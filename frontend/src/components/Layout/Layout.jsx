import React from 'react';
import Sidebar from './Sidebar';
import RoleSwitcher from '../common/RoleSwitcher';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user } = useAuth();

  // Get user's primary role name (first role or RC/GD if available)
  const getUserRoleDisplay = () => {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'No Role';
    }
    
    // Prefer RC/GD roles if available
    const rcGdRole = user.roles.find(r => r.code === 'RC' || r.code === 'GD');
    if (rcGdRole) {
      return rcGdRole.name;
    }
    
    // Otherwise return first role
    return user.roles[0].name;
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{getUserRoleDisplay()}</span>
          </div>
          <div className="header-controls">
            <RoleSwitcher />
            <LanguageSwitcher />
          </div>
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


