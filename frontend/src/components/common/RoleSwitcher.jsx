import React from 'react';
import { useAuth } from '../../context/AuthContext';

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
      <div className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-[10px] rounded-xl mr-4 border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <span className="font-semibold text-text-secondary text-sm tracking-wide whitespace-nowrap">Role:</span>
        <span className="font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent text-sm">{rcGdRoles[0].name}</span>
      </div>
    );
  }

  const handleRoleChange = async (e) => {
    const newRoleCode = e.target.value;
    await setSelectedRole(newRoleCode);
  };

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-[10px] rounded-xl mr-4 border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <label htmlFor="role-select" className="font-semibold text-text-secondary text-sm tracking-wide whitespace-nowrap">Role:</label>
      <select
        id="role-select"
        value={selectedRole || rcGdRoles[0].code}
        onChange={handleRoleChange}
        className="px-4 py-2 border-2 border-border rounded-lg bg-gradient-to-b from-white to-bg-secondary text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-300 min-w-[120px] hover:border-primary hover:bg-white hover:shadow-[0_2px_8px_rgba(102,126,234,0.15)] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white"
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

