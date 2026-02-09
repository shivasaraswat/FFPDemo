/**
 * Assign Permissions Script
 * This script assigns MANAGE_ROLES permission to a role so you can access API Registry
 * Usage: node src/scripts/assignPermissions.js [roleId] [accessLevel]
 * Example: node src/scripts/assignPermissions.js 1 FULL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function assignPermissions() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'field_fix_db'
    });

    console.log('✅ Connected to database\n');

    // Get roleId from command line or default to admin role
    const roleId = process.argv[2] || null;
    const accessLevel = process.argv[3] || 'FULL'; // FULL, READ, or NONE

    if (!roleId) {
      // Find admin role
      const [roles] = await connection.execute(
        "SELECT id, name, code FROM roles WHERE code = 'ADMIN' OR name LIKE '%admin%' LIMIT 1"
      );
      
      if (roles.length === 0) {
        console.log('❌ No admin role found. Listing all roles:\n');
        const [allRoles] = await connection.execute('SELECT id, name, code FROM roles');
        allRoles.forEach(role => {
          console.log(`  ID: ${role.id} | Code: ${role.code} | Name: ${role.name}`);
        });
        console.log('\n💡 Run: node src/scripts/assignPermissions.js [roleId] [FULL|READ]');
        return;
      }
      
      const adminRole = roles[0];
      console.log(`📋 Found role: ${adminRole.name} (ID: ${adminRole.id}, Code: ${adminRole.code})\n`);
      
      // Assign MANAGE_ROLES permission to admin
      await connection.execute(
        `INSERT INTO role_permissions (roleId, moduleKey, access) 
         VALUES (?, 'MANAGE_ROLES', ?)
         ON DUPLICATE KEY UPDATE access = ?`,
        [adminRole.id, accessLevel, accessLevel]
      );
      
      console.log(`✅ Assigned MANAGE_ROLES permission (${accessLevel}) to role: ${adminRole.name}`);
      
      // Also assign USER_MANAGEMENT permission (parent module)
      await connection.execute(
        `INSERT INTO role_permissions (roleId, moduleKey, access) 
         VALUES (?, 'USER_MANAGEMENT', ?)
         ON DUPLICATE KEY UPDATE access = ?`,
        [adminRole.id, accessLevel, accessLevel]
      );
      
      console.log(`✅ Assigned USER_MANAGEMENT permission (${accessLevel}) to role: ${adminRole.name}`);
      
    } else {
      // Assign to specific role
      const [roles] = await connection.execute('SELECT id, name, code FROM roles WHERE id = ?', [roleId]);
      
      if (roles.length === 0) {
        console.log(`❌ Role with ID ${roleId} not found`);
        return;
      }
      
      const role = roles[0];
      console.log(`📋 Assigning permissions to role: ${role.name} (ID: ${role.id})\n`);
      
      // Assign MANAGE_ROLES permission
      await connection.execute(
        `INSERT INTO role_permissions (roleId, moduleKey, access) 
         VALUES (?, 'MANAGE_ROLES', ?)
         ON DUPLICATE KEY UPDATE access = ?`,
        [roleId, accessLevel, accessLevel]
      );
      
      console.log(`✅ Assigned MANAGE_ROLES permission (${accessLevel})`);
      
      // Also assign USER_MANAGEMENT permission (parent module)
      await connection.execute(
        `INSERT INTO role_permissions (roleId, moduleKey, access) 
         VALUES (?, 'USER_MANAGEMENT', ?)
         ON DUPLICATE KEY UPDATE access = ?`,
        [roleId, accessLevel, accessLevel]
      );
      
      console.log(`✅ Assigned USER_MANAGEMENT permission (${accessLevel})`);
    }

    console.log('\n💡 You may need to log out and log back in for permissions to refresh.');
    console.log('💡 Or clear your browser cache/localStorage.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

assignPermissions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });



