const pool = require('../config/database');

class GdRegionCenter {
  static async findAll(filters = {}) {
    let query = `SELECT * FROM gd_regioncenter WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ' AND (regioncenter_code LIKE ? OR regioncenter_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_regioncenter WHERE regioncenter_id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_regioncenter WHERE regioncenter_code = ?',
      [code]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data) {
    const {
      regioncenter_code,
      regioncenter_name,
      is_active = 1,
      created_by
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO gd_regioncenter (regioncenter_code, regioncenter_name, is_active, created_by)
       VALUES (?, ?, ?, ?)`,
      [regioncenter_code, regioncenter_name, is_active, created_by]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const allowedFields = ['regioncenter_code', 'regioncenter_name', 'is_active', 'updated_by'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(data[field]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE gd_regioncenter SET ${updates.join(', ')} WHERE regioncenter_id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM gd_regioncenter WHERE regioncenter_id = ?', [id]);
    return true;
  }
}

module.exports = GdRegionCenter;


