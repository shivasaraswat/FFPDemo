const pool = require('../config/database');

class UserRole {
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT ur.*, r.name as roleName, r.code as roleCode, r.description, r.isSystemRole
       FROM user_roles ur
       INNER JOIN roles r ON ur.roleId = r.id
       WHERE ur.userId = ?
       ORDER BY r.name ASC`,
      [userId]
    );
    return rows;
  }

  static async findByRole(roleId) {
    const [rows] = await pool.execute(
      `SELECT ur.*, u.name as userName, u.email
       FROM user_roles ur
       INNER JOIN users u ON ur.userId = u.id
       WHERE ur.roleId = ?`,
      [roleId]
    );
    return rows;
  }

  static async add(userId, roleId) {
    try {
      await pool.execute(
        `INSERT INTO user_roles (userId, roleId) VALUES (?, ?)`,
        [userId, roleId]
      );
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User already has this role');
      }
      throw error;
    }
  }

  static async remove(userId, roleId) {
    const [result] = await pool.execute(
      `DELETE FROM user_roles WHERE userId = ? AND roleId = ?`,
      [userId, roleId]
    );
    return result.affectedRows > 0;
  }

  static async hasRole(userId, roleId) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM user_roles WHERE userId = ? AND roleId = ?`,
      [userId, roleId]
    );
    return rows[0].count > 0;
  }

  static async hasRoleByCode(userId, roleCode) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM user_roles ur
       INNER JOIN roles r ON ur.roleId = r.id
       WHERE ur.userId = ? AND r.code = ?`,
      [userId, roleCode]
    );
    return rows[0].count > 0;
  }

  static async getUserRolesWithDetails(userId) {
    return await this.findByUser(userId);
  }

  static async removeAllUserRoles(userId) {
    await pool.execute(
      `DELETE FROM user_roles WHERE userId = ?`,
      [userId]
    );
    return true;
  }
}

module.exports = UserRole;


