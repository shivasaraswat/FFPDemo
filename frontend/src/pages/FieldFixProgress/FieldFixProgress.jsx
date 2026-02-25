import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FieldFixProgressUpdate from './FieldFixProgressUpdate';
import FieldFixProgressUpdateRC from './FieldFixProgressUpdateRC';
import FalconUpdates from './FalconUpdates';
import OnHoldFieldFixProgress from './OnHoldFieldFix';
import ArchivedFieldFixProgress from './ArchivedFieldFix';
import '../Common.css';
import './FieldFixProgress.css';

const FieldFixProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  
  // Define tabs with their access object names
  const allTabs = useMemo(() => [
    { key: 'update', label: 'Field Fix Progress Update', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE' },
    { key: 'update-rc', label: 'Field Fix Progress Update RC', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE_RC' },
    { key: 'falcon-updates', label: 'Falcon Updates', accessObjectName: 'FALCON_UPDATES' },
    { key: 'on-hold', label: 'On Hold Field Fix Progress', accessObjectName: 'ON_HOLD_FIELD_FIX_PROGRESS' },
    { key: 'archived', label: 'Archived Field Fix Progress', accessObjectName: 'ARCHIVED_FIELD_FIX_PROGRESS' }
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
    if (path.includes('/update-rc')) return 'update-rc';
    if (path.includes('/update')) return 'update';
    if (path.includes('/falcon-updates')) return 'falcon-updates';
    if (path.includes('/on-hold')) return 'on-hold';
    if (path.includes('/archived')) return 'archived';
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
      navigate(`/field-fix-progress/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    } else if (tab) {
      setActiveTab(tab);
    } else {
      // No tab found in URL, redirect to first available
      navigate(`/field-fix-progress/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    }
  }, [location.pathname, hasPermission, visibleTabs, navigate, allTabs]);

  const handleTabChange = (tab) => {
    // Verify permission before changing tab
    const tabInfo = allTabs.find(t => t.key === tab);
    if (tabInfo && hasPermission(tabInfo.accessObjectName, 'read_only')) {
      setActiveTab(tab);
      navigate(`/field-fix-progress/${tab}`);
    }
  };

  return (
    <div className="manage-field-fix-progress-container">
      <div className="user-management-wrapper">
        {/* Header */}
        <div className="page-header">
          <h1>Field Fix Progress</h1>
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
        <div className="field-fix-progress-content">
          {activeTab === 'update' && <FieldFixProgressUpdate />}
          {activeTab === 'update-rc' && <FieldFixProgressUpdateRC />}
          {activeTab === 'falcon-updates' && <FalconUpdates />}
          {activeTab === 'on-hold' && <OnHoldFieldFixProgress />}
          {activeTab === 'archived' && <ArchivedFieldFixProgress />}
        </div>
      </div>
    </div>
  );
};

export default FieldFixProgress;

