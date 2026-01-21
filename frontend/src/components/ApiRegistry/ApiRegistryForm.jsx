import React, { useState, useEffect } from 'react';
import './ApiRegistryForm.css';

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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{api ? 'Edit API Registration' : 'Add API Registration'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="api-registry-form">
          <div className="form-group">
            <label htmlFor="method">HTTP Method *</label>
            <select
              id="method"
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className={errors.method ? 'error' : ''}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            {errors.method && <span className="error-message">{errors.method}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="path">API Path *</label>
            <input
              type="text"
              id="path"
              value={formData.path}
              onChange={(e) => handleChange('path', e.target.value)}
              placeholder="/api/example/path"
              className={errors.path ? 'error' : ''}
            />
            {errors.path && <span className="error-message">{errors.path}</span>}
            <small>Path must start with /api/ (e.g., /api/users, /api/users/:id)</small>
          </div>

          <div className="form-group">
            <label htmlFor="moduleKey">Module *</label>
            <select
              id="moduleKey"
              value={formData.moduleKey}
              onChange={(e) => handleChange('moduleKey', e.target.value)}
              className={errors.moduleKey ? 'error' : ''}
            >
              <option value="">Select a module</option>
              {modules.map(module => (
                <option key={module.key} value={module.key}>
                  {module.name} ({module.key})
                </option>
              ))}
            </select>
            {errors.moduleKey && <span className="error-message">{errors.moduleKey}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="requiredAccess">Required Access *</label>
            <select
              id="requiredAccess"
              value={formData.requiredAccess}
              onChange={(e) => handleChange('requiredAccess', e.target.value)}
            >
              <option value="READ">READ - Read-only access</option>
              <option value="FULL">FULL - Full access (read + write)</option>
            </select>
            <small>Users need this access level to use this API endpoint</small>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              Active (API is registered and enforced)
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {api ? 'Update' : 'Create'} API Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiRegistryForm;


