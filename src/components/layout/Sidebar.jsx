import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('.hamburger-button')
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Hamburger Icon */}
      <div
        className="hamburger-button"
        onMouseEnter={() => setIsSidebarOpen(true)}
      >
        ☰
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={isSidebarOpen ? 'open' : ''}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <nav className="mt-6">
          <ul>
            {[
              { to: '/', label: 'Dashboard' },
              { to: '/patients', label: 'Patients' },
              { to: '/appointments', label: 'Appointments' },
              { to: '/staff', label: 'Staff' },
              { to: '/inventory', label: 'Inventory' },
              { to: '/billing', label: 'Billing' },
              { to: '/reports', label: 'Reports' },
              { to: '/settings', label: 'Settings' },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setActiveTab(item.to)}
                  className={`block ${activeTab === item.to ? 'active' : ''}`}
                >
                  {item.label}
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
