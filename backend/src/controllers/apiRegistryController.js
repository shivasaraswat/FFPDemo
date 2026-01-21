const apiRegistryService = require('../services/apiRegistryService');
const { validationResult } = require('express-validator');

class ApiRegistryController {
  async getAll(req, res, next) {
    try {
      const apis = await apiRegistryService.getAll();
      res.json(apis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res, next) {
    try {
      const api = await apiRegistryService.getById(req.params.id);
      res.json(api);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const api = await apiRegistryService.create(req.body);
      res.status(201).json(api);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const api = await apiRegistryService.update(req.params.id, req.body);
      res.json(api);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res, next) {
    try {
      await apiRegistryService.delete(req.params.id);
      res.json({ message: 'API registry entry deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByModule(req, res, next) {
    try {
      const apis = await apiRegistryService.findByModule(req.params.moduleKey);
      res.json(apis);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ApiRegistryController();


