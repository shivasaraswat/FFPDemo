const Role = require('../models/Role');

const roles = [
  {
    name: 'Administrator',
    code: 'ADMIN',
    description: 'Full system administrator with all permissions',
    isSystemRole: true
  },
  {
    name: 'Creator (QM)',
    code: 'CREATOR_QM',
    description: 'Quality Manager - Can create field fixes',
    isSystemRole: true
  },
  {
    name: 'Approver (L4)',
    code: 'APPROVER_L4',
    description: 'Level 4 Approver - Can approve field fixes',
    isSystemRole: true
  },
  {
    name: 'CSHQ',
    code: 'CSHQ',
    description: 'CSHQ user',
    isSystemRole: true
  },
  {
    name: 'RC',
    code: 'RC',
    description: 'RC user',
    isSystemRole: true
  },
  {
    name: 'GD',
    code: 'GD',
    description: 'GD user',
    isSystemRole: true
  },
  {
    name: 'SC/FDP',
    code: 'SC_FDP',
    description: 'Service Center/FUSO Dealer Partners - for Japan Market',
    isSystemRole: true
  },
  {
    name: 'Read-only user',
    code: 'READ_ONLY',
    description: 'Read-only access user',
    isSystemRole: true
  }
];

async function seedRoles() {
  console.log('🌱 Seeding roles...');
  
  for (const roleData of roles) {
    try {
      const existingRole = await Role.findByCode(roleData.code);
      if (existingRole) {
        console.log(`  ⏭️  Role ${roleData.code} already exists, skipping...`);
        continue;
      }

      const role = await Role.create(roleData);
      console.log(`  ✅ Created role: ${role.name} (${role.code})`);
    } catch (error) {
      console.error(`  ❌ Error creating role ${roleData.code}:`, error.message);
    }
  }

  console.log('✅ Roles seeding completed!\n');
}

module.exports = seedRoles;


