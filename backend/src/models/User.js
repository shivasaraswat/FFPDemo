const pool = require('../config/database');
const UserRole = require('./UserRole');
const UserCountry = require('./UserCountry');
const UserGdCode = require('./UserGdCode');

class User {
  static async create(userData) {
    const { 
      name, 
      email, 
      passwordHash, 
      roleId, 
      language = 'en', 
      ssoId = null,
      mobile = null,
      address = null,
      region = null,
      isActive = true 
    } = userData;
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, passwordHash, roleId, language, ssoId, mobile, address, region, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, roleId, language, ssoId, mobile, address, region, isActive]
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
    
    if (rows.length === 0) {
      return null;
    }
    
    const user = rows[0];
    
    // Get all roles from user_roles table
    const roles = await UserRole.findByUser(id);
    user.roles = roles.map(role => ({
      id: role.roleId,
      name: role.roleName,
      code: role.roleCode,
      description: role.description,
      isSystemRole: role.isSystemRole
    }));
    
    // Get countries and gdCodes from junction tables
    user.country = await UserCountry.findByUser(id);
    user.gdCode = await UserGdCode.findByUser(id);
    
    return user;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as roleName, r.code as roleCode 
       FROM users u 
       LEFT JOIN roles r ON u.roleId = r.id 
       WHERE u.email = ?`,
      [email]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const user = rows[0];
    
    // Get all roles from user_roles table
    const roles = await UserRole.findByUser(user.id);
    user.roles = roles.map(role => ({
      id: role.roleId,
      name: role.roleName,
      code: role.roleCode,
      description: role.description,
      isSystemRole: role.isSystemRole
    }));
    
    // Get countries and gdCodes from junction tables
    user.country = await UserCountry.findByUser(user.id);
    user.gdCode = await UserGdCode.findByUser(user.id);
    
    return user;
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
    
    // Optionally load countries and gdCodes for all users
    // This can be expensive for large datasets, so we'll load them
    const usersWithRelations = await Promise.all(
      rows.map(async (user) => {
        const countries = await UserCountry.findByUser(user.id);
        const gdCodes = await UserGdCode.findByUser(user.id);
        return {
          ...user,
          country: countries,
          gdCode: gdCodes
        };
      })
    );
    
    return usersWithRelations;
  }

  static async update(id, userData) {
    const allowedFields = [
      'name', 
      'email', 
      'passwordHash', 
      'roleId', 
      'language', 
      'ssoId',
      'mobile',
      'address',
      'region',
      'isActive'
    ];
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


