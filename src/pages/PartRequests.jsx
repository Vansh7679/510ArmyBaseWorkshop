// pages/PartRequests.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';
import CreateRequestModal from '../components/modals/CreateRequestModal.jsx';
import RequestDetailsModal from '../components/modals/RequestDetailsModal.jsx';

const PartRequests = () => {
  const { partRequests, setPartRequests, workshops, users, apiService, currentUser } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterWorkshop, setFilterWorkshop] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('requestDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter and search logic
  const filteredRequests = partRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    const matchesWorkshop = filterWorkshop === 'all' || request.workshopId.toString() === filterWorkshop;
    const matchesSearch = request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesWorkshop && matchesSearch;
  });

  // Sort logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'requestDate' || sortField === 'requiredDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleCreateRequest = async (requestData) => {
    try {
      const newRequest = await apiService.createPartRequest({
        ...requestData,
        userId: currentUser.id
      });
      setPartRequests(prev => [...prev, newRequest]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    // Implement export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Part Name,Part Number,Quantity,Priority,Status,Request Date,Required Date,Workshop,Estimated Cost\n" +
      sortedRequests.map(req => {
        const workshop = workshops.find(w => w.id === req.workshopId);
        return `${req.id},${req.partName},${req.partNumber},${req.quantity},${req.priority},${req.status},${req.requestDate},${req.requiredDate},${workshop?.name || 'Unknown'},${req.estimatedCost}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `part_requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#16a34a';
      case 'REJECTED': return '#dc2626';
      case 'PENDING': return '#ca8a04';
      default: return '#6b7280';
    }
  };

  const canCreateRequest = ['Admin', 'Manager', 'User'].includes(currentUser.role);
  const canEditRequest = ['Admin', 'Manager'].includes(currentUser.role);

  return (
    <div className="part-requests">
      <div className="page-header">
        <div className="header-content">
          <h1>Part Requests Management</h1>
          <p>Manage and track military equipment part requests</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download /> Export
          </button>
          {canCreateRequest && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus /> New Request
            </button>
          )}
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search part requests, numbers, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
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
          
          <select
            value={filterWorkshop}
            onChange={(e) => setFilterWorkshop(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Workshops</option>
            {workshops.map(workshop => (
              <option key={workshop.id} value={workshop.id.toString()}>
                {workshop.name}
              </option>
            ))}
          </select>
          
          <button className="filter-btn">
            <Filter /> Advanced Filters
          </button>
        </div>
      </div>
      
      {/* Results Summary */}
      <div className="results-summary">
        <span>Showing {sortedRequests.length} of {partRequests.length} requests</span>
      </div>
      
      {/* Requests Table */}
      <div className="table-container">
        <table className="data-table">
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
                className={`sortable ${sortField === 'quantity' ? `sorted-${sortDirection}` : ''}`}
                onClick={() => handleSort('quantity')}
              >
                Quantity
              </th>
              <th 
                className={`sortable ${sortField === 'priority' ? `sorted-${sortDirection}` : ''}`}
                onClick={() => handleSort('priority')}
              >
                Priority
              </th>
              <th 
                className={`sortable ${sortField === 'status' ? `sorted-${sortDirection}` : ''}`}
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th>Workshop</th>
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
            {sortedRequests.map(request => {
              const workshop = workshops.find(w => w.id === request.workshopId);
              const requestUser = users.find(u => u.id === request.userId);
              
              return (
                <tr key={request.id} className={request.priority === 'CRITICAL' ? 'critical-row' : ''}>
                  <td>
                    <span className="request-id">#{request.id}</span>
                  </td>
                  <td>
                    <div className="part-details">
                      <span className="part-name">{request.partName}</span>
                      <span className="part-number">{request.partNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="quantity">{request.quantity}</span>
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
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(request.status),
                        color: 'white'
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <div className="workshop-info">
                      <span className="workshop-name">{workshop?.name || 'Unknown'}</span>
                      <span className="workshop-location">{workshop?.location || ''}</span>
                    </div>
                  </td>
                  <td>{request.requestDate}</td>
                  <td className={new Date(request.requiredDate) < new Date() ? 'overdue' : ''}>
                    {request.requiredDate}
                  </td>
                  <td>
                    <span className="cost">₹{request.estimatedCost?.toLocaleString() || 'N/A'}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="View Details"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye />
                      </button>
                      {canEditRequest && (
                        <button className="btn-icon" title="Edit Request">
                          <Edit />
                        </button>
                      )}
                      {currentUser.role === 'Admin' && (
                        <button className="btn-icon danger" title="Delete Request">
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {sortedRequests.length === 0 && (
          <div className="no-data">
            <p>No part requests found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRequest}
          workshops={workshops}
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

export default PartRequests;