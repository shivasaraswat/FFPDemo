const pool = require('../config/database');

class UserCountry {
  static async add(userId, country) {
    try {
      await pool.execute(
        'INSERT INTO user_countries (userId, country) VALUES (?, ?)',
        [userId, country]
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

  static async remove(userId, country) {
    const [result] = await pool.execute(
      'DELETE FROM user_countries WHERE userId = ? AND country = ?',
      [userId, country]
    );
    return result.affectedRows > 0;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      'SELECT country FROM user_countries WHERE userId = ? ORDER BY country',
      [userId]
    );
    return rows.map(row => row.country);
  }

  static async removeAll(userId) {
    await pool.execute(
      'DELETE FROM user_countries WHERE userId = ?',
      [userId]
    );
    return true;
  }

  static async setCountries(userId, countries) {
    // Remove all existing countries
    await this.removeAll(userId);
    
    // Add new countries
    if (Array.isArray(countries) && countries.length > 0) {
      for (const country of countries) {
        await this.add(userId, country);
      }
    }
    return true;
  }
}

module.exports = UserCountry;

