// components/modals/ApprovalModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ApprovalModal = ({ request, workshop, requestUser, onClose, onSubmit }) => {
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decision) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(request.id, decision, comments);
    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MEDIUM': return '#ca8a04';
      case 'LOW': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getUrgencyLevel = () => {
    const requiredDate = new Date(request.requiredDate);
    const today = new Date();
    const daysUntilRequired = Math.ceil((requiredDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilRequired <= 1) return 'immediate';
    if (daysUntilRequired <= 3) return 'urgent';
    if (daysUntilRequired <= 7) return 'soon';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Review Part Request #{request.id}</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <X />
          </button>
        </div>
        
        <div className="modal-form">
          {/* Request Overview */}
          <div className="form-section">
            <h3>Request Details</h3>
            
            <div className="request-overview">
              <div className="overview-grid">
                <div className="overview-item">
                  <label>Part Name</label>
                  <span className="value">{request.partName}</span>
                </div>
                
                <div className="overview-item">
                  <label>Part Number</label>
                  <span className="value">{request.partNumber}</span>
                </div>
                
                <div className="overview-item">
                  <label>Quantity</label>
                  <span className="value">{request.quantity}</span>
                </div>
                
                <div className="overview-item">
                  <label>Priority</label>
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: getPriorityColor(request.priority),
                      color: 'white'
                    }}
                  >
                    {request.priority}
                  </span>
                </div>
                
                <div className="overview-item">
                  <label>Estimated Cost</label>
                  <span className="value cost">₹{request.estimatedCost?.toLocaleString() || 'N/A'}</span>
                </div>
                
                <div className="overview-item">
                  <label>Required Date</label>
                  <span className={`value ${urgencyLevel === 'immediate' || urgencyLevel === 'urgent' ? 'urgent' : ''}`}>
                    {request.requiredDate}
                    {urgencyLevel === 'immediate' && <span className="urgency-indicator"> (IMMEDIATE)</span>}
                    {urgencyLevel === 'urgent' && <span className="urgency-indicator"> (URGENT)</span>}
                  </span>
                </div>
              </div>
            </div>
            
            {request.description && (
              <div className="description-section">
                <label>Description</label>
                <p className="description">{request.description}</p>
              </div>
            )}
            
            {request.justification && (
              <div className="justification-section">
                <label>Justification</label>
                <p className="justification">{request.justification}</p>
              </div>
            )}
          </div>
          
          {/* Requester & Workshop Info */}
          <div className="form-section">
            <h3>Request Context</h3>
            
            <div className="context-grid">
              <div className="context-item">
                <label>Requested By</label>
                <div className="requester-info">
                  <span className="requester-name">
                    {requestUser?.rank} {requestUser?.username || 'Unknown User'}
                  </span>
                  <span className="requester-role">{requestUser?.role}</span>
                  <span className="requester-email">{requestUser?.email}</span>
                </div>
              </div>
              
              <div className="context-item">
                <label>Workshop</label>
                <div className="workshop-info">
                  <span className="workshop-name">{workshop?.name || 'Unknown Workshop'}</span>
                  <span className="workshop-location">{workshop?.location}</span>
                  <span className="workshop-capacity">Capacity: {workshop?.capacity} personnel</span>
                </div>
              </div>
            </div>
            
            <div className="timing-info">
              <div className="timing-item">
                <label>Request Date</label>
                <span>{request.requestDate}</span>
              </div>
              <div className="timing-item">
                <label>Days Pending</label>
                <span>{Math.ceil((new Date() - new Date(request.requestDate)) / (1000 * 60 * 60 * 24))} days</span>
              </div>
            </div>
          </div>
          
          {/* Priority & Urgency Warnings */}
          {(request.priority === 'CRITICAL' || urgencyLevel === 'immediate' || urgencyLevel === 'urgent') && (
            <div className="warning-section">
              <AlertTriangle className="warning-icon" />
              <div className="warning-content">
                <h4>Attention Required</h4>
                {request.priority === 'CRITICAL' && (
                  <p>This request is marked as <strong>CRITICAL PRIORITY</strong> and may impact mission readiness.</p>
                )}
                {urgencyLevel === 'immediate' && (
                  <p>This request has an <strong>IMMEDIATE DEADLINE</strong> - required today or overdue.</p>
                )}
                {urgencyLevel === 'urgent' && (
                  <p>This request is <strong>TIME-SENSITIVE</strong> with an approaching deadline.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Decision Section */}
          <div className="form-section">
            <h3>Approval Decision</h3>
            
            <div className="decision-section">
              <label>Decision *</label>
              <div className="radio-group">
                <label className="radio-option approve">
                  <input
                    type="radio"
                    name="decision"
                    value="APPROVED"
                    checked={decision === 'APPROVED'}
                    onChange={(e) => setDecision(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="radio-content">
                    <CheckCircle className="radio-icon approved" />
                    <div className="radio-text">
                      <span className="radio-title">Approve Request</span>
                      <span className="radio-description">Authorize procurement of requested parts</span>
                    </div>
                  </div>
                </label>
                
                <label className="radio-option reject">
                  <input
                    type="radio"
                    name="decision"
                    value="REJECTED"
                    checked={decision === 'REJECTED'}
                    onChange={(e) => setDecision(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="radio-content">
                    <XCircle className="radio-icon rejected" />
                    <div className="radio-text">
                      <span className="radio-title">Reject Request</span>
                      <span className="radio-description">Deny the part request with explanation</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="comments">
                Comments {decision === 'REJECTED' ? '*' : ''}
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="4"
                placeholder={
                  decision === 'APPROVED' 
                    ? "Add any approval conditions or notes..."
                    : decision === 'REJECTED'
                    ? "Please provide a detailed explanation for rejection..."
                    : "Add your comments here..."
                }
                disabled={isSubmitting}
                required={decision === 'REJECTED'}
              />
              {decision === 'REJECTED' && !comments.trim() && (
                <span className="error-message">Comments are required for rejections</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            className={`btn ${decision === 'APPROVED' ? 'btn-success' : decision === 'REJECTED' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleSubmit}
            disabled={!decision || isSubmitting || (decision === 'REJECTED' && !comments.trim())}
          >
            {isSubmitting ? (
              'Processing...'
            ) : decision === 'APPROVED' ? (
              'Approve Request'
            ) : decision === 'REJECTED' ? (
              'Reject Request'
            ) : (
              'Submit Decision'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;