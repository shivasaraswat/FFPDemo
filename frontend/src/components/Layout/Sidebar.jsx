import React, { useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useSidebar } from '../../context/SidebarContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout, hasPermission, permissions, user } = useAuth();
  const { t } = useLanguage();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  // Check if user has ADMIN role
  const isAdmin = user?.roles?.some(role => role.code === 'ADMIN');

  // Menu items - NO CHILDREN in sidebar (sub-screens appear in parent pages)
  const allMenuItems = useMemo(() => [
    {
      name: t('dashboard'),
      path: '/dashboard',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'DASHBOARD'
    },
    {
      name: t('masterModel'),
      path: '/master-model',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M3 8H17M8 3V17" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      accessObjectName: 'MASTER_MODEL'
    },
    {
      name: t('mapping'),
      path: '/mapping',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 6L10 1L19 6V14L10 19L1 14V6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M10 1V19" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      accessObjectName: 'MAPPING'
    },
    {
      name: t('helpManualUpload'),
      path: '/help-manual-upload',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H16V16H4V4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M6 6H14M6 9H14M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accessObjectName: 'HELP_MANUAL_UPLOAD'
    },
    {
      name: t('fieldFix'),
      path: '/field-fix',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2L18 6L10 14L6 10L14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M6 10L2 14L6 18L10 14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'FIELD_FIX'
    },
    {
      name: 'Code Generation',
      path: '/code-generation',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H16V16H4V4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accessObjectName: 'CODE_GENERATION'
    },
    {
      name: t('fieldFixProgress'),
      path: '/field-fix-progress',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10L6 14L18 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 2L18 10L14 14L6 6L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'FIELD_FIX_PROGRESS'
    },
    {
      name: t('userManagement'),
      path: '/user-management',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="13" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M2 18C2 14 4.5 12 7 12C9.5 12 12 14 12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M8 18C8 15 9.5 13 12 13C14.5 13 16 15 16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accessObjectName: 'USER_MANAGEMENT'
    },
    {
      name: t('apiRegistry'),
      path: '/api-registry',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10L10 3L17 10M10 3V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      accessObjectName: 'MANAGE_ROLES'
    },
    {
      name: t('reportGallery'),
      path: '/report-gallery',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      accessObjectName: 'REPORTS_GALLERY'
    }
  ], [t]);

  // Define child modules for each parent module
  const parentChildMap = useMemo(() => ({
    'MASTER_MODEL': ['CONFIG_GROUP', 'CONFIG_VALUES', 'MANAGE_MASTERS', 'API_LOGS', 'DATA_MIGRATION', 'EMAIL_CONFIGURATIONS'],
    'MAPPING': ['COUNTRY_MAPPING', 'GENERAL_DISTRIBUTORS'],
    'FIELD_FIX': ['CREATE_NEW_FIELD_FIX', 'SAVED_FIELD_FIX', 'PENDING_FOR_APPROVAL', 'RETURNED_FIELD_FIX', 'ARCHIVED_FIELD_FIX', 'RELEASED_FIELD_FIX', 'NEW_FIELD_FIX_FROM_CSHQ', 'ON_HOLD_FIELD_FIX', 'READY_TO_RELEASE', 'RELEASED_FIELD_FIX_TO_GD', 'FIELD_FIX_LIMITED_TO_RC', 'NEW_FIELD_FIX_FROM_QM'],
    'FIELD_FIX_PROGRESS': ['FIELD_FIX_PROGRESS_UPDATE', 'FIELD_FIX_PROGRESS_UPDATE_RC', 'FALCON_UPDATES', 'ON_HOLD_FIELD_FIX_PROGRESS', 'ARCHIVED_FIELD_FIX_PROGRESS'],
    'USER_MANAGEMENT': ['MANAGE_USERS', 'MANAGE_ROLES', 'DEACTIVATED_USERS']
  }), []);

  // Helper function to check if user has any child permission for a parent module
  const hasAnyChildPermission = useCallback((parentKey) => {
    const childModules = parentChildMap[parentKey];
    if (!childModules) {
      // If no child modules defined, check parent permission directly
      return hasPermission(parentKey, 'read_only');
    }
    
    // Check if user has permission for any child module
    return childModules.some(childKey => hasPermission(childKey, 'read_only'));
  }, [parentChildMap, hasPermission]);

  // Helper function to check if parent should be shown
  // A parent should only be shown if at least one child has permission
  // OR if the parent has permission AND at least one child has permission
  const shouldShowParent = useCallback((parentKey) => {
    const childModules = parentChildMap[parentKey];
    if (!childModules) {
      // If no child modules defined, check parent permission directly
      return hasPermission(parentKey, 'read_only');
    }
    
    // Check if user has permission for any child module
    const hasAnyChild = childModules.some(childKey => hasPermission(childKey, 'read_only'));
    
    // Only show parent if at least one child has permission
    // This ensures that if parent has permission but all children are NONE, parent won't show
    return hasAnyChild;
  }, [parentChildMap, hasPermission]);

  // Filter menu items based on permissions
  const menuItems = useMemo(() => {
    return allMenuItems.map(item => {
      // API Registry is only visible to admin users
      if (item.accessObjectName === 'MANAGE_ROLES' && item.name === 'API Registry') {
        if (!isAdmin) {
          return null;
        }
        return item;
      }
      
      // For parent modules with children, only show if at least one child has permission
      // This prevents showing parent when all children have NONE access
      if (parentChildMap[item.accessObjectName]) {
        const shouldShow = shouldShowParent(item.accessObjectName);
        if (!shouldShow) {
          return null;
        }
        return item;
      }
      
      // For modules without children, check parent permission directly
      const hasParentPermission = hasPermission(item.accessObjectName, 'read_only');
      if (!hasParentPermission) {
        return null;
      }
      
      return item;
    }).filter(item => item !== null);
  }, [permissions, hasPermission, isAdmin, parentChildMap, hasAnyChildPermission, shouldShowParent, allMenuItems]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="fuso-logo">
            <img src="/favicon.svg" alt="FUSO Logo" />
          </div>
          {!isCollapsed && <h2>Field Fix Portal</h2>}
        </div>
        <button 
          className="collapse-button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Square with rounded corners */}
            <rect 
              x="2" 
              y="2" 
              width="16" 
              height="16" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
            {/* Thin vertical rectangle on the left */}
            <rect 
              x="5" 
              y="6" 
              width="2" 
              height="8" 
              fill="currentColor"
            />
            {/* Left-pointing chevron on the right */}
            <path 
              d="M13 10L10 7M13 10L10 13" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-parent ${isActive(item.path) ? 'active' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            <span className="menu-icon">{item.iconSvg}</span>
            {!isCollapsed && <span className="menu-text">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
