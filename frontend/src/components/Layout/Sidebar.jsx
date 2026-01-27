import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout, hasPermission, permissions } = useAuth();
  const { t } = useLanguage();
  const [expandedMenus, setExpandedMenus] = useState({});

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
      // API Registry is always visible (needed to register APIs for RBAC)
      if (item.accessObjectName === 'MANAGE_ROLES' && item.name === 'API Registry') {
        return item;
      }
      
      // User Management is always visible and shows all children
      if (item.accessObjectName === 'USER_MANAGEMENT') {
        // Filter children based on permissions for User Management
        const filteredChildren = item.children.length > 0 
          ? item.children.filter(child => hasPermission(child.accessObjectName, 'read_only'))
          : [];
        return {
          ...item,
          children: filteredChildren
        };
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
  }, [permissions, hasPermission]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Field Fix</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.name} className="menu-item">
            {item.children.length > 0 ? (
              <>
                <div
                  className={`menu-parent ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => toggleMenu(item.name)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.name}</span>
                  <span className={`menu-arrow ${expandedMenus[item.name] ? 'expanded' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {expandedMenus[item.name] && item.children.length > 0 && (
                  <div className="menu-children">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`menu-child ${isActive(child.path) ? 'active' : ''}`}
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
                className={`menu-parent ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button">
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

