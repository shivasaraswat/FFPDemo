import React, { useState, useEffect, useRef } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import UserTable from '../../components/UserManagement/UserTable';
import UserForm from '../../components/UserManagement/UserForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useSnackbar } from '../../context/SnackbarContext';
import '../Common.css';

const ManageUsers = () => {
  const { success, error: showError } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [searchInput, setSearchInput] = useState(''); // Separate state for input
  const [filters, setFilters] = useState({
    roleId: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const searchTimeoutRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, userId: null });

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
          isActive: true, // Only show active users by default
          ...(filters.roleId && { roleId: parseInt(filters.roleId) }),
          ...(filters.search && { search: filters.search })
        }),
        roleService.getAll()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showError('Failed to load users data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    // Close form first to ensure clean state
    setShowForm(false);
    // Explicitly set to null (not undefined)
    setEditingUser(null);
    // Increment form key to force remount with fresh state
    setFormKey(prev => prev + 1);
    // Use setTimeout to ensure state is reset before showing form
    setTimeout(() => {
      setShowForm(true);
    }, 10);
  };

  const handleEdit = async (user) => {
    try {
      // Fetch full user data with roles
      const fullUserData = await userService.getById(user.id);
      setEditingUser(fullUserData);
      setShowForm(true);
    } catch (error) {
      console.error('Failed to load user data:', error);
      showError('Failed to load user data for editing');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, type: 'delete', userId: id });
  };

  const confirmDelete = async () => {
    const userId = confirmModal.userId;
    setConfirmModal({ isOpen: false, type: null, userId: null });
    
    try {
      await userService.delete(userId);
      success('User deleted successfully');
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeactivate = (id) => {
    setConfirmModal({ isOpen: true, type: 'deactivate', userId: id });
  };

  const confirmDeactivate = async () => {
    const userId = confirmModal.userId;
    setConfirmModal({ isOpen: false, type: null, userId: null });
    
    try {
      await userService.deactivate(userId);
      success('User deactivated successfully');
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to deactivate user');
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, userData);
        success('User updated successfully');
      } else {
        await userService.create(userData);
        success('User created successfully');
      }
      setShowForm(false);
      setEditingUser(null);
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Failed to save user');
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
        <div className="text-center py-8 text-gray-600">Loading users...</div>
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
            Manage Users
            <span className="text-gray-400 ml-1.5 font-normal">({totalRecords} Records)</span>
          </h2>
          <button 
            className="flex items-center gap-1.5 px-4 py-2
             border border-[var(--Strokes-Primary,#D80C0C)]
             rounded-lg bg-white
             text-[var(--Strokes-Primary,#D80C0C)]
             shadow-[0px_1px_2px_0px_#0000000D] border-common hover:bg-[#fff3f3]"
            onClick={handleAdd}
          >
            <span>+</span>
            Create New User
          </button>
        </div>
  
        {/* Controls */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex items-center">
              {/* <svg className="absolute left-3 text-gray-400 pointer-events-none z-10" width="18" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M15 15L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg> */}
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
              className="h-18 px-4 border border-[#ff3b3b] text-[#ff3b3b] bg-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#fff3f3] border-common"
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
            onDeactivate={handleDeactivate}
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
            user={editingUser}
            roles={roles}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, type: null, userId: null })}
          onConfirm={confirmModal.type === 'delete' ? confirmDelete : confirmDeactivate}
          title={confirmModal.type === 'delete' ? 'Delete User' : 'Deactivate User'}
          message={confirmModal.type === 'delete' 
            ? 'Are you sure you want to delete this user? This action cannot be undone.'
            : 'Are you sure you want to deactivate this user?'
          }
          confirmText={confirmModal.type === 'delete' ? 'Delete' : 'Deactivate'}
          cancelText="Cancel"
          type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
        />
      </div>
    </div>
  );
  
};

export default ManageUsers;
