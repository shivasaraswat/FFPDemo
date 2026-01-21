import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Common.css';
import './UserManagement.css';

const UserManagement = () => {
  const { hasPermission } = useAuth();

  const menuItems = [
    {
      name: 'Manage Users',
      path: '/user-management/manage-users',
      moduleKey: 'MANAGE_USERS',
      description: 'View and manage all system users'
    },
    {
      name: 'Manage Roles',
      path: '/user-management/manage-roles',
      moduleKey: 'MANAGE_ROLES',
      description: 'Configure role permissions and access control'
    },
    {
      name: 'Deactivated Users',
      path: '/user-management/deactivated-users',
      moduleKey: 'DEACTIVATED_USERS',
      description: 'View and manage deactivated user accounts'
    },
    {
      name: 'API Registry',
      path: '/user-management/api-registry',
      moduleKey: 'MANAGE_ROLES',
      description: 'Map API endpoints to modules and manage RBAC registrations'
    }
  ];

  // Filter items based on permissions
  const accessibleItems = menuItems.filter(item => {
    if (item.moduleKey) {
      return hasPermission(item.moduleKey, 'read_only');
    }
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
        <p className="breadcrumb">User Management</p>
      </div>
      <div className="page-content">
        <div className="user-management-grid">
          {accessibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="management-card"
            >
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <span className="card-arrow">→</span>
            </Link>
          ))}
        </div>
        {accessibleItems.length === 0 && (
          <div className="no-access-message">
            <p>You don't have access to any user management features.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

