// pages/ReportsAnalytics.jsx
import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, PieChart, FileText, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.jsx';

const ReportsAnalytics = () => {
  const { partRequests, workshops, approvals, currentUser } = useAppContext();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  // Calculate analytics data
  const analytics = {
    totalRequests: partRequests.length,
    pendingRequests: partRequests.filter(req => req.status === 'PENDING').length,
    approvedRequests: partRequests.filter(req => req.status === 'APPROVED').length,
    rejectedRequests: partRequests.filter(req => req.status === 'REJECTED').length,
    approvalRate: (partRequests.filter(req => req.status === 'APPROVED').length / partRequests.length * 100).toFixed(1),
    avgProcessingTime: '2.3 days',
    totalValue: partRequests.reduce((sum, req) => sum + (req.estimatedCost || 0), 0)
  };

  // Priority distribution
  const priorityData = {
    'CRITICAL': partRequests.filter(req => req.priority === 'CRITICAL').length,
    'HIGH': partRequests.filter(req => req.priority === 'HIGH').length,
    'MEDIUM': partRequests.filter(req => req.priority === 'MEDIUM').length,
    'LOW': partRequests.filter(req => req.priority === 'LOW').length
  };

  // Workshop performance
  const workshopPerformance = workshops.map(workshop => {
    const workshopRequests = partRequests.filter(req => req.workshopId === workshop.id);
    const approvedCount = workshopRequests.filter(req => req.status === 'APPROVED').length;
    
    return {
      name: workshop.name,
      totalRequests: workshopRequests.length,
      approvedRequests: approvedCount,
      approvalRate: workshopRequests.length > 0 ? (approvedCount / workshopRequests.length * 100).toFixed(1) : 0
    };
  });

  const handleExportReport = (format) => {
    console.log(`Exporting ${reportType} report in ${format} format`);
  };

  const canViewReports = ['Admin', 'Manager'].includes(currentUser.role);

  if (!canViewReports) {
    return (
      <div className="reports-analytics">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
          <p>Access Denied - Insufficient Permissions</p>
        </div>
        <div className="access-denied">
          <BarChart3 className="access-denied-icon" />
          <h3>Access Restricted</h3>
          <p>You do not have sufficient permissions to view reports and analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-analytics">
      <div className="page-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights into parts management operations</p>
        </div>
        <div className="header-actions">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="filter-select"
          >
            <option value="overview">Overview Report</option>
            <option value="workshop">Workshop Performance</option>
            <option value="priority">Priority Analysis</option>
            <option value="financial">Financial Summary</option>
          </select>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handleExportReport('pdf')}
          >
            <Download /> Export PDF
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => handleExportReport('excel')}
          >
            <Download /> Export Excel
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FileText />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalRequests}</h3>
            <p>Total Requests</p>
            <div className="stat-trend">
              <TrendingUp className="trend-icon up" />
              <span>+12% from last period</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <h3>{analytics.approvalRate}%</h3>
            <p>Approval Rate</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                {analytics.approvedRequests} approved
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-content">
            <h3>{analytics.avgProcessingTime}</h3>
            <p>Avg Processing Time</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                Target: 2 days
              </span>
            </div>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">
            <PieChart />
          </div>
          <div className="stat-content">
            <h3>₹{analytics.totalValue.toLocaleString()}</h3>
            <p>Total Request Value</p>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                Current period
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="charts-grid">
        {/* Request Status Distribution */}
        <div className="chart-card">
          <div className="card-header">
            <h2>Request Status Distribution</h2>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="status-distribution">
                <div className="status-item">
                  <div className="status-bar approved" style={{ width: `${(analytics.approvedRequests / analytics.totalRequests) * 100}%` }}></div>
                  <span className="status-label">Approved ({analytics.approvedRequests})</span>
                </div>
                <div className="status-item">
                  <div className="status-bar pending" style={{ width: `${(analytics.pendingRequests / analytics.totalRequests) * 100}%` }}></div>
                  <span className="status-label">Pending ({analytics.pendingRequests})</span>
                </div>
                <div className="status-item">
                  <div className="status-bar rejected" style={{ width: `${(analytics.rejectedRequests / analytics.totalRequests) * 100}%` }}></div>
                  <span className="status-label">Rejected ({analytics.rejectedRequests})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Priority Analysis */}
        <div className="chart-card">
          <div className="card-header">
            <h2>Priority Distribution</h2>
          </div>
          <div className="card-content">
            <div className="priority-chart">
              {Object.entries(priorityData).map(([priority, count]) => (
                <div key={priority} className="priority-item">
                  <div className="priority-info">
                    <span className={`priority-dot priority-${priority.toLowerCase()}`}></span>
                    <span className="priority-name">{priority}</span>
                  </div>
                  <div className="priority-count">{count}</div>
                  <div className="priority-bar">
                    <div 
                      className={`priority-fill priority-${priority.toLowerCase()}`}
                      style={{ width: `${(count / analytics.totalRequests) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Workshop Performance */}
        <div className="chart-card workshop-performance">
          <div className="card-header">
            <h2>Workshop Performance</h2>
          </div>
          <div className="card-content">
            <div className="workshop-chart">
              {workshopPerformance.map((workshop, index) => (
                <div key={index} className="workshop-item">
                  <div className="workshop-info">
                    <h4>{workshop.name}</h4>
                    <div className="workshop-stats">
                      <span className="stat">Requests: {workshop.totalRequests}</span>
                      <span className="stat">Approved: {workshop.approvedRequests}</span>
                      <span className="stat success">Rate: {workshop.approvalRate}%</span>
                    </div>
                  </div>
                  <div className="workshop-progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${workshop.approvalRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Activity Timeline */}
        <div className="chart-card timeline">
          <div className="card-header">
            <h2>Recent Activity Timeline</h2>
          </div>
          <div className="card-content">
            <div className="timeline-container">
              {partRequests.slice().sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)).slice(0, 5).map(request => {
                const workshop = workshops.find(w => w.id === request.workshopId);
                return (
                  <div key={request.id} className="timeline-item">
                    <div className={`timeline-dot ${request.status.toLowerCase()}`}></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-title">Request #{request.id} - {request.partName}</span>
                        <span className="timeline-date">{request.requestDate}</span>
                      </div>
                      <div className="timeline-details">
                        <span className="timeline-workshop">{workshop?.name}</span>
                        <span className={`timeline-status ${request.status.toLowerCase()}`}>{request.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Tables */}
      <div className="summary-section">
        <div className="card">
          <div className="card-header">
            <h2>Top Requested Parts</h2>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Requests</th>
                    <th>Approval Rate</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Group parts by name and calculate stats */}
                  {Object.entries(
                    partRequests.reduce((acc, req) => {
                      if (!acc[req.partName]) {
                        acc[req.partName] = {
                          count: 0,
                          approved: 0,
                          totalValue: 0
                        };
                      }
                      acc[req.partName].count++;
                      if (req.status === 'APPROVED') acc[req.partName].approved++;
                      acc[req.partName].totalValue += (req.estimatedCost || 0);
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b.count - a.count)
                  .slice(0, 5)
                  .map(([partName, stats]) => (
                    <tr key={partName}>
                      <td>{partName}</td>
                      <td>{stats.count}</td>
                      <td>{stats.count > 0 ? ((stats.approved / stats.count) * 100).toFixed(1) : 0}%</td>
                      <td>₹{stats.totalValue.toLocaleString()}</td>
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

export default ReportsAnalytics;