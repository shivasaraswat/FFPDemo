# Database Migrations

This directory contains SQL migration files that are executed in order to set up and update the database schema.

## Migration Files

Migrations are numbered sequentially and executed in order:

- `001_create_migrations_table.sql` - Creates the migrations tracking table
- `002_create_users_table.sql` - Creates the users table
- `003_create_roles_table.sql` - Creates the roles table
- `004_create_modules_table.sql` - Creates the modules table
- `005_create_role_permissions_table.sql` - Creates the role_permissions table
- `006_create_api_registry_table.sql` - Creates the api_registry table

## Running Migrations

### Run all pending migrations:
```bash
npm run migrate
```

### Check migration status:
```bash
npm run migrate:status
```

### Rollback a migration (manual rollback required):
```bash
npm run migrate:rollback <filename>
```

## Migration Naming Convention

- Use sequential numbers: `001_`, `002_`, `003_`, etc.
- Use descriptive names: `001_create_users_table.sql`
- Always include `.sql` extension
- Use lowercase with underscores for readability

## Creating New Migrations

1. Create a new file in this directory: `007_your_migration_name.sql`
2. Write your SQL statements
3. Run `npm run migrate` to apply it

## Important Notes

- Migrations are tracked in the `migrations` table
- Each migration runs only once
- Migrations are executed in filename order
- Always test migrations in a development environment first


