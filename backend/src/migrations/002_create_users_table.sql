-- Migration: Create users table

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  roleId INT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  ssoId VARCHAR(255) NULL COMMENT 'SSO ID or Business ID',
  mobile VARCHAR(20) NULL COMMENT 'Phone number',
  address TEXT NULL COMMENT 'User address',
  region VARCHAR(100) NULL COMMENT 'Region (required for RC & GD users)',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_roleId (roleId),
  INDEX idx_isActive (isActive),
  INDEX idx_ssoId (ssoId),
  INDEX idx_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


