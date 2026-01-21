# Field Fix Backend - User Management with RBAC

Production-ready Node.js backend for User Management with module-based Role-Based Access Control (RBAC).

## Features

- **JWT Authentication**: Secure token-based authentication
- **Module-based RBAC**: Hierarchical permission system with parent-child module relationships
- **User Management**: CRUD operations for users with activation/deactivation
- **Role Management**: Manage roles and their permissions
- **Permission Matrix**: Visualize and manage permissions across roles and modules
- **API Registry**: Centralized API endpoint registration for RBAC enforcement
- **Secure by Default**: Unregistered APIs return 403 Forbidden

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=field_fix_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

4. Run database migrations:
```bash
npm run migrate
```

5. Seed initial data:
```bash
npm run seed
```

**Or run both in sequence:**
```bash
npm run migrate && npm run seed
```

**Migration commands:**
- `npm run migrate` - Run all pending migrations
- `npm run migrate:status` - Check migration status
- `npm run migrate:rollback <filename>` - Rollback a specific migration

**Seeding will:**
- Seed predefined roles
- Seed initial modules with hierarchy
- Register API endpoints
- Create default admin user (admin@fieldfix.com / admin123)

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (public)
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/me/permissions` - Get user permissions

### Roles
- `GET /api/roles` - List all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role (admin only)
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Modules
- `GET /api/modules` - List all modules
- `GET /api/modules?hierarchical=true` - Get hierarchical module structure
- `GET /api/modules/:key` - Get module by key
- `POST /api/modules` - Create module (admin only)
- `PUT /api/modules/:key` - Update module
- `DELETE /api/modules/:key` - Delete module

### Permissions
- `GET /api/permissions` - Get permission matrix (all roles × all modules)
- `GET /api/permissions/role/:roleId` - Get permissions for a role
- `POST /api/permissions` - Bulk update permissions
- `PUT /api/permissions/:id` - Update single permission

### Users
- `GET /api/users` - List users (with filters: ?isActive=true&roleId=1&search=name)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/activate` - Activate user
- `PATCH /api/users/:id/deactivate` - Deactivate user
- `DELETE /api/users/:id` - Delete user

### API Registry
- `GET /api/api-registry` - List all registered APIs
- `GET /api/api-registry/:id` - Get API registry entry by ID
- `GET /api/api-registry/module/:moduleKey` - Get APIs for a module
- `POST /api/api-registry` - Register new API endpoint
- `PUT /api/api-registry/:id` - Update API registry entry
- `DELETE /api/api-registry/:id` - Delete API registry entry

## RBAC System

### Permission Levels
- **FULL**: Full access (read + write)
- **READ**: Read-only access
- **NONE**: No access

### Parent-Child Module Hierarchy
- If a parent module has **NONE** access, all child modules are automatically denied
- Child permissions are only effective if parent permission ≠ NONE
- Parent permission acts as a hard gate

### How It Works
1. Every API request (except public endpoints) goes through RBAC middleware
2. Middleware looks up the API in `api_registry` table
3. Checks parent module permission first (if exists)
4. Then checks child module permission
5. Returns 403 if permission insufficient or API not registered

## Default Admin User

After seeding:
- **Email**: admin@fieldfix.com
- **Password**: admin123
- **Role**: Administrator (full access)

**⚠️ Change the default password in production!**

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and JWT configuration
│   ├── models/          # Database models
│   ├── middleware/      # Auth and RBAC middleware
│   ├── controllers/    # Route controllers
│   ├── services/       # Business logic
│   ├── routes/         # Express routes
│   ├── utils/          # Utility functions
│   ├── seeds/          # Database seeding scripts
│   └── server.js       # Express app entry point
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- SQL injection prevention (parameterized queries)
- Input validation on all endpoints
- CORS configuration
- Secure by default (unregistered APIs return 403)

## License

ISC
