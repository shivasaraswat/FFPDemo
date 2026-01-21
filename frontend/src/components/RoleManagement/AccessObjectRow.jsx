import React from 'react';
import PermissionCheckbox from './PermissionCheckbox';
import './AccessObjectRow.css';

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
      <tr className={`access-object-row ${hasChildren ? 'has-children' : ''}`}>
        <td className="access-object-cell" style={{ paddingLeft: `${indent + 1}rem` }}>
          <div className="access-object-content">
            {hasChildren && (
              <button
                className="expand-button"
                onClick={() => onToggleExpand(accessObject.key)}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </button>
            )}
            {!hasChildren && <span className="spacer"></span>}
            <span className="access-object-name">{accessObject.name}</span>
          </div>
        </td>
        {roles.map(role => {
          const key = `${role.id}-${accessObject.key}`;
          const access = permissions[key] || 'NONE';
          const fullAccess = access === 'FULL';
          const readOnly = access === 'READ' || access === 'FULL';
          
          return (
            <td key={role.id} className="permission-cell">
              <div className="permission-checkboxes">
                <PermissionCheckbox
                  checked={fullAccess}
                  onChange={(checked) => 
                    onPermissionChange(role.id, accessObject.key, 'full_access', checked)
                  }
                />
                <PermissionCheckbox
                  checked={readOnly && !fullAccess}
                  onChange={(checked) => 
                    onPermissionChange(role.id, accessObject.key, 'read_only', checked)
                  }
                />
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

