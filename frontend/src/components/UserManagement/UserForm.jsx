import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import './UserForm.css';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  
  // Separate RC/GD roles from other roles
  const rcGdRoles = roles.filter(r => r.code === 'RC' || r.code === 'GD');
  const otherRoles = roles.filter(r => r.code !== 'RC' && r.code !== 'GD');

  // Region options for dropdown
  const regionOptions = [
    { value: '', label: 'Select a region' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia Pacific', label: 'Asia Pacific' },
    { value: 'Middle East', label: 'Middle East' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Japan', label: 'Japan' },
    { value: 'China', label: 'China' },
    { value: 'India', label: 'India' },
    { value: 'Southeast Asia', label: 'Southeast Asia' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Latin America', label: 'Latin America' },
    { value: 'Other', label: 'Other' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [], // For RC/GD roles (multi-select)
    nonRcGdRoleId: '', // For other roles (single select)
    mobile: '',
    iamShortId: '',
    address: '',
    region: '',
    language: 'en' // Default language
  });
  const [errors, setErrors] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      // Extract roles from user object
      // Handle both array format and single role format
      let userRoles = [];
      if (Array.isArray(user.roles)) {
        userRoles = user.roles;
      } else if (user.roleId && user.roleName && user.roleCode) {
        // Handle case where roles come as single role object from getAll
        userRoles = [{
          id: user.roleId,
          name: user.roleName,
          code: user.roleCode
        }];
      }
      
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
        mobile: user.mobile || '',
        iamShortId: user.iamShortId || user.ssoId || '',
        address: user.address || '',
        region: user.region || '',
        language: user.language || 'en'
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        roleIds: [],
        nonRcGdRoleId: '',
        mobile: '',
        iamShortId: '',
        address: '',
        region: '',
        language: 'en'
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

    // Validate at least one role is selected (mutually exclusive)
    if (formData.roleIds.length === 0 && !formData.nonRcGdRoleId) {
      newErrors.roles = 'At least one role is required';
    }
    
    // Ensure mutual exclusivity - user should not have both types selected
    if (formData.roleIds.length > 0 && formData.nonRcGdRoleId) {
      newErrors.roles = 'Please select either other roles OR RC/GD roles, not both';
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
        if (submitData[key] === '' && ['mobile', 'iamShortId', 'address'].includes(key)) {
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
    let updatedFormData = { ...formData, [field]: value };
    
    // Make role selection mutually exclusive
    if (field === 'nonRcGdRoleId') {
      // If user selects an "other role", clear RC/GD checkboxes
      if (value) {
        updatedFormData.roleIds = [];
        // Clear region since it's only required for RC/GD
        updatedFormData.region = '';
      }
    } else if (field === 'roleIds') {
      // If user selects RC/GD checkboxes, clear "other role" dropdown
      if (value.length > 0) {
        updatedFormData.nonRcGdRoleId = '';
      }
    }
    
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
    // handleChange will automatically clear nonRcGdRoleId when roleIds is set
    handleChange('roleIds', currentRoleIds);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content user-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? t('editUser') : t('addNewUser')}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">{t('name')} *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder={t('name')}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('email')} *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder={t('email')}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('roles')} *</label>
              {otherRoles.length > 0 && (
                <div className="role-selection-group">
                  <label className="role-group-label">{t('otherRoles')}:</label>
                  <select
                    value={formData.nonRcGdRoleId || ''}
                    onChange={(e) => handleChange('nonRcGdRoleId', e.target.value ? parseInt(e.target.value) : '')}
                    className={errors.roles ? 'error' : ''}
                    disabled={formData.roleIds.length > 0}
                  >
                    <option value="">Select a role</option>
                    {otherRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {formData.roleIds.length > 0 && (
                    <small className="field-hint" style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                      Clear RC/GD roles to select other roles
                    </small>
                  )}
                </div>
              )}
              {rcGdRoles.length > 0 && (
                <div className="role-selection-group">
                  <label className="role-group-label">{t('rcGdRoles')}:</label>
                  <div className="checkbox-group">
                    {rcGdRoles.map(role => (
                      <label key={role.id} className="checkbox-label" style={{ opacity: formData.nonRcGdRoleId ? 0.5 : 1 }}>
                        <input
                          type="checkbox"
                          checked={formData.roleIds.includes(role.id)}
                          onChange={(e) => handleRoleCheckboxChange(role.id, e.target.checked)}
                          disabled={!!formData.nonRcGdRoleId}
                        />
                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.nonRcGdRoleId && (
                    <small className="field-hint" style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                      Clear other role selection to select RC/GD roles
                    </small>
                  )}
                </div>
              )}
              {errors.roles && <span className="error-message">{errors.roles}</span>}
            </div>

          </div>

          {(!isEditMode || showPasswordField) && (
            <div className="form-group">
              <label htmlFor="password">
                {isEditMode ? t('newPassword') : `${t('password')} *`}
                {isEditMode && <span className="field-hint">({t('leaveBlankToKeepCurrent')})</span>}
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder={isEditMode ? t('enterNewPasswordOptional') : t('passwordMinLength')}
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
                {t('changePassword')}
              </button>
            </div>
          )}

          <div className="form-section-divider">
            <span>{t('optionalFields')}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">{t('language')}</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mobile">{t('mobile')}</label>
              <input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder={t('enterMobileNumber')}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="iamShortId">{t('iamShortId')}</label>
              <input
                id="iamShortId"
                type="text"
                value={formData.iamShortId}
                onChange={(e) => handleChange('iamShortId', e.target.value)}
                placeholder={t('enterIamShortId')}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">
                {t('region')}
                {formData.roleIds.length > 0 && <span className="required-asterisk"> *</span>}
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className={errors.region ? 'error' : ''}
              >
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.region && <span className="error-message">{errors.region}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">{t('address')}</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder={t('enterAddress')}
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              {t('cancel')}
            </button>
            <button type="submit" className="submit-button">
              {isEditMode ? t('updateUser') : t('createUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;


