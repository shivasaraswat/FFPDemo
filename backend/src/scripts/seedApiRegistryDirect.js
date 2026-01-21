/**
 * Direct API Registry Seeding Script
 * This script bypasses RBAC and directly inserts APIs into the database
 * Run this if APIs are not registered: node src/scripts/seedApiRegistryDirect.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const apiMappings = [
  // Auth APIs
  { method: 'POST', path: '/api/auth/login', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/auth/register', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'GET', path: '/api/auth/me', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/auth/me/permissions', moduleKey: 'USER_MANAGEMENT', requiredAccess: 'READ' },

  // Role APIs
  { method: 'GET', path: '/api/roles', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/roles', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/roles/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // Module APIs
  { method: 'GET', path: '/api/modules', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/modules', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/modules/:key', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // Permission APIs
  { method: 'GET', path: '/api/permissions', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/permissions/role/:roleId', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/permissions', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/permissions/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },

  // User APIs
  { method: 'GET', path: '/api/users', moduleKey: 'MANAGE_USERS', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/users', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },
  { method: 'PATCH', path: '/api/users/:id/activate', moduleKey: 'DEACTIVATED_USERS', requiredAccess: 'FULL' },
  { method: 'PATCH', path: '/api/users/:id/deactivate', moduleKey: 'DEACTIVATED_USERS', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/users/:id', moduleKey: 'MANAGE_USERS', requiredAccess: 'FULL' },

  // API Registry APIs
  { method: 'GET', path: '/api/api-registry', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'GET', path: '/api/api-registry/module/:moduleKey', moduleKey: 'MANAGE_ROLES', requiredAccess: 'READ' },
  { method: 'POST', path: '/api/api-registry', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'PUT', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' },
  { method: 'DELETE', path: '/api/api-registry/:id', moduleKey: 'MANAGE_ROLES', requiredAccess: 'FULL' }
];

async function seedApiRegistryDirect() {
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
    console.log('📦 Registering APIs in API Registry...\n');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const apiData of apiMappings) {
      try {
        // Check if already exists
        const [existing] = await connection.execute(
          'SELECT id FROM api_registry WHERE method = ? AND path = ?',
          [apiData.method, apiData.path]
        );

        if (existing.length > 0) {
          console.log(`  ⏭️  ${apiData.method} ${apiData.path} already exists, skipping...`);
          skipCount++;
          continue;
        }

        // Insert API
        await connection.execute(
          `INSERT INTO api_registry (method, path, moduleKey, requiredAccess, isActive) 
           VALUES (?, ?, ?, ?, ?)`,
          [apiData.method, apiData.path, apiData.moduleKey, apiData.requiredAccess, true]
        );

        console.log(`  ✅ Registered: ${apiData.method} ${apiData.path} -> ${apiData.moduleKey} (${apiData.requiredAccess})`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ Error registering ${apiData.method} ${apiData.path}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Successfully registered: ${successCount}`);
    console.log(`  ⏭️  Already existed: ${skipCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📝 Total: ${apiMappings.length} APIs\n`);

    if (successCount > 0 || skipCount > 0) {
      console.log('✅ API Registry seeding completed!');
      console.log('💡 You can now access the API Registry screen.\n');
    }
  } catch (error) {
    console.error('❌ Database connection or seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedApiRegistryDirect()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = seedApiRegistryDirect;


