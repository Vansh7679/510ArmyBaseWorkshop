// components/modals/RequestDetailsModal.jsx
import React from 'react';
import { X, User, MapPin, Calendar, DollarSign, FileText, Clock } from 'lucide-react';

const RequestDetailsModal = ({ request, workshop, requestUser, onClose }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MEDIUM': return '#ca8a04';
      case 'LOW': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#16a34a';
      case 'REJECTED': return '#dc2626';
      case 'PENDING': return '#ca8a04';
      default: return '#6b7280';
    }
  };

  const getDaysFromRequest = () => {
    return Math.ceil((new Date() - new Date(request.requestDate)) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilRequired = () => {
    return Math.ceil((new Date(request.requiredDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h2>Request Details #{request.id}</h2>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>
        
        <div className="modal-form">
          {/* Status Header */}
          <div className="status-header">
            <div className="status-info">
              <span 
                className="status-badge large"
                style={{ 
                  backgroundColor: getStatusColor(request.status),
                  color: 'white'
                }}
              >
                {request.status}
              </span>
              <span 
                className="priority-badge large"
                style={{ 
                  backgroundColor: getPriorityColor(request.priority),
                  color: 'white'
                }}
              >
                {request.priority} PRIORITY
              </span>
            </div>
            <div className="timing-info">
              <span className="days-pending">{getDaysFromRequest()} days ago</span>
              {getDaysUntilRequired() >= 0 ? (
                <span className="days-until">Due in {getDaysUntilRequired()} days</span>
              ) : (
                <span className="days-overdue">Overdue by {Math.abs(getDaysUntilRequired())} days</span>
              )}
            </div>
          </div>
          
          {/* Part Information */}
          <div className="form-section">
            <h3>
              <FileText className="section-icon" />
              Part Information
            </h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Part Name</label>
                <span className="value">{request.partName}</span>
              </div>
              
              <div className="info-item">
                <label>Part Number</label>
                <span className="value mono">{request.partNumber}</span>
              </div>
              
              <div className="info-item">
                <label>Quantity Requested</label>
                <span className="value">{request.quantity} units</span>
              </div>
              
              <div className="info-item">
                <label>Estimated Unit Cost</label>
                <span className="value cost">
                  ₹{request.estimatedCost ? (request.estimatedCost / request.quantity).toLocaleString() : 'N/A'}
                </span>
              </div>
              
              <div className="info-item">
                <label>Total Estimated Cost</label>
                <span className="value cost total">
                  ₹{request.estimatedCost?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>
            
            {request.specifications && (
              <div className="specifications">
                <label>Technical Specifications</label>
                <div className="specifications-content">
                  {request.specifications}
                </div>
              </div>
            )}
          </div>
          
          {/* Request Context */}
          <div className="form-section">
            <h3>
              <User className="section-icon" />
              Request Context
            </h3>
            
            <div className="context-grid">
              <div className="context-card">
                <div className="context-header">
                  <User className="context-icon" />
                  <h4>Requested By</h4>
                </div>
                <div className="context-content">
                  <div className="requester-details">
                    <span className="name">{requestUser?.rank} {requestUser?.username || 'Unknown User'}</span>
                    <span className="role">{requestUser?.role}</span>
                    <span className="email">{requestUser?.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="context-card">
                <div className="context-header">
                  <MapPin className="context-icon" />
                  <h4>Workshop</h4>
                </div>
                <div className="context-content">
                  <div className="workshop-details">
                    <span className="name">{workshop?.name || 'Unknown Workshop'}</span>
                    <span className="location">{workshop?.location}</span>
                    <span className="capacity">Capacity: {workshop?.capacity} personnel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="form-section">
            <h3>
              <Calendar className="section-icon" />
              Timeline
            </h3>
            
            <div className="timeline-grid">
              <div className="timeline-item">
                <Clock className="timeline-icon" />
                <div className="timeline-content">
                  <label>Request Date</label>
                  <span className="value">{request.requestDate}</span>
                </div>
              </div>
              
              <div className="timeline-item">
                <Calendar className="timeline-icon" />
                <div className="timeline-content">
                  <label>Required Date</label>
                  <span className={`value ${getDaysUntilRequired() < 0 ? 'overdue' : getDaysUntilRequired() <= 3 ? 'urgent' : ''}`}>
                    {request.requiredDate}
                  </span>
                </div>
              </div>
              
              <div className="timeline-item">
                <Clock className="timeline-icon" />
                <div className="timeline-content">
                  <label>Processing Time</label>
                  <span className="value">{getDaysFromRequest()} days</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Descriptions */}
          <div className="form-section">
            <h3>
              <FileText className="section-icon" />
              Additional Information
            </h3>
            
            {request.description && (
              <div className="description-block">
                <label>Description & Usage</label>
                <div className="description-content">
                  {request.description}
                </div>
              </div>
            )}
            
            {request.justification && (
              <div className="description-block">
                <label>Justification</label>
                <div className="justification-content">
                  {request.justification}
                </div>
              </div>
            )}
            
            {request.supplier && (
              <div className="supplier-info">
                <label>Preferred Supplier</label>
                <span className="supplier-name">{request.supplier}</span>
              </div>
            )}
          </div>
          
          {/* Approval History (if any) */}
          {request.status !== 'PENDING' && (
            <div className="form-section">
              <h3>Approval History</h3>
              
              <div className="approval-history">
                <div className="approval-item">
                  <div className="approval-status">
                    <div className={`status-dot ${request.status.toLowerCase()}`}></div>
                    <span className={`status-text ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="approval-details">
                    <span className="approver">Decision by: Colonel Sharma</span>
                    <span className="approval-date">
                      {request.status === 'APPROVED' ? 
                        new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                        new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                      }
                    </span>
                    {request.status === 'REJECTED' && (
                      <div className="rejection-reason">
                        Reason: Budget constraints - defer to next quarter
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <button type="button" className="btn btn-outline">
            <FileText /> Print Details
          </button>
          
          {request.status === 'APPROVED' && (
            <button type="button" className="btn btn-primary">
              Track Procurement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;