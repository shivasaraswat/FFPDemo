-- Migration: Migrate existing user roles to user_roles table

INSERT IGNORE INTO user_roles (userId, roleId)
SELECT u.id, u.roleId FROM users u WHERE u.roleId IS NOT NULL;

