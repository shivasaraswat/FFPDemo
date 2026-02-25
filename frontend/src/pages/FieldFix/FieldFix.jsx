import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreateNewFieldFix from './CreateNewFieldFix';
import SavedFieldFix from './SavedFieldFix';
import PendingForApproval from './PendingForApproval';
import ReturnedFieldFix from './ReturnedFieldFix';
import ArchivedFieldFix from './ArchivedFieldFix';
import ReleasedFieldFix from './ReleasedFieldFix';
import NewFieldFixFromCSHQ from './NewFieldFixFromCSHQ';
import OnHoldFieldFix from './OnHoldFieldFix';
import ReadyToRelease from './ReadyToRelease';
import ReleasedFieldFixToGD from './ReleasedFieldFixToGD';
import FieldFixLimitedToRC from './FieldFixLimitedToRC';
import NewFieldFixFromQM from './NewFieldFixFromQM';
import '../Common.css';
import './FieldFix.css';

const FieldFix = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  
  // Define tabs with their access object names
  const allTabs = useMemo(() => [
    { key: 'create', label: 'Create New Field Fix', accessObjectName: 'CREATE_NEW_FIELD_FIX' },
    { key: 'saved', label: 'Saved Field Fix', accessObjectName: 'SAVED_FIELD_FIX' },
    { key: 'pending', label: 'Pending For Approval', accessObjectName: 'PENDING_FOR_APPROVAL' },
    { key: 'returned', label: 'Returned Field Fix', accessObjectName: 'RETURNED_FIELD_FIX' },
    { key: 'archived', label: 'Archived Field Fix', accessObjectName: 'ARCHIVED_FIELD_FIX' },
    { key: 'released', label: 'Released Field Fix', accessObjectName: 'RELEASED_FIELD_FIX' },
    { key: 'new-from-cshq', label: 'New Field Fix From CSHQ', accessObjectName: 'NEW_FIELD_FIX_FROM_CSHQ' },
    { key: 'on-hold', label: 'On Hold Field Fix', accessObjectName: 'ON_HOLD_FIELD_FIX' },
    { key: 'ready-to-release', label: 'Ready To Release', accessObjectName: 'READY_TO_RELEASE' },
    { key: 'released-to-gd', label: 'Released Field Fix To GD', accessObjectName: 'RELEASED_FIELD_FIX_TO_GD' },
    { key: 'limited-to-rc', label: 'Field Fix Limited To RC', accessObjectName: 'FIELD_FIX_LIMITED_TO_RC' },
    { key: 'new-from-qm', label: 'New Field Fix From QM', accessObjectName: 'NEW_FIELD_FIX_FROM_QM' }
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
    if (path.includes('/create')) return 'create';
    if (path.includes('/saved')) return 'saved';
    if (path.includes('/pending')) return 'pending';
    if (path.includes('/returned')) return 'returned';
    if (path.includes('/archived')) return 'archived';
    if (path.includes('/released') && !path.includes('/released-to-gd')) return 'released';
    if (path.includes('/new-from-cshq')) return 'new-from-cshq';
    if (path.includes('/on-hold')) return 'on-hold';
    if (path.includes('/ready-to-release')) return 'ready-to-release';
    if (path.includes('/released-to-gd')) return 'released-to-gd';
    if (path.includes('/limited-to-rc')) return 'limited-to-rc';
    if (path.includes('/new-from-qm')) return 'new-from-qm';
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
      navigate(`/field-fix/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    } else if (tab) {
      setActiveTab(tab);
    } else {
      // No tab found in URL, redirect to first available
      navigate(`/field-fix/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    }
  }, [location.pathname, hasPermission, visibleTabs, navigate, allTabs]);

  const handleTabChange = (tab) => {
    // Verify permission before changing tab
    const tabInfo = allTabs.find(t => t.key === tab);
    if (tabInfo && hasPermission(tabInfo.accessObjectName, 'read_only')) {
      setActiveTab(tab);
      navigate(`/field-fix/${tab}`);
    }
  };

  return (
    <div className="manage-field-fix-container">
      <div className="user-management-wrapper">
        {/* Header */}
        <div className="page-header">
          <h1>Field Fix</h1>
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
        <div className="field-fix-content">
          {activeTab === 'create' && <CreateNewFieldFix />}
          {activeTab === 'saved' && <SavedFieldFix />}
          {activeTab === 'pending' && <PendingForApproval />}
          {activeTab === 'returned' && <ReturnedFieldFix />}
          {activeTab === 'archived' && <ArchivedFieldFix />}
          {activeTab === 'released' && <ReleasedFieldFix />}
          {activeTab === 'new-from-cshq' && <NewFieldFixFromCSHQ />}
          {activeTab === 'on-hold' && <OnHoldFieldFix />}
          {activeTab === 'ready-to-release' && <ReadyToRelease />}
          {activeTab === 'released-to-gd' && <ReleasedFieldFixToGD />}
          {activeTab === 'limited-to-rc' && <FieldFixLimitedToRC />}
          {activeTab === 'new-from-qm' && <NewFieldFixFromQM />}
        </div>
      </div>
    </div>
  );
};

export default FieldFix;

