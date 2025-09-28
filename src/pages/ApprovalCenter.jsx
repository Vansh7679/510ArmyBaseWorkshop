// pages/ApprovalCenter.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, FileText } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';
import ApprovalModal from '../components/modals/ApprovalModal.jsx';
import RequestDetailsModal from '../components/modals/RequestDetailsModal.jsx';

const ApprovalCenter = () => {
  const { 
    partRequests, 
    setPartRequests, 
    approvals, 
    setApprovals, 
    workshops, 
    users, 
    apiService, 
    currentUser 
  } = useAppContext();
  
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('requestDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const pendingRequests = partRequests.filter(req => req.status === 'PENDING');
  
  // Filter pending requests
  const filteredPendingRequests = pendingRequests.filter(request => {
    return filterPriority === 'all' || request.priority === filterPriority;
  });

  // Sort pending requests
  const sortedPendingRequests = [...filteredPendingRequests].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'requestDate' || sortField === 'requiredDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortField === 'priority') {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      aValue = priorityOrder[aValue];
      bValue = priorityOrder[bValue];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const recentApprovals = approvals.slice().sort((a, b) => 
    new Date(b.approvalDate) - new Date(a.approvalDate)
  ).slice(0, 5);

  const handleApprovalAction = async (requestId, status, comments) => {
    try {
      const approvalData = {
        approverId: currentUser.id,
        status,
        comments
      };
      
      const newApproval = await apiService.createApproval(requestId, approvalData);
      setApprovals(prev => [...prev, newApproval]);
      
      // Update part request status
      setPartRequests(prev => 
        prev.map(req => 
          req.id === requestId ? {...req, status} : req
        )
      );
      
      setShowApprovalModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to process approval:', error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleReviewRequest = (request) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to desc for most fields
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

  const getUrgencyLevel = (request) => {
    const requiredDate = new Date(request.requiredDate);
    const today = new Date();
    const daysUntilRequired = Math.ceil((requiredDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilRequired <= 1) return 'immediate';
    if (daysUntilRequired <= 3) return 'urgent';
    if (daysUntilRequired <= 7) return 'soon';
    return 'normal';
  };

  const criticalRequests = sortedPendingRequests.filter(req => req.priority === 'CRITICAL');
  const urgentRequests = sortedPendingRequests.filter(req => getUrgencyLevel(req) === 'urgent' || getUrgencyLevel(req) === 'immediate');

  const canApprove = ['Admin', 'Manager'].includes(currentUser.role);

  if (!canApprove) {
    return (
      <div className="approval-center">
        <div className="page-header">
          <h1>Approval Center</h1>
          <p>Access Denied - Insufficient Permissions</p>
        </div>
        <div className="access-denied">
          <AlertTriangle className="access-denied-icon" />
          <h3>Access Restricted</h3>
          <p>You do not have the required permissions to access the approval center.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="approval-center">
      <div className="page-header">
        <div className="header-content">
          <h1>Approval Center</h1>
          <p>Review and process pending part requests</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{pendingRequests.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item critical">
            <span className="stat-number">{criticalRequests.length}</span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-item urgent">
            <span className="stat-number">{urgentRequests.length}</span>
            <span className="stat-label">Urgent</span>
          </div>
        </div>
      </div>

      {/* Alert Section for Critical/Urgent Requests */}
      {(criticalRequests.length > 0 || urgentRequests.length > 0) && (
        <div className="alerts-section">
          {criticalRequests.length > 0 && (
            <div className="alert-card critical">
              <AlertTriangle className="alert-icon" />
              <div className="alert-content">
                <h3>Critical Priority Requests</h3>
                <p>{criticalRequests.length} requests marked as critical priority require immediate attention.</p>
              </div>
            </div>
          )}
          
          {urgentRequests.length > 0 && (
            <div className="alert-card urgent">
              <Clock className="alert-icon" />
              <div className="alert-content">
                <h3>Time-Sensitive Requests</h3>
                <p>{urgentRequests.length} requests have approaching deadlines and need urgent review.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="approval-content">
        {/* Pending Approvals Section */}
        <div className="pending-approvals">
          <div className="section-header">
            <h2>Pending Approvals ({sortedPendingRequests.length})</h2>
            <div className="section-controls">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
          
          {sortedPendingRequests.length === 0 ? (
            <div className="no-pending">
              <CheckCircle className="no-pending-icon" />
              <h3>All Caught Up!</h3>
              <p>No pending approvals at this time.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table approval-table">
                <thead>
                  <tr>
                    <th 
                      className={`sortable ${sortField === 'id' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </th>
                    <th 
                      className={`sortable ${sortField === 'partName' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('partName')}
                    >
                      Part Details
                    </th>
                    <th 
                      className={`sortable ${sortField === 'priority' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                    </th>
                    <th>Workshop</th>
                    <th>Requested By</th>
                    <th 
                      className={`sortable ${sortField === 'requestDate' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('requestDate')}
                    >
                      Request Date
                    </th>
                    <th 
                      className={`sortable ${sortField === 'requiredDate' ? `sorted-${sortDirection}` : ''}`}
                      onClick={() => handleSort('requiredDate')}
                    >
                      Required Date
                    </th>
                    <th>Estimated Cost</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPendingRequests.map(request => {
                    const workshop = workshops.find(w => w.id === request.workshopId);
                    const requestUser = users.find(u => u.id === request.userId);
                    const urgencyLevel = getUrgencyLevel(request);
                    
                    return (
                      <tr 
                        key={request.id} 
                        className={`
                          ${request.priority === 'CRITICAL' ? 'critical-row' : ''} 
                          ${urgencyLevel === 'immediate' || urgencyLevel === 'urgent' ? 'urgent-row' : ''}
                        `}
                      >
                        <td>
                          <div className="request-id-container">
                            <span className="request-id">#{request.id}</span>
                            {urgencyLevel === 'immediate' && (
                              <span className="urgency-indicator immediate">!</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="part-details">
                            <span className="part-name">{request.partName}</span>
                            <span className="part-number">{request.partNumber}</span>
                            <span className="quantity">Qty: {request.quantity}</span>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="priority-badge"
                            style={{ 
                              backgroundColor: getPriorityColor(request.priority),
                              color: 'white'
                            }}
                          >
                            {request.priority}
                          </span>
                        </td>
                        <td>
                          <div className="workshop-info">
                            <span className="workshop-name">{workshop?.name || 'Unknown'}</span>
                            <span className="workshop-location">{workshop?.location || ''}</span>
                          </div>
                        </td>
                        <td>
                          <div className="user-info">
                            <span className="user-name">{requestUser?.rank || ''} {requestUser?.username || 'Unknown'}</span>
                            <span className="user-role">{requestUser?.role || ''}</span>
                          </div>
                        </td>
                        <td>{request.requestDate}</td>
                        <td className={urgencyLevel === 'immediate' || urgencyLevel === 'urgent' ? 'overdue' : ''}>
                          {request.requiredDate}
                          {urgencyLevel === 'immediate' && (
                            <span className="urgency-text">Today/Overdue</span>
                          )}
                          {urgencyLevel === 'urgent' && (
                            <span className="urgency-text">Urgent</span>
                          )}
                        </td>
                        <td>
                          <span className="cost">₹{request.estimatedCost?.toLocaleString() || 'N/A'}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => handleViewDetails(request)}
                              title="View Details"
                            >
                              <Eye />
                            </button>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => handleReviewRequest(request)}
                              title="Review & Approve"
                            >
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Approvals Section */}
        <div className="recent-approvals">
          <div className="section-header">
            <h2>Recent Approval Decisions</h2>
          </div>
          
          <div className="approvals-list">
            {recentApprovals.length === 0 ? (
              <div className="no-approvals">
                <FileText className="no-approvals-icon" />
                <p>No recent approval decisions.</p>
              </div>
            ) : (
              recentApprovals.map(approval => {
                const request = partRequests.find(req => req.id === approval.partRequestId);
                const workshop = workshops.find(w => w.id === request?.workshopId);
                
                return (
                  <div key={approval.id} className="approval-item">
                    <div className="approval-status">
                      {approval.status === 'APPROVED' ? (
                        <CheckCircle className="status-icon approved" />
                      ) : (
                        <XCircle className="status-icon rejected" />
                      )}
                    </div>
                    <div className="approval-content">
                      <div className="approval-header">
                        <span className="request-id">Request #{approval.partRequestId}</span>
                        <span className="approval-date">{approval.approvalDate}</span>
                      </div>
                      <div className="approval-details">
                        <span className="part-name">{request?.partName || 'Unknown Part'}</span>
                        <span className="workshop">{workshop?.name || 'Unknown Workshop'}</span>
                      </div>
                      {approval.comments && (
                        <div className="approval-comments">
                          <span className="comments-label">Comments:</span>
                          <span className="comments-text">{approval.comments}</span>
                        </div>
                      )}
                      <div className="approval-footer">
                        <span className="approver">By: {approval.approverName}</span>
                        <span className={`status-text ${approval.status.toLowerCase()}`}>
                          {approval.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApprovalModal && selectedRequest && (
        <ApprovalModal
          request={selectedRequest}
          workshop={workshops.find(w => w.id === selectedRequest.workshopId)}
          requestUser={users.find(u => u.id === selectedRequest.userId)}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleApprovalAction}
        />
      )}
      
      {showDetailsModal && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          workshop={workshops.find(w => w.id === selectedRequest.workshopId)}
          requestUser={users.find(u => u.id === selectedRequest.userId)}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default ApprovalCenter;