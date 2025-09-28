// components/modals/CreateUserModal.jsx
import React, { useState } from 'react';

// Simple X icon for close button
const X = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CreateUserModal = ({ onClose, onSubmit, roles }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    rank: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    department: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ranks = [
    'Field Marshal', 'General', 'Lieutenant General', 'Major General', 'Brigadier',
    'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant', 
    'Second Lieutenant', 'Subedar Major', 'Subedar', 'Naib Subedar',
    'Havildar', 'Naik', 'Lance Naik', 'Sepoy'
  ];

  const departments = [
    'Infantry', 'Artillery', 'Armored Corps', 'Engineers', 'Signals',
    'Intelligence', 'Medical Corps', 'Supply Corps', 'Ordnance', 'EME'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscore';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare user data for API
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        rank: formData.rank,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        department: formData.department
      };
      
      await onSubmit(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Create New User</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rank">Military Rank</label>
                <select
                  id="rank"
                  value={formData.rank}
                  onChange={(e) => handleChange('rank', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select Rank</option>
                  {ranks.map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Account Information */}
          <div className="form-section">
            <h3>Account Information</h3>
            
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={errors.username ? 'error' : ''}
                placeholder="Enter username"
                disabled={isSubmitting}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
              <small className="field-hint">Only letters, numbers, and underscore allowed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="user@army.gov.in"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm password"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">System Role *</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={errors.role ? 'error' : ''}
                disabled={isSubmitting}
              >
                <option value="">Select Role</option>
                <option value="USER">User - Basic Access</option>
                <option value="ADMIN">Admin - Full Access</option>
                <option value="Manager">Manager - Approval Rights</option>
              </select>
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
              <small className="field-hint">
                {formData.role === 'USER' && 'Can create and view requests'}
                {formData.role === 'ADMIN' && 'Full system access including user management'}
                {formData.role === 'Manager' && 'Can approve/reject requests and manage workshops'}
              </small>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="modal-actions">
            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating User...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;