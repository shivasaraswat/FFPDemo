import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManageMasters from './ManageMasters';
import ConfigGroup from './ConfigGroup';
import ConfigValues from './ConfigValues';
import ApiLogs from './ApiLogs';
import DataMigration from './DataMigration';
import EmailConfigurations from './EmailConfigurations';
import '../Common.css';
import './MasterModel.css';

const MasterModel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  
  // Define tabs with their access object names
  const allTabs = useMemo(() => [
    { key: 'manage-masters', label: 'Manage Masters', accessObjectName: 'MANAGE_MASTERS' },
    { key: 'config-group', label: 'Config Group', accessObjectName: 'CONFIG_GROUP' },
    { key: 'config-values', label: 'Config Values', accessObjectName: 'CONFIG_VALUES' },
    { key: 'api-logs', label: 'API Logs', accessObjectName: 'API_LOGS' },
    { key: 'data-migration', label: 'Data Migration', accessObjectName: 'DATA_MIGRATION' },
    { key: 'email-configurations', label: 'Email Configurations', accessObjectName: 'EMAIL_CONFIGURATIONS' }
  ], []);

  // Filter tabs based on permissions
  const visibleTabs = useMemo(() => {
    return allTabs.filter(tab => {
      return hasPermission(tab.accessObjectName, 'read_only');
    });
  }, [allTabs, hasPermission]);

  // Determine active tab from URL or default to first available tab
  const getActiveTabFromPath = (availableTabs) => {
    const path = location.pathname;
    if (path.includes('/manage-masters')) return 'manage-masters';
    if (path.includes('/config-group')) return 'config-group';
    if (path.includes('/config-values')) return 'config-values';
    if (path.includes('/api-logs')) return 'api-logs';
    if (path.includes('/data-migration')) return 'data-migration';
    if (path.includes('/email-configurations')) return 'email-configurations';
    // Default to first available tab
    return availableTabs.length > 0 ? availableTabs[0].key : null;
  };

  const [activeTab, setActiveTab] = useState(null);

  // Initialize and sync tab with URL changes and check permissions
  useEffect(() => {
    if (visibleTabs.length === 0) {
      // No tabs available, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    const tab = getActiveTabFromPath(visibleTabs);
    
    // Check if user has permission for the current tab
    const currentTab = allTabs.find(t => t.key === tab);
    if (currentTab && !hasPermission(currentTab.accessObjectName, 'read_only')) {
      // Redirect to first available tab if no permission
      navigate(`/master-model/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    } else if (tab) {
      setActiveTab(tab);
    } else {
      // No tab found in URL, redirect to first available
      navigate(`/master-model/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    }
  }, [location.pathname, hasPermission, visibleTabs, navigate, allTabs]);

  const handleTabChange = (tab) => {
    // Verify permission before changing tab
    const tabInfo = allTabs.find(t => t.key === tab);
    if (tabInfo && hasPermission(tabInfo.accessObjectName, 'read_only')) {
      setActiveTab(tab);
      navigate(`/master-model/${tab}`);
    }
  };

  return (
    <div className="manage-master-model-container">
      <div className="user-management-wrapper">
        {/* Header */}
        <div className="page-header">
          <h1>Master Model</h1>
        </div>

        {/* Tabs */}
        {visibleTabs.length > 0 && (
          <div className="user-management-tabs">
            {visibleTabs.map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="master-model-content">
          {activeTab === 'manage-masters' && <ManageMasters />}
          {activeTab === 'config-group' && <ConfigGroup />}
          {activeTab === 'config-values' && <ConfigValues />}
          {activeTab === 'api-logs' && <ApiLogs />}
          {activeTab === 'data-migration' && <DataMigration />}
          {activeTab === 'email-configurations' && <EmailConfigurations />}
        </div>
      </div>
    </div>
  );
};

export default MasterModel;

