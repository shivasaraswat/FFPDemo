import React, { useState } from 'react';
import '../../pages/Common.css';

const AddRoleModal = ({ isOpen, onClose, onSave, loading }) => {
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!roleName.trim()) {
      newErrors.roleName = 'Role name is required';
    }
    if (!roleCode.trim()) {
      newErrors.roleCode = 'Role code is required';
    } else if (!/^[A-Z_][A-Z0-9_]*$/.test(roleCode.toUpperCase())) {
      newErrors.roleCode = 'Role code must contain only uppercase letters, numbers, and underscores';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format role code
    const formattedCode = roleCode.toUpperCase().replace(/\s+/g, '_');
    
    // Call onSave callback
    onSave({
      name: roleName.trim(),
      code: formattedCode,
      description: ''
    });

    // Reset form
    setRoleName('');
    setRoleCode('');
    setErrors({});
  };

  const handleClose = () => {
    setRoleName('');
    setRoleCode('');
    setErrors({});
    onClose();
  };

  const handleRoleCodeChange = (e) => {
    const value = e.target.value;
    setRoleCode(value);
    // Clear error when user starts typing
    if (errors.roleCode) {
      setErrors({ ...errors, roleCode: '' });
    }
  };

  const handleRoleNameChange = (e) => {
    const value = e.target.value;
    setRoleName(value);
    // Clear error when user starts typing
    if (errors.roleName) {
      setErrors({ ...errors, roleName: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]" onClick={handleClose}>
      <div className="bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="m-0 text-2xl">Add New Role</h2>
          <button className="bg-transparent border-none text-3xl cursor-pointer text-gray-600 leading-none p-0 w-8 h-8 flex items-center justify-center hover:text-black transition-colors" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="roleName" className="block mb-2 font-medium text-gray-800">
              Role Name <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={handleRoleNameChange}
              placeholder="Enter role name (e.g., Administrator)"
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.roleName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={loading}
            />
            {errors.roleName && (
              <span className="block text-red-600 text-sm mt-1">{errors.roleName}</span>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="roleCode" className="block mb-2 font-medium text-gray-800">
              Role Code <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="text"
              id="roleCode"
              value={roleCode}
              onChange={handleRoleCodeChange}
              placeholder="Enter role code (e.g., ADMIN)"
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.roleCode ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={loading}
            />
            {errors.roleCode && (
              <span className="block text-red-600 text-sm mt-1">{errors.roleCode}</span>
            )}
            <small className="block text-gray-600 text-sm mt-1">
              Use uppercase letters, numbers, and underscores only
            </small>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-2.5 border-common rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 border-none rounded-lg bg-danger text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;

