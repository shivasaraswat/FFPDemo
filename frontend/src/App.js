import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { NotificationProvider } from './context/NotificationContext';
import { SidebarProvider } from './context/SidebarContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SmartRedirect from './components/common/SmartRedirect';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import RoleManagement from './pages/RoleManagement';

// Master Model pages
import MasterModel from './pages/MasterModel/MasterModel';
import ConfigGroup from './pages/MasterModel/ConfigGroup';
import ConfigValues from './pages/MasterModel/ConfigValues';
import ManageMasters from './pages/MasterModel/ManageMasters';
import ApiLogs from './pages/MasterModel/ApiLogs';
import DataMigration from './pages/MasterModel/DataMigration';
import EmailConfigurations from './pages/MasterModel/EmailConfigurations';

// Mapping pages
import Mapping from './pages/Mapping/Mapping';
import CountryMapping from './pages/Mapping/CountryMapping';
import GeneralDistributors from './pages/Mapping/GeneralDistributors';

// Help Manual Upload
import HelpManualUpload from './pages/HelpManualUpload';

// Field Fix pages
import FieldFix from './pages/FieldFix/FieldFix';
import CreateNewFieldFix from './pages/FieldFix/CreateNewFieldFix';
import SavedFieldFix from './pages/FieldFix/SavedFieldFix';
import PendingForApproval from './pages/FieldFix/PendingForApproval';
import ReturnedFieldFix from './pages/FieldFix/ReturnedFieldFix';
import ArchivedFieldFix from './pages/FieldFix/ArchivedFieldFix';
import ReleasedFieldFix from './pages/FieldFix/ReleasedFieldFix';
import NewFieldFixFromCSHQ from './pages/FieldFix/NewFieldFixFromCSHQ';
import OnHoldFieldFix from './pages/FieldFix/OnHoldFieldFix';
import ReadyToRelease from './pages/FieldFix/ReadyToRelease';
import ReleasedFieldFixToGD from './pages/FieldFix/ReleasedFieldFixToGD';
import FieldFixLimitedToRC from './pages/FieldFix/FieldFixLimitedToRC';
import NewFieldFixFromQM from './pages/FieldFix/NewFieldFixFromQM';

// Dashboard
import Dashboard from './pages/Dashboard';

// Field Fix Progress pages
import FieldFixProgress from './pages/FieldFixProgress/FieldFixProgress';
import FieldFixProgressUpdate from './pages/FieldFixProgress/FieldFixProgressUpdate';
import FieldFixProgressUpdateRC from './pages/FieldFixProgress/FieldFixProgressUpdateRC';
import FalconUpdates from './pages/FieldFixProgress/FalconUpdates';
import OnHoldFieldFixProgress from './pages/FieldFixProgress/OnHoldFieldFix';
import ArchivedFieldFixProgress from './pages/FieldFixProgress/ArchivedFieldFix';

// User Management pages
import UserManagement from './pages/UserManagement/UserManagement';
import ManageUsers from './pages/UserManagement/ManageUsers';
import ManageRoles from './pages/UserManagement/ManageRoles';
import DeactivatedUsers from './pages/UserManagement/DeactivatedUsers';
import ApiRegistryManagement from './pages/UserManagement/ApiRegistryManagement';

// Report Gallery
import ReportGallery from './pages/ReportGallery';

// Code Generation
import CFTMasterRecords from './pages/CodeGeneration/CFTMasterRecords';

// Profile
import ProfileInformation from './pages/Profile/ProfileInformation';

import './App.css';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route
        path="/role-management"
        element={
          <ProtectedRoute>
            <Layout>
              <RoleManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Master Model Routes */}
      <Route 
        path="/master-model" 
        element={
          <SmartRedirect 
            basePath="/master-model"
            tabs={[
              { key: 'manage-masters', accessObjectName: 'MANAGE_MASTERS' },
              { key: 'config-group', accessObjectName: 'CONFIG_GROUP' },
              { key: 'config-values', accessObjectName: 'CONFIG_VALUES' },
              { key: 'api-logs', accessObjectName: 'API_LOGS' },
              { key: 'data-migration', accessObjectName: 'DATA_MIGRATION' },
              { key: 'email-configurations', accessObjectName: 'EMAIL_CONFIGURATIONS' }
            ]}
          />
        } 
      />
      <Route path="/master-model/manage-masters" element={<ProtectedRoute requiredPermission="MANAGE_MASTERS" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      <Route path="/master-model/config-group" element={<ProtectedRoute requiredPermission="CONFIG_GROUP" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      <Route path="/master-model/config-values" element={<ProtectedRoute requiredPermission="CONFIG_VALUES" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      <Route path="/master-model/api-logs" element={<ProtectedRoute requiredPermission="API_LOGS" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      <Route path="/master-model/data-migration" element={<ProtectedRoute requiredPermission="DATA_MIGRATION" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      <Route path="/master-model/email-configurations" element={<ProtectedRoute requiredPermission="EMAIL_CONFIGURATIONS" requiredLevel="read_only"><Layout><MasterModel /></Layout></ProtectedRoute>} />
      
      {/* Mapping Routes */}
      <Route 
        path="/mapping" 
        element={
          <SmartRedirect 
            basePath="/mapping"
            tabs={[
              { key: 'country-mapping', accessObjectName: 'COUNTRY_MAPPING' },
              { key: 'general-distributors', accessObjectName: 'GENERAL_DISTRIBUTORS' }
            ]}
          />
        } 
      />
      <Route path="/mapping/country-mapping" element={<ProtectedRoute requiredPermission="COUNTRY_MAPPING" requiredLevel="read_only"><Layout><Mapping /></Layout></ProtectedRoute>} />
      <Route path="/mapping/general-distributors" element={<ProtectedRoute requiredPermission="GENERAL_DISTRIBUTORS" requiredLevel="read_only"><Layout><Mapping /></Layout></ProtectedRoute>} />
      
      {/* Help Manual Upload */}
      <Route path="/help-manual-upload" element={<ProtectedRoute><Layout><HelpManualUpload /></Layout></ProtectedRoute>} />
      
      {/* Field Fix Routes */}
      <Route 
        path="/field-fix" 
        element={
          <SmartRedirect 
            basePath="/field-fix"
            tabs={[
              { key: 'create', accessObjectName: 'CREATE_NEW_FIELD_FIX' },
              { key: 'saved', accessObjectName: 'SAVED_FIELD_FIX' },
              { key: 'pending', accessObjectName: 'PENDING_FOR_APPROVAL' },
              { key: 'returned', accessObjectName: 'RETURNED_FIELD_FIX' },
              { key: 'archived', accessObjectName: 'ARCHIVED_FIELD_FIX' },
              { key: 'released', accessObjectName: 'RELEASED_FIELD_FIX' },
              { key: 'new-from-cshq', accessObjectName: 'NEW_FIELD_FIX_FROM_CSHQ' },
              { key: 'on-hold', accessObjectName: 'ON_HOLD_FIELD_FIX' },
              { key: 'ready-to-release', accessObjectName: 'READY_TO_RELEASE' },
              { key: 'released-to-gd', accessObjectName: 'RELEASED_FIELD_FIX_TO_GD' },
              { key: 'limited-to-rc', accessObjectName: 'FIELD_FIX_LIMITED_TO_RC' },
              { key: 'new-from-qm', accessObjectName: 'NEW_FIELD_FIX_FROM_QM' }
            ]}
          />
        } 
      />
      <Route path="/field-fix/create" element={<ProtectedRoute requiredPermission="CREATE_NEW_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/saved" element={<ProtectedRoute requiredPermission="SAVED_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/pending" element={<ProtectedRoute requiredPermission="PENDING_FOR_APPROVAL" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/returned" element={<ProtectedRoute requiredPermission="RETURNED_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/archived" element={<ProtectedRoute requiredPermission="ARCHIVED_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/released" element={<ProtectedRoute requiredPermission="RELEASED_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/new-from-cshq" element={<ProtectedRoute requiredPermission="NEW_FIELD_FIX_FROM_CSHQ" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/on-hold" element={<ProtectedRoute requiredPermission="ON_HOLD_FIELD_FIX" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/ready-to-release" element={<ProtectedRoute requiredPermission="READY_TO_RELEASE" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/released-to-gd" element={<ProtectedRoute requiredPermission="RELEASED_FIELD_FIX_TO_GD" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/limited-to-rc" element={<ProtectedRoute requiredPermission="FIELD_FIX_LIMITED_TO_RC" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/new-from-qm" element={<ProtectedRoute requiredPermission="NEW_FIELD_FIX_FROM_QM" requiredLevel="read_only"><Layout><FieldFix /></Layout></ProtectedRoute>} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      
      {/* Field Fix Progress Routes */}
      <Route 
        path="/field-fix-progress" 
        element={
          <SmartRedirect 
            basePath="/field-fix-progress"
            tabs={[
              { key: 'update', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE' },
              { key: 'update-rc', accessObjectName: 'FIELD_FIX_PROGRESS_UPDATE_RC' },
              { key: 'falcon-updates', accessObjectName: 'FALCON_UPDATES' },
              { key: 'on-hold', accessObjectName: 'ON_HOLD_FIELD_FIX_PROGRESS' },
              { key: 'archived', accessObjectName: 'ARCHIVED_FIELD_FIX_PROGRESS' }
            ]}
          />
        } 
      />
      <Route path="/field-fix-progress/update" element={<ProtectedRoute requiredPermission="FIELD_FIX_PROGRESS_UPDATE" requiredLevel="read_only"><Layout><FieldFixProgress /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/update-rc" element={<ProtectedRoute requiredPermission="FIELD_FIX_PROGRESS_UPDATE_RC" requiredLevel="read_only"><Layout><FieldFixProgress /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/falcon-updates" element={<ProtectedRoute requiredPermission="FALCON_UPDATES" requiredLevel="read_only"><Layout><FieldFixProgress /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/on-hold" element={<ProtectedRoute requiredPermission="ON_HOLD_FIELD_FIX_PROGRESS" requiredLevel="read_only"><Layout><FieldFixProgress /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/archived" element={<ProtectedRoute requiredPermission="ARCHIVED_FIELD_FIX_PROGRESS" requiredLevel="read_only"><Layout><FieldFixProgress /></Layout></ProtectedRoute>} />
      
      {/* User Management Routes */}
      <Route 
        path="/user-management" 
        element={
          <SmartRedirect 
            basePath="/user-management"
            tabs={[
              { key: 'manage-users', accessObjectName: 'MANAGE_USERS' },
              { key: 'manage-roles', accessObjectName: 'MANAGE_ROLES' },
              { key: 'deactivated-users', accessObjectName: 'DEACTIVATED_USERS' }
            ]}
          />
        } 
      />
      <Route path="/user-management/manage-users" element={<ProtectedRoute requiredPermission="MANAGE_USERS" requiredLevel="read_only"><Layout><ManageUsers /></Layout></ProtectedRoute>} />
      <Route path="/user-management/manage-roles" element={<ProtectedRoute requiredPermission="MANAGE_ROLES" requiredLevel="read_only"><Layout><ManageRoles /></Layout></ProtectedRoute>} />
      <Route path="/user-management/deactivated-users" element={<ProtectedRoute requiredPermission="DEACTIVATED_USERS" requiredLevel="read_only"><Layout><DeactivatedUsers /></Layout></ProtectedRoute>} />
      
      {/* API Registry Route - Standalone (accessible to all authenticated users) */}
      <Route path="/api-registry" element={<ProtectedRoute><Layout><ApiRegistryManagement /></Layout></ProtectedRoute>} />
      
      {/* Report Gallery */}
      <Route path="/report-gallery" element={<ProtectedRoute><Layout><ReportGallery /></Layout></ProtectedRoute>} />
      
      {/* Code Generation Routes */}
      <Route path="/code-generation" element={<ProtectedRoute><Layout><CFTMasterRecords /></Layout></ProtectedRoute>} />
      
      {/* Profile Routes */}
      <Route path="/profile" element={<ProtectedRoute><Layout><ProfileInformation /></Layout></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <NotificationProvider>
            <SnackbarProvider>
              <div className="App">
                <AppRoutes />
              </div>
            </SnackbarProvider>
          </NotificationProvider>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

