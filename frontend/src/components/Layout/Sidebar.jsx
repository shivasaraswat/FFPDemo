import React, { useMemo } from 'react';
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
      
      // Check if user has permission for parent screen
      const hasParentPermission = hasPermission(item.accessObjectName, 'read_only');
      
      if (!hasParentPermission) {
        return null;
      }
      
      return item;
    }).filter(item => item !== null);
  }, [permissions, hasPermission, isAdmin]);

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
      
      <div className="sidebar-footer">
        <button 
          className="collapse-button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isCollapsed ? 'rotated' : ''}
          >
            <path 
              d="M10 12L6 8L10 4" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
