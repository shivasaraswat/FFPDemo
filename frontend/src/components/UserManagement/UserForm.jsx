import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  // Separate RC/GD roles from other roles
  const rcGdRoles = roles.filter(r => r.code === 'RC' || r.code === 'GD');
  const otherRoles = roles.filter(r => r.code !== 'RC' && r.code !== 'GD');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [], // For RC/GD roles (multi-select)
    nonRcGdRoleId: '', // For other roles (single select)
    language: 'en',
    classification: '',
    username: '',
    mobile: '',
    iamShortId: '',
    address: '',
    region: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      // Extract roles from user object
      const userRoles = user.roles || [];
      const userRcGdRoleIds = userRoles
        .filter(r => r.code === 'RC' || r.code === 'GD')
        .map(r => r.id);
      const userOtherRole = userRoles.find(r => r.code !== 'RC' && r.code !== 'GD');
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password in edit mode
        roleIds: userRcGdRoleIds,
        nonRcGdRoleId: userOtherRole ? userOtherRole.id : '',
        language: user.language || 'en',
        classification: user.classification || '',
        username: user.username || '',
        mobile: user.mobile || '',
        iamShortId: user.iamShortId || user.ssoId || '',
        address: user.address || '',
        region: user.region || ''
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        roleIds: [],
        nonRcGdRoleId: '',
        language: 'en',
        classification: '',
        username: '',
        mobile: '',
        iamShortId: '',
        address: '',
        region: ''
      });
      setShowPasswordField(true); // Show password field for new users
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password required only for new users or if user wants to change it
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate at least one role is selected
    if (formData.roleIds.length === 0 && !formData.nonRcGdRoleId) {
      newErrors.roles = 'At least one role is required';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    // Validate region is required for RC and GD roles
    if (formData.roleIds.length > 0) {
      if (!formData.region || !formData.region.trim()) {
        newErrors.region = 'Region is required for RC and GD users';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      
      // Combine roleIds and nonRcGdRoleId into roleIds array
      const allRoleIds = [...submitData.roleIds];
      if (submitData.nonRcGdRoleId) {
        allRoleIds.push(submitData.nonRcGdRoleId);
      }
      submitData.roleIds = allRoleIds;
      
      // Remove nonRcGdRoleId (not needed in API)
      delete submitData.nonRcGdRoleId;
      
      // Remove password if not provided in edit mode
      if (isEditMode && !showPasswordField) {
        delete submitData.password;
      }
      
      // Remove empty optional fields (but keep region if RC/GD roles are selected)
      const isRegionRequired = submitData.roleIds.length > 0;
      
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' && ['classification', 'username', 'mobile', 'iamShortId', 'address'].includes(key)) {
          delete submitData[key];
        }
        // Remove region only if it's empty and not required
        if (key === 'region' && submitData[key] === '' && !isRegionRequired) {
          delete submitData[key];
        }
        // Remove empty roleIds array
        if (key === 'roleIds' && Array.isArray(submitData[key]) && submitData[key].length === 0) {
          delete submitData[key];
        }
      });

      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    
    // Clear error for the changed field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // If RC/GD roles changed, validate region requirement
    if (field === 'roleIds') {
      if (value.length > 0) {
        if (!updatedFormData.region || !updatedFormData.region.trim()) {
          setErrors({ ...errors, region: 'Region is required for RC and GD users' });
        } else {
          const newErrors = { ...errors };
          delete newErrors.region;
          setErrors(newErrors);
        }
      } else {
        // Clear region error if no RC/GD roles selected
        const newErrors = { ...errors };
        delete newErrors.region;
        setErrors(newErrors);
      }
    }
    
    // If region changed and RC/GD roles are selected, clear error
    if (field === 'region' && updatedFormData.roleIds.length > 0) {
      if (value && value.trim()) {
        const newErrors = { ...errors };
        delete newErrors.region;
        setErrors(newErrors);
      }
    }
  };

  const handleRoleCheckboxChange = (roleId, checked) => {
    const currentRoleIds = [...formData.roleIds];
    if (checked) {
      currentRoleIds.push(roleId);
    } else {
      const index = currentRoleIds.indexOf(roleId);
      if (index > -1) {
        currentRoleIds.splice(index, 1);
      }
    }
    handleChange('roleIds', currentRoleIds);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="user@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Roles *</label>
              {otherRoles.length > 0 && (
                <div className="role-selection-group">
                  <label className="role-group-label">Other Roles (Select One):</label>
                  <select
                    value={formData.nonRcGdRoleId}
                    onChange={(e) => handleChange('nonRcGdRoleId', e.target.value ? parseInt(e.target.value) : '')}
                    className={errors.roles ? 'error' : ''}
                  >
                    <option value="">Select a role</option>
                    {otherRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {rcGdRoles.length > 0 && (
                <div className="role-selection-group">
                  <label className="role-group-label">RC / GD Roles (Can Select Both):</label>
                  <div className="checkbox-group">
                    {rcGdRoles.map(role => (
                      <label key={role.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.roleIds.includes(role.id)}
                          onChange={(e) => handleRoleCheckboxChange(role.id, e.target.checked)}
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {errors.roles && <span className="error-message">{errors.roles}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="language">Language *</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className={errors.language ? 'error' : ''}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
              {errors.language && <span className="error-message">{errors.language}</span>}
            </div>
          </div>

          {(!isEditMode || showPasswordField) && (
            <div className="form-group">
              <label htmlFor="password">
                {isEditMode ? 'New Password' : 'Password *'}
                {isEditMode && <span className="field-hint">(Leave blank to keep current password)</span>}
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder={isEditMode ? "Enter new password (optional)" : "Minimum 6 characters"}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          )}

          {isEditMode && !showPasswordField && (
            <div className="form-group">
              <button
                type="button"
                className="change-password-button"
                onClick={() => setShowPasswordField(true)}
              >
                Change Password
              </button>
            </div>
          )}

          <div className="form-section-divider">
            <span>Optional Fields</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile</label>
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="classification">Classification</label>
              <input
                id="classification"
                type="text"
                value={formData.classification}
                onChange={(e) => handleChange('classification', e.target.value)}
                placeholder="Enter classification"
              />
            </div>

            <div className="form-group">
              <label htmlFor="iamShortId">IAM Short ID</label>
              <input
                id="iamShortId"
                type="text"
                value={formData.iamShortId}
                onChange={(e) => handleChange('iamShortId', e.target.value)}
                placeholder="Enter IAM Short ID"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">
                Region
                {formData.roleIds.length > 0 && <span className="required-asterisk"> *</span>}
              </label>
              <input
                id="region"
                type="text"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className={errors.region ? 'error' : ''}
                placeholder="Enter region"
              />
              {errors.region && <span className="error-message">{errors.region}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;


