import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CountryMapping from './CountryMapping';
import GeneralDistributors from './GeneralDistributors';
import '../Common.css';
import './Mapping.css';

const Mapping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  
  // Define tabs with their access object names
  const allTabs = useMemo(() => [
    { key: 'country-mapping', label: 'Country Mapping', accessObjectName: 'COUNTRY_MAPPING' },
    { key: 'general-distributors', label: 'General Distributors', accessObjectName: 'GENERAL_DISTRIBUTORS' }
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
    if (path.includes('/country-mapping')) return 'country-mapping';
    if (path.includes('/general-distributors')) return 'general-distributors';
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
      navigate(`/mapping/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    } else if (tab) {
      setActiveTab(tab);
    } else {
      // No tab found in URL, redirect to first available
      navigate(`/mapping/${visibleTabs[0].key}`);
      setActiveTab(visibleTabs[0].key);
    }
  }, [location.pathname, hasPermission, visibleTabs, navigate, allTabs]);

  const handleTabChange = (tab) => {
    // Verify permission before changing tab
    const tabInfo = allTabs.find(t => t.key === tab);
    if (tabInfo && hasPermission(tabInfo.accessObjectName, 'read_only')) {
      setActiveTab(tab);
      navigate(`/mapping/${tab}`);
    }
  };

  return (
    <div className="manage-mapping-container">
      <div className="user-management-wrapper">
        {/* Header */}
        <div className="page-header">
          <h1>Mapping</h1>
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
        <div className="mapping-content">
          {activeTab === 'country-mapping' && <CountryMapping />}
          {activeTab === 'general-distributors' && <GeneralDistributors />}
        </div>
      </div>
    </div>
  );
};

export default Mapping;

