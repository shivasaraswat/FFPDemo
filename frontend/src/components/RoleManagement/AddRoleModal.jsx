import React, { useState, useEffect } from 'react';
import '../../pages/Common.css';
import { roleService } from '../../services/roleService';

const AddRoleModal = ({ isOpen, onClose, onSave, loading }) => {
  const [roleName, setRoleName] = useState('');
  const [referenceRoleId, setReferenceRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    try {
      const rolesData = await roleService.getAll();
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!roleName.trim()) {
      newErrors.roleName = 'Role name is required';
    }
    if (!referenceRoleId) {
      newErrors.referenceRoleId = 'Reference role is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call onSave callback
    onSave({
      name: roleName.trim(),
      referenceRoleId: parseInt(referenceRoleId),
      description: ''
    });

    // Reset form
    setRoleName('');
    setReferenceRoleId('');
    setErrors({});
  };

  const handleClose = () => {
    setRoleName('');
    setReferenceRoleId('');
    setErrors({});
    onClose();
  };

  const handleReferenceRoleChange = (e) => {
    const value = e.target.value;
    setReferenceRoleId(value);
    // Clear error when user selects
    if (errors.referenceRoleId) {
      setErrors({ ...errors, referenceRoleId: '' });
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
      <div className="bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-lg add-role-modal" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .add-role-modal .modal-cancel-btn {
            border: 2px solid #d1d5db !important;
          }
          .add-role-modal .modal-submit-btn {
            border: 2px solid #D80C0C !important;
          }
        `}</style>
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
            <label htmlFor="referenceRoleId" className="block mb-2 font-medium text-gray-800">
              Reference Role <span className="text-red-600 font-bold">*</span>
            </label>
            <select
              id="referenceRoleId"
              value={referenceRoleId}
              onChange={handleReferenceRoleChange}
              className={`w-full py-3 px-3 border rounded-md text-base box-border focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.referenceRoleId ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed appearance-none bg-white`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
              disabled={loading}
            >
              <option value="">Select a reference role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.referenceRoleId && (
              <span className="block text-red-600 text-sm mt-1">{errors.referenceRoleId}</span>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="modal-cancel-btn px-6 py-2.5 rounded-lg font-semibold bg-white text-gray-500 cursor-pointer transition-all duration-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-btn px-6 py-2.5 rounded-lg font-semibold bg-white cursor-pointer transition-all duration-300 hover:bg-red-50 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ color: '#D80C0C' }}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Role'}
              <span style={{ color: '#D80C0C' }}>›</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;

