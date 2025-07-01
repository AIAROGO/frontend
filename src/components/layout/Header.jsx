import React, { useEffect } from 'react';
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

  // Debugging render count
  useEffect(() => {
    console.log('Header rendered');
    return () => console.log('Header unmounted');
  }, []);

  return (
    <header>
      <div className="header-container">
        <div className="flex items-center gap-1">
          <i className="fas fa-hospital text-primary text-base sm:text-lg"></i>
          <h1 className={`text-xs sm:text-sm md:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            MediCare Pro
          </h1>
        </div>
        <div className="header-actions">
          <div className="relative hidden sm:block">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search search-bar-icon"></i>
          </div>
          <div className="relative">
            <button className="notification-icon">
              <i className="fas fa-bell text-sm sm:text-base"></i>
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div>
          <div className="relative">
            <button className="message-icon">
              <i className="fas fa-envelope text-sm sm:text-base"></i>
              {messages > 0 && (
                <span className="message-badge">{messages}</span>
              )}
            </button>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-sm sm:text-base`}></i>
          </button>
          <div className="profile-container">
            <div className="profile-image">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20doctor%20with%20a%20friendly%20smile%2C%20wearing%20a%20white%20coat%2C%20high%20quality%20professional%20headshot%2C%20clean%20background%2C%20medical%20professional&width=100&height=100&seq=1&orientation=squarish"
                alt="User Profile"
              />
            </div>
            <div className="profile-info hidden sm:block">
              <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>Dr. Rhoda Ghati</p>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;