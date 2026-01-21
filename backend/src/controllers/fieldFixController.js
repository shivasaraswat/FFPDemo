class FieldFixController {
  async getDemo(req, res, next) {
    try {
      // Dummy API that returns field fix demo data
      res.json({
        message: 'field fix demo',
        data: {
          id: 1,
          title: 'Field Fix Demo',
          description: 'This is a demo field fix response',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FieldFixController();


