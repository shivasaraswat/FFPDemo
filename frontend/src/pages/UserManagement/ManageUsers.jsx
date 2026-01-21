import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import UserTable from '../../components/UserManagement/UserTable';
import UserForm from '../../components/UserManagement/UserForm';
import './UserManagement.css';
import './ManageUsers.css';

const ManageUsers = () => {
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
      setMessage({ type: 'error', text: 'Failed to load users data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
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

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      await userService.deactivate(id);
      setMessage({ type: 'success', text: 'User deactivated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to deactivate user' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, userData);
        setMessage({ type: 'success', text: 'User updated successfully' });
      } else {
        await userService.create(userData);
        setMessage({ type: 'success', text: 'User created successfully' });
      }
      setShowForm(false);
      setEditingUser(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Failed to save user' 
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
      <div className="page-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="breadcrumb">User Management / Manage Users</p>
        </div>
        <button 
          className="add-button-header" 
          onClick={handleAdd}
          type="button"
        >
          ➕ Add New User
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="page-content">
        <div className="users-header">
          <div className="filters-section">
            <select
              value={filters.roleId}
              onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
              className="filter-select"
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
              className="search-input"
            />
          </div>
        </div>

        <UserTable
          users={users}
          roles={roles}
          onEdit={handleEdit}
          onActivate={() => {}}
          onDeactivate={handleDeactivate}
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

export default ManageUsers;
