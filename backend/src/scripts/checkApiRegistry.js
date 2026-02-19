/**
 * Check API Registry - Debug script
 * This script checks what APIs are registered and tests matching
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkApiRegistry() {
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

    // Check all registered APIs
    const [apis] = await connection.execute(
      'SELECT * FROM api_registry ORDER BY method, path'
    );

    console.log(`📊 Total APIs registered: ${apis.length}\n`);
    
    if (apis.length === 0) {
      console.log('❌ No APIs found in registry!');
      return;
    }

    console.log('📋 Registered APIs:\n');
    apis.forEach(api => {
      console.log(`  ${api.method.padEnd(6)} ${api.path.padEnd(40)} -> ${api.moduleKey} (${api.requiredAccess}) [Active: ${api.isActive}]`);
    });

    // Test specific paths
    console.log('\n🔍 Testing path matching:\n');
    
    const testPaths = [
      { method: 'GET', path: '/api/api-registry' },
      { method: 'GET', path: '/api/modules' },
      { method: 'GET', path: '/api/roles' }
    ];

    for (const test of testPaths) {
      // Exact match
      const [exact] = await connection.execute(
        'SELECT * FROM api_registry WHERE method = ? AND path = ? AND isActive = TRUE',
        [test.method, test.path]
      );

      if (exact.length > 0) {
        console.log(`  ✅ Exact match found for ${test.method} ${test.path}`);
      } else {
        console.log(`  ❌ No exact match for ${test.method} ${test.path}`);
        
        // Try pattern matching
        const [all] = await connection.execute(
          'SELECT * FROM api_registry WHERE method = ? AND isActive = TRUE',
          [test.method]
        );

        let found = false;
        for (const api of all) {
          const pattern = api.path.replace(/:[^/]+/g, '[^/]+');
          const regex = new RegExp(`^${pattern}$`);
          if (regex.test(test.path)) {
            console.log(`  ✅ Pattern match: ${test.method} ${test.path} matches ${api.path}`);
            found = true;
            break;
          }
        }
        
        if (!found) {
          console.log(`  ❌ No pattern match found for ${test.method} ${test.path}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkApiRegistry()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });




