import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'CREATOR';
    }
    
    // Prefer RC/GD roles if available
    const rcGdRole = user.roles.find(r => r.code === 'RC' || r.code === 'GD');
    if (rcGdRole) {
      return rcGdRole.name.toUpperCase();
    }
    
    // Otherwise return first role
    return user.roles[0].name.toUpperCase();
  };

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

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[0.95rem] text-text-primary tracking-wide leading-tight">{user?.name || 'User'}</span>
            <span className="text-xs text-text-secondary font-medium leading-tight">{getUserRoleDisplay()}</span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-danger text-white rounded-full font-semibold text-sm tracking-wide">
            {getInitials(user?.name || 'User')}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white rounded-lg shadow-lg min-w-[280px] z-[1000] animate-[slideDownDropdown_0.2s_ease-out]">
          <div className="px-5 py-4">
            <div className="font-semibold text-[0.95rem] text-text-primary mb-1">{user?.name || 'User'}</div>
            <div className="text-sm text-text-secondary">{user?.email || 'user@example.com'}</div>
          </div>
          
          <div className="h-px bg-border my-2"></div>
          
          <div className="py-2">
            <div className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-200 text-gray-700 hover:bg-bg-secondary" onClick={handleProfileClick}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary flex-shrink-0">
                <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 18C3 14 6 11 10 11C14 11 17 14 17 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-sm font-medium">Profile</span>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-200 text-gray-700 hover:bg-bg-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary flex-shrink-0">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-200 text-gray-700 hover:bg-bg-secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary flex-shrink-0">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium">Help & Support</span>
            </div>
            
            <div className="h-px bg-border my-2"></div>
            
            <div className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-200 text-danger hover:bg-red-100" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-danger flex-shrink-0">
                <path d="M7 17L3 13M3 13L7 9M3 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium">Log out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

