const pool = require('../config/database');

class GdAggregate {
  static async findAll(filters = {}) {
    let query = `SELECT * FROM gd_aggregate WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ' AND (aggregate_code LIKE ? OR aggregate_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_aggregate WHERE aggregate_id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_aggregate WHERE aggregate_code = ?',
      [code]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data) {
    const {
      aggregate_code,
      aggregate_name,
      is_active = 1,
      created_by
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO gd_aggregate (aggregate_code, aggregate_name, is_active, created_by)
       VALUES (?, ?, ?, ?)`,
      [aggregate_code, aggregate_name, is_active, created_by]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const allowedFields = ['aggregate_code', 'aggregate_name', 'is_active', 'updated_by'];
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
      `UPDATE gd_aggregate SET ${updates.join(', ')} WHERE aggregate_id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM gd_aggregate WHERE aggregate_id = ?', [id]);
    return true;
  }
}

module.exports = GdAggregate;


