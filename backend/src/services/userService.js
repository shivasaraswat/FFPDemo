const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const UserCountry = require('../models/UserCountry');
const UserGdCode = require('../models/UserGdCode');
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
    const { email, password, iamShortId, roleIds, roleId, country, gdCode, ...otherData } = userData;

    // Normalize name field: trim and replace multiple spaces with single space
    if (otherData.name !== undefined) {
      otherData.name = otherData.name.trim().replace(/\s+/g, ' ');
    }

    // Map iamShortId to ssoId for backward compatibility
    if (iamShortId !== undefined && !otherData.ssoId) {
      otherData.ssoId = iamShortId;
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Support both roleIds array and single roleId (backward compatibility)
    let rolesToAssign = [];
    if (roleIds && Array.isArray(roleIds) && roleIds.length > 0) {
      rolesToAssign = roleIds;
    } else if (roleId) {
      rolesToAssign = [roleId];
    }
    
    if (rolesToAssign.length === 0) {
      throw new Error('At least one role is required. Provide either roleIds array or roleId.');
    }

    // Validate role assignment rules
    await this.validateRoleAssignment(null, rolesToAssign);

    // Verify all roles exist and get role details
    const roles = [];
    for (const roleIdToCheck of rolesToAssign) {
      const role = await Role.findById(roleIdToCheck);
      if (!role) {
        throw new Error(`Role with id ${roleIdToCheck} not found`);
      }
      roles.push(role);
    }

    // Validate region is required for RC and GD roles
    const hasRC = roles.some(r => r.code === 'RC');
    const hasGD = roles.some(r => r.code === 'GD');
    if ((hasRC || hasGD) && (!otherData.region || otherData.region.trim() === '')) {
      throw new Error('Region is required for RC and GD users');
    }

    // Validate country and gdCode for GD role (or when both RC and GD are selected - follow GD behavior)
    if (hasGD || (hasRC && hasGD)) {
      // Validate country array
      if (!country || !Array.isArray(country) || country.length === 0) {
        throw new Error('At least one country is required for GD users');
      }
      
      // Validate gdCode array
      if (!gdCode || !Array.isArray(gdCode) || gdCode.length === 0) {
        throw new Error('At least one GD Code is required for GD users');
      }
      
      // Validate countries are valid for the selected region
      await this.validateCountriesForRegion(otherData.region, country);
      
      // Validate GD codes are valid for selected countries
      await this.validateGdCodesForCountries(country, gdCode);
    }

    // Set primary roleId for backward compatibility (first role or RC/GD priority)
    let primaryRoleId = rolesToAssign[0];
    if (hasRC) {
      const rcRole = roles.find(r => r.code === 'RC');
      primaryRoleId = rcRole.id;
    } else if (hasGD) {
      const gdRole = roles.find(r => r.code === 'GD');
      primaryRoleId = gdRole.id;
    }
    otherData.roleId = primaryRoleId;

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      ...otherData
    });

    // Assign all roles via user_roles table
    for (const roleIdToAssign of rolesToAssign) {
      await UserRole.add(user.id, roleIdToAssign);
    }

    // Save countries and gdCodes if provided
    if (hasGD || (hasRC && hasGD)) {
      if (country && Array.isArray(country) && country.length > 0) {
        await UserCountry.setCountries(user.id, country);
      }
      if (gdCode && Array.isArray(gdCode) && gdCode.length > 0) {
        await UserGdCode.setGdCodes(user.id, gdCode);
      }
    }

    // Return user with all roles, countries, and gdCodes
    return await User.findById(user.id);
  }

  async validateRoleAssignment(userId, roleIds) {
    if (!roleIds || roleIds.length === 0) {
      throw new Error('At least one role is required');
    }

    // Get role details
    const roles = [];
    for (const roleId of roleIds) {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new Error(`Role with id ${roleId} not found`);
      }
      roles.push(role);
    }

    // Separate RC/GD roles from others
    const rcGdRoles = roles.filter(r => r.code === 'RC' || r.code === 'GD');
    const otherRoles = roles.filter(r => r.code !== 'RC' && r.code !== 'GD');

    // Validation rules:
    // 1. Non-RC/GD roles: Only one allowed
    if (otherRoles.length > 1) {
      throw new Error('User can have only one non-RC/GD role');
    }

    // 2. RC and GD can be assigned together (both allowed)
    // No validation needed for RC/GD combination

    // 3. If user already exists, check current roles
    if (userId) {
      const currentRoles = await UserRole.findByUser(userId);
      const currentOtherRoles = currentRoles.filter(r => r.roleCode !== 'RC' && r.roleCode !== 'GD');
      
      // If updating to a different non-RC/GD role, remove old one
      if (otherRoles.length > 0 && currentOtherRoles.length > 0) {
        const newOtherRole = otherRoles[0];
        const currentOtherRole = currentOtherRoles[0];
        if (newOtherRole.id !== currentOtherRole.roleId) {
          // Will be handled in update method
        }
      }
    }
  }

  async update(id, userData, requestingUserId = null) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Extract country and gdCode from userData (they're handled separately)
    const { country, gdCode, ...otherUserData } = userData;
    userData = otherUserData;

    // Normalize name field: trim and replace multiple spaces with single space
    if (userData.name !== undefined) {
      userData.name = userData.name.trim().replace(/\s+/g, ' ');
    }

    // Check if user is updating themselves
    const isSelfUpdate = requestingUserId && parseInt(id) === parseInt(requestingUserId);

    // If self-update, restrict what can be changed
    if (isSelfUpdate) {
      // Prevent self-updates from changing roles
      if (userData.roleIds !== undefined || userData.roleId !== undefined) {
        throw new Error('You cannot change your own roles. Please contact an administrator.');
      }
      
      // Prevent self-updates from changing isActive status
      if (userData.isActive !== undefined) {
        throw new Error('You cannot change your own active status. Please contact an administrator.');
      }
      
      // Only allow profile fields for self-updates (including country and gdCode)
      const allowedFields = ['name', 'email', 'mobile', 'jobTitle', 'department', 'address', 'region', 'language', 'iamShortId', 'ssoId', 'password', 'country', 'gdCode'];
      const restrictedFields = Object.keys(userData).filter(key => !allowedFields.includes(key));
      
      if (restrictedFields.length > 0) {
        throw new Error(`You cannot update the following fields: ${restrictedFields.join(', ')}. Please contact an administrator.`);
      }
    }

    // Map iamShortId to ssoId for backward compatibility
    if (userData.iamShortId !== undefined && userData.ssoId === undefined) {
      userData.ssoId = userData.iamShortId;
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

    // Handle role updates (roleIds array or single roleId for backward compatibility)
    // Only allowed for admin updates (not self-updates)
    if (userData.roleIds !== undefined || userData.roleId !== undefined) {
      const newRoleIds = userData.roleIds || (userData.roleId ? [userData.roleId] : []);
      
      if (newRoleIds.length === 0) {
        throw new Error('At least one role is required');
      }

      // Validate role assignment
      await this.validateRoleAssignment(id, newRoleIds);

      // Get current roles
      const currentRoles = await UserRole.findByUser(id);
      const currentRoleIds = currentRoles.map(r => r.roleId);

      // Get roles to add and remove
      const rolesToAdd = newRoleIds.filter(rid => !currentRoleIds.includes(rid));
      const rolesToRemove = currentRoleIds.filter(rid => !newRoleIds.includes(rid));

      // Remove roles
      for (const roleIdToRemove of rolesToRemove) {
        await UserRole.remove(id, roleIdToRemove);
      }

      // Add new roles
      for (const roleIdToAdd of rolesToAdd) {
        await UserRole.add(id, roleIdToAdd);
      }

      // Update primary roleId for backward compatibility
      const newRoles = [];
      for (const roleId of newRoleIds) {
        const role = await Role.findById(roleId);
        if (role) newRoles.push(role);
      }

      const hasRC = newRoles.some(r => r.code === 'RC');
      const hasGD = newRoles.some(r => r.code === 'GD');
      
      if (hasRC) {
        const rcRole = newRoles.find(r => r.code === 'RC');
        userData.roleId = rcRole.id;
      } else if (hasGD) {
        const gdRole = newRoles.find(r => r.code === 'GD');
        userData.roleId = gdRole.id;
      } else {
        userData.roleId = newRoleIds[0];
      }

      // Remove roleIds from userData (not a column in users table)
      delete userData.roleIds;
    }

    // Validate region is required for RC and GD roles
    const currentRoles = await UserRole.findByUser(id);
    const hasRC = currentRoles.some(r => r.roleCode === 'RC');
    const hasGD = currentRoles.some(r => r.roleCode === 'GD');
    const finalRegion = userData.region !== undefined ? userData.region : user.region;
    
    if ((hasRC || hasGD) && (!finalRegion || finalRegion.trim() === '')) {
      throw new Error('Region is required for RC and GD users');
    }

    // Handle country and gdCode updates for GD role
    if (hasGD || (hasRC && hasGD)) {
      // If country is being updated, validate it
      if (country !== undefined) {
        if (!Array.isArray(country) || country.length === 0) {
          throw new Error('At least one country is required for GD users');
        }
        await this.validateCountriesForRegion(finalRegion, country);
      }
      
      // If gdCode is being updated, validate it
      if (gdCode !== undefined) {
        if (!Array.isArray(gdCode) || gdCode.length === 0) {
          throw new Error('At least one GD Code is required for GD users');
        }
        // Get final country list (updated or existing)
        const finalCountries = country !== undefined ? country : (user.country || []);
        if (finalCountries.length === 0) {
          throw new Error('Country must be set before GD Code can be updated');
        }
        await this.validateGdCodesForCountries(finalCountries, gdCode);
      }
    }

    // Update user basic fields
    const updatedUser = await User.update(id, userData);

    // Update countries and gdCodes if provided
    if (country !== undefined) {
      await UserCountry.setCountries(id, country);
    }
    if (gdCode !== undefined) {
      await UserGdCode.setGdCodes(id, gdCode);
    }

    // Return updated user with all relations
    return await User.findById(id);
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
    // UserRole entries will be deleted automatically due to CASCADE
    return await User.delete(id);
  }

  async getUserRoles(userId) {
    return await UserRole.findByUser(userId);
  }

  async assignRole(userId, roleId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Get current roles
    const currentRoles = await UserRole.findByUser(userId);
    const currentRoleIds = currentRoles.map(r => r.roleId);
    
    // Validate if adding this role is allowed
    const newRoleIds = [...currentRoleIds, roleId];
    await this.validateRoleAssignment(userId, newRoleIds);

    await UserRole.add(userId, roleId);
    return await User.findById(userId);
  }

  async removeRole(userId, roleId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentRoles = await UserRole.findByUser(userId);
    if (currentRoles.length <= 1) {
      throw new Error('User must have at least one role');
    }

    const removed = await UserRole.remove(userId, roleId);
    if (!removed) {
      throw new Error('Role not assigned to user');
    }

    return await User.findById(userId);
  }

  // Validation helper methods
  async validateCountriesForRegion(region, countries) {
    if (!region || !countries || !Array.isArray(countries)) {
      return;
    }

    const validCountriesByRegion = {
      'North America': ['USA', 'Canada', 'Mexico'],
      'Europe': ['UK', 'Germany', 'France', 'Italy', 'Spain'],
      'Asia Pacific': ['Japan', 'China', 'India', 'Australia', 'Singapore', 'South Korea'],
      'Middle East': ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait']
    };

    const validCountries = validCountriesByRegion[region] || [];
    
    for (const country of countries) {
      if (!validCountries.includes(country)) {
        throw new Error(`Country "${country}" is not valid for region "${region}"`);
      }
    }
  }

  async validateGdCodesForCountries(countries, gdCodes) {
    if (!countries || !Array.isArray(countries) || !gdCodes || !Array.isArray(gdCodes)) {
      return;
    }

    const gdCodeMap = {
      'USA': ['GD001', 'GD002', 'GD003'],
      'Canada': ['GD010', 'GD011'],
      'Mexico': ['GD020'],
      'UK': ['GD100', 'GD101', 'GD102'],
      'Germany': ['GD110', 'GD111'],
      'France': ['GD120'],
      'Italy': ['GD130'],
      'Spain': ['GD140'],
      'Japan': ['GD200', 'GD201', 'GD202', 'GD203'],
      'China': ['GD210', 'GD211'],
      'India': ['GD220', 'GD221', 'GD222'],
      'Australia': ['GD230'],
      'Singapore': ['GD240'],
      'South Korea': ['GD250'],
      'UAE': ['GD300', 'GD301'],
      'Saudi Arabia': ['GD310'],
      'Qatar': ['GD320'],
      'Kuwait': ['GD330']
    };

    // Get all valid GD codes for the selected countries
    const validGdCodes = [];
    countries.forEach(country => {
      if (gdCodeMap[country]) {
        validGdCodes.push(...gdCodeMap[country]);
      }
    });

    // Check if all provided GD codes are valid
    for (const gdCode of gdCodes) {
      if (!validGdCodes.includes(gdCode)) {
        throw new Error(`GD Code "${gdCode}" is not valid for the selected countries`);
      }
    }
  }
}

module.exports = new UserService();


