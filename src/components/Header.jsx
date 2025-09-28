// components/Header.jsx
import React, { useState } from 'react';
import { Search, User, Bell, Shield, LogOut, Settings } from './SimpleIcons.jsx';
import { useAppContext } from '../contexts/AppContext.jsx';

const Header = ({ activeSection, setActiveSection }) => {
  const { currentUser } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement global search functionality
    console.log('Searching for:', searchTerm);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <Shield className="logo-icon" />
          <div className="logo-text">
            <span className="logo-main">Indian Army</span>
            <span className="logo-sub">Parts Management System</span>
          </div>
        </div>
      </div>
      
      <div className="header-center">
        <form className="search-container" onSubmit={handleSearch}>
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search parts, requests, workshops..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      
      <div className="header-right">
        <div className="notification-container">
          <button className="notification-btn">
            <Bell className="notification-icon" />
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="user-profile-container">
          <button className="user-profile" onClick={handleUserMenuToggle}>
            <User className="profile-icon" />
            <div className="user-info">
              <span className="user-name">{currentUser.rank} {currentUser.username}</span>
              <span className="user-role">{currentUser.role}</span>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <User className="menu-user-icon" />
                <div className="menu-user-info">
                  <span className="menu-user-name">{currentUser.rank} {currentUser.username}</span>
                  <span className="menu-user-role">{currentUser.role}</span>
                </div>
              </div>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item">
                <Settings className="menu-item-icon" />
                Account Settings
              </button>
              <button className="user-menu-item">
                <User className="menu-item-icon" />
                Profile
              </button>
              <div className="user-menu-divider"></div>
              <button className="user-menu-item logout">
                <LogOut className="menu-item-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;