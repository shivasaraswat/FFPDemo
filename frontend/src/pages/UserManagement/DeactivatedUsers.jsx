import React, { useState, useEffect, useRef } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import UserTable from '../../components/UserManagement/UserTable';
import UserForm from '../../components/UserManagement/UserForm';
import '../Common.css';

const DeactivatedUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchInput, setSearchInput] = useState(''); // Separate state for input
  const [filters, setFilters] = useState({
    roleId: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const searchTimeoutRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout to update filters after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);

    // Cleanup on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

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
    setSearchInput('');
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
    <div className="">
      <style>{`
        .user-table-container::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .user-table-container {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
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
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
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
              className="h-18 px-4 border-common text-sm font-medium flex items-center justify-center gap-2"
              onClick={handleClear}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear
            </button>
          </div>
        </div>
  
        {/* Table */}
        <div 
          className="border border-gray-200 rounded-lg overflow-hidden user-table-container" 
          style={{ 
            height: 'calc(100vh - 370px)', 
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
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
              Showing {Math.min(endIndex, totalRecords)} results out of {totalRecords}
            </span>
          )}
          {totalRecords === 0 && <div></div>}
          {totalRecords > 0 && (
            <div className="flex gap-2 items-center">
              <button className="w-8 h-8 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 flex items-center justify-center" style={{ border: '0.8px solid #D1D5DC' }}>
                {currentPage}
              </button>
              <span className="text-sm text-gray-700">of {totalPages}</span>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  className="w-8 h-8 bg-white border-r border-gray-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-sm font-medium flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  ‹
                </button>
                <button
                  className="w-8 h-8 bg-gray-100 cursor-pointer text-sm rounded-none font-medium flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
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
