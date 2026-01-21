const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  async getAll(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        roleId: req.query.roleId ? parseInt(req.query.roleId) : undefined,
        search: req.query.search
      };
      const users = await userService.getAll(filters);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
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

      const user = await userService.create(req.body);
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
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

      const user = await userService.update(req.params.id, req.body);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async activate(req, res, next) {
    try {
      const user = await userService.activate(req.params.id);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deactivate(req, res, next) {
    try {
      const user = await userService.deactivate(req.params.id);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();


