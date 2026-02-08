import React from 'react';
import Sidebar from './Sidebar';
import RoleSwitcher from '../common/RoleSwitcher';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ProfileDropdown from '../common/ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen bg-bg-secondary flex flex-col transition-all duration-300 ease-in-out max-md:ml-0">
        <header className="bg-white px-8 py-4 border-b border-border flex justify-between items-center gap-6 shadow-sm sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10">
              <option>International</option>
            </select> */}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer p-2 text-gray-700 transition-colors duration-200 hover:text-gray-900">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2C8.34 2 7 3.34 7 5V8C7 9.1 6.55 10.1 5.8 10.8L5 11.6V13H15V11.6L14.2 10.8C13.45 10.1 13 9.1 13 8V5C13 3.34 11.66 2 10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M8 13V14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14V13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="absolute top-0 right-0 bg-danger text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[0.7rem] font-semibold border-2 border-white">1</span>
            </div>
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


