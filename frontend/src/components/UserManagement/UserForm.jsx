import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    language: 'en',
    classification: '',
    username: '',
    mobile: '',
    iamShortId: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password in edit mode
        roleId: user.roleId || '',
        language: user.language || 'en',
        classification: user.classification || '',
        username: user.username || '',
        mobile: user.mobile || '',
        iamShortId: user.iamShortId || '',
        address: user.address || ''
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        roleId: '',
        language: 'en',
        classification: '',
        username: '',
        mobile: '',
        iamShortId: '',
        address: ''
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

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      
      // Remove password if not provided in edit mode
      if (isEditMode && !showPasswordField) {
        delete submitData.password;
      }
      
      // Remove empty optional fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' && ['classification', 'username', 'mobile', 'iamShortId', 'address'].includes(key)) {
          delete submitData[key];
        }
      });

      onSubmit(submitData);
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
              <label htmlFor="roleId">Role *</label>
              <select
                id="roleId"
                value={formData.roleId}
                onChange={(e) => handleChange('roleId', parseInt(e.target.value))}
                className={errors.roleId ? 'error' : ''}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && <span className="error-message">{errors.roleId}</span>}
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


