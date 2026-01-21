const Role = require('../models/Role');

class RoleService {
  async getAll() {
    return await Role.findAll();
  }

  async getById(id) {
    const role = await Role.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async create(roleData) {
    // Check if code already exists
    const existingRole = await Role.findByCode(roleData.code);
    if (existingRole) {
      throw new Error('Role with this code already exists');
    }

    return await Role.create(roleData);
  }

  async update(id, roleData) {
    const role = await Role.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // If updating code, check for duplicates
    if (roleData.code && roleData.code !== role.code) {
      const existingRole = await Role.findByCode(roleData.code);
      if (existingRole) {
        throw new Error('Role with this code already exists');
      }
    }

    return await Role.update(id, roleData);
  }

  async delete(id) {
    const role = await Role.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    return await Role.delete(id);
  }
}

module.exports = new RoleService();


