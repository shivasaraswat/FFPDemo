import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

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

  // Initialize with empty form data
  const getInitialFormData = () => ({
    name: '',
    email: '',
    password: '',
    roleIds: [],
    nonRcGdRoleId: '',
    iamShortId: '',
    address: '',
    region: '',
    language: 'en'
  });

  const [formData, setFormData] = useState(() => getInitialFormData());
  const [errors, setErrors] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const isEditMode = !!user;

  useEffect(() => {
    // Always reset form first, then populate if editing
    if (user === null || user === undefined || !user.id) {
      // Reset form for new user - ensure all fields are completely empty
      // Use a fresh object to avoid any reference issues
      setFormData({
        name: '',
        email: '',
        password: '',
        roleIds: [],
        nonRcGdRoleId: '',
        iamShortId: '',
        address: '',
        region: '',
        language: 'en'
      });
      setShowPasswordField(true); // Show password field for new users
      setErrors({}); // Clear errors
    } else if (user && user.id) {
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
        iamShortId: user.iamShortId || user.ssoId || '',
        address: user.address || '',
        region: user.region || '',
        language: user.language || 'en'
      });
      setShowPasswordField(false); // Hide password field initially in edit mode
      setErrors({}); // Clear errors
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
        if (submitData[key] === '' && ['iamShortId', 'address'].includes(key)) {
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="m-0 text-gray-800 text-2xl">{isEditMode ? t('editUser') : t('addNewUser')}</h2>
          <button className="bg-transparent border-none text-3xl text-gray-600 cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-gray-100" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 text-gray-800 font-medium text-sm">{t('name')} *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.name ? 'border-danger bg-red-50' : 'border-gray-200'}`}
                placeholder={t('name')}
              />
              {errors.name && <span className="mt-1 text-sm text-danger">{errors.name}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-gray-800 font-medium text-sm">{t('email')} *</label>
              <input
                key={`email-${user?.id || 'new'}`}
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.email ? 'border-danger bg-red-50' : 'border-gray-200'}`}
                placeholder={t('email')}
                autoComplete="off"
              />
              {errors.email && <span className="mt-1 text-sm text-danger">{errors.email}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-800 font-medium text-sm">{t('roles')} *</label>
              {otherRoles.length > 0 && (
                <div className="mb-3">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{t('otherRoles')}:</label>
                  <select
                    value={formData.nonRcGdRoleId || ''}
                    onChange={(e) => handleChange('nonRcGdRoleId', e.target.value ? parseInt(e.target.value) : '')}
                    className={`w-full py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg-tertiary ${errors.roles ? 'border-danger bg-red-50' : 'border-gray-200'}`}
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
                    <small className="text-text-secondary mt-1 block text-sm">
                      Clear RC/GD roles to select other roles
                    </small>
                  )}
                </div>
              )}
              {rcGdRoles.length > 0 && (
                <div className="mb-3">
                  <label className="block mb-2 text-sm font-medium text-gray-700">{t('rcGdRoles')}:</label>
                  <div className="flex flex-col gap-2">
                    {rcGdRoles.map(role => (
                      <label key={role.id} className={`flex items-center gap-2 cursor-pointer ${formData.nonRcGdRoleId ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          checked={formData.roleIds.includes(role.id)}
                          onChange={(e) => handleRoleCheckboxChange(role.id, e.target.checked)}
                          disabled={!!formData.nonRcGdRoleId}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                  {formData.nonRcGdRoleId && (
                    <small className="text-text-secondary mt-1 block text-sm">
                      Clear other role selection to select RC/GD roles
                    </small>
                  )}
                </div>
              )}
              {errors.roles && <span className="mt-1 text-sm text-danger">{errors.roles}</span>}
            </div>
          </div>

          {(!isEditMode || showPasswordField) && (
            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="mb-2 text-gray-800 font-medium text-sm">
                {isEditMode ? t('newPassword') : `${t('password')} *`}
                {isEditMode && <span className="font-normal text-gray-600 ml-2 text-xs">({t('leaveBlankToKeepCurrent')})</span>}
              </label>
              <input
                key={`password-${user?.id || 'new'}`}
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.password ? 'border-danger bg-red-50' : 'border-gray-200'}`}
                placeholder={isEditMode ? t('enterNewPasswordOptional') : t('passwordMinLength')}
                autoComplete="new-password"
              />
              {errors.password && <span className="mt-1 text-sm text-danger">{errors.password}</span>}
            </div>
          )}

          {isEditMode && !showPasswordField && (
            <div className="flex flex-col mb-4">
              <button
                type="button"
                className="self-start px-4 py-2 text-sm text-primary border border-primary rounded-lg bg-transparent hover:bg-primary/10 transition-colors"
                onClick={() => setShowPasswordField(true)}
              >
                {t('changePassword')}
              </button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('optionalFields')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="language" className="mb-2 text-gray-800 font-medium text-sm">{t('language')}</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                <option value="en">English</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="iamShortId" className="mb-2 text-gray-800 font-medium text-sm">{t('iamShortId')}</label>
              <input
                id="iamShortId"
                type="text"
                value={formData.iamShortId}
                onChange={(e) => handleChange('iamShortId', e.target.value)}
                className="py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                placeholder={t('enterIamShortId')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="region" className="mb-2 text-gray-800 font-medium text-sm">
                {t('region')}
                {formData.roleIds.length > 0 && <span className="text-danger font-bold"> *</span>}
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.region ? 'border-danger bg-red-50' : 'border-gray-200'}`}
              >
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.region && <span className="mt-1 text-sm text-danger">{errors.region}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="address" className="mb-2 text-gray-800 font-medium text-sm">{t('address')}</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                placeholder={t('enterAddress')}
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="px-6 py-2.5 border-common rounded-lg font-semibold" onClick={onCancel}>
              {t('cancel')}
            </button>
            <button type="submit" className="px-6 py-2.5 border-none rounded-lg bg-danger text-white font-semibold cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg">
              {isEditMode ? t('updateUser') : t('createUser')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;


