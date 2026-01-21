import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { accessObjectService } from '../../services/accessObjectService';
import AccessObjectRow from './AccessObjectRow';
import RoleHeader from './RoleHeader';
import './RoleManagementTable.css';

const RoleManagementTable = () => {
  const [roles, setRoles] = useState([]);
  const [accessObjects, setAccessObjects] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedObjects, setExpandedObjects] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, accessObjectsData, permissionsData] = await Promise.all([
        roleService.getAll(),
        accessObjectService.getAll(true), // Get hierarchical structure
        permissionService.getMatrix()
      ]);

      setRoles(rolesData);
      
      // Backend returns hierarchical structure with parentKey
      // Filter to ensure only root modules (no parentKey) are shown initially
      const onlyParents = accessObjectsData.filter(obj => !obj.parentKey);
      setAccessObjects(onlyParents);

      // Build permissions map: { `${roleId}-${moduleKey}`: access }
      // Backend returns: { roleId, moduleKey, access: "FULL"|"READ"|"NONE" }
      const permissionsMap = {};
      permissionsData.forEach(perm => {
        const key = `${perm.roleId}-${perm.moduleKey}`;
        permissionsMap[key] = perm.access || 'NONE';
      });
      setPermissions(permissionsMap);
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (moduleKey) => {
    setExpandedObjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
  };

  const handlePermissionChange = async (roleId, moduleKey, type, checked) => {
    const key = `${roleId}-${moduleKey}`;
    
    // Get current permission state before updating
    const currentAccess = permissions[key] || 'NONE';
    
    // Calculate new access value based on checkbox state
    let newAccess = 'NONE';
    
    if (type === 'full_access') {
      newAccess = checked ? 'FULL' : 'NONE';
    } else if (type === 'read_only') {
      newAccess = checked ? 'READ' : 'NONE';
    }
    
    // Update local state immediately for UI responsiveness
    setPermissions(prev => {
      const newPerms = { ...prev };
      newPerms[key] = newAccess;
      return newPerms;
    });
    
    // Call API immediately when checkbox changes
    try {
      // Prepare permission data for backend
      const permissionData = {
        roleId: roleId,
        moduleKey: moduleKey,
        access: newAccess
      };
      
      // Call API to update permission
      await permissionService.bulkUpdate([permissionData]);
      
      // Show success message briefly
      setMessage({ type: 'success', text: 'Permission updated' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('Failed to update permission:', error);
      setMessage({ type: 'error', text: 'Failed to update permission' });
      
      // Revert the change on error
      setPermissions(prev => {
        const newPerms = { ...prev };
        newPerms[key] = currentAccess; // Revert to original
        return newPerms;
      });
    }
  };

  // Save button is no longer needed since API calls happen on checkbox change
  // But keeping it for bulk operations if needed in future
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Reload data to sync with server
      await loadData();
      setMessage({ type: 'success', text: 'Data refreshed' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setMessage({ type: 'error', text: 'Failed to refresh data' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = async () => {
    const roleName = prompt('Enter role name:');
    if (!roleName) return;

    const roleCode = prompt('Enter role code (e.g., ROLE_CODE):');
    if (!roleCode) return;

    try {
      await roleService.create({ 
        name: roleName,
        code: roleCode.toUpperCase().replace(/\s+/g, '_'),
        description: ''
      });
      await loadData();
      setMessage({ type: 'success', text: 'Role added successfully' });
    } catch (error) {
      console.error('Failed to add role:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add role' });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="role-management-container">
      <div className="role-management-header">
        <div className="breadcrumb">Home / Role Management</div>
        <h1>Role Management</h1>
        <div className="header-actions">
          <button className="add-role-button" onClick={handleAddRole}>
            + Add Role
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="table-wrapper">
        <table className="role-management-table">
          <thead>
            <tr>
              <th className="access-object-header">Access Objects</th>
              {roles.map(role => (
                <RoleHeader key={role.id} role={role} />
              ))}
            </tr>
          </thead>
          <tbody>
            {accessObjects.map(accessObject => (
              <AccessObjectRow
                key={accessObject.key}
                accessObject={accessObject}
                roles={roles}
                permissions={permissions}
                expandedObjects={expandedObjects}
                onToggleExpand={toggleExpand}
                onPermissionChange={handlePermissionChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-actions">
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default RoleManagementTable;

