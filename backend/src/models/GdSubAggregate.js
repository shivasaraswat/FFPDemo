const pool = require('../config/database');

class GdSubAggregate {
  static async findAll(filters = {}) {
    let query = `SELECT sa.*, a.aggregate_name, a.aggregate_code
                 FROM gd_subaggregate sa
                 LEFT JOIN gd_aggregate a ON sa.aggregate_id = a.aggregate_id
                 WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND sa.is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ' AND (sa.subaggregate_code LIKE ? OR sa.subaggregate_name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY sa.created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT sa.*, a.aggregate_name, a.aggregate_code
       FROM gd_subaggregate sa
       LEFT JOIN gd_aggregate a ON sa.aggregate_id = a.aggregate_id
       WHERE sa.subaggregate_id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_subaggregate WHERE subaggregate_code = ?',
      [code]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data) {
    const {
      subaggregate_code,
      subaggregate_name,
      aggregate_id = null,
      is_active = 1,
      created_by
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO gd_subaggregate (subaggregate_code, subaggregate_name, aggregate_id, is_active, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [subaggregate_code, subaggregate_name, aggregate_id, is_active, created_by]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const allowedFields = ['subaggregate_code', 'subaggregate_name', 'aggregate_id', 'is_active', 'updated_by'];
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
      `UPDATE gd_subaggregate SET ${updates.join(', ')} WHERE subaggregate_id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM gd_subaggregate WHERE subaggregate_id = ?', [id]);
    return true;
  }
}

module.exports = GdSubAggregate;


