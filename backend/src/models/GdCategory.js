const pool = require('../config/database');

class GdCategory {
  static async findAll(filters = {}) {
    let query = `SELECT * FROM gd_categories WHERE 1=1`;
    const params = [];

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }

    if (filters.search) {
      query += ' AND (category_code LIKE ? OR category_name LIKE ? OR applicable_business LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_categories WHERE category_id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute(
      'SELECT * FROM gd_categories WHERE category_code = ?',
      [code]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data) {
    const {
      category_code,
      category_name,
      applicable_business = null,
      is_active = 1,
      created_by
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO gd_categories (category_code, category_name, applicable_business, is_active, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [category_code, category_name, applicable_business, is_active, created_by]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const allowedFields = ['category_code', 'category_name', 'applicable_business', 'is_active', 'updated_by'];
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
      `UPDATE gd_categories SET ${updates.join(', ')} WHERE category_id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM gd_categories WHERE category_id = ?', [id]);
    return true;
  }
}

module.exports = GdCategory;


