const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');

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
    const { name, referenceRoleId, description } = roleData;
    
    // Generate role code from role name automatically
    // Convert to uppercase, replace spaces with underscores, remove special characters
    let generatedCode = name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');
    
    // Ensure it starts with a letter
    if (!/^[A-Z]/.test(generatedCode)) {
      generatedCode = 'ROLE_' + generatedCode;
    }
    
    // Check if code already exists, if so append a number
    let finalCode = generatedCode;
    let counter = 1;
    while (await Role.findByCode(finalCode)) {
      finalCode = `${generatedCode}_${counter}`;
      counter++;
    }

    // Create the role
    const newRole = await Role.create({
      name: name.trim(),
      code: finalCode,
      description: description || '',
      isSystemRole: false
    });

    // If reference role is provided, copy permissions from it
    if (referenceRoleId) {
      const referenceRole = await Role.findById(referenceRoleId);
      if (!referenceRole) {
        throw new Error('Reference role not found');
      }

      // Get all permissions from reference role
      const referencePermissions = await RolePermission.findByRole(referenceRoleId);
      
      // Copy all permissions to new role
      if (referencePermissions && referencePermissions.length > 0) {
        const permissionsToCreate = referencePermissions.map(perm => ({
          roleId: newRole.id,
          moduleKey: perm.moduleKey,
          access: perm.access
        }));
        
        await RolePermission.bulkUpdate(permissionsToCreate);
      }
    }

    return newRole;
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




