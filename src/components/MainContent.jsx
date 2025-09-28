// components/MainContent.jsx
import React from 'react';
import Dashboard from '../pages/Dashboard.jsx';
import PartRequests from '../pages/PartRequests.jsx';
import ApprovalCenter from '../pages/ApprovalCenter.jsx';
import Workshops from '../pages/Workshops.jsx';
import UserManagement from '../pages/UserManagement.jsx';
import RoleManagement from '../pages/RoleManagement.jsx';
import InventoryTracking from '../pages/InventoryTracking.jsx';
import ReportsAnalytics from '../pages/ReportsAnalytics.jsx';
import { useAppContext } from '../contexts/AppContext.jsx';

const MainContent = ({ activeSection }) => {
  const { loading } = useAppContext();
  
  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading military operations data...</p>
        </div>
      </main>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'part-requests':
        return <PartRequests />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'workshops':
        return <Workshops />;
      case 'inventory':
        return <InventoryTracking />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RoleManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="main-content">
      <div className="content-wrapper">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;