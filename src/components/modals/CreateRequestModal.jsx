// components/modals/CreateRequestModal.jsx
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CreateRequestModal = ({ onClose, onSubmit, workshops }) => {
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    quantity: 1,
    priority: 'MEDIUM',
    workshopId: '',
    requiredDate: '',
    description: '',
    estimatedCost: '',
    justification: '',
    supplier: '',
    specifications: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.partName.trim()) {
      newErrors.partName = 'Part name is required';
    }
    
    if (!formData.partNumber.trim()) {
      newErrors.partNumber = 'Part number is required';
    }
    
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    if (!formData.workshopId) {
      newErrors.workshopId = 'Workshop selection is required';
    }
    
    if (!formData.requiredDate) {
      newErrors.requiredDate = 'Required date is required';
    } else {
      const requiredDate = new Date(formData.requiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (requiredDate < today) {
        newErrors.requiredDate = 'Required date cannot be in the past';
      }
    }
    
    if (formData.estimatedCost && isNaN(formData.estimatedCost)) {
      newErrors.estimatedCost = 'Estimated cost must be a valid number';
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
      const requestData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        workshopId: parseInt(formData.workshopId),
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : null
      };
      
      await onSubmit(requestData);
    } catch (error) {
      console.error('Error creating request:', error);
      setErrors({ submit: 'Failed to create request. Please try again.' });
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

  const getPriorityDescription = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'Mission critical - immediate action required';
      case 'HIGH':
        return 'High priority - required for operational readiness';
      case 'MEDIUM':
        return 'Standard priority - normal processing time';
      case 'LOW':
        return 'Low priority - can be deferred if necessary';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Create New Part Request</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Part Information */}
          <div className="form-section">
            <h3>Part Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="partName">Part Name *</label>
                <input
                  id="partName"
                  type="text"
                  value={formData.partName}
                  onChange={(e) => handleChange('partName', e.target.value)}
                  className={errors.partName ? 'error' : ''}
                  placeholder="Enter part name"
                  disabled={isSubmitting}
                />
                {errors.partName && (
                  <span className="error-message">{errors.partName}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="partNumber">Part Number *</label>
                <input
                  id="partNumber"
                  type="text"
                  value={formData.partNumber}
                  onChange={(e) => handleChange('partNumber', e.target.value)}
                  className={errors.partNumber ? 'error' : ''}
                  placeholder="Enter part number"
                  disabled={isSubmitting}
                />
                {errors.partNumber && (
                  <span className="error-message">{errors.partNumber}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  className={errors.quantity ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <span className="error-message">{errors.quantity}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="estimatedCost">Estimated Cost (₹)</label>
                <input
                  id="estimatedCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => handleChange('estimatedCost', e.target.value)}
                  className={errors.estimatedCost ? 'error' : ''}
                  placeholder="Enter estimated cost"
                  disabled={isSubmitting}
                />
                {errors.estimatedCost && (
                  <span className="error-message">{errors.estimatedCost}</span>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="specifications">Technical Specifications</label>
              <textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleChange('specifications', e.target.value)}
                rows="3"
                placeholder="Enter detailed technical specifications..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Request Details */}
          <div className="form-section">
            <h3>Request Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority Level *</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <div className="priority-description">
                  {getPriorityDescription(formData.priority)}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="workshopId">Requesting Workshop *</label>
                <select
                  id="workshopId"
                  value={formData.workshopId}
                  onChange={(e) => handleChange('workshopId', e.target.value)}
                  className={errors.workshopId ? 'error' : ''}
                  disabled={isSubmitting}
                >
                  <option value="">Select Workshop</option>
                  {workshops.map(workshop => (
                    <option key={workshop.id} value={workshop.id}>
                      {workshop.name} - {workshop.location}
                    </option>
                  ))}
                </select>
                {errors.workshopId && (
                  <span className="error-message">{errors.workshopId}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requiredDate">Required Date *</label>
                <input
                  id="requiredDate"
                  type="date"
                  value={formData.requiredDate}
                  onChange={(e) => handleChange('requiredDate', e.target.value)}
                  className={errors.requiredDate ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
                {errors.requiredDate && (
                  <span className="error-message">{errors.requiredDate}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="supplier">Preferred Supplier</label>
                <input
                  id="supplier"
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  placeholder="Enter preferred supplier name"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="description">Description & Usage</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                placeholder="Describe the part usage, application, and any specific requirements..."
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="justification">Justification</label>
              <textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => handleChange('justification', e.target.value)}
                rows="3"
                placeholder="Provide justification for this request, including operational impact..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Critical Priority Warning */}
          {formData.priority === 'CRITICAL' && (
            <div className="warning-section">
              <AlertTriangle className="warning-icon" />
              <div className="warning-content">
                <h4>Critical Priority Notice</h4>
                <p>Critical priority requests require immediate attention and additional documentation. 
                   Please ensure all fields are accurately completed and justification is provided.</p>
              </div>
            </div>
          )}
          
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
              {isSubmitting ? 'Creating Request...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;