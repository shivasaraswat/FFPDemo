const pool = require('../config/database');

class UserRegion {
  static async add(userId, region) {
    try {
      await pool.execute(
        'INSERT INTO user_regions (userId, region) VALUES (?, ?)',
        [userId, region]
      );
      return true;
    } catch (error) {
      // Ignore duplicate entry errors (already exists)
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  static async remove(userId, region) {
    const [result] = await pool.execute(
      'DELETE FROM user_regions WHERE userId = ? AND region = ?',
      [userId, region]
    );
    return result.affectedRows > 0;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT region FROM user_regions WHERE userId = ? ORDER BY region',
      [userId]
    );
    return rows.map(row => row.region);
  }

  static async removeAll(userId) {
    await pool.execute(
      'DELETE FROM user_regions WHERE userId = ?',
      [userId]
    );
    return true;
  }

  static async setRegions(userId, regions) {
    // Remove all existing regions
    await this.removeAll(userId);
    
    // Add new regions
    if (Array.isArray(regions) && regions.length > 0) {
      for (const region of regions) {
        await this.add(userId, region);
      }
    }
    return true;
  }
}

module.exports = UserRegion;


