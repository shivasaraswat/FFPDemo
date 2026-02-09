import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// MultiSelect Component with Chips
const MultiSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  error,
  getOptionLabel = (opt) => opt.label || opt
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedValues = Array.isArray(value) ? value : [];
  
  const filteredOptions = options.filter(opt => {
    const label = typeof opt === 'string' ? opt : (opt.label || opt.value || '');
    return label.toLowerCase().includes(searchTerm.toLowerCase()) && 
           !selectedValues.includes(typeof opt === 'string' ? opt : opt.value);
  });

  const handleSelect = (optionValue) => {
    if (!selectedValues.includes(optionValue)) {
      onChange([...selectedValues, optionValue]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemove = (valueToRemove) => {
    onChange(selectedValues.filter(v => v !== valueToRemove));
  };

  const getDisplayLabel = (val) => {
    const option = options.find(opt => {
      const optValue = typeof opt === 'string' ? opt : opt.value;
      return optValue === val;
    });
    if (typeof option === 'string') return option;
    return option?.label || option?.value || val;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`min-h-[42px] border-2 rounded-lg px-3 py-1.5 cursor-text bg-bg-secondary transition-all duration-300 ${
          error ? 'border-danger bg-red-50' : 'border-gray-200'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-bg-tertiary' : 'hover:border-gray-300 hover:bg-white focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10'}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {selectedValues.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
            >
              {getDisplayLabel(val)}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(val);
                  }}
                  className="text-red-500 hover:text-red-700 focus:outline-none ml-0.5"
                >
                  <span className="text-xs font-bold leading-none">×</span>
                </button>
              )}
            </span>
          ))}
          <input
            type="text"
            placeholder={selectedValues.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            disabled={disabled}
            className="flex-1 outline-none bg-transparent text-sm text-gray-500 placeholder-gray-400 min-w-[120px]"
          />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .multi-select-dropdown::-webkit-scrollbar {
              display: none !important;
            }
          `}</style>
          <div className="multi-select-dropdown">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optValue = typeof option === 'string' ? option : option.value;
                const optLabel = typeof option === 'string' ? option : (option.label || option.value);
                return (
                  <div
                    key={index}
                    onClick={() => handleSelect(optValue)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors"
                  >
                    {optLabel}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                {searchTerm ? 'No options found' : 'No available options'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  
  // Separate RC/GD roles from other roles
  const rcGdRoles = roles.filter(r => r.code === 'RC' || r.code === 'GD');
  const otherRoles = roles.filter(r => r.code !== 'RC' && r.code !== 'GD');

  // Region options for dropdown - only 4 regions
  const regionOptions = [
    { value: '', label: 'Select a region' },
    { value: 'North America', label: 'North America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia Pacific', label: 'Asia Pacific' },
    { value: 'Middle East', label: 'Middle East' }
  ];

  // Country options based on region
  const getCountriesByRegion = (region) => {
    const countryMap = {
      'North America': [
        { value: '', label: 'Select a country' },
        { value: 'USA', label: 'United States' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Mexico', label: 'Mexico' }
      ],
      'Europe': [
        { value: '', label: 'Select a country' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Italy', label: 'Italy' },
        { value: 'Spain', label: 'Spain' }
      ],
      'Asia Pacific': [
        { value: '', label: 'Select a country' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
        { value: 'India', label: 'India' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Singapore', label: 'Singapore' },
        { value: 'South Korea', label: 'South Korea' }
      ],
      'Middle East': [
        { value: '', label: 'Select a country' },
        { value: 'UAE', label: 'United Arab Emirates' },
        { value: 'Saudi Arabia', label: 'Saudi Arabia' },
        { value: 'Qatar', label: 'Qatar' },
        { value: 'Kuwait', label: 'Kuwait' }
      ]
    };
    return countryMap[region] || [];
  };

  // GD Code options based on country (supports multiple countries)
  const getGdCodesByCountry = (countries) => {
    const gdCodeMap = {
      'USA': ['GD001', 'GD002', 'GD003'],
      'Canada': ['GD010', 'GD011'],
      'Mexico': ['GD020'],
      'UK': ['GD100', 'GD101', 'GD102'],
      'Germany': ['GD110', 'GD111'],
      'France': ['GD120'],
      'Italy': ['GD130'],
      'Spain': ['GD140'],
      'Japan': ['GD200', 'GD201', 'GD202', 'GD203'],
      'China': ['GD210', 'GD211'],
      'India': ['GD220', 'GD221', 'GD222'],
      'Australia': ['GD230'],
      'Singapore': ['GD240'],
      'South Korea': ['GD250'],
      'UAE': ['GD300', 'GD301'],
      'Saudi Arabia': ['GD310'],
      'Qatar': ['GD320'],
      'Kuwait': ['GD330']
    };
    
    // If countries is an array, get all GD codes for all selected countries
    if (Array.isArray(countries) && countries.length > 0) {
      const allCodes = [];
      countries.forEach(country => {
        if (gdCodeMap[country]) {
          allCodes.push(...gdCodeMap[country]);
        }
      });
      // Remove duplicates and sort
      return [...new Set(allCodes)].sort();
    }
    
    // Fallback for single country (backward compatibility)
    if (typeof countries === 'string' && countries) {
      return gdCodeMap[countries] || [];
    }
    
    return [];
  };

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
    country: [],
    gdCode: [],
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
        country: [],
        gdCode: [],
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
        country: Array.isArray(user.country) ? user.country : (user.country ? [user.country] : []),
        gdCode: Array.isArray(user.gdCode) ? user.gdCode : (user.gdCode ? [user.gdCode] : []),
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

    // Check if RC or GD roles are selected
    const selectedRcGdRoles = rcGdRoles.filter(r => formData.roleIds.includes(r.id));
    const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
    const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
    const hasRcOrGd = hasRcRole || hasGdRole;

    // Validate region is required for RC and GD roles
    if (hasRcOrGd) {
      if (!formData.region || !formData.region.trim()) {
        newErrors.region = 'Region is required for RC and GD users';
      }
    }

    // Validate country and GD Code for GD role (or when both RC and GD are selected - follow GD behavior)
    if (hasGdRole || (hasRcRole && hasGdRole)) {
      if (!formData.country || !Array.isArray(formData.country) || formData.country.length === 0) {
        newErrors.country = 'At least one country is required for GD users';
      }
      if (!formData.gdCode || !Array.isArray(formData.gdCode) || formData.gdCode.length === 0) {
        newErrors.gdCode = 'At least one GD Code is required for GD users';
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
      
      // Check if country and gdCode are required (for GD role)
      const selectedRcGdRoles = rcGdRoles.filter(r => submitData.roleIds.includes(r.id));
      const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
      const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
      const isRegionRequired = submitData.roleIds.length > 0;
      const isCountryRequired = hasGdRole || (hasRcRole && hasGdRole);
      
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' && ['iamShortId', 'address'].includes(key)) {
          delete submitData[key];
        }
        // Remove region only if it's empty and not required
        if (key === 'region' && submitData[key] === '' && !isRegionRequired) {
          delete submitData[key];
        }
        // Remove country and gdCode only if they're empty and not required
        if (key === 'country' && (!Array.isArray(submitData[key]) || submitData[key].length === 0) && !isCountryRequired) {
          delete submitData[key];
        }
        if (key === 'gdCode' && (!Array.isArray(submitData[key]) || submitData[key].length === 0) && !isCountryRequired) {
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
        // Clear region, country, and gdCode since they're only required for RC/GD
        updatedFormData.region = '';
        updatedFormData.country = [];
        updatedFormData.gdCode = [];
      }
    } else if (field === 'roleIds') {
      // If user selects RC/GD checkboxes, clear "other role" dropdown
      if (value.length > 0) {
        updatedFormData.nonRcGdRoleId = '';
      } else {
        // If no RC/GD roles selected, clear region, country, and gdCode
        updatedFormData.region = '';
        updatedFormData.country = [];
        updatedFormData.gdCode = [];
      }
    }
    
    // Handle region change - reset country and gdCode when region changes
    if (field === 'region') {
      updatedFormData.country = [];
      updatedFormData.gdCode = [];
    }
    
    // Handle country change - reset gdCode when country changes
    if (field === 'country') {
      updatedFormData.gdCode = [];
    }
    
    setFormData(updatedFormData);
    
    // Clear error for the changed field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    // Validate requirements when RC/GD roles change
    if (field === 'roleIds') {
      const selectedRcGdRoles = rcGdRoles.filter(r => value.includes(r.id));
      const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
      const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
      const hasRcOrGd = hasRcRole || hasGdRole;
      
      if (hasRcOrGd) {
        if (!updatedFormData.region || !updatedFormData.region.trim()) {
          setErrors({ ...errors, region: 'Region is required for RC and GD users' });
        } else {
          const newErrors = { ...errors };
          delete newErrors.region;
          setErrors(newErrors);
        }
        
        // For GD role (or both RC and GD), validate country and gdCode
        if (hasGdRole || (hasRcRole && hasGdRole)) {
          if (!updatedFormData.country || !Array.isArray(updatedFormData.country) || updatedFormData.country.length === 0) {
            setErrors({ ...errors, country: 'At least one country is required for GD users' });
          }
          if (!updatedFormData.gdCode || !Array.isArray(updatedFormData.gdCode) || updatedFormData.gdCode.length === 0) {
            setErrors({ ...errors, gdCode: 'At least one GD Code is required for GD users' });
          }
        }
      } else {
        // Clear all RC/GD related errors if no RC/GD roles selected
        const newErrors = { ...errors };
        delete newErrors.region;
        delete newErrors.country;
        delete newErrors.gdCode;
        setErrors(newErrors);
      }
    }
    
    // If region changed and RC/GD roles are selected, clear error
    if (field === 'region' && updatedFormData.roleIds.length > 0) {
      const selectedRcGdRoles = rcGdRoles.filter(r => updatedFormData.roleIds.includes(r.id));
      const hasRcOrGd = selectedRcGdRoles.length > 0;
      if (hasRcOrGd && value && value.trim()) {
        const newErrors = { ...errors };
        delete newErrors.region;
        setErrors(newErrors);
      }
    }
    
    // If country changed and GD role is selected, clear error
    if (field === 'country' && Array.isArray(value) && value.length > 0) {
      const selectedRcGdRoles = rcGdRoles.filter(r => updatedFormData.roleIds.includes(r.id));
      const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
      const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
      if (hasGdRole || (hasRcRole && hasGdRole)) {
        const newErrors = { ...errors };
        delete newErrors.country;
        setErrors(newErrors);
      }
    }
    
    // If gdCode changed and GD role is selected, clear error
    if (field === 'gdCode' && Array.isArray(value) && value.length > 0) {
      const selectedRcGdRoles = rcGdRoles.filter(r => updatedFormData.roleIds.includes(r.id));
      const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
      const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
      if (hasGdRole || (hasRcRole && hasGdRole)) {
        const newErrors = { ...errors };
        delete newErrors.gdCode;
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
      <div className="bg-white rounded-lg w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-lg user-form-modal" onClick={(e) => e.stopPropagation()} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .user-form-modal {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .user-form-modal::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .user-form-modal select[multiple],
          .user-form-modal .country-select,
          .user-form-modal .gd-code-select {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .user-form-modal select[multiple]::-webkit-scrollbar,
          .user-form-modal .country-select::-webkit-scrollbar,
          .user-form-modal .gd-code-select::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        `}</style>
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
                {(() => {
                  const selectedRcGdRoles = rcGdRoles.filter(r => formData.roleIds.includes(r.id));
                  const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
                  const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
                  return (hasRcRole || hasGdRole) && <span className="text-danger font-bold"> *</span>;
                })()}
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

          {/* Country and GD Code fields - shown only for GD role (or when both RC and GD are selected) */}
          {(() => {
            const selectedRcGdRoles = rcGdRoles.filter(r => formData.roleIds.includes(r.id));
            const hasGdRole = selectedRcGdRoles.some(r => r.code === 'GD');
            const hasRcRole = selectedRcGdRoles.some(r => r.code === 'RC');
            const showGdFields = hasGdRole || (hasRcRole && hasGdRole);
            
            if (!showGdFields) return null;
            
            const countryOptions = getCountriesByRegion(formData.region);
            const gdCodeOptions = getGdCodesByCountry(formData.country);
            
            return (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="country" className="mb-2 text-gray-800 font-medium text-sm">
                    Country <span className="text-danger font-bold">*</span>
                  </label>
                  <MultiSelect
                    options={countryOptions.filter(opt => opt.value !== '')}
                    value={Array.isArray(formData.country) ? formData.country : []}
                    onChange={(selected) => handleChange('country', selected)}
                    placeholder="Select Country"
                    disabled={!formData.region || !formData.region.trim()}
                    error={errors.country}
                    getOptionLabel={(opt) => opt.label || opt.value}
                  />
                  {errors.country && <span className="mt-1 text-sm text-danger">{errors.country}</span>}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="gdCode" className="mb-2 text-gray-800 font-medium text-sm">
                    GD Code <span className="text-danger font-bold">*</span>
                  </label>
                  <MultiSelect
                    options={gdCodeOptions.map(code => ({ value: code, label: code }))}
                    value={Array.isArray(formData.gdCode) ? formData.gdCode : []}
                    onChange={(selected) => handleChange('gdCode', selected)}
                    placeholder="Select GD Code"
                    disabled={!formData.country || !Array.isArray(formData.country) || formData.country.length === 0}
                    error={errors.gdCode}
                    getOptionLabel={(opt) => opt.label || opt.value || opt}
                  />
                  {errors.gdCode && <span className="mt-1 text-sm text-danger">{errors.gdCode}</span>}
                </div>
              </div>
            );
          })()}

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


