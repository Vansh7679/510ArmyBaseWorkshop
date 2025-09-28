// components/modals/CreateWorkshopModal.jsx
import React, { useState } from 'react';

// Simple X icon for close button
const X = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CreateWorkshopModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Workshop name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
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
      // This matches CreateWorkshopDTO structure in your backend
      const workshopData = {
        name: formData.name.trim(),
        location: formData.location.trim()
      };
      
      await onSubmit(workshopData);
    } catch (error) {
      console.error('Error creating workshop:', error);
      setErrors({ submit: 'Failed to create workshop. Please try again.' });
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
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Workshop</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Workshop Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Workshop Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter workshop name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={errors.location ? 'error' : ''}
                placeholder="Enter workshop location"
                disabled={isSubmitting}
              />
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>
          </div>
          
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
              {isSubmitting ? 'Creating Workshop...' : 'Create Workshop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshopModal;