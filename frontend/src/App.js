import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import RoleManagement from './pages/RoleManagement';

// Master Model pages
import ConfigGroup from './pages/MasterModel/ConfigGroup';
import ConfigValues from './pages/MasterModel/ConfigValues';
import ManageMasters from './pages/MasterModel/ManageMasters';
import ApiLogs from './pages/MasterModel/ApiLogs';
import DataMigration from './pages/MasterModel/DataMigration';
import EmailConfigurations from './pages/MasterModel/EmailConfigurations';

// Mapping pages
import CountryMapping from './pages/Mapping/CountryMapping';
import GeneralDistributors from './pages/Mapping/GeneralDistributors';

// Help Manual Upload
import HelpManualUpload from './pages/HelpManualUpload';

// Field Fix pages
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
import FieldFixProgressUpdate from './pages/FieldFixProgress/FieldFixProgressUpdate';
import FieldFixProgressUpdateRC from './pages/FieldFixProgress/FieldFixProgressUpdateRC';
import FalconUpdates from './pages/FieldFixProgress/FalconUpdates';
import OnHoldFieldFixProgress from './pages/FieldFixProgress/OnHoldFieldFix';
import ArchivedFieldFixProgress from './pages/FieldFixProgress/ArchivedFieldFix';

// User Management pages
import UserManagement from './pages/UserManagement/UserManagement';
import ManageUsers from './pages/UserManagement/ManageUsers';
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
      <Route path="/master-model/config-group" element={<ProtectedRoute><Layout><ConfigGroup /></Layout></ProtectedRoute>} />
      <Route path="/master-model/config-values" element={<ProtectedRoute><Layout><ConfigValues /></Layout></ProtectedRoute>} />
      <Route path="/master-model/manage-masters" element={<ProtectedRoute><Layout><ManageMasters /></Layout></ProtectedRoute>} />
      <Route path="/master-model/api-logs" element={<ProtectedRoute><Layout><ApiLogs /></Layout></ProtectedRoute>} />
      <Route path="/master-model/data-migration" element={<ProtectedRoute><Layout><DataMigration /></Layout></ProtectedRoute>} />
      <Route path="/master-model/email-configurations" element={<ProtectedRoute><Layout><EmailConfigurations /></Layout></ProtectedRoute>} />
      
      {/* Mapping Routes */}
      <Route path="/mapping/country-mapping" element={<ProtectedRoute><Layout><CountryMapping /></Layout></ProtectedRoute>} />
      <Route path="/mapping/general-distributors" element={<ProtectedRoute><Layout><GeneralDistributors /></Layout></ProtectedRoute>} />
      
      {/* Help Manual Upload */}
      <Route path="/help-manual-upload" element={<ProtectedRoute><Layout><HelpManualUpload /></Layout></ProtectedRoute>} />
      
      {/* Field Fix Routes */}
      <Route path="/field-fix/create" element={<ProtectedRoute><Layout><CreateNewFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/saved" element={<ProtectedRoute><Layout><SavedFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/pending" element={<ProtectedRoute><Layout><PendingForApproval /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/returned" element={<ProtectedRoute><Layout><ReturnedFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/archived" element={<ProtectedRoute><Layout><ArchivedFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/released" element={<ProtectedRoute><Layout><ReleasedFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/new-from-cshq" element={<ProtectedRoute><Layout><NewFieldFixFromCSHQ /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/on-hold" element={<ProtectedRoute><Layout><OnHoldFieldFix /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/ready-to-release" element={<ProtectedRoute><Layout><ReadyToRelease /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/released-to-gd" element={<ProtectedRoute><Layout><ReleasedFieldFixToGD /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/limited-to-rc" element={<ProtectedRoute><Layout><FieldFixLimitedToRC /></Layout></ProtectedRoute>} />
      <Route path="/field-fix/new-from-qm" element={<ProtectedRoute><Layout><NewFieldFixFromQM /></Layout></ProtectedRoute>} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      
      {/* Field Fix Progress Routes */}
      <Route path="/field-fix-progress/update" element={<ProtectedRoute><Layout><FieldFixProgressUpdate /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/update-rc" element={<ProtectedRoute><Layout><FieldFixProgressUpdateRC /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/falcon-updates" element={<ProtectedRoute><Layout><FalconUpdates /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/on-hold" element={<ProtectedRoute><Layout><OnHoldFieldFixProgress /></Layout></ProtectedRoute>} />
      <Route path="/field-fix-progress/archived" element={<ProtectedRoute><Layout><ArchivedFieldFixProgress /></Layout></ProtectedRoute>} />
      
      {/* User Management Routes */}
      <Route path="/user-management" element={<ProtectedRoute><Layout><UserManagement /></Layout></ProtectedRoute>} />
      <Route path="/user-management/manage-users" element={<ProtectedRoute requiredPermission="MANAGE_USERS" requiredLevel="read_only"><Layout><ManageUsers /></Layout></ProtectedRoute>} />
      <Route path="/user-management/manage-roles" element={<ProtectedRoute requiredPermission="MANAGE_ROLES" requiredLevel="read_only"><Layout><RoleManagement /></Layout></ProtectedRoute>} />
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
        <SnackbarProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </SnackbarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

