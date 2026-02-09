# Complete List of API Endpoints for Registration

This document lists all API endpoints in the system that should be registered in the API Registry for RBAC enforcement.

## Authentication APIs (`/api/auth`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| POST | `/api/auth/login` | `USER_MANAGEMENT` | READ | Public endpoint (no RBAC) |
| POST | `/api/auth/register` | `MANAGE_USERS` | FULL | Admin only |
| GET | `/api/auth/me` | `USER_MANAGEMENT` | READ | Get current user |
| GET | `/api/auth/me/permissions` | `USER_MANAGEMENT` | READ | Get user permissions |

## Role Management APIs (`/api/roles`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/api/roles` | `MANAGE_ROLES` | READ | List all roles |
| GET | `/api/roles/:id` | `MANAGE_ROLES` | READ | Get role by ID |
| POST | `/api/roles` | `MANAGE_ROLES` | FULL | Create new role |
| PUT | `/api/roles/:id` | `MANAGE_ROLES` | FULL | Update role |
| DELETE | `/api/roles/:id` | `MANAGE_ROLES` | FULL | Delete role |

## Module Management APIs (`/api/modules`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/api/modules` | `MANAGE_ROLES` | READ | List all modules |
| GET | `/api/modules?hierarchical=true` | `MANAGE_ROLES` | READ | Get hierarchical modules |
| GET | `/api/modules/:key` | `MANAGE_ROLES` | READ | Get module by key |
| POST | `/api/modules` | `MANAGE_ROLES` | FULL | Create new module |
| PUT | `/api/modules/:key` | `MANAGE_ROLES` | FULL | Update module |
| DELETE | `/api/modules/:key` | `MANAGE_ROLES` | FULL | Delete module |

## Permission Management APIs (`/api/permissions`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/api/permissions` | `MANAGE_ROLES` | READ | Get permission matrix |
| GET | `/api/permissions/role/:roleId` | `MANAGE_ROLES` | READ | Get permissions for role |
| POST | `/api/permissions` | `MANAGE_ROLES` | FULL | Bulk update permissions |
| PUT | `/api/permissions/:id` | `MANAGE_ROLES` | FULL | Update single permission |

## User Management APIs (`/api/users`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/api/users` | `MANAGE_USERS` | READ | List users (with filters) |
| GET | `/api/users/:id` | `MANAGE_USERS` | READ | Get user by ID |
| POST | `/api/users` | `MANAGE_USERS` | FULL | Create new user |
| PUT | `/api/users/:id` | `MANAGE_USERS` | FULL | Update user |
| PATCH | `/api/users/:id/activate` | `DEACTIVATED_USERS` | FULL | Activate user |
| PATCH | `/api/users/:id/deactivate` | `DEACTIVATED_USERS` | FULL | Deactivate user |
| DELETE | `/api/users/:id` | `MANAGE_USERS` | FULL | Delete user |

## API Registry Management APIs (`/api/api-registry`)

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/api/api-registry` | `MANAGE_ROLES` | READ | List all registered APIs |
| GET | `/api/api-registry/:id` | `MANAGE_ROLES` | READ | Get API registry entry by ID |
| GET | `/api/api-registry/module/:moduleKey` | `MANAGE_ROLES` | READ | Get APIs for a module |
| POST | `/api/api-registry` | `MANAGE_ROLES` | FULL | Register new API |
| PUT | `/api/api-registry/:id` | `MANAGE_ROLES` | FULL | Update API registration |
| DELETE | `/api/api-registry/:id` | `MANAGE_ROLES` | FULL | Delete API registration |

## System APIs

| Method | Path | Module Key | Required Access | Notes |
|--------|------|------------|-----------------|-------|
| GET | `/health` | N/A | N/A | Health check (public, no RBAC) |

---

## Quick Registration Guide

When registering APIs in the API Registry screen:

1. **Method**: Select the HTTP method (GET, POST, PUT, DELETE, PATCH)
2. **Path**: Enter the full path (e.g., `/api/users`, `/api/users/:id`)
3. **Module**: Select the module this API belongs to
4. **Required Access**: 
   - **READ**: For GET endpoints (viewing data)
   - **FULL**: For POST, PUT, DELETE, PATCH endpoints (modifying data)
5. **Active**: Check to enable RBAC enforcement

## Important Notes

- Paths with `:id`, `:key`, `:roleId` are dynamic parameters (e.g., `/api/users/:id` matches `/api/users/1`, `/api/users/2`, etc.)
- The RBAC middleware automatically matches these patterns
- All APIs under `/api/auth/login` and `/health` are public and don't need RBAC
- All other APIs must be registered for RBAC to work

## Total Count

- **Authentication APIs**: 4 endpoints
- **Role APIs**: 5 endpoints
- **Module APIs**: 6 endpoints
- **Permission APIs**: 4 endpoints
- **User APIs**: 7 endpoints
- **API Registry APIs**: 6 endpoints
- **System APIs**: 1 endpoint (public)

**Total: 33 API endpoints** (32 require registration, 1 is public)



