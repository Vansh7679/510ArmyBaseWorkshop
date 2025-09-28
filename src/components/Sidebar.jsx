// components/Sidebar.jsx
import React from 'react';
import { Home, FileText, CheckCircle, Wrench, Users, Settings, BarChart3, Archive } from './SimpleIcons.jsx';
import { useAppContext } from '../contexts/AppContext.jsx';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { currentUser, partRequests } = useAppContext();
  
  const pendingApprovalsCount = partRequests.filter(req => req.status === 'PENDING').length;
  
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Command Dashboard', 
      icon: Home, 
      roles: ['Admin', 'Manager', 'User'] 
    },
    { 
      id: 'part-requests', 
      label: 'Part Requests', 
      icon: FileText, 
      roles: ['Admin', 'Manager', 'User'] 
    },
    { 
      id: 'approvals', 
      label: 'Approval Center', 
      icon: CheckCircle, 
      roles: ['Admin', 'Manager'],
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null
    },
    { 
      id: 'workshops', 
      label: 'Workshop Management', 
      icon: Wrench, 
      roles: ['Admin', 'Manager'] 
    },
    { 
      id: 'inventory', 
      label: 'Inventory Tracking', 
      icon: Archive, 
      roles: ['Admin', 'Manager', 'User'] 
    },
    { 
      id: 'reports', 
      label: 'Reports & Analytics', 
      icon: BarChart3, 
      roles: ['Admin', 'Manager'] 
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      roles: ['Admin'] 
    },
    { 
      id: 'roles', 
      label: 'Role Management', 
      icon: Settings, 
      roles: ['Admin'] 
    }
  ];

  // Filter menu items based on user role
  const accessibleMenuItems = menuItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Operations</div>
          {accessibleMenuItems.slice(0, 6).map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
        
        {currentUser.role === 'Admin' && (
          <div className="nav-section">
            <div className="nav-section-title">Administration</div>
            {accessibleMenuItems.slice(6).map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </nav>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span className="status-text">System Online</span>
        </div>
        <div className="version-info">
          <span>v2.1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;