import React from 'react';
import './ApiRegistryTable.css';

const ApiRegistryTable = ({ apis, modules, onEdit, onDelete }) => {
  const getModuleName = (moduleKey) => {
    const module = modules.find(m => m.key === moduleKey);
    return module ? module.name : moduleKey;
  };

  const getMethodBadgeClass = (method) => {
    const classes = {
      GET: 'method-badge-get',
      POST: 'method-badge-post',
      PUT: 'method-badge-put',
      DELETE: 'method-badge-delete',
      PATCH: 'method-badge-patch'
    };
    return classes[method] || 'method-badge';
  };

  const getAccessBadgeClass = (access) => {
    return access === 'FULL' ? 'access-badge-full' : 'access-badge-read';
  };

  if (apis.length === 0) {
    return (
      <div className="no-data-message">
        <p>No API registrations found. Click "Add API" to register a new endpoint.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="api-registry-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Module</th>
            <th>Required Access</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.map(api => (
            <tr key={api.id} className={!api.isActive ? 'inactive-row' : ''}>
              <td>
                <span className={`method-badge ${getMethodBadgeClass(api.method)}`}>
                  {api.method}
                </span>
              </td>
              <td className="path-cell">
                <code>{api.path}</code>
              </td>
              <td>{getModuleName(api.moduleKey)}</td>
              <td>
                <span className={`access-badge ${getAccessBadgeClass(api.requiredAccess)}`}>
                  {api.requiredAccess}
                </span>
              </td>
              <td>
                <span className={`status-badge ${api.isActive ? 'status-active' : 'status-inactive'}`}>
                  {api.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(api)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(api.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiRegistryTable;


