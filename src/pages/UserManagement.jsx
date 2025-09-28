// pages/UserManagement.jsx
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.jsx';
import CreateUserModal from '../components/modals/CreateUserModal.jsx';

// Simple icons defined inline to avoid import issues
const Plus = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Search = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Edit = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Trash2 = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Shield = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const UserCheck = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const UserX = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path d="M10 6a3 3 0 100-6 3 3 0 000 6zM3 20a7 7 0 1114 0v1H3v-1zM13 8a1 1 0 10-2 0v6a1 1 0 102 0V8zM9 8a1 1 0 10-2 0v6a1 1 0 102 0V8z" />
  </svg>
);

const UserManagement = () => {
  const { users, setUsers, roles, apiService, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.rank && user.rank.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // This function now only opens the modal - NO automatic user creation
  const handleNewUserClick = () => {
    setShowCreateModal(true);
  };

  // This function handles the actual user creation from the modal form
  const handleCreateUser = async (userData) => {
    try {
      console.log('Creating user with data:', userData);
      
      const createdUser = await apiService.createUser(userData);
      console.log('User created successfully:', createdUser);
      
      // Update the users state with the new user
      setUsers(prev => [...prev, createdUser]);
      
      // Close modal
      setShowCreateModal(false);
      
      // Show success message
      alert('User created successfully!');
      
    } catch (error) {
      console.error('Failed to create user:', error);
      // Don't close modal on error, let user see the error and try again
      throw error; // Let the modal handle the error display
    }
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', userId);
      // Implement delete functionality here
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return '#dc2626';
      case 'Admin': return '#dc2626';
      case 'Manager': return '#ca8a04';
      case 'USER': return '#2563eb';
      case 'User': return '#2563eb';
      default: return '#6b7280';
    }
  };

  if (currentUser.role !== 'Admin') {
    return (
      <div className="user-management">
        <div className="page-header">
          <h1>User Management</h1>
          <p>Access Denied - Administrator privileges required</p>
        </div>
        <div className="access-denied">
          <Shield className="access-denied-icon" />
          <h3>Access Restricted</h3>
          <p>You do not have sufficient permissions to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Manage system users and their access permissions</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleNewUserClick}
          >
            <Plus /> New User
          </button>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name, rank, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
      </div>
      
      {/* User Statistics */}
      <div className="stats-grid">
        <div className="stat-card info">
          <div className="stat-icon">
            <Shield />
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'ADMIN' || u.role === 'Admin').length}</h3>
            <p>Administrators</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <UserCheck />
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'Manager').length}</h3>
            <p>Managers</p>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <UserCheck />
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'USER' || u.role === 'User').length}</h3>
            <p>Users</p>
          </div>
        </div>
        
        <div className="stat-card primary">
          <div className="stat-icon">
            <UserCheck />
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Details</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <span className="user-id">#{user.id}</span>
                  </td>
                  <td>
                    <div className="user-details">
                      <div className="user-avatar">
                        <Shield style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div className="user-info">
                        <span className="user-name">
                          {user.rank && `${user.rank} `}{user.username}
                        </span>
                        <span className="user-rank">{user.rank || 'Personnel'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="role-badge"
                      style={{ 
                        backgroundColor: getRoleBadgeColor(user.role),
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <div className="status-indicator-container">
                      <div className="status-indicator online"></div>
                      <span>Active</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Edit User"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit />
                      </button>
                      {user.id !== currentUser.id && (
                        <button 
                          className="btn-icon danger" 
                          title="Delete User"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <UserX style={{ width: '48px', height: '48px', color: '#6b7280' }} />
                    <p>No users found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          roles={roles}
        />
      )}
    </div>
  );
};

export default UserManagement;