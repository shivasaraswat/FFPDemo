const pool = require('../config/database');

class Notification {
  static async create(notificationData) {
    const { userId, type, title, message, data, isRead = false, emailSent = false } = notificationData;
    
    const [result] = await pool.execute(
      `INSERT INTO notifications (userId, type, title, message, data, isRead, emailSent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, title, message, JSON.stringify(data || {}), isRead, emailSent]
    );
    
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    
    const notification = rows[0];
    if (notification.data) {
      try {
        // If data is already an object, use it as is
        if (typeof notification.data === 'object') {
          return notification;
        }
        // If data is a string, parse it
        if (typeof notification.data === 'string') {
          notification.data = JSON.parse(notification.data);
        }
      } catch (error) {
        console.error('Error parsing notification data:', error);
        notification.data = {};
      }
    }
    return notification;
  }

  static async findByUserId(userId, options = {}) {
    const { limit = 50, offset = 0, isRead = null } = options;
    
    // Ensure limit and offset are valid integers
    const limitInt = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const offsetInt = Math.max(0, parseInt(offset, 10) || 0);
    
    // Build query with parameters for WHERE clause, but use template for LIMIT/OFFSET
    // (LIMIT and OFFSET must be integers, so we can safely use them in template)
    let query = 'SELECT * FROM notifications WHERE userId = ?';
    const params = [userId];
    
    if (isRead !== null) {
      query += ' AND isRead = ?';
      params.push(isRead === true || isRead === 'true' ? 1 : 0);
    }
    
    query += ` ORDER BY createdAt DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;
    
    const [rows] = await pool.execute(query, params);
    
    return rows.map(row => {
      if (row.data) {
        try {
          // If data is already an object, use it as is
          if (typeof row.data === 'object') {
            return row;
          }
          // If data is a string, parse it
          if (typeof row.data === 'string') {
            row.data = JSON.parse(row.data);
          }
        } catch (error) {
          console.error('Error parsing notification data:', error);
          row.data = {};
        }
      }
      return row;
    });
  }

  static async getUnreadCount(userId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = FALSE',
      [userId]
    );
    return rows[0].count;
  }

  static async markAsRead(id, userId) {
    await pool.execute(
      'UPDATE notifications SET isRead = TRUE WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return this.findById(id);
  }

  static async markAllAsRead(userId) {
    await pool.execute(
      'UPDATE notifications SET isRead = TRUE WHERE userId = ? AND isRead = FALSE',
      [userId]
    );
    return true;
  }

  static async delete(id, userId) {
    await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return true;
  }
}

module.exports = Notification;

