const pool = require('../config/database');

class User {
  static async create(userData) {
    const { name, email, passwordHash, roleId, language = 'en', isActive = true } = userData;
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, passwordHash, roleId, language, isActive) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, roleId, language, isActive]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as roleName, r.code as roleCode 
       FROM users u 
       LEFT JOIN roles r ON u.roleId = r.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as roleName, r.code as roleCode 
       FROM users u 
       LEFT JOIN roles r ON u.roleId = r.id 
       WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  static async findAll(filters = {}) {
    let query = `SELECT u.*, r.name as roleName, r.code as roleCode 
                 FROM users u 
                 LEFT JOIN roles r ON u.roleId = r.id 
                 WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND u.isActive = ?';
      params.push(filters.isActive);
    }

    if (filters.roleId) {
      query += ' AND u.roleId = ?';
      params.push(filters.roleId);
    }

    if (filters.search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY u.createdAt DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async update(id, userData) {
    const allowedFields = ['name', 'email', 'passwordHash', 'roleId', 'language', 'isActive'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (userData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(userData[field]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async activate(id) {
    await pool.execute('UPDATE users SET isActive = TRUE WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async deactivate(id) {
    await pool.execute('UPDATE users SET isActive = FALSE WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

module.exports = User;


