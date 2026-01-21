import React, { useState, useEffect } from 'react';
import { apiRegistryService } from '../../services/apiRegistryService';
import { accessObjectService } from '../../services/accessObjectService';
import ApiRegistryTable from '../../components/ApiRegistry/ApiRegistryTable';
import ApiRegistryForm from '../../components/ApiRegistry/ApiRegistryForm';
import './UserManagement.css';
import './ApiRegistryManagement.css';

const ApiRegistryManagement = () => {
  const [apis, setApis] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApi, setEditingApi] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    method: '',
    moduleKey: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apisData, modulesData] = await Promise.all([
        apiRegistryService.getAll(),
        accessObjectService.getAll()
      ]);
      setApis(apisData);
      setModules(modulesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: 'Failed to load API registry data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingApi(null);
    setShowForm(true);
  };

  const handleEdit = (api) => {
    setEditingApi(api);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this API registration?')) {
      return;
    }

    try {
      await apiRegistryService.delete(id);
      setMessage({ type: 'success', text: 'API registration deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete API registration' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFormSubmit = async (apiData) => {
    try {
      if (editingApi) {
        await apiRegistryService.update(editingApi.id, apiData);
        setMessage({ type: 'success', text: 'API registration updated successfully' });
      } else {
        await apiRegistryService.create(apiData);
        setMessage({ type: 'success', text: 'API registration created successfully' });
      }
      setShowForm(false);
      setEditingApi(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      loadData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save API registration' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingApi(null);
  };

  const filteredApis = apis.filter(api => {
    if (filters.method && api.method !== filters.method) return false;
    if (filters.moduleKey && api.moduleKey !== filters.moduleKey) return false;
    if (filters.search && !api.path.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading API registry...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>API Registry Management</h1>
          <p className="breadcrumb">API Registry</p>
        </div>
        <button 
          className="add-button-header" 
          onClick={handleAdd}
          type="button"
          title="Register a new API endpoint"
        >
          ➕ Add New API
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="page-content">
        <div className="api-registry-header">
          <div className="filters-section">
            <select
              value={filters.method}
              onChange={(e) => setFilters({ ...filters, method: e.target.value })}
              className="filter-select"
            >
              <option value="">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>

            <select
              value={filters.moduleKey}
              onChange={(e) => setFilters({ ...filters, moduleKey: e.target.value })}
              className="filter-select"
            >
              <option value="">All Modules</option>
              {modules.map(module => (
                <option key={module.key} value={module.key}>
                  {module.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by path..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
          </div>

          <button 
            className="add-button" 
            onClick={handleAdd}
            type="button"
            title="Register a new API endpoint"
          >
            ➕ Add API
          </button>
        </div>

        <ApiRegistryTable
          apis={filteredApis}
          modules={modules}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
          <ApiRegistryForm
            api={editingApi}
            modules={modules}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ApiRegistryManagement;

