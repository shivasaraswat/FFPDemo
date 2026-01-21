const User = require('../models/User');
const Role = require('../models/Role');
const { hashPassword } = require('../utils/password');

class UserService {
  async getAll(filters = {}) {
    return await User.findAll(filters);
  }

  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(userData) {
    const { email, password, ...otherData } = userData;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Verify role exists
    const role = await Role.findById(otherData.roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const passwordHash = await hashPassword(password);
    return await User.create({
      email,
      passwordHash,
      ...otherData
    });
  }

  async update(id, userData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // If updating email, check for duplicates
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    // If updating password, hash it
    if (userData.password) {
      userData.passwordHash = await hashPassword(userData.password);
      delete userData.password;
    }

    // If updating role, verify it exists
    if (userData.roleId) {
      const role = await Role.findById(userData.roleId);
      if (!role) {
        throw new Error('Role not found');
      }
    }

    return await User.update(id, userData);
  }

  async activate(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await User.activate(id);
  }

  async deactivate(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await User.deactivate(id);
  }

  async delete(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await User.delete(id);
  }
}

module.exports = new UserService();


