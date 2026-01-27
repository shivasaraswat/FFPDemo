import React, { useState } from 'react';
import './AddRoleModal.css';

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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Role</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="roleName">
              Role Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={handleRoleNameChange}
              placeholder="Enter role name (e.g., Administrator)"
              className={errors.roleName ? 'error' : ''}
              disabled={loading}
            />
            {errors.roleName && (
              <span className="error-message">{errors.roleName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="roleCode">
              Role Code <span className="required">*</span>
            </label>
            <input
              type="text"
              id="roleCode"
              value={roleCode}
              onChange={handleRoleCodeChange}
              placeholder="Enter role code (e.g., ADMIN)"
              className={errors.roleCode ? 'error' : ''}
              disabled={loading}
            />
            {errors.roleCode && (
              <span className="error-message">{errors.roleCode}</span>
            )}
            <small className="form-hint">
              Use uppercase letters, numbers, and underscores only
            </small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
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

