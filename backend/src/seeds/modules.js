const Module = require('../models/Module');

const modules = [
  // 1. Master Model (parent)
  { key: 'MASTER_MODEL', name: 'Master Model', parentKey: null, order: 1 },
  { key: 'CONFIG_GROUP', name: 'Config Group', parentKey: 'MASTER_MODEL', order: 1 },
  { key: 'CONFIG_VALUES', name: 'Config Values', parentKey: 'MASTER_MODEL', order: 2 },
  { key: 'MANAGE_MASTERS', name: 'Manage Masters', parentKey: 'MASTER_MODEL', order: 3 },
  { key: 'API_LOGS', name: 'API Logs', parentKey: 'MASTER_MODEL', order: 4 },
  { key: 'DATA_MIGRATION', name: 'Data Migration', parentKey: 'MASTER_MODEL', order: 5 },
  { key: 'EMAIL_CONFIGURATIONS', name: 'Email Configurations', parentKey: 'MASTER_MODEL', order: 6 },

  // 2. Mapping (parent)
  { key: 'MAPPING', name: 'Mapping', parentKey: null, order: 2 },
  { key: 'COUNTRY_MAPPING', name: 'Country Mapping', parentKey: 'MAPPING', order: 1 },
  { key: 'GENERAL_DISTRIBUTORS', name: 'General Distributors', parentKey: 'MAPPING', order: 2 },

  // 3. Help Manual Upload
  { key: 'HELP_MANUAL_UPLOAD', name: 'Help Manual Upload', parentKey: null, order: 3 },

  // 4. Field Fix (parent)
  { key: 'FIELD_FIX', name: 'Field Fix', parentKey: null, order: 4 },
  { key: 'CREATE_NEW_FIELD_FIX', name: 'Create New Field Fix', parentKey: 'FIELD_FIX', order: 1 },
  { key: 'SAVED_FIELD_FIX', name: 'Saved Field Fix', parentKey: 'FIELD_FIX', order: 2 },
  { key: 'PENDING_FOR_APPROVAL', name: 'Pending For Approval', parentKey: 'FIELD_FIX', order: 3 },
  { key: 'RETURNED_FIELD_FIX', name: 'Returned Field Fix', parentKey: 'FIELD_FIX', order: 4 },
  { key: 'ARCHIVED_FIELD_FIX', name: 'Archived Field Fix', parentKey: 'FIELD_FIX', order: 5 },
  { key: 'RELEASED_FIELD_FIX', name: 'Released Field Fix', parentKey: 'FIELD_FIX', order: 6 },
  { key: 'NEW_FIELD_FIX_FROM_CSHQ', name: 'New Field Fix From CSHQ', parentKey: 'FIELD_FIX', order: 7 },
  { key: 'ON_HOLD_FIELD_FIX', name: 'On Hold Field Fix', parentKey: 'FIELD_FIX', order: 8 },
  { key: 'READY_TO_RELEASE', name: 'Ready To Release', parentKey: 'FIELD_FIX', order: 9 },
  { key: 'RELEASED_FIELD_FIX_TO_GD', name: 'Released Field Fix To GD', parentKey: 'FIELD_FIX', order: 10 },
  { key: 'FIELD_FIX_LIMITED_TO_RC', name: 'Field Fix Limited To RC', parentKey: 'FIELD_FIX', order: 11 },
  { key: 'NEW_FIELD_FIX_FROM_QM', name: 'New Field Fix From QM', parentKey: 'FIELD_FIX', order: 12 },

  // 5. Dashboard
  { key: 'DASHBOARD', name: 'Dashboard', parentKey: null, order: 5 },

  // 6. Field Fix Progress (parent)
  { key: 'FIELD_FIX_PROGRESS', name: 'Field Fix Progress', parentKey: null, order: 6 },
  { key: 'FIELD_FIX_PROGRESS_UPDATE', name: 'Field Fix Progress Update', parentKey: 'FIELD_FIX_PROGRESS', order: 1 },
  { key: 'FIELD_FIX_PROGRESS_UPDATE_RC', name: 'Field Fix Progress Update RC', parentKey: 'FIELD_FIX_PROGRESS', order: 2 },
  { key: 'FALCON_UPDATES', name: 'Falcon Updates', parentKey: 'FIELD_FIX_PROGRESS', order: 3 },
  { key: 'ON_HOLD_FIELD_FIX_PROGRESS', name: 'On Hold Field Fix Progress', parentKey: 'FIELD_FIX_PROGRESS', order: 4 },
  { key: 'ARCHIVED_FIELD_FIX_PROGRESS', name: 'Archived Field Fix Progress', parentKey: 'FIELD_FIX_PROGRESS', order: 5 },

  // 7. User Management (parent)
  { key: 'USER_MANAGEMENT', name: 'User Management', parentKey: null, order: 7 },
  { key: 'MANAGE_USERS', name: 'Manage Users', parentKey: 'USER_MANAGEMENT', order: 1 },
  { key: 'MANAGE_ROLES', name: 'Manage Roles', parentKey: 'USER_MANAGEMENT', order: 2 },
  { key: 'DEACTIVATED_USERS', name: 'Deactivated Users', parentKey: 'USER_MANAGEMENT', order: 3 },

  // 8. Reports Gallery
  { key: 'REPORTS_GALLERY', name: 'Reports Gallery', parentKey: null, order: 8 }
];

async function seedModules() {
  console.log('🌱 Seeding modules...');
  
  // Sort modules to ensure parents are created before children
  const sortedModules = [...modules].sort((a, b) => {
    if (a.parentKey === null && b.parentKey !== null) return -1;
    if (a.parentKey !== null && b.parentKey === null) return 1;
    return a.order - b.order;
  });

  for (const moduleData of sortedModules) {
    try {
      const existingModule = await Module.findByKey(moduleData.key);
      if (existingModule) {
        console.log(`  ⏭️  Module ${moduleData.key} already exists, skipping...`);
        continue;
      }

      // Verify parent exists if parentKey is specified
      if (moduleData.parentKey) {
        const parent = await Module.findByKey(moduleData.parentKey);
        if (!parent) {
          console.error(`  ❌ Parent module ${moduleData.parentKey} not found for ${moduleData.key}, skipping...`);
          continue;
        }
      }

      const module = await Module.create(moduleData);
      console.log(`  ✅ Created module: ${module.name} (${module.key})`);
    } catch (error) {
      console.error(`  ❌ Error creating module ${moduleData.key}:`, error.message);
    }
  }

  console.log('✅ Modules seeding completed!\n');
}

module.exports = seedModules;


