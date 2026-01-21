-- Migration: Create api_registry table

CREATE TABLE IF NOT EXISTS api_registry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL,
  path VARCHAR(500) NOT NULL,
  moduleKey VARCHAR(100) NOT NULL,
  requiredAccess ENUM('READ', 'FULL') NOT NULL DEFAULT 'READ',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_method_path (method, path),
  INDEX idx_moduleKey (moduleKey),
  INDEX idx_isActive (isActive),
  FOREIGN KEY (moduleKey) REFERENCES modules(`key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


