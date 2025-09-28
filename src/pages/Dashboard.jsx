// pages/Dashboard.jsx
import React from 'react';
import { useAppContext } from '../contexts/AppContext.jsx';

// Simple icons defined inline to avoid import issues
const FileText = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Clock = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const Wrench = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 11-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 015.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 00-.11.494 3.01 3.01 0 001.617 1.617c.17.07.363.02.493-.111l2.692-2.692c.242-.24.647-.174.752.15.14.435.216.9.216 1.382zM4 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const Users = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const TrendingUp = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CheckCircle = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const XCircle = ({ className, ...props }) => (
  <svg className={className} {...props} fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const Dashboard = () => {
  const { partRequests, workshops, users, approvals } = useAppContext();
  
  const stats = {
    totalRequests: partRequests.length,
    pendingApprovals: partRequests.filter(req => req.status === 'PENDING').length,
    approvedRequests: partRequests.filter(req => req.status === 'APPROVED').length,
    rejectedRequests: partRequests.filter(req => req.status === 'REJECTED').length,
    totalWorkshops: workshops.length,
    activeWorkshops: workshops.filter(w => w.status === 'Active').length,
    totalUsers: users.length,
    criticalRequests: partRequests.filter(req => req.priority === 'CRITICAL').length
  };

  const recentRequests = partRequests.slice().sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)).slice(0, 6);
  const urgentRequests = partRequests.filter(req => req.priority === 'HIGH' || req.priority === 'CRITICAL');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="status-icon approved" />;
      case 'REJECTED': return <XCircle className="status-icon rejected" />;
      case 'PENDING': return <Clock className="status-icon pending" />;
      default: return <Clock className="status-icon pending" />;
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

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="header-content">
          <h1>Command Dashboard</h1>
          <p>Real-time overview of military parts management operations</p>
        </div>
        <div className="header-actions">
          <div className="last-updated">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Key Performance Indicators */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <div className="stat-icon">
              <FileText />
            </div>
            <div className="stat-trend">
              <TrendingUp className="trend-icon up" />
              <span>+12%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRequests}</h3>
            <p>Total Part Requests</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                {stats.pendingApprovals} pending
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon">
              <Clock />
            </div>
            <div className="stat-trend">
              <span>{stats.criticalRequests}</span>
            </div>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
            <div className="stat-breakdown">
              <span className="breakdown-item critical">
                {stats.criticalRequests} critical
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon">
              <Wrench />
            </div>
            <div className="stat-trend">
              <CheckCircle className="trend-icon success" />
              <span>100%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3>{stats.activeWorkshops}</h3>
            <p>Active Workshops</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                {stats.totalWorkshops} total facilities
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-header">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-trend">
              <TrendingUp className="trend-icon up" />
              <span>+5</span>
            </div>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>System Users</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                Active personnel
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Requests */}
        <div className="dashboard-card recent-requests">
          <div className="card-header">
            <h2>Recent Part Requests</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Part Name</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map(request => (
                    <tr key={request.id}>
                      <td>
                        <span className="request-id">#{request.id}</span>
                      </td>
                      <td>
                        <div className="part-info">
                          <span className="part-name">{request.partName}</span>
                          <span className="part-number">{request.partNumber}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="priority-indicator" 
                          style={{ backgroundColor: getPriorityColor(request.priority) }}
                        >
                          {request.priority}
                        </span>
                      </td>
                      <td>
                        <div className="status-with-icon">
                          {getStatusIcon(request.status)}
                          <span>{request.status}</span>
                        </div>
                      </td>
                      <td>{request.requestDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-content">
            <div className="action-buttons">
              <button className="action-btn primary">
                <FileText className="btn-icon" />
                <div className="btn-content">
                  <span className="btn-title">New Request</span>
                  <span className="btn-subtitle">Create part request</span>
                </div>
              </button>
              
              <button className="action-btn warning">
                <Clock className="btn-icon" />
                <div className="btn-content">
                  <span className="btn-title">Pending Approvals</span>
                  <span className="btn-subtitle">{stats.pendingApprovals} awaiting review</span>
                </div>
              </button>
              
              <button className="action-btn success">
                <Wrench className="btn-icon" />
                <div className="btn-content">
                  <span className="btn-title">Workshop Status</span>
                  <span className="btn-subtitle">Monitor operations</span>
                </div>
              </button>
              
              <button className="action-btn info">
                <Users className="btn-icon" />
                <div className="btn-content">
                  <span className="btn-title">User Management</span>
                  <span className="btn-subtitle">Manage personnel</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;