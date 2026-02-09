const pool = require('../config/database');

class UserGdCode {
  static async add(userId, gdCode) {
    try {
      await pool.execute(
        'INSERT INTO user_gd_codes (userId, gdCode) VALUES (?, ?)',
        [userId, gdCode]
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

  static async remove(userId, gdCode) {
    const [result] = await pool.execute(
      'DELETE FROM user_gd_codes WHERE userId = ? AND gdCode = ?',
      [userId, gdCode]
    );
    return result.affectedRows > 0;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT gdCode FROM user_gd_codes WHERE userId = ? ORDER BY gdCode',
      [userId]
    );
    return rows.map(row => row.gdCode);
  }

  static async removeAll(userId) {
    await pool.execute(
      'DELETE FROM user_gd_codes WHERE userId = ?',
      [userId]
    );
    return true;
  }

  static async setGdCodes(userId, gdCodes) {
    // Remove all existing GD codes
    await this.removeAll(userId);
    
    // Add new GD codes
    if (Array.isArray(gdCodes) && gdCodes.length > 0) {
      for (const gdCode of gdCodes) {
        await this.add(userId, gdCode);
      }
    }
    return true;
  }
}

module.exports = UserGdCode;

