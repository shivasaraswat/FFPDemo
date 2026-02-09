const pool = require('../config/database');

class ApiRegistry {
  static async create(apiData) {
    const { method, path, moduleKey, requiredAccess = 'READ', isActive = true } = apiData;
    const [result] = await pool.execute(
      `INSERT INTO api_registry (method, path, moduleKey, requiredAccess, isActive) 
       VALUES (?, ?, ?, ?, ?)`,
      [method, path, moduleKey, requiredAccess, isActive]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM api_registry WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByMethodAndPath(method, path) {
    const [rows] = await pool.execute(
      'SELECT * FROM api_registry WHERE method = ? AND path = ? AND isActive = TRUE',
      [method, path]
    );
    return rows[0] || null;
  }

  static async findByModule(moduleKey) {
    const [rows] = await pool.execute(
      'SELECT * FROM api_registry WHERE moduleKey = ? AND isActive = TRUE',
      [moduleKey]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT ar.*, m.name as moduleName 
       FROM api_registry ar
       LEFT JOIN modules m ON ar.moduleKey = m.key
       ORDER BY ar.method, ar.path`
    );
    return rows;
  }

  static async update(id, apiData) {
    const allowedFields = ['method', 'path', 'moduleKey', 'requiredAccess', 'isActive'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (apiData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(apiData[field]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE api_registry SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM api_registry WHERE id = ?', [id]);
    return true;
  }

  // Match API path with registered paths (supports route parameters)
  static async matchApi(method, path) {
    // First try exact match
    let api = await this.findByMethodAndPath(method, path);
    if (api) {
      return api;
    }

    // Then try pattern matching (for routes with :id, etc.)
    const [allApis] = await pool.execute(
      'SELECT * FROM api_registry WHERE method = ? AND isActive = TRUE',
      [method]
    );

    for (const registeredApi of allApis) {
      const pattern = registeredApi.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(path)) {
        return registeredApi;
      }
    }

    return null;
  }
}

module.exports = ApiRegistry;



