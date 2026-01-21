import React from 'react';
import './UserTable.css';

const UserTable = ({ users, roles, onEdit, onActivate, onDeactivate, onDelete }) => {
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="no-data-message">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Language</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={!user.isActive ? 'inactive-row' : ''}>
              <td className="name-cell">{user.name}</td>
              <td className="email-cell">{user.email}</td>
              <td>{getRoleName(user.roleId)}</td>
              <td className="language-cell">{user.language?.toUpperCase() || 'EN'}</td>
              <td>{getStatusBadge(user.isActive)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(user)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  {user.isActive ? (
                    <button
                      className="deactivate-button"
                      onClick={() => onDeactivate(user.id)}
                      title="Deactivate"
                    >
                      🚫
                    </button>
                  ) : (
                    <button
                      className="activate-button"
                      onClick={() => onActivate(user.id)}
                      title="Activate"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => onDelete(user.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
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


