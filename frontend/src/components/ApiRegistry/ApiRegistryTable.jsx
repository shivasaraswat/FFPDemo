import React from 'react';

const ApiRegistryTable = ({ apis, modules, onEdit, onDelete }) => {
  const getModuleName = (moduleKey) => {
    const module = modules.find(m => m.key === moduleKey);
    return module ? module.name : moduleKey;
  };

  const getMethodBadgeColors = (method) => {
    const colors = {
      GET: 'bg-blue-500 text-white',
      POST: 'bg-green-500 text-white',
      PUT: 'bg-orange-500 text-white',
      DELETE: 'bg-red-500 text-white',
      PATCH: 'bg-teal-500 text-white'
    };
    return colors[method] || 'bg-gray-500 text-white';
  };

  const getAccessBadgeColors = (access) => {
    return access === 'FULL' ? 'bg-green-600 text-white' : 'bg-cyan-600 text-white';
  };

  if (apis.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary bg-bg-secondary rounded-lg border border-border">
        <p className="m-0 text-base font-medium">No API registrations found. Click "Add API" to register a new endpoint.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-md">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Method</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Path</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Module</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Required Access</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Status</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-800 border-b-2 border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.map(api => (
            <tr key={api.id} className={`border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${!api.isActive ? 'opacity-60' : ''}`}>
              <td className="px-4 py-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold uppercase ${getMethodBadgeColors(api.method)}`}>
                  {api.method}
                </span>
              </td>
              <td className="px-4 py-4 font-mono text-sm">
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{api.path}</code>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">{getModuleName(api.moduleKey)}</td>
              <td className="px-4 py-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getAccessBadgeColors(api.requiredAccess)}`}>
                  {api.requiredAccess}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${api.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {api.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button
                    className="bg-transparent border-none cursor-pointer text-xl px-2 py-1 rounded transition-colors duration-200 hover:bg-blue-100"
                    onClick={() => onEdit(api)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-transparent border-none cursor-pointer text-xl px-2 py-1 rounded transition-colors duration-200 hover:bg-red-100"
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


