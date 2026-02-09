const RolePermission = require('../models/RolePermission');
const Role = require('../models/Role');
const Module = require('../models/Module');
const permissionCache = require('../utils/cache');

class PermissionService {
  async getMatrix() {
    // Get all roles and modules
    const roles = await Role.findAll();
    const modules = await Module.findAll();

    // Get all permissions
    const permissions = await RolePermission.getMatrix();
    const permissionMap = new Map();
    
    permissions.forEach(perm => {
      const key = `${perm.roleId}-${perm.moduleKey}`;
      permissionMap.set(key, perm.access);
    });

    // Build matrix: roles × modules
    const matrix = [];

    for (const role of roles) {
      for (const module of modules) {
        const key = `${role.id}-${module.key}`;
        const access = permissionMap.get(key) || 'NONE';
        
        matrix.push({
          id: `${role.id}-${module.key}`, // Composite key for frontend
          roleId: role.id,
          roleName: role.name,
          roleCode: role.code,
          moduleKey: module.key,
          moduleName: module.name,
          access: access
        });
      }
    }

    return matrix;
  }

  async getByRole(roleId) {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await RolePermission.findByRole(roleId);
    const modules = await Module.findAll();

    const permissionMap = new Map();
    permissions.forEach(perm => {
      permissionMap.set(perm.moduleKey, perm.access);
    });

    return modules.map(module => ({
      moduleKey: module.key,
      moduleName: module.name,
      access: permissionMap.get(module.key) || 'NONE'
    }));
  }

  async bulkUpdate(permissions) {
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      throw new Error('Permissions array is required');
    }

    // Validate all permissions before updating
    const roles = await Role.findAll();
    const modules = await Module.findAll();
    const roleMap = new Map(roles.map(r => [r.id, r]));
    const moduleMap = new Map(modules.map(m => [m.key, m]));

    for (const perm of permissions) {
      if (!roleMap.has(perm.roleId)) {
        throw new Error(`Role with id ${perm.roleId} not found`);
      }
      if (!moduleMap.has(perm.moduleKey)) {
        throw new Error(`Module with key ${perm.moduleKey} not found`);
      }
      if (!['FULL', 'READ', 'NONE'].includes(perm.access)) {
        throw new Error(`Invalid access value: ${perm.access}. Must be FULL, READ, or NONE`);
      }
    }

    // Update permissions
    await RolePermission.bulkUpdate(permissions);

    // Invalidate cache for affected roles and modules
    const affectedRoles = new Set(permissions.map(p => p.roleId));
    const affectedModules = new Set(permissions.map(p => p.moduleKey));

    affectedRoles.forEach(roleId => {
      affectedModules.forEach(moduleKey => {
        permissionCache.invalidate(roleId, moduleKey);
      });
    });

    return this.getMatrix();
  }

  async update(id, access) {
    if (!['FULL', 'READ', 'NONE'].includes(access)) {
      throw new Error('Invalid access value. Must be FULL, READ, or NONE');
    }

    const permission = await RolePermission.update(id, access);
    if (!permission) {
      throw new Error('Permission not found');
    }

    // Invalidate cache
    permissionCache.invalidate(permission.roleId, permission.moduleKey);

    return permission;
  }
}

module.exports = new PermissionService();



