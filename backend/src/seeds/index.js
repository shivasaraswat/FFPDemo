require('dotenv').config();
const MigrationRunner = require('../utils/migrate');
const seedRoles = require('./roles');
const seedModules = require('./modules');
const seedApiRegistry = require('./apiRegistry');
const Role = require('../models/Role');
const User = require('../models/User');
const { hashPassword } = require('../utils/password');

async function seed() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Run migrations first
    console.log('📦 Running database migrations...\n');
    const migrationRunner = new MigrationRunner();
    await migrationRunner.runMigrations();
    console.log('');

    // Seed roles
    await seedRoles();

    // Seed modules
    await seedModules();

    // Seed API registry
    await seedApiRegistry();

    // Create default admin user if not exists
    await createDefaultAdmin();

    console.log('✅ All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

async function createDefaultAdmin() {
  console.log('🌱 Creating default admin user...');
  
  try {
    const adminRole = await Role.findByCode('ADMIN');
    if (!adminRole) {
      console.error('  ❌ Admin role not found. Please seed roles first.');
      return;
    }

    const existingAdmin = await User.findByEmail('admin@fieldfix.com');
    if (existingAdmin) {
      console.log('  ⏭️  Default admin user already exists, skipping...');
      return;
    }

    const passwordHash = await hashPassword('admin123');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@fieldfix.com',
      passwordHash,
      roleId: adminRole.id,
      language: 'en',
      isActive: true
    });

    console.log(`  ✅ Created default admin user: ${admin.email}`);
    console.log('  📝 Default credentials: admin@fieldfix.com / admin123');
  } catch (error) {
    console.error('  ❌ Error creating default admin:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('\n✨ Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seed;

