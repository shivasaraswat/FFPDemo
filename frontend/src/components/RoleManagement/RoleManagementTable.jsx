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
      <div className="">
        <div className="bg-white rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="text-center py-8 text-gray-600">Loading roles...</div>
        </div>
      </div>
    );
  }

  const totalRecords = accessObjects.length;

  return (
    <div className="">
      <style>{`
        .user-table-container::-webkit-scrollbar,
        .user-table-container .overflow-x-auto::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .user-table-container,
        .user-table-container .overflow-x-auto {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      <div className="bg-white rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Role Management
            <span className="text-gray-400 ml-1.5 font-normal">({totalRecords} Access Objects)</span>
          </h2>
          <button 
            className="flex items-center gap-1.5 px-4 py-2 border-common text-sm font-medium"
            onClick={handleAddRole}
          >
            <span>+</span>
            Add Role
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`}>
            {message.text}
          </div>
        )}

        {/* Table */}
        <div 
          className="border border-gray-200 rounded-lg overflow-hidden user-table-container" 
          style={{ 
            height: 'calc(100vh - 250px)', 
            overflowY: 'auto',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <table className="w-full border-collapse min-w-[800px] bg-white">
              <thead className="bg-bg-secondary border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">Access Objects</th>
                  {roles.map(role => (
                    <RoleHeader key={role.id} role={role} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {accessObjects.length === 0 ? (
                  <tr>
                    <td colSpan={roles.length + 1} className="px-4 py-12 text-center text-gray-500">
                      No access objects found.
                    </td>
                  </tr>
                ) : (
                  accessObjects.map(accessObject => (
                    <AccessObjectRow
                      key={accessObject.key}
                      accessObject={accessObject}
                      roles={roles}
                      permissions={permissions}
                      expandedObjects={expandedObjects}
                      onToggleExpand={toggleExpand}
                      onPermissionChange={handlePermissionChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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

