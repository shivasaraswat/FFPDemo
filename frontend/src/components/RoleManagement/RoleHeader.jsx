import React from 'react';

const RoleHeader = ({ role }) => {
  return (
    <th className="px-4 py-4 bg-bg-secondary border-b border-border text-left">
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm text-gray-800" title={role.name}>
          {role.name.length > 15 ? `${role.name.substring(0, 15)}...` : role.name}
        </span>
        <div className="flex gap-2">
          <span className="text-xs text-gray-600 font-medium">Full Access</span>
          <span className="text-xs text-gray-600 font-medium">Read Only</span>
        </div>
      </div>
    </th>
  );
};

export default RoleHeader;


