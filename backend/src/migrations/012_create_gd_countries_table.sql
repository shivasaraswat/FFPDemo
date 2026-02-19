-- Migration: Create GD_COUNTRIES table

CREATE TABLE IF NOT EXISTS gd_countries (
  country_id INT AUTO_INCREMENT PRIMARY KEY,
  country_code VARCHAR(50) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  country_iso_id VARCHAR(10) NULL,
  is_active TINYINT(1) DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by INT NOT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT NULL,
  INDEX idx_country_code (country_code),
  INDEX idx_country_iso_id (country_iso_id),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by),
  INDEX idx_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


