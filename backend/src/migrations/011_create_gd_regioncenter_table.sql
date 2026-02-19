-- Migration: Create GD_REGIONCENTER table

CREATE TABLE IF NOT EXISTS gd_regioncenter (
  regioncenter_id INT AUTO_INCREMENT PRIMARY KEY,
  regioncenter_code VARCHAR(50) NOT NULL UNIQUE,
  regioncenter_name VARCHAR(100) NOT NULL,
  is_active TINYINT(1) DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by INT NOT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT NULL,
  INDEX idx_regioncenter_code (regioncenter_code),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by),
  INDEX idx_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


