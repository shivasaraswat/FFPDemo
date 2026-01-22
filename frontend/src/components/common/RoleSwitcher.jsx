import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './RoleSwitcher.css';

const RoleSwitcher = () => {
  const { user, selectedRole, setSelectedRole } = useAuth();

  if (!user || !user.roles) {
    return null;
  }

  // Get RC/GD roles only
  const rcGdRoles = user.roles.filter(r => r.code === 'RC' || r.code === 'GD');

  // Only show if user has RC or GD roles
  if (rcGdRoles.length === 0) {
    return null;
  }

  // If only one role, don't show dropdown
  if (rcGdRoles.length === 1) {
    return (
      <div className="role-switcher">
        <span className="role-label">Role:</span>
        <span className="role-value">{rcGdRoles[0].name}</span>
      </div>
    );
  }

  const handleRoleChange = async (e) => {
    const newRoleCode = e.target.value;
    await setSelectedRole(newRoleCode);
  };

  return (
    <div className="role-switcher">
      <label htmlFor="role-select" className="role-label">Role:</label>
      <select
        id="role-select"
        value={selectedRole || rcGdRoles[0].code}
        onChange={handleRoleChange}
        className="role-select"
      >
        {rcGdRoles.map(role => (
          <option key={role.id} value={role.code}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;

