const pool = require('../config/database');

class RolePermission {
  static async create(permissionData) {
    const { roleId, moduleKey, access = 'NONE' } = permissionData;
    const [result] = await pool.execute(
      `INSERT INTO role_permissions (roleId, moduleKey, access) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE access = ?`,
      [roleId, moduleKey, access, access]
    );
    return this.findByRoleAndModule(roleId, moduleKey);
  }

  static async findByRoleAndModule(roleId, moduleKey) {
    const [rows] = await pool.execute(
      'SELECT * FROM role_permissions WHERE roleId = ? AND moduleKey = ?',
      [roleId, moduleKey]
    );
    return rows[0] || null;
  }

  static async findByRole(roleId) {
    const [rows] = await pool.execute(
      'SELECT * FROM role_permissions WHERE roleId = ?',
      [roleId]
    );
    return rows;
  }

  static async findByModule(moduleKey) {
    const [rows] = await pool.execute(
      'SELECT * FROM role_permissions WHERE moduleKey = ?',
      [moduleKey]
    );
    return rows;
  }

  static async getMatrix() {
    const [rows] = await pool.execute(
      `SELECT rp.*, r.name as roleName, r.code as roleCode, m.name as moduleName
       FROM role_permissions rp
       JOIN roles r ON rp.roleId = r.id
       JOIN modules m ON rp.moduleKey = m.key
       ORDER BY r.name, m.name`
    );
    return rows;
  }

  static async bulkUpdate(permissions) {
    if (!permissions || permissions.length === 0) {
      return [];
    }

    const values = [];
    const placeholders = [];

    for (const perm of permissions) {
      const { roleId, moduleKey, access = 'NONE' } = perm;
      placeholders.push('(?, ?, ?)');
      values.push(roleId, moduleKey, access);
    }

    await pool.execute(
      `INSERT INTO role_permissions (roleId, moduleKey, access) 
       VALUES ${placeholders.join(', ')}
       ON DUPLICATE KEY UPDATE access = VALUES(access)`,
      values
    );

    return this.getMatrix();
  }

  static async update(id, access) {
    await pool.execute(
      'UPDATE role_permissions SET access = ? WHERE id = ?',
      [access, id]
    );
    const [rows] = await pool.execute(
      'SELECT * FROM role_permissions WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async delete(id) {
    await pool.execute('DELETE FROM role_permissions WHERE id = ?', [id]);
    return true;
  }

  static async deleteByRoleAndModule(roleId, moduleKey) {
    await pool.execute(
      'DELETE FROM role_permissions WHERE roleId = ? AND moduleKey = ?',
      [roleId, moduleKey]
    );
    return true;
  }
}

module.exports = RolePermission;


