import React from 'react';

const PermissionCheckbox = ({ checked, onChange, label }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="relative">
        <div className={`w-10 h-5 rounded-full transition-all duration-200 ease-in-out ${
          checked 
            ? 'bg-[#ff3b3b] shadow-inner' 
            : 'bg-gray-300'
        } group-hover:shadow-md`}>
          <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-md transition-all duration-200 ease-in-out transform ${
            checked 
              ? 'translate-x-5' 
              : 'translate-x-0'
          } group-hover:shadow-lg`}></div>
        </div>
      </div>
      {label && (
        <span className="ml-2 text-xs text-gray-600 font-medium">{label}</span>
      )}
    </label>
  );
};

export default PermissionCheckbox;


