import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleSwitcher = () => {
  const { user, selectedRole, setSelectedRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
    return null;
  }

  const handleRoleChange = async (roleCode) => {
    await setSelectedRole(roleCode);
    setIsOpen(false);
  };

  const currentRole = rcGdRoles.find(r => r.code === (selectedRole || rcGdRoles[0].code)) || rcGdRoles[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[120px] justify-between"
      >
        <span>{currentRole.name}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px] overflow-hidden animate-[slideDownDropdown_0.2s_ease-out]">
          {rcGdRoles.map(role => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleChange(role.code)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                role.code === (selectedRole || rcGdRoles[0].code)
                  ? 'bg-red-50 text-danger font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDownDropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RoleSwitcher;

