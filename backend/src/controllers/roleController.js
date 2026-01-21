const roleService = require('../services/roleService');
const { validationResult } = require('express-validator');

class RoleController {
  async getAll(req, res, next) {
    try {
      const roles = await roleService.getAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res, next) {
    try {
      const role = await roleService.getById(req.params.id);
      res.json(role);
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

      const role = await roleService.create(req.body);
      res.status(201).json(role);
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

      const role = await roleService.update(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res, next) {
    try {
      await roleService.delete(req.params.id);
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RoleController();


