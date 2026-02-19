-- Migration: Create GD_SUBAGGREGATE table

CREATE TABLE IF NOT EXISTS gd_subaggregate (
  subaggregate_id INT AUTO_INCREMENT PRIMARY KEY,
  subaggregate_code VARCHAR(50) NOT NULL UNIQUE,
  subaggregate_name VARCHAR(100) NOT NULL,
  aggregate_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  created_by INT NOT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT NULL,
  INDEX idx_subaggregate_code (subaggregate_code),
  INDEX idx_aggregate_id (aggregate_id),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by),
  INDEX idx_updated_by (updated_by),
  FOREIGN KEY (aggregate_id) REFERENCES gd_aggregate(aggregate_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


