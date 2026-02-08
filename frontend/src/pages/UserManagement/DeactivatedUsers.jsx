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
  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    roleId: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    loadData();
    setCurrentPage(1); // Reset to first page when filters change
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

  const handleEdit = async (user) => {
    try {
      // Fetch full user data with roles
      const fullUserData = await userService.getById(user.id);
      setEditingUser(fullUserData);
      setShowForm(true);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load user data for editing' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
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
    // Reset form key when canceling to ensure clean state next time
    setFormKey(0);
  };

  const handleClear = () => {
    setFilters({ roleId: '', search: '' });
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
        <div className="text-center py-8 text-gray-600">Loading deactivated users...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6fa] min-h-screen p-6">
      <div className="bg-white rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Deactivated Users
            <span className="text-gray-400 ml-1.5 font-normal">({totalRecords} Records)</span>
          </h2>
        </div>
  
        {/* Controls */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search by name or email"
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})}
                className="w-60 h-18 px-4 pl-10 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 transition-all duration-200 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10 placeholder:text-gray-400"
              />
            </div>
            
            {/* Role Dropdown */}
            <select
              className="w-60 h-18 px-4 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 appearance-none bg-[url('data:image/svg+xml,%3Csvg_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'_fill=\'none\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath_d=\'M1_1L6_6L11_1\'_stroke=\'%236b7280\'_stroke-width=\'1.5\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
              value={filters.roleId}
              onChange={e => setFilters({...filters, roleId: e.target.value})}
            >
              <option value="" className="text-gray-400">All Roles</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            
            {/* Clear Button */}
            <button 
              className="w-40 h-18 px-4 border border-[#ff3b3b] text-[#ff3b3b] bg-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#fff3f3]"
              onClick={handleClear}
            >
              Clear Filters
            </button>
          </div>
        </div>
  
        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <UserTable
            users={displayedUsers}
            roles={roles}
            onEdit={handleEdit}
            onActivate={handleActivate}
            onDeactivate={() => {}}
            onDelete={handleDelete}
          />
        </div>
  
        {/* Footer with Results Count and Pagination */}
        <div className="flex justify-between items-center mt-4">
          {totalRecords > 0 && (
            <span className="text-gray-500 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} results out of {totalRecords}
            </span>
          )}
          {totalRecords === 0 && <div></div>}
          {totalPages > 1 && (
            <div className="flex gap-3 items-center">
              <button
                className="w-8 h-8 border border-gray-300 bg-white rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ‹
              </button>
              <span className="text-sm text-gray-700">{currentPage} of {totalPages}</span>
              <button
                className="w-8 h-8 border border-gray-300 bg-white rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* UserForm Modal */}
        {showForm && (
          <UserForm
            key={formKey}
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
