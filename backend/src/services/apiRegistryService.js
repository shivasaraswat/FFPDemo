const ApiRegistry = require('../models/ApiRegistry');
const Module = require('../models/Module');

class ApiRegistryService {
  async getAll() {
    return await ApiRegistry.findAll();
  }

  async getById(id) {
    const api = await ApiRegistry.findById(id);
    if (!api) {
      throw new Error('API registry entry not found');
    }
    return api;
  }

  async create(apiData) {
    // Verify module exists
    const module = await Module.findByKey(apiData.moduleKey);
    if (!module) {
      throw new Error('Module not found');
    }

    // Check if method + path combination already exists
    const existing = await ApiRegistry.findByMethodAndPath(apiData.method, apiData.path);
    if (existing) {
      throw new Error('API with this method and path already exists');
    }

    return await ApiRegistry.create(apiData);
  }

  async update(id, apiData) {
    const api = await ApiRegistry.findById(id);
    if (!api) {
      throw new Error('API registry entry not found');
    }

    // If updating moduleKey, verify it exists
    if (apiData.moduleKey) {
      const module = await Module.findByKey(apiData.moduleKey);
      if (!module) {
        throw new Error('Module not found');
      }
    }

    return await ApiRegistry.update(id, apiData);
  }

  async delete(id) {
    const api = await ApiRegistry.findById(id);
    if (!api) {
      throw new Error('API registry entry not found');
    }
    return await ApiRegistry.delete(id);
  }

  async findByModule(moduleKey) {
    return await ApiRegistry.findByModule(moduleKey);
  }
}

module.exports = new ApiRegistryService();


