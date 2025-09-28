// pages/RoleManagement.jsx
import React, { useState } from 'react';
import { Plus, Settings, Shield, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';

const RoleManagement = () => {
  const { roles, setRoles, apiService, currentUser } = useAppContext();

  const handleCreateRole = () => {
    console.log('Create role modal');
  };

  const handleEditRole = (role) => {
    console.log('Edit role:', role);
  };

  const handleDeleteRole = (roleId) => {
    console.log('Delete role:', roleId);
  };

  const getPermissionColor = (permission) => {
    const colors = {
      'CREATE': 'var(--status-success)',
      'READ': 'var(--status-info)',
      'UPDATE': 'var(--status-warning)',
      'DELETE': 'var(--status-danger)',
      'APPROVE': 'var(--priority-high)',
      'MANAGE_USERS': 'var(--priority-critical)',
      'MANAGE_ROLES': 'var(--priority-critical)',
      'MANAGE_WORKSHOPS': 'var(--status-warning)'
    };
    return colors[permission] || 'var(--gray-500)';
  };

  if (currentUser.role !== 'Admin') {
    return (
      <div className="role-management">
        <div className="page-header">
          <h1>Role Management</h1>
          <p>Access Denied - Administrator privileges required</p>
        </div>
        <div className="access-denied">
          <Shield className="access-denied-icon" />
          <h3>Access Restricted</h3>
          <p>You do not have sufficient permissions to manage roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Role Management</h1>
          <p>Define and manage user roles and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreateRole}>
            <Plus /> New Role
          </button>
        </div>
      </div>
      
      {/* Role Cards */}
      <div className="roles-grid">
        {roles.map(role => (
          <div key={role.id} className="role-card">
            <div className="role-header">
              <div className="role-icon">
                <Settings />
              </div>
              <div className="role-actions">
                <button 
                  className="btn-icon"
                  onClick={() => handleEditRole(role)}
                  title="Edit Role"
                >
                  <Edit />
                </button>
                {role.name !== 'Admin' && (
                  <button 
                    className="btn-icon danger"
                    onClick={() => handleDeleteRole(role.id)}
                    title="Delete Role"
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            </div>
            
            <div className="role-content">
              <h3>{role.name}</h3>
              <p className="role-description">{role.description}</p>
              
              <div className="permissions-section">
                <h4>Permissions</h4>
                <div className="permissions-grid">
                  {role.permissions.map(permission => (
                    <span 
                      key={permission}
                      className="permission-badge"
                      style={{ 
                        backgroundColor: getPermissionColor(permission),
                        color: 'white'
                      }}
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="role-stats">
                <div className="stat-item">
                  <span className="stat-number">{role.permissions.length}</span>
                  <span className="stat-label">Permissions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {/* This would normally come from a user count by role */}
                    {role.name === 'Admin' ? '2' : role.name === 'Manager' ? '1' : '2'}
                  </span>
                  <span className="stat-label">Users</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Permissions Matrix */}
      <div className="permissions-matrix">
        <div className="card">
          <div className="card-header">
            <h2>Permissions Matrix</h2>
          </div>
          <div className="card-content">
            <div className="matrix-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Permission</th>
                    {roles.map(role => (
                      <th key={role.id}>{role.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(roles.flatMap(role => role.permissions))).map(permission => (
                    <tr key={permission}>
                      <td className="permission-name">
                        <span 
                          className="permission-badge small"
                          style={{ 
                            backgroundColor: getPermissionColor(permission),
                            color: 'white'
                          }}
                        >
                          {permission.replace('_', ' ')}
                        </span>
                      </td>
                      {roles.map(role => (
                        <td key={`${role.id}-${permission}`} className="permission-cell">
                          {role.permissions.includes(permission) ? (
                            <div className="permission-granted">✓</div>
                          ) : (
                            <div className="permission-denied">✗</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;