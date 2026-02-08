import React, { useState, useEffect } from 'react';
import { apiRegistryService } from '../../services/apiRegistryService';
import { accessObjectService } from '../../services/accessObjectService';
import ApiRegistryTable from '../../components/ApiRegistry/ApiRegistryTable';
import ApiRegistryForm from '../../components/ApiRegistry/ApiRegistryForm';

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
      <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
        <div className="text-center py-8 text-gray-600">Loading API registry...</div>
      </div>
    );
  }

  return (
    <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
      <div className="mb-8 px-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-text-primary mb-3 text-3xl font-semibold tracking-tight">API Registry Management</h1>
            <p className="text-text-secondary text-sm m-0 flex items-center gap-2 before:content-['›'] before:text-gray-400 before:mr-1">API Registry</p>
          </div>
          <button 
            className="px-6 py-2.5 bg-danger text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={handleAdd}
            type="button"
            title="Register a new API endpoint"
          >
            ➕ Add New API
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
          {message.text}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-4 flex-wrap">
            <select
              value={filters.method}
              onChange={(e) => setFilters({ ...filters, method: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 min-w-[150px] appearance-none bg-[url('data:image/svg+xml,%3Csvg_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'_fill=\'none\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath_d=\'M1_1L6_6L11_1\'_stroke=\'%236b7280\'_stroke-width=\'1.5\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
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
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 min-w-[150px] appearance-none bg-[url('data:image/svg+xml,%3Csvg_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'_fill=\'none\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath_d=\'M1_1L6_6L11_1\'_stroke=\'%236b7280\'_stroke-width=\'1.5\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
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
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
            />
          </div>

          <button 
            className="px-6 py-2.5 bg-danger text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg"
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

