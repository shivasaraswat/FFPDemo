const Module = require('../models/Module');

class ModuleService {
  async getAll(hierarchical = false) {
    return await Module.findAll(hierarchical);
  }

  async getByKey(key) {
    const module = await Module.findByKey(key);
    if (!module) {
      throw new Error('Module not found');
    }
    return module;
  }

  async create(moduleData) {
    // Check if key already exists
    const existingModule = await Module.findByKey(moduleData.key);
    if (existingModule) {
      throw new Error('Module with this key already exists');
    }

    // Verify parent exists if parentKey is specified
    if (moduleData.parentKey) {
      const parent = await Module.findByKey(moduleData.parentKey);
      if (!parent) {
        throw new Error('Parent module not found');
      }
    }

    return await Module.create(moduleData);
  }

  async update(key, moduleData) {
    const module = await Module.findByKey(key);
    if (!module) {
      throw new Error('Module not found');
    }

    // Verify parent exists if parentKey is being updated
    if (moduleData.parentKey !== undefined && moduleData.parentKey !== null) {
      const parent = await Module.findByKey(moduleData.parentKey);
      if (!parent) {
        throw new Error('Parent module not found');
      }
      
      // Prevent circular reference
      if (moduleData.parentKey === key) {
        throw new Error('Module cannot be its own parent');
      }
    }

    return await Module.update(key, moduleData);
  }

  async delete(key) {
    const module = await Module.findByKey(key);
    if (!module) {
      throw new Error('Module not found');
    }

    return await Module.delete(key);
  }
}

module.exports = new ModuleService();



