const pool = require('../config/database');

class Role {
  static async create(roleData) {
    const { name, code, description, isSystemRole = false } = roleData;
    const [result] = await pool.execute(
      `INSERT INTO roles (name, code, description, isSystemRole) 
       VALUES (?, ?, ?, ?)`,
      [name, code, description, isSystemRole]
    );
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM roles WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute(
      'SELECT * FROM roles WHERE code = ?',
      [code]
    );
    return rows[0] || null;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM roles ORDER BY name ASC'
    );
    return rows;
  }

  static async update(id, roleData) {
    const allowedFields = ['name', 'code', 'description'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (roleData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(roleData[field]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE roles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    // Check if it's a system role
    const role = await this.findById(id);
    if (role && role.isSystemRole) {
      throw new Error('Cannot delete system role');
    }

    // Check if role is assigned to any users
    const [users] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE roleId = ?',
      [id]
    );
    if (users[0].count > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    await pool.execute('DELETE FROM roles WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Role;


