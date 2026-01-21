const moduleService = require('../services/moduleService');
const { validationResult } = require('express-validator');

class ModuleController {
  async getAll(req, res, next) {
    try {
      const hierarchical = req.query.hierarchical === 'true';
      const modules = await moduleService.getAll(hierarchical);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByKey(req, res, next) {
    try {
      const module = await moduleService.getByKey(req.params.key);
      res.json(module);
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

      const module = await moduleService.create(req.body);
      res.status(201).json(module);
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

      const module = await moduleService.update(req.params.key, req.body);
      res.json(module);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res, next) {
    try {
      await moduleService.delete(req.params.key);
      res.json({ message: 'Module deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ModuleController();


