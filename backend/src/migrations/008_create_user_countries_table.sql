-- Migration: Create user_countries junction table
-- This table stores the many-to-many relationship between users and countries

CREATE TABLE IF NOT EXISTS user_countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  country VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_country (userId, country),
  INDEX idx_userId (userId),
  INDEX idx_country (country),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

