const masterService = require('../services/masterService');

class MasterController {
  async getAll(req, res, next) {
    try {
      const { type } = req.params;
      
      // Handle isActive filter - accept both "1"/"true" and "0"/"false"
      let isActive = undefined;
      if (req.query.isActive !== undefined) {
        const value = req.query.isActive.toString().toLowerCase();
        isActive = value === 'true' || value === '1';
      }
      
      const filters = {
        isActive: isActive,
        search: req.query.search
      };
      const records = await masterService.getAll(type, filters);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res, next) {
    try {
      const { type, id } = req.params;
      const record = await masterService.getById(type, id);
      res.json(record);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req, res, next) {
    try {
      const { type } = req.params;
      const userId = req.user ? req.user.id : null;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const record = await masterService.create(type, req.body, userId);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res, next) {
    try {
      const { type, id } = req.params;
      const userId = req.user ? req.user.id : null;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const record = await masterService.update(type, id, req.body, userId);
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res, next) {
    try {
      const { type, id } = req.params;
      await masterService.delete(type, id);
      res.json({ message: `${type} deleted successfully` });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MasterController();

