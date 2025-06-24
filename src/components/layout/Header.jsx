import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    notifications,
    messages,
  } = useTheme();

  return (
    <header style={{ backgroundColor: darkMode ? '#1f2937' : 'white' }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <div className="flex items-center">
              <i className="fas fa-hospital" style={{ color: '#2563eb', fontSize: '24px', marginRight: '8px' }}></i>
              <h1 style={{ fontSize: '20px', fontWeight: '600' }}>MediCare Pro</h1>
            </div>
          </div>

          {/* Right Section - Search, Notifications, Theme Toggle, Profile */}
          <div className="flex items-center">
            {/* Search Input */}
            <div style={{ position: 'relative', marginRight: '16px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '256px',
                  padding: '8px 32px 8px 40px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  fontSize: '14px',
                }}
              />
              <div style={{ position: 'absolute', left: '12px', top: '10px', color: '#6b7280' }}>
                <i className="fas fa-search"></i>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative', marginRight: '16px' }}>
              <button
                style={{
                  padding: '8px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                }}
              >
                <i className="fas fa-bell" style={{ fontSize: '18px' }}></i>
                {notifications > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '9999px',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Messages */}
            <div style={{ position: 'relative', marginRight: '16px' }}>
              <button
                style={{
                  padding: '8px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                }}
              >
                <i className="fas fa-envelope" style={{ fontSize: '18px' }}></i>
                {messages > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '9999px',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    {messages}
                  </span>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '8px',
                borderRadius: '9999px',
                backgroundColor: darkMode ? '#374151' : '#e5e7eb',
              }}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} style={{ fontSize: '18px' }}></i>
            </button>

            {/* User Profile */}
            <div className="flex items-center" style={{ marginLeft: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden' }}>
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20doctor%20with%20a%20friendly%20smile%2C%20wearing%20a%20white%20coat%2C%20high%20quality%20professional%20headshot%2C%20clean%20background%2C%20medical%20professional&width=100&height=100&seq=1&orientation=squarish"
                  alt="User Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div style={{ marginLeft: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>Dr. Rhoda Ghati</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
