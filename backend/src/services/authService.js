const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/User');
const RolePermission = require('../models/RolePermission');
const Module = require('../models/Module');
const { hashPassword, comparePassword } = require('../utils/password');

class AuthService {
  async login(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id);
    
    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }

  async register(userData) {
    const { email, password, ...otherData } = userData;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      ...otherData
    });

    const token = this.generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPermissions(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all permissions for the user's role
    const permissions = await RolePermission.findByRole(user.roleId);
    
    // Get all modules to build complete permission list
    const modules = await Module.findAll();
    
    // Build permission map with parent-child hierarchy check
    const permissionMap = new Map();
    permissions.forEach(perm => {
      permissionMap.set(perm.moduleKey, perm.access);
    });

    const result = [];

    for (const module of modules) {
      let access = permissionMap.get(module.key) || 'NONE';
      
      // Check parent permission if this is a child module
      if (module.parentKey) {
        const parentAccess = permissionMap.get(module.parentKey) || 'NONE';
        // If parent is NONE, child must be NONE
        if (parentAccess === 'NONE') {
          access = 'NONE';
        }
      }

      result.push({
        moduleKey: module.key,
        moduleName: module.name,
        access: access
      });
    }

    return result;
  }

  generateToken(userId) {
    return jwt.sign({ userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
  }
}

module.exports = new AuthService();


