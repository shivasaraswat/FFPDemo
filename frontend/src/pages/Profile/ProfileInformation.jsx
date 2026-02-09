import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import './ProfileInformation.css';

const ProfileInformation = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const initialFormData = {
    name: user?.name || '',
    email: user?.email || '',
    iamShortId: user?.iamShortId || user?.ssoId || '',
    address: user?.address || '',
    language: user?.language || 'en',
    region: user?.region || '',
    roles: user?.roles || []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalFormData, setOriginalFormData] = useState(initialFormData);

  // Update form data when user changes
  useEffect(() => {
    const newFormData = {
      name: user?.name || '',
      email: user?.email || '',
      iamShortId: user?.iamShortId || user?.ssoId || '',
      address: user?.address || '',
      language: user?.language || 'en',
      region: user?.region || '',
      roles: user?.roles || []
    };
    setFormData(newFormData);
    setOriginalFormData(newFormData);
  }, [user]);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'YY';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any previous messages when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleCancel = () => {
    setFormData(originalFormData);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setMessage({ type: 'error', text: 'Name is required' });
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setMessage({ type: 'error', text: 'Email Address is required' });
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        setLoading(false);
        return;
      }

      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        iamShortId: formData.iamShortId.trim() || null,
        address: formData.address.trim() || null,
        language: formData.language || 'en',
        region: formData.region.trim() || null
      };

      // Call API to update user
      const updatedUser = await userService.update(user.id, updateData);

      // Update user in context and localStorage
      const updatedUserData = {
        ...user,
        ...updateData,
        name: updateData.name,
        email: updateData.email,
        iamShortId: updateData.iamShortId,
        ssoId: updateData.iamShortId,
        address: updateData.address,
        language: updateData.language,
        region: updateData.region
      };
      
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setOriginalFormData(formData);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-sidebar">
        <div className="settings-header">SETTINGS</div>
        <nav className="settings-nav">
          <div className="settings-nav-item active">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M3 18C3 14 6 11 10 11C14 11 17 14 17 18" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Profile</span>
          </div>
          <div className="settings-nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C8.34 2 7 3.34 7 5V8C7 9.1 6.55 10.1 5.8 10.8L5 11.6V13H15V11.6L14.2 10.8C13.45 10.1 13 9.1 13 8V5C13 3.34 11.66 2 10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M8 13V14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14V13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Notifications</span>
          </div>
          <div className="settings-nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M10 2L10 6M10 14L10 18M2 10L6 10M14 10L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Regional Settings</span>
          </div>
          <div className="settings-nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="8" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M6 8V5C6 3.34 7.34 2 9 2H11C12.66 2 14 3.34 14 5V8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Security & Privacy</span>
          </div>
          <div className="settings-nav-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M7 7H13M7 10H13M7 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Data Management</span>
          </div>
        </nav>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <h1>Profile Information</h1>
          <p>Update your personal information and profile details</p>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-picture-section">
            <div className="avatar-container">
              <div className="profile-avatar">
                {getInitials(user?.name || 'User')}
              </div>
              <div className="camera-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M2 15V5C2 3.89543 2.89543 3 4 3H5.58579C5.851 3 6.10536 2.89464 6.29289 2.70711L7.70711 1.29289C7.89464 1.10536 8.149 1 8.41421 1H11.5858C11.851 1 12.1054 1.10536 12.2929 1.29289L13.7071 2.70711C13.8946 2.89464 14.149 3 14.4142 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15Z" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>
            <div className="avatar-actions">
              <button type="button" className="change-photo-btn">Change Photo</button>
              <button type="button" className="remove-photo-btn">Remove</button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roles">Roles</label>
              <input
                id="roles"
                type="text"
                value={Array.isArray(formData.roles) && formData.roles.length > 0 
                  ? formData.roles.map(r => r.name || r).join(', ') 
                  : 'No roles assigned'}
                readOnly
                disabled
                className="role-input"
              />
              <p className="role-hint">Role based permissions are locked by administrator</p>
            </div>
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                disabled={!formData.roles.some(r => r.code === 'RC' || r.code === 'GD')}
              >
                <option value="">Select a region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="Middle East">Middle East</option>
              </select>
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows="3"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="profile-cancel-btn"
              onClick={handleCancel} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="profile-save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
              <span style={{ color: '#D80C0C' }}>›</span>
            </button>
          </div>
          <style>{`
            .profile-form .profile-cancel-btn {
              border: 2px solid #d1d5db !important;
              background: #ffffff !important;
              color: #6b7280 !important;
            }
            .profile-form .profile-save-btn {
              border: 2px solid #D80C0C !important;
              background: #ffffff !important;
              color: #D80C0C !important;
            }
            .profile-form .profile-save-btn:hover:not(:disabled) {
              background: #fff3f3 !important;
            }
            .profile-form .profile-cancel-btn:hover:not(:disabled) {
              background: #f9fafb !important;
            }
          `}</style>
        </form>
      </div>
    </div>
  );
};

export default ProfileInformation;

