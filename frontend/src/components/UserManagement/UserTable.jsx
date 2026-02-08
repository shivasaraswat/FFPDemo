import React from 'react';
import { HiPencil, HiXCircle, HiCheckCircle, HiTrash } from 'react-icons/hi';

const UserTable = ({ users, roles, onEdit, onActivate, onDeactivate, onDelete }) => {
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary bg-bg-secondary rounded-lg border border-border">
        <p className="m-0 text-base font-medium">No users found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 max-md:overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-bg-secondary border-b border-border">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Name
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Email
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Role
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Language
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={`border-b border-gray-100 transition-colors duration-200 hover:bg-bg-secondary ${!user.isActive ? 'opacity-70 hover:opacity-100 hover:bg-yellow-50' : ''}`}>
              <td className="px-4 py-4 text-sm font-medium text-text-primary">{user.name}</td>
              <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{getRoleName(user.roleId)}</td>
              <td className="px-4 py-4 text-xs uppercase text-gray-500 font-medium">{user.language?.toUpperCase() || 'EN'}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{getStatusBadge(user.isActive)}</td>
              <td className="px-4 py-4 text-sm text-gray-700">
                <div className="flex gap-3 items-center">
                  <button
                    className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-blue-600"
                    onClick={() => onEdit(user)}
                    title="Edit"
                    aria-label="Edit user"
                  >
                    <HiPencil size={20} />
                  </button>
                  {user.isActive ? (
                    <button
                      className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-orange-600"
                      onClick={() => onDeactivate(user.id)}
                      title="Deactivate"
                      aria-label="Deactivate user"
                    >
                      <HiXCircle size={20} />
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-green-600"
                      onClick={() => onActivate(user.id)}
                      title="Activate"
                      aria-label="Activate user"
                    >
                      <HiCheckCircle size={20} />
                    </button>
                  )}
                  <button
                    className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-red-600"
                    onClick={() => onDelete(user.id)}
                    title="Delete"
                    aria-label="Delete user"
                  >
                    <HiTrash size={20} />
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

export default UserTable;
