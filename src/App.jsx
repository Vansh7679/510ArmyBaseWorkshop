// App.jsx
import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import MainContent from './components/MainContent.jsx';
import { apiService } from './services/apiService.js';
import './styles/App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState({ 
    id: 1, 
    username: 'col_sharma', 
    role: 'Admin', 
    rank: 'Colonel' 
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [usersData, workshopsData, requestsData, approvalsData, rolesData] = await Promise.all([
        apiService.getUsers(),
        apiService.getWorkshops(),
        apiService.getPartRequests(),
        apiService.getApprovals(),
        apiService.getRoles()
      ]);
      
      setUsers(usersData);
      setWorkshops(workshopsData);
      setPartRequests(requestsData);
      setApprovals(approvalsData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    workshops,
    setWorkshops,
    partRequests,
    setPartRequests,
    approvals,
    setApprovals,
    roles,
    setRoles,
    loading,
    setLoading,
    apiService
  };

  return (
    <AppProvider value={contextValue}>
      <div className="app">
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="app-body">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <MainContent activeSection={activeSection} />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;