import React from 'react';
import './PermissionCheckbox.css';

const PermissionCheckbox = ({ checked, onChange }) => {
  return (
    <label className="permission-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark"></span>
    </label>
  );
};

export default PermissionCheckbox;


