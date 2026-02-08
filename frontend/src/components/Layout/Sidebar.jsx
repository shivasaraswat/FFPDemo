import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';

const Sidebar = () => {
  const location = useLocation();
  const { logout, hasPermission, permissions, user } = useAuth();
  const { t } = useLanguage();
  const [expandedMenus, setExpandedMenus] = useState({});
  
  // Check if user has ADMIN role
  const isAdmin = user?.roles?.some(role => role.code === 'ADMIN');

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Menu items with access object names for permission checking
  // Note: accessObjectName must match moduleKey from backend (uppercase with underscores)
  const allMenuItems = useMemo(() => [
    {
      name: t('dashboard'),
      path: '/dashboard',
      icon: '📊',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'DASHBOARD',
      children: []
    },
    {
      name: t('masterModel'),
      path: '/master-model',
      icon: '⚙️',
      accessObjectName: 'MASTER_MODEL',
      children: [
        { name: t('configGroup'), path: '/master-model/config-group', accessObjectName: 'CONFIG_GROUP' },
        { name: t('configValues'), path: '/master-model/config-values', accessObjectName: 'CONFIG_VALUES' },
        { name: t('manageMasters'), path: '/master-model/manage-masters', accessObjectName: 'MANAGE_MASTERS' },
        { name: t('apiLogs'), path: '/master-model/api-logs', accessObjectName: 'API_LOGS' },
        { name: t('dataMigration'), path: '/master-model/data-migration', accessObjectName: 'DATA_MIGRATION' },
        { name: t('emailConfigurations'), path: '/master-model/email-configurations', accessObjectName: 'EMAIL_CONFIGURATIONS' }
      ]
    },
    {
      name: t('mapping'),
      path: '/mapping',
      icon: '🗺️',
      accessObjectName: 'MAPPING',
      children: [
        { name: t('countryMapping'), path: '/mapping/country-mapping', accessObjectName: 'COUNTRY_MAPPING' },
        { name: t('generalDistributors'), path: '/mapping/general-distributors', accessObjectName: 'GENERAL_DISTRIBUTORS' }
      ]
    },
    {
      name: t('helpManualUpload'),
      path: '/help-manual-upload',
      icon: '📚',
      accessObjectName: 'HELP_MANUAL_UPLOAD',
      children: []
    },
    {
      name: t('fieldFix'),
      path: '/field-fix',
      icon: '🔧',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2L18 6L10 14L6 10L14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M6 10L2 14L6 18L10 14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'FIELD_FIX',
      children: [
        { name: t('createNewFieldFix'), path: '/field-fix/create', accessObjectName: 'CREATE_NEW_FIELD_FIX' },
        { name: t('savedFieldFix'), path: '/field-fix/saved', accessObjectName: 'SAVED_FIELD_FIX' },
        { name: t('pendingForApproval'), path: '/field-fix/pending', accessObjectName: 'PENDING_FOR_APPROVAL' },
        { name: t('returnedFieldFix'), path: '/field-fix/returned', accessObjectName: 'RETURNED_FIELD_FIX' },
        { name: t('archivedFieldFix'), path: '/field-fix/archived', accessObjectName: 'ARCHIVED_FIELD_FIX' },
        { name: t('releasedFieldFix'), path: '/field-fix/released', accessObjectName: 'RELEASED_FIELD_FIX' },
        { name: t('newFieldFixFromCSHQ'), path: '/field-fix/new-from-cshq', accessObjectName: 'NEW_FIELD_FIX_FROM_CSHQ' },
        { name: t('onHoldFieldFix'), path: '/field-fix/on-hold', accessObjectName: 'ON_HOLD_FIELD_FIX' },
        { name: t('readyToRelease'), path: '/field-fix/ready-to-release', accessObjectName: 'READY_TO_RELEASE' },
        { name: t('releasedFieldFixToGD'), path: '/field-fix/released-to-gd', accessObjectName: 'RELEASED_FIELD_FIX_TO_GD' },
        { name: t('fieldFixLimitedToRC'), path: '/field-fix/limited-to-rc', accessObjectName: 'FIELD_FIX_LIMITED_TO_RC' },
        { name: t('newFieldFixFromQM'), path: '/field-fix/new-from-qm', accessObjectName: 'NEW_FIELD_FIX_FROM_QM' }
      ]
    },
    {
      name: 'Code Generation',
      path: '/code-generation',
      icon: '📝',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H16V16H4V4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accessObjectName: 'CODE_GENERATION',
      children: []
    },
    {
      name: t('fieldFixProgress'),
      path: '/field-fix-progress',
      icon: '📈',
      accessObjectName: 'FIELD_FIX_PROGRESS',
      children: [
        { name: t('fieldFixProgressUpdate'), path: '/field-fix-progress/update', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE' },
        { name: t('fieldFixProgressUpdateRC'), path: '/field-fix-progress/update-rc', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE_RC' },
        { name: t('falconUpdates'), path: '/field-fix-progress/falcon-updates', accessObjectName: 'FALCON_UPDATES' },
        { name: t('onHoldFieldFixProgress'), path: '/field-fix-progress/on-hold', accessObjectName: 'ON_HOLD_FIELD_FIX_PROGRESS' },
        { name: t('archivedFieldFixProgress'), path: '/field-fix-progress/archived', accessObjectName: 'ARCHIVED_FIELD_FIX_PROGRESS' }
      ]
    },
    {
      name: t('userManagement'),
      path: '/user-management',
      icon: '👥',
      accessObjectName: 'USER_MANAGEMENT',
      children: [
        { name: t('manageUsers'), path: '/user-management/manage-users', accessObjectName: 'MANAGE_USERS' },
        { name: t('manageRoles'), path: '/user-management/manage-roles', accessObjectName: 'MANAGE_ROLES' },
        { name: t('deactivatedUsers'), path: '/user-management/deactivated-users', accessObjectName: 'DEACTIVATED_USERS' }
      ]
    },
    {
      name: t('apiRegistry'),
      path: '/api-registry',
      icon: '🔗',
      accessObjectName: 'MANAGE_ROLES',
      children: []
    },
    {
      name: t('reportGallery'),
      path: '/report-gallery',
      icon: '📊',
      accessObjectName: 'REPORTS_GALLERY',
      children: []
    }
  ], [t]);

  // Filter menu items based on permissions
  const menuItems = useMemo(() => {
    return allMenuItems.map(item => {
      // API Registry is only visible to admin users
      if (item.accessObjectName === 'MANAGE_ROLES' && item.name === 'API Registry') {
        if (!isAdmin) {
          return null; // Hide API Registry for non-admin users
        }
        return item;
      }
      
      // Check if user has permission for parent screen
      const hasParentPermission = hasPermission(item.accessObjectName, 'read_only');
      
      // Filter children based on permissions (create new array, don't mutate)
      const filteredChildren = item.children.length > 0 
        ? item.children.filter(child => hasPermission(child.accessObjectName, 'read_only'))
        : [];
      
      // Show parent if:
      // 1. Parent itself has permission, OR
      // 2. At least one child has permission (even if parent doesn't)
      const hasAnyChildPermission = filteredChildren.length > 0;
      const shouldShowParent = hasParentPermission || hasAnyChildPermission;
      
      if (!shouldShowParent) {
        return null; // Will filter out null items
      }
      
      // Return new object with filtered children
      return {
        ...item,
        children: filteredChildren
      };
    }).filter(item => item !== null);
  }, [permissions, hasPermission, isAdmin]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-[280px] h-screen bg-white text-text-primary flex flex-col fixed left-0 top-0 overflow-y-auto shadow-[2px_0_8px_rgba(0,0,0,0.05)] z-[1000] border-r border-border max-md:transform max-md:-translate-x-full max-md:transition-transform max-md:duration-300 max-md:ease-in-out max-md:shadow-[4px_0_20px_rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-bg-secondary [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
      <div className="p-6 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-transparent">
            <img src="/favicon.svg" alt="FUSO Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="m-0 text-xl font-semibold text-text-primary tracking-tight">Field Fix Portal</h2>
        </div>
      </div>
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <div key={item.name} className="mb-2 px-3">
            {item.children.length > 0 ? (
              <>
                <div
                  className={`flex items-center px-5 py-3.5 text-gray-700 no-underline cursor-pointer transition-all duration-200 select-none rounded-lg mx-2 font-medium relative hover:bg-bg-tertiary hover:text-text-primary ${isActive(item.path) ? 'bg-red-100 text-danger font-semibold' : ''}`}
                  onClick={() => toggleMenu(item.name)}
                >
                  <span className={`mr-3.5 text-xl flex items-center justify-center w-5 h-5 ${isActive(item.path) ? 'text-danger' : 'text-inherit'}`}>{item.iconSvg || item.icon}</span>
                  <span className="flex-1 text-[0.95rem] tracking-wide">{item.name}</span>
                  <span className={`flex items-center justify-center ml-auto transition-all duration-300 opacity-60 ${expandedMenus[item.name] ? 'rotate-180 opacity-100' : ''} hover:opacity-100`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {expandedMenus[item.name] && item.children.length > 0 && (
                  <div className="bg-bg-secondary py-2 mt-1 rounded-lg mx-2 animate-[slideDown_0.3s_ease-out]">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block py-2.5 pl-12 pr-6 text-gray-500 no-underline text-sm transition-all duration-300 rounded-lg mx-2 relative hover:bg-bg-tertiary hover:text-text-primary before:content-['•'] before:absolute before:left-7 before:opacity-50 before:transition-all before:duration-300 hover:before:opacity-100 hover:before:text-danger ${isActive(child.path) ? 'bg-red-100 text-danger font-semibold border-l-[3px] border-danger before:opacity-100 before:text-danger' : ''}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-5 py-3.5 text-gray-700 no-underline cursor-pointer transition-all duration-200 select-none rounded-lg mx-2 font-medium relative hover:bg-bg-tertiary hover:text-text-primary ${isActive(item.path) ? 'bg-red-100 text-danger font-semibold' : ''}`}
              >
                <span className={`mr-3.5 text-xl flex items-center justify-center w-5 h-5 ${isActive(item.path) ? 'text-danger' : 'text-inherit'}`}>{item.iconSvg || item.icon}</span>
                <span className="flex-1 text-[0.95rem] tracking-wide">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
      {/* <div className="p-6 border-t border-border bg-white">
        <button onClick={logout} className="w-full px-5 py-3.5 bg-danger text-white border-none rounded-lg cursor-pointer text-[0.95rem] font-semibold transition-all duration-300 tracking-wide hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(220,38,38,0.3)] active:translate-y-0">
          {t('logout')}
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;

