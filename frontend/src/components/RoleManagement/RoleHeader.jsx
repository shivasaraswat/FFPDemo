import React from 'react';
import './RoleHeader.css';

const RoleHeader = ({ role }) => {
  return (
    <th className="role-header">
      <div className="role-header-content">
        <span className="role-name" title={role.name}>
          {role.name.length > 15 ? `${role.name.substring(0, 15)}...` : role.name}
        </span>
        <div className="permission-labels">
          <span className="label">Full Access</span>
          <span className="label">Read Only</span>
        </div>
      </div>
    </th>
  );
};

export default RoleHeader;


