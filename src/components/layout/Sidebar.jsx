import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const sidebarRef = useRef(null);

  // Toggle when clicking hamburger (still works)
  const handleToggle = () => {
    console.log('Hamburger clicked, isSidebarOpen:', !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.hamburger-button')
      ) {
        console.log('Clicked outside, closing sidebar');
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 👇 New: Auto-open sidebar on hover
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleMouseEnter = () => {
      console.log('Hovered over sidebar — opening');
      setIsSidebarOpen(true);
    };

    const handleMouseLeave = () => {
      console.log('Mouse left sidebar — closing');
      setIsSidebarOpen(false);
    };

    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Menu items
  const menuItems = [
    { to: '/', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { to: '/manage-patients', label: 'Manage Patients', icon: 'fa-users' },
    { to: '/manage-doctors', label: 'Doctors', icon: 'fa-user-md' },
    { to: '/appointments', label: 'Appointments', icon: 'fa-calendar-check' },
    { to: '/staff-management', label: 'Staff Management', icon: 'fa-users-cog' },
    { to: '/inventory', label: 'Inventory', icon: 'fa-boxes' },
    { to: '/bed-room-management', label: 'Bed/Room Management', icon: 'fa-bed' },
    { to: '/billing-payment', label: 'Billing & Payment', icon: 'fa-money-bill' },
    { to: '/reports-analytics', label: 'Reports & Analytics', icon: 'fa-chart-line' },
    { to: '/laboratory', label: 'Laboratory', icon: 'fa-flask' },
    { to: '/pharmacy', label: 'Pharmacy', icon: 'fa-prescription' },
    { to: '/system-settings', label: 'System Settings', icon: 'fa-cog' },
    { to: '/emergency-cases', label: 'Emergency Cases', icon: 'fa-ambulance' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger-button"
        onClick={handleToggle}
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}
      >
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to} className="sidebar-item">
                <Link
                  to={item.to}
                  onClick={() => {
                    setActiveTab(item.to);
                    if (window.innerWidth <= 768) setIsSidebarOpen(false);
                  }}
                  className={`sidebar-link ${activeTab === item.to ? 'active' : ''} ${
                    !isSidebarOpen ? 'collapsed' : ''
                  }`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span className="link-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
