-- Migration: Create role_permissions table

CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roleId INT NOT NULL,
  moduleKey VARCHAR(100) NOT NULL,
  access ENUM('FULL', 'READ', 'NONE') DEFAULT 'NONE',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_role_module (roleId, moduleKey),
  INDEX idx_roleId (roleId),
  INDEX idx_moduleKey (moduleKey),
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (moduleKey) REFERENCES modules(`key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


