-- Migration: Create user_gd_codes junction table
-- This table stores the many-to-many relationship between users and GD codes

CREATE TABLE IF NOT EXISTS user_gd_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  gdCode VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_gd_code (userId, gdCode),
  INDEX idx_userId (userId),
  INDEX idx_gdCode (gdCode),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

