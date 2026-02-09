# How to Register APIs in Database

Since you're getting 403 errors because APIs aren't registered, here's how to register them initially.

## Quick Solution

Run this command to directly insert all APIs into the database:

```bash
npm run seed:api-registry
```

This script bypasses RBAC and directly inserts all 32 API endpoints into the `api_registry` table.

## Manual SQL Option

If you prefer to run SQL directly, here's the complete INSERT statement:

```sql
USE field_fix_db;

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

-- API Registry APIs
('GET', '/api/api-registry', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/api-registry/:id', 'MANAGE_ROLES', 'READ', TRUE),
('GET', '/api/api-registry/module/:moduleKey', 'MANAGE_ROLES', 'READ', TRUE),
('POST', '/api/api-registry', 'MANAGE_ROLES', 'FULL', TRUE),
('PUT', '/api/api-registry/:id', 'MANAGE_ROLES', 'FULL', TRUE),
('DELETE', '/api/api-registry/:id', 'MANAGE_ROLES', 'FULL', TRUE)
ON DUPLICATE KEY UPDATE moduleKey=VALUES(moduleKey), requiredAccess=VALUES(requiredAccess);
```

## After Registration

Once APIs are registered:
1. Refresh your browser
2. The API Registry screen should now be accessible
3. You can view and manage APIs through the UI

## Verify Registration

Check if APIs are registered:
```sql
SELECT COUNT(*) as total FROM api_registry;
SELECT method, path, moduleKey FROM api_registry ORDER BY method, path;
```

You should see 32 APIs registered.



