import React from 'react';
import Sidebar from './Sidebar';
import RoleSwitcher from '../common/RoleSwitcher';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ProfileDropdown from '../common/ProfileDropdown';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();

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
    <div className="flex">
      <Sidebar />
      <main 
        className="flex-1 bg-bg-secondary flex flex-col transition-all duration-300 ease-in-out max-md:ml-0"
        style={{ marginLeft: isCollapsed ? '80px' : '280px' }}
      >
        <header className="bg-white px-8 py-4 border-b border-border flex justify-between items-center gap-6 shadow-sm sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            {/* Empty space on left */}
          </div>
          <div className="flex items-center gap-6">
            <RoleSwitcher />
            <LanguageSwitcher />
            <NotificationBell />
            <ProfileDropdown user={user} />
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto animate-[fadeIn_0.4s_ease-out] bg-bg-secondary">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


