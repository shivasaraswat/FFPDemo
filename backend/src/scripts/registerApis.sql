-- Direct SQL to register all APIs
-- Run this in MySQL to register all APIs immediately

USE field_fix_db;

-- Delete existing entries (optional - comment out if you want to keep existing)
-- DELETE FROM api_registry;

-- Insert all APIs
INSERT INTO api_registry (method, path, moduleKey, requiredAccess, isActive) VALUES
-- Auth APIs
('POST', '/api/auth/login', 'USER_MANAGEMENT', 'READ', TRUE),
('POST', '/api/auth/register', 'MANAGE_USERS', 'FULL', TRUE),
('GET', '/api/auth/me', 'USER_MANAGEMENT', 'READ', TRUE),
('GET', '/api/auth/me/permissions', 'USER_MANAGEMENT', 'READ', TRUE),

-- Role APIs
('GET', '/api/roles', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/roles/:id', 'MANAGE_ROLES', 'READ', TRUE),
('POST', '/api/roles', 'MANAGE_ROLES', 'FULL', TRUE),
('PUT', '/api/roles/:id', 'MANAGE_ROLES', 'FULL', TRUE),
('DELETE', '/api/roles/:id', 'MANAGE_ROLES', 'FULL', TRUE),

-- Module APIs
('GET', '/api/modules', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/modules/:key', 'MANAGE_ROLES', 'READ', TRUE),
('POST', '/api/modules', 'MANAGE_ROLES', 'FULL', TRUE),
('PUT', '/api/modules/:key', 'MANAGE_ROLES', 'FULL', TRUE),
('DELETE', '/api/modules/:key', 'MANAGE_ROLES', 'FULL', TRUE),

-- Permission APIs
('GET', '/api/permissions', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/permissions/role/:roleId', 'MANAGE_ROLES', 'READ', TRUE),
('POST', '/api/permissions', 'MANAGE_ROLES', 'FULL', TRUE),
('PUT', '/api/permissions/:id', 'MANAGE_ROLES', 'FULL', TRUE),

-- User APIs
('GET', '/api/users', 'MANAGE_USERS', 'READ', TRUE),
('GET', '/api/users/:id', 'MANAGE_USERS', 'READ', TRUE),
('POST', '/api/users', 'MANAGE_USERS', 'FULL', TRUE),
('PUT', '/api/users/:id', 'MANAGE_USERS', 'FULL', TRUE),
('PATCH', '/api/users/:id/activate', 'DEACTIVATED_USERS', 'FULL', TRUE),
('PATCH', '/api/users/:id/deactivate', 'DEACTIVATED_USERS', 'FULL', TRUE),
('DELETE', '/api/users/:id', 'MANAGE_USERS', 'FULL', TRUE),

-- API Registry APIs (CRITICAL - needed to access API Registry screen)
('GET', '/api/api-registry', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/api-registry/:id', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/api-registry/module/:moduleKey', 'MANAGE_ROLES', 'READ', TRUE),
('POST', '/api/api-registry', 'MANAGE_ROLES', 'FULL', TRUE),
('PUT', '/api/api-registry/:id', 'MANAGE_ROLES', 'FULL', TRUE),
('DELETE', '/api/api-registry/:id', 'MANAGE_ROLES', 'FULL', TRUE);

-- Verify registration
SELECT COUNT(*) as total_apis FROM api_registry;
SELECT method, path, moduleKey FROM api_registry ORDER BY method, path;


