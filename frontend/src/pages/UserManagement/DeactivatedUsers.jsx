import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import UserTable from '../../components/UserManagement/UserTable';
import UserForm from '../../components/UserManagement/UserForm';

const DeactivatedUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    roleId: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getAll({ 
          isActive: false, // Only show deactivated users
          ...(filters.roleId && { roleId: parseInt(filters.roleId) }),
          ...(filters.search && { search: filters.search })
        }),
        roleService.getAll()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: 'Failed to load deactivated users data' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleActivate = async (id) => {
    if (!window.confirm('Are you sure you want to activate this user?')) {
      return;
    }

    try {
      await userService.activate(id);
      setMessage({ type: 'success', text: 'User activated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to activate user' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await userService.delete(id);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete user' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      await userService.update(editingUser.id, userData);
      setMessage({ type: 'success', text: 'User updated successfully' });
      setShowForm(false);
      setEditingUser(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Failed to update user' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
        <div className="text-center py-8 text-gray-600">Loading deactivated users...</div>
      </div>
    );
  }

  return (
    <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
      <div className="mb-8 px-2">
        <div>
          <h1 className="text-text-primary mb-3 text-3xl font-semibold tracking-tight">Deactivated Users</h1>
          <p className="text-text-secondary text-sm m-0 flex items-center gap-2 before:content-['›'] before:text-gray-400 before:mr-1">User Management / Deactivated Users</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
          {message.text}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <div className="flex gap-4 flex-wrap">
            <select
              value={filters.roleId}
              onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 min-w-[150px] appearance-none bg-[url('data:image/svg+xml,%3Csvg_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'_fill=\'none\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath_d=\'M1_1L6_6L11_1\'_stroke=\'%236b7280\'_stroke-width=\'1.5\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
            />
          </div>
        </div>

        <UserTable
          users={users}
          roles={roles}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={() => {}}
          onDelete={handleDelete}
        />

        {showForm && (
          <UserForm
            user={editingUser}
            roles={roles}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default DeactivatedUsers;
