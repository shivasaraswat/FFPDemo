import React, { useState, useEffect } from 'react';

const ApiRegistryForm = ({ api, modules, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    method: 'GET',
    path: '',
    moduleKey: '',
    requiredAccess: 'READ',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (api) {
      setFormData({
        method: api.method || 'GET',
        path: api.path || '',
        moduleKey: api.moduleKey || '',
        requiredAccess: api.requiredAccess || 'READ',
        isActive: api.isActive !== undefined ? api.isActive : true
      });
    }
  }, [api]);

  const validate = () => {
    const newErrors = {};

    if (!formData.path.trim()) {
      newErrors.path = 'Path is required';
    } else if (!formData.path.startsWith('/api/')) {
      newErrors.path = 'Path must start with /api/';
    }

    if (!formData.moduleKey) {
      newErrors.moduleKey = 'Module is required';
    }

    if (!formData.method) {
      newErrors.method = 'Method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]" onClick={onCancel}>
      <div className="bg-white rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="m-0 text-2xl">{api ? 'Edit API Registration' : 'Add API Registration'}</h2>
          <button className="bg-transparent border-none text-3xl cursor-pointer text-gray-600 leading-none p-0 w-8 h-8 flex items-center justify-center hover:text-black transition-colors" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="method" className="block mb-2 font-medium text-gray-800">HTTP Method *</label>
            <select
              id="method"
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.method ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            {errors.method && <span className="block text-red-600 text-sm mt-1">{errors.method}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="path" className="block mb-2 font-medium text-gray-800">API Path *</label>
            <input
              type="text"
              id="path"
              value={formData.path}
              onChange={(e) => handleChange('path', e.target.value)}
              placeholder="/api/example/path"
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.path ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            />
            {errors.path && <span className="block text-red-600 text-sm mt-1">{errors.path}</span>}
            <small className="block text-gray-600 text-sm mt-1">Path must start with /api/ (e.g., /api/users, /api/users/:id)</small>
          </div>

          <div className="mb-6">
            <label htmlFor="moduleKey" className="block mb-2 font-medium text-gray-800">Module *</label>
            <select
              id="moduleKey"
              value={formData.moduleKey}
              onChange={(e) => handleChange('moduleKey', e.target.value)}
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.moduleKey ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            >
              <option value="">Select a module</option>
              {modules.map(module => (
                <option key={module.key} value={module.key}>
                  {module.name} ({module.key})
                </option>
              ))}
            </select>
            {errors.moduleKey && <span className="block text-red-600 text-sm mt-1">{errors.moduleKey}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="requiredAccess" className="block mb-2 font-medium text-gray-800">Required Access *</label>
            <select
              id="requiredAccess"
              value={formData.requiredAccess}
              onChange={(e) => handleChange('requiredAccess', e.target.value)}
              className="w-full py-3 px-3 border border-gray-300 rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
            >
              <option value="READ">READ - Read-only access</option>
              <option value="FULL">FULL - Full access (read + write)</option>
            </select>
            <small className="block text-gray-600 text-sm mt-1">Users need this access level to use this API endpoint</small>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-auto cursor-pointer"
              />
              <span className="text-gray-800">Active (API is registered and enforced)</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-300">
            <button type="button" className="px-6 py-3 border-none rounded-md text-base cursor-pointer font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-3 border-none rounded-md text-base cursor-pointer font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              {api ? 'Update' : 'Create'} API Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiRegistryForm;


