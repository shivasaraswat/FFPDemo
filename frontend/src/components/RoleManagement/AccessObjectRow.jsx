import React from 'react';
import PermissionCheckbox from './PermissionCheckbox';

const AccessObjectRow = ({ 
  accessObject, 
  roles, 
  permissions, 
  expandedObjects, 
  onToggleExpand,
  onPermissionChange,
  level = 0 
}) => {
  const hasChildren = accessObject.children && accessObject.children.length > 0;
  const isExpanded = expandedObjects.has(accessObject.key);
  const indent = level * 20;

  return (
    <>
      <tr className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50">
        <td className="px-4 py-4 text-left" style={{ paddingLeft: `${indent + 1}rem` }}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                className="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-400 transition-all duration-200 w-5 h-5 rounded hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => onToggleExpand(accessObject.key)}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            {!hasChildren && <span className="w-5"></span>}
            <span className="text-gray-800 text-sm font-medium">{accessObject.name}</span>
          </div>
        </td>
        {roles.map(role => {
          const key = `${role.id}-${accessObject.key}`;
          const access = permissions[key] || 'NONE';
          const fullAccess = access === 'FULL';
          const readOnly = access === 'READ' || access === 'FULL';
          
          return (
            <td key={role.id} className="px-4 py-4">
              <div className="flex gap-8 justify-center items-start">
                <div className="flex flex-col items-center gap-1.5">
                  <PermissionCheckbox
                    checked={fullAccess}
                    onChange={(checked) => 
                      onPermissionChange(role.id, accessObject.key, 'full_access', checked)
                    }
                  />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide whitespace-nowrap">Full</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <PermissionCheckbox
                    checked={readOnly && !fullAccess}
                    onChange={(checked) => 
                      onPermissionChange(role.id, accessObject.key, 'read_only', checked)
                    }
                  />
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide whitespace-nowrap">Read</span>
                </div>
              </div>
            </td>
          );
        })}
      </tr>
      {hasChildren && isExpanded && accessObject.children.map(child => (
        <AccessObjectRow
          key={child.key}
          accessObject={child}
          roles={roles}
          permissions={permissions}
          expandedObjects={expandedObjects}
          onToggleExpand={onToggleExpand}
          onPermissionChange={onPermissionChange}
          level={level + 1}
        />
      ))}
    </>
  );
};

export default AccessObjectRow;

