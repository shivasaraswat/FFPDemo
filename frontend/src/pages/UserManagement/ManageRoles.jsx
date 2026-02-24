import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { accessObjectService } from '../../services/accessObjectService';
import AddRoleModal from '../../components/RoleManagement/AddRoleModal';
import { useSnackbar } from '../../context/SnackbarContext';
import '../Common.css';
import './ManageRoles.css';

const ManageRoles = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingRole, setAddingRole] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRole && roles.length > 0) {
      loadPermissionsForRole(selectedRole.id);
    }
  }, [selectedRole, roles]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, modulesData] = await Promise.all([
        roleService.getAll(),
        accessObjectService.getAll(true) // Get hierarchical structure
      ]);

      setRoles(rolesData);
      
      // Filter to get only parent modules (no parentKey)
      const parentModules = modulesData.filter(obj => !obj.parentKey);
      setModules(parentModules);

      // Select first role by default
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissionsForRole = async (roleId) => {
    try {
      const permissionsData = await permissionService.getByRole(roleId);
      
      // Build permissions map: { moduleKey: access }
      const permissionsMap = {};
      permissionsData.forEach(perm => {
        permissionsMap[perm.moduleKey] = perm.access || 'NONE';
      });
      setPermissions(permissionsMap);
      
      // Update selected features count
      updateSelectedFeatures(permissionsMap);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      showError('Failed to load permissions');
    }
  };

  const updateSelectedFeatures = (perms) => {
    const selected = new Set();
    Object.entries(perms).forEach(([key, access]) => {
      if (access === 'READ' || access === 'FULL') {
        selected.add(key);
      }
    });
    setSelectedFeatures(selected);
  };

  const toggleModuleExpand = (moduleKey) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
  };

  const handlePermissionChange = async (moduleKey, accessType) => {
    if (!selectedRole) return;

    const currentAccess = permissions[moduleKey] || 'NONE';
    let newAccess = 'NONE';

    if (accessType === 'full') {
      newAccess = 'FULL';
    } else if (accessType === 'read') {
      newAccess = 'READ';
    }

    // Update local state immediately
    const newPermissions = { ...permissions };
    newPermissions[moduleKey] = newAccess;
    setPermissions(newPermissions);
    updateSelectedFeatures(newPermissions);

    // Update backend
    try {
      await permissionService.bulkUpdate([{
        roleId: selectedRole.id,
        moduleKey: moduleKey,
        access: newAccess
      }]);
      success('Permission updated successfully');
    } catch (error) {
      console.error('Failed to update permission:', error);
      showError('Failed to update permission');
      
      // Revert on error
      newPermissions[moduleKey] = currentAccess;
      setPermissions(newPermissions);
      updateSelectedFeatures(newPermissions);
    }
  };

  const handleSelectAll = async (module, checked) => {
    if (!selectedRole) return;

    // Get all features in this module (including children)
    const allFeatures = getAllFeaturesInModule(module);
    
    const updates = [];
    const newPermissions = { ...permissions };

    allFeatures.forEach(feature => {
      const newAccess = checked ? 'READ' : 'NONE';
      newPermissions[feature.key] = newAccess;
      updates.push({
        roleId: selectedRole.id,
        moduleKey: feature.key,
        access: newAccess
      });
    });

    setPermissions(newPermissions);
    updateSelectedFeatures(newPermissions);

    try {
      await permissionService.bulkUpdate(updates);
      success(checked ? 'All features selected' : 'All features cleared');
    } catch (error) {
      console.error('Failed to update permissions:', error);
      showError('Failed to update permissions');
      loadPermissionsForRole(selectedRole.id);
    }
  };

  const getAllFeaturesInModule = (module) => {
    const features = [];
    if (module.children && module.children.length > 0) {
      module.children.forEach(child => {
        features.push(child);
      });
    }
    return features;
  };

  const handleClear = async () => {
    if (!selectedRole) return;

    const allModuleKeys = [];
    modules.forEach(module => {
      if (module.children) {
        module.children.forEach(child => {
          allModuleKeys.push(child.key);
        });
      }
    });

    const updates = allModuleKeys.map(key => ({
      roleId: selectedRole.id,
      moduleKey: key,
      access: 'NONE'
    }));

    const newPermissions = { ...permissions };
    allModuleKeys.forEach(key => {
      newPermissions[key] = 'NONE';
    });

    setPermissions(newPermissions);
    setSelectedFeatures(new Set());

    try {
      await permissionService.bulkUpdate(updates);
      success('All permissions cleared');
    } catch (error) {
      console.error('Failed to clear permissions:', error);
      showError('Failed to clear permissions');
      loadPermissionsForRole(selectedRole.id);
    }
  };

  const handleAddRole = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = async (roleData) => {
    try {
      setAddingRole(true);
      await roleService.create(roleData);
      await loadData();
      setIsModalOpen(false);
      success('Role added successfully');
    } catch (error) {
      console.error('Failed to add role:', error);
      showError(error.response?.data?.error || 'Failed to add role');
    } finally {
      setAddingRole(false);
    }
  };

  const getFeatureCount = (module) => {
    return module.children ? module.children.length : 0;
  };

  const isModuleAllSelected = (module) => {
    if (!module.children || module.children.length === 0) return false;
    return module.children.every(child => {
      const access = permissions[child.key] || 'NONE';
      return access === 'READ' || access === 'FULL';
    });
  };

  if (loading) {
    return (
      <div className="manage-roles-container">
        <div className="text-center py-8 text-gray-600">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="manage-roles-container">
      {/* Header */}
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      {/* Tabs */}
      <div className="user-management-tabs">
        <button
          className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Manage Roles
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('users');
            navigate('/user-management/manage-users');
          }}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'roles' && (
        <div className="manage-roles-content">
          {/* Left Column - Role List */}
          <div className="roles-list-column">
            <div className="roles-list">
              {roles.map(role => (
                <div
                  key={role.id}
                  className={`role-item ${selectedRole?.id === role.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Module Management */}
          <div className="modules-column">
            <div className="modules-header">
              <h2>
                Manage Role ({modules.length} Modules)
              </h2>
              <button 
                className="new-role-button"
                onClick={handleAddRole}
              >
                + New Role
              </button>
            </div>

            {selectedRole && (
              <>
                <div className="modules-list">
                  {modules.map(module => {
                    const isExpanded = expandedModules.has(module.key);
                    const featureCount = getFeatureCount(module);
                    const allSelected = isModuleAllSelected(module);

                    return (
                      <div key={module.key} className="module-section">
                        <div 
                          className="module-header"
                          onClick={() => toggleModuleExpand(module.key)}
                        >
                          <div className="module-title">
                            <span className="module-name">{module.name}</span>
                            {featureCount > 0 && (
                              <span className="module-badge">{featureCount}</span>
                            )}
                          </div>
                          <svg
                            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 6L8 10L12 6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        {isExpanded && module.children && module.children.length > 0 && (
                          <div className="module-features">
                            {module.children.map(feature => {
                              const access = permissions[feature.key] || 'NONE';
                              const isViewOnly = access === 'READ';
                              const isFullAccess = access === 'FULL';

                              return (
                                <div key={feature.key} className="feature-row">
                                  <span className="feature-name">{feature.name}</span>
                                  <div className="permission-radio-group">
                                    <label className="radio-label">
                                      <input
                                        type="radio"
                                        name={`permission-${feature.key}`}
                                        checked={isViewOnly && !isFullAccess}
                                        onChange={() => handlePermissionChange(feature.key, 'read')}
                                      />
                                      <span>View Only</span>
                                    </label>
                                    <label className="radio-label">
                                      <input
                                        type="radio"
                                        name={`permission-${feature.key}`}
                                        checked={isFullAccess}
                                        onChange={() => handlePermissionChange(feature.key, 'full')}
                                      />
                                      <span>Full Access</span>
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="module-actions">
                              <label className="select-all-checkbox">
                                <input
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={(e) => handleSelectAll(module, e.target.checked)}
                                />
                                <span>Select All</span>
                              </label>
                              <span className="features-count">
                                {Array.from(selectedFeatures).filter(key => {
                                  return module.children?.some(child => child.key === key);
                                }).length} features selected
                              </span>
                              <button 
                                className="clear-link" 
                                onClick={() => {
                                  if (module.children) {
                                    const updates = module.children.map(child => ({
                                      roleId: selectedRole.id,
                                      moduleKey: child.key,
                                      access: 'NONE'
                                    }));
                                    const newPermissions = { ...permissions };
                                    module.children.forEach(child => {
                                      newPermissions[child.key] = 'NONE';
                                    });
                                    setPermissions(newPermissions);
                                    updateSelectedFeatures(newPermissions);
                                    permissionService.bulkUpdate(updates).then(() => {
                                      success('Module permissions cleared');
                                    }).catch(() => {
                                      showError('Failed to clear permissions');
                                      loadPermissionsForRole(selectedRole.id);
                                    });
                                  }
                                }}
                              >
                                x Clear
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {!selectedRole && (
              <div className="no-role-selected">
                <p>Please select a role to manage permissions</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AddRoleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        loading={addingRole}
      />
    </div>
  );
};

export default ManageRoles;

