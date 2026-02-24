-- Migration: Create user_regions junction table
-- This table stores the many-to-many relationship between users and regions

CREATE TABLE IF NOT EXISTS user_regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  region VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_region (userId, region),
  INDEX idx_userId (userId),
  INDEX idx_region (region),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


