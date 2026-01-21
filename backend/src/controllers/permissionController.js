const permissionService = require('../services/permissionService');
const { validationResult } = require('express-validator');

class PermissionController {
  async getMatrix(req, res, next) {
    try {
      const matrix = await permissionService.getMatrix();
      res.json(matrix);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByRole(req, res, next) {
    try {
      const permissions = await permissionService.getByRole(req.params.roleId);
      res.json(permissions);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async bulkUpdate(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const matrix = await permissionService.bulkUpdate(req.body.permissions);
      res.json(matrix);
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

      const permission = await permissionService.update(req.params.id, req.body.access);
      res.json(permission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PermissionController();


