import React, { useState, useRef, useEffect } from 'react';
import './UserTable.css';

const UserTable = ({ users, roles, onEdit, onActivate, onDeactivate, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`status-badge ${isActive ? 'status-active' : 'status-deactivated'}`}>
        {isActive ? 'Active' : 'Deactivated'}
      </span>
    );
  };

  const toggleMenu = (userId) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleMenuAction = (action, user) => {
    setOpenMenuId(null);
    if (action === 'edit') {
      onEdit(user);
    } else if (action === 'deactivate') {
      onDeactivate(user.id);
    } else if (action === 'activate') {
      onActivate(user.id);
    } else if (action === 'delete') {
      onDelete(user.id);
    }
  };

  if (users.length === 0) {
    return (
      <div className="users-table-empty">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="users-table-wrapper">
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Language</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={!user.isActive ? 'user-inactive' : ''}>
              <td className="user-name">{user.name}</td>
              <td className="user-email">{user.email}</td>
              <td className="user-role">{getRoleName(user.roleId)}</td>
              <td className="user-language">{user.language?.toUpperCase() || 'EN'}</td>
              <td className="user-status">{getStatusBadge(user.isActive)}</td>
              <td className="user-action">
                <div className="action-menu-container" ref={el => menuRefs.current[user.id] = el}>
                  <button
                    className="action-menu-button"
                    onClick={() => toggleMenu(user.id)}
                    aria-label="Actions"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="4" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                      <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                    </svg>
                  </button>
                  {openMenuId === user.id && (
                    <div className="action-menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => handleMenuAction('edit', user)}
                      >
                        Edit
                      </button>
                      {user.isActive ? (
                        <button
                          className="menu-item"
                          onClick={() => handleMenuAction('deactivate', user)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="menu-item"
                          onClick={() => handleMenuAction('activate', user)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        className="menu-item menu-item-danger"
                        onClick={() => handleMenuAction('delete', user)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
