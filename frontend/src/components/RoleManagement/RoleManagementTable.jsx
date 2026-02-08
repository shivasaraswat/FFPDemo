import React, { useState, useEffect } from 'react';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { accessObjectService } from '../../services/accessObjectService';
import AccessObjectRow from './AccessObjectRow';
import RoleHeader from './RoleHeader';
import AddRoleModal from './AddRoleModal';

const RoleManagementTable = () => {
  const [roles, setRoles] = useState([]);
  const [accessObjects, setAccessObjects] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedObjects, setExpandedObjects] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingRole, setAddingRole] = useState(false);

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

  const handleAddRole = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = async (roleData) => {
    try {
      setAddingRole(true);
      setMessage({ type: '', text: '' });
      
      await roleService.create(roleData);
      await loadData();
      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Role added successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to add role:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add role' });
    } finally {
      setAddingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 px-8 text-lg text-text-secondary font-medium">
        <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4 mr-2"></div>
        Loading...
      </div>
    );
  }

  return (
    <div className="p-0 max-w-full overflow-x-auto">
      <div className="mb-8 px-2">
        <div className="text-text-secondary text-sm mb-3 flex items-center gap-2 before:content-['›'] before:text-gray-400 before:mr-1">Home / Role Management</div>
        <div className="flex justify-between items-center">
          <h1 className="text-text-primary mb-4 text-3xl font-semibold tracking-tight">Role Management</h1>
          <div className="flex justify-end gap-4">
            <button className="bg-danger text-white border-none px-6 py-3 rounded-lg cursor-pointer text-sm font-semibold transition-all duration-300 shadow-sm tracking-wide hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0" onClick={handleAddRole}>
              + Add Role
            </button>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 px-5 rounded-xl mb-6 font-medium animate-[slideDown_0.3s_ease-out] ${message.type === 'error' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'}`}>
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto border border-border rounded-lg bg-white shadow-sm">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-bg-secondary sticky top-0 z-10">
            <tr>
              <th className="px-4 py-4 text-left font-semibold text-gray-700 border-r border-border border-b border-border min-w-[250px]">Access Objects</th>
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

      <AddRoleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        loading={addingRole}
      />
    </div>
  );
};

export default RoleManagementTable;

