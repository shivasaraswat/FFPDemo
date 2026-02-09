import React from 'react';

const RoleHeader = ({ role }) => {
  return (
    <th className="px-4 py-4 bg-bg-secondary border-b border-gray-200 text-left">
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider" title={role.name}>
          {role.name.length > 20 ? `${role.name.substring(0, 20)}...` : role.name}
        </span>
        <div className="flex gap-8 justify-center">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide whitespace-nowrap">Full</span>
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide whitespace-nowrap">Read</span>
        </div>
      </div>
    </th>
  );
};

export default RoleHeader;


