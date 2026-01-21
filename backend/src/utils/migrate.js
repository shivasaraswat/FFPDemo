const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class MigrationRunner {
  constructor() {
    this.connection = null;
    this.migrationsDir = path.join(__dirname, '../migrations');
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'field_fix_db',
      multipleStatements: true
    });
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
    }
  }

  async ensureDatabase() {
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'field_fix_db';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempConnection.end();
  }

  async ensureMigrationsTable() {
    // Check if migrations table exists
    const [tables] = await this.connection.query(
      "SHOW TABLES LIKE 'migrations'"
    );

    if (tables.length === 0) {
      // Create migrations table manually (chicken-egg problem)
      const migrationsTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_filename (filename)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;
      await this.connection.query(migrationsTableSQL);
      console.log('✅ Created migrations tracking table');
    }
  }

  async getAppliedMigrations() {
    await this.ensureMigrationsTable();
    const [rows] = await this.connection.query(
      'SELECT filename FROM migrations ORDER BY filename ASC'
    );
    return rows.map(row => row.filename);
  }

  async getMigrationFiles() {
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    return files;
  }

  async executeMigration(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    let sql = fs.readFileSync(filePath, 'utf8');

    // Remove single-line comments (lines starting with --)
    sql = sql.split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith('--');
      })
      .join('\n')
      .trim();

    // Split by semicolons and filter out empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ')) // Normalize whitespace
      .filter(s => s.length > 10); // Filter out very short strings (likely empty)

    if (statements.length === 0) {
      throw new Error(`No valid SQL statements found in ${filename}`);
    }

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await this.connection.query(statement);
      } catch (error) {
        console.error(`  ❌ Error executing statement ${i + 1}/${statements.length}`);
        console.error(`  Error: ${error.message}`);
        console.error(`  SQL preview: ${statement.substring(0, 150)}...`);
        throw error;
      }
    }

    // Record migration only if all statements succeeded
    await this.connection.query(
      'INSERT INTO migrations (filename) VALUES (?) ON DUPLICATE KEY UPDATE filename=filename',
      [filename]
    );
  }

  async runMigrations() {
    try {
      await this.ensureDatabase();
      await this.connect();
      await this.ensureMigrationsTable();

      const appliedMigrations = await this.getAppliedMigrations();
      const allMigrations = await this.getMigrationFiles();

      const pendingMigrations = allMigrations.filter(
        file => !appliedMigrations.includes(file)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations. Database is up to date.');
        return;
      }

      console.log(`📦 Found ${pendingMigrations.length} pending migration(s)...\n`);

      for (const migration of pendingMigrations) {
        console.log(`  🔄 Running migration: ${migration}`);
        await this.executeMigration(migration);
        console.log(`  ✅ Completed: ${migration}\n`);
      }

      console.log('✅ All migrations completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async rollbackMigration(filename) {
    try {
      await this.connect();
      await this.ensureMigrationsTable();

      const appliedMigrations = await this.getAppliedMigrations();
      
      if (!appliedMigrations.includes(filename)) {
        console.log(`⚠️  Migration ${filename} has not been applied.`);
        return;
      }

      // Note: Rollback requires a corresponding rollback file
      // For now, we just remove it from the tracking table
      // In production, you'd want rollback SQL files
      console.log(`⚠️  Rollback for ${filename} - removing from tracking only.`);
      console.log(`⚠️  Note: Manual rollback may be required.`);
      
      await this.connection.query(
        'DELETE FROM migrations WHERE filename = ?',
        [filename]
      );

      console.log(`✅ Removed ${filename} from migration tracking`);
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async status() {
    try {
      await this.ensureDatabase();
      await this.connect();
      await this.ensureMigrationsTable();

      const appliedMigrations = await this.getAppliedMigrations();
      const allMigrations = await this.getMigrationFiles();

      console.log('\n📊 Migration Status:\n');
      console.log(`Total migrations: ${allMigrations.length}`);
      console.log(`Applied: ${appliedMigrations.length}`);
      console.log(`Pending: ${allMigrations.length - appliedMigrations.length}\n`);

      if (appliedMigrations.length > 0) {
        console.log('Applied migrations:');
        appliedMigrations.forEach(m => console.log(`  ✅ ${m}`));
      }

      const pending = allMigrations.filter(m => !appliedMigrations.includes(m));
      if (pending.length > 0) {
        console.log('\nPending migrations:');
        pending.forEach(m => console.log(`  ⏳ ${m}`));
      }

      console.log('');
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const runner = new MigrationRunner();

  (async () => {
    try {
      switch (command) {
        case 'up':
        case 'migrate':
          await runner.runMigrations();
          process.exit(0);
          break;

        case 'status':
          await runner.status();
          process.exit(0);
          break;

        case 'rollback':
          const filename = process.argv[3];
          if (!filename) {
            console.error('❌ Please specify a migration filename to rollback');
            process.exit(1);
          }
          await runner.rollbackMigration(filename);
          process.exit(0);
          break;

        default:
          console.log('Usage:');
          console.log('  node migrate.js up       - Run pending migrations');
          console.log('  node migrate.js status   - Show migration status');
          console.log('  node migrate.js rollback <filename> - Rollback a migration');
          process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}

module.exports = MigrationRunner;

