import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import UserTable from '../../components/UserManagement/UserTable';
import UserForm from '../../components/UserManagement/UserForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useSnackbar } from '../../context/SnackbarContext';
import '../Common.css';
import './ManageUsers.css';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [searchInput, setSearchInput] = useState(''); // Separate state for input
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'deactivated'
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
      const filterParams = {
        ...(filters.search && { search: filters.search })
      };
      
      // Add status filter if not 'all'
      if (filters.status === 'active') {
        filterParams.isActive = true;
      } else if (filters.status === 'deactivated') {
        filterParams.isActive = false;
      }
      // If 'all', don't add isActive filter to get all users
      
      const [usersData, rolesData] = await Promise.all([
        userService.getAll(filterParams),
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

  const handleActivate = async (id) => {
    try {
      await userService.activate(id);
      success('User activated successfully');
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to activate user');
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
    setFilters({ status: 'all', search: '' });
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
      <div className="manage-users-container">
        <div className="text-center py-8 text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      {/* Header */}
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      {/* Tabs */}
      <div className="user-management-tabs">
        <button
          className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('roles');
            navigate('/user-management/manage-roles');
          }}
        >
          Manage Roles
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="manage-users-content">
          {/* Header Section */}
          <div className="users-header-section">
            <h2 className="users-subheading">
              Manage Users ({totalRecords} Users)
            </h2>
            <button 
              className="new-user-button"
              onClick={handleAdd}
            >
              + New User
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="users-controls">
            <div className="search-container">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M15 15L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by user name"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* Status Dropdown */}
            <select
              className="status-select"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
            
            {/* Clear Button */}
            <button 
              className="clear-button"
              onClick={handleClear}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear
            </button>
          </div>
  
          {/* Table */}
          <div className="users-table-container">
            <UserTable
              users={displayedUsers}
              roles={roles}
              onEdit={handleEdit}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onDelete={handleDelete}
            />
          </div>
    
          {/* Footer with Results Count and Pagination */}
          <div className="users-footer">
            {totalRecords > 0 && (
              <span className="results-count">
                Showing {Math.min(endIndex, totalRecords)} results out of {totalRecords}
              </span>
            )}
            {totalRecords === 0 && <div></div>}
            {totalRecords > 0 && (
              <div className="pagination-controls">
                <button className="page-number" style={{ border: '0.8px solid #D1D5DC' }}>
                  {currentPage}
                </button>
                <span className="page-of">of {totalPages}</span>
                <div className="pagination-buttons">
                  <button
                    className="page-nav prev"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    ‹
                  </button>
                  <button
                    className="page-nav next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
  );
};

export default ManageUsers;
