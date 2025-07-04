import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/api/axiosInstance';
import PatientFlowChart from '../components/dashboard/PatientFlowChart';
import BedOccupancyChart from '../components/dashboard/BedOccupancyChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import DepartmentOccupancyChart from '../components/dashboard/DepartmentOccupancyChart';
import ReportGenerator from '../components/dashboard/ReportGenerator';
import CommunicationPanel from '../components/dashboard/CommunicationPanel';

const Dashboard = () => {
  const { darkMode, sidebarOpen } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    totalPatients: 0,
    availableBeds: { total: 50, occupied: 0 },
    appointments: 0,
    staffOnDuty: { doctors: 5, nurses: 10 },
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    try {
      const [patientsRes, appointmentsRes, inventoryRes] = await Promise.all([
        axiosInstance.get('/api/patients'), // Added /api prefix
        axiosInstance.get('/api/appointments'), // Added /api prefix
        axiosInstance.get('/api/inventory').catch(() => ({ data: [] })), // Fallback for missing endpoint
      ]);

      const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : [];
      const appointmentsData = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
      const inventoryData = Array.isArray(inventoryRes.data) ? inventoryRes.data : [];

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setInventory(inventoryData);

      setStats({
        totalPatients: patientsData.length,
        availableBeds: {
          total: 50,
          occupied: patientsData.filter((p) => p.status === 'Admitted').length,
        },
        appointments: appointmentsData.length,
        staffOnDuty: {
          doctors: 5,
          nurses: 10,
        },
      });
    } catch (err) {
      const errorMessage = `Failed to load dashboard data: Request failed with status code ${err.response?.status} at ${err.config?.url || 'unknown endpoint'}`;
      setError(errorMessage);
      console.error('API fetch error:', {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        response: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (!isAuthenticated) {
    return (
      <div className="container p-1 text-red-600 text-center text-sm">
        Please log in to access the dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container p-1 text-center text-gray-600 text-sm">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-1 text-red-600 bg-red-50 border border-red-200 rounded-lg text-center text-sm">
        <p>{error}</p>
        <button
          className="mt-1 bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 text-xs"
          onClick={handleRefresh}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main
      className={`pt-12 ${sidebarOpen ? 'sm:ml-48 ml-12' : 'ml-0'} transition-all duration-300 ease-in-out min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } doctor-dashboard`}
    >
      <div className="container px-1 sm:px-2 py-2 sm:py-4">
        {/* Header */}
        <div className="header-container flex flex-col items-center mb-2 sm:mb-4">
          <div className="text-center">
            <h2
              className={`text-base sm:text-lg md:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Dashboard
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } mt-0.5`}
            >
              Welcome back, Doctor! Here's what's happening today.
            </p>
          </div>
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg px-2 py-1 shadow-sm mt-2 sm:mt-0`}
          >
            <p
              className={`text-xs ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              ,{' '}
              <span className="font-medium">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>{' '}
              EAT
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-container space-y-2">
          <div className="flex justify-between items-center w-full">
            <h3
              className={`text-sm sm:text-base font-semibold text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Overview
            </h3>
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition duration-200 text-xs"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-grid-container">
              <div className="stat-icon">
                <i className="fas fa-user-injured"></i>
              </div>
              <div className="stat-title">Total Patients</div>
              <div className="stat-value">{stats.totalPatients}</div>
              <div className="stat-change">
                {stats.totalPatients === 0 ? '0%' : '0%'} from last month
              </div>
            </div>
            <div className="stat-grid-container">
              <div className="stat-icon">
                <i className="fas fa-procedures"></i>
              </div>
              <div className="stat-title">Available Beds</div>
              <div className="stat-value">{`${stats.availableBeds.total - stats.availableBeds.occupied}/${stats.availableBeds.total}`}</div>
              <div className="stat-change">
                {stats.availableBeds.occupied === 0 ? '0%' : '0%'} from last week
              </div>
            </div>
            <div className="stat-grid-container">
              <div className="stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-title">Appointments</div>
              <div className="stat-value">{stats.appointments}</div>
              <div className="stat-change">
                {stats.appointments === 0 ? '0%' : '0%'} from yesterday
              </div>
            </div>
            <div className="stat-grid-container">
              <div className="stat-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <div className="stat-title">Staff On Duty</div>
              <div className="stat-value">{`${stats.staffOnDuty.doctors} doctors, ${stats.staffOnDuty.nurses} nurses`}</div>
              <div className="stat-change"></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-block">
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Patient Flow
            </h3>
            <div className="chart-container">
              <PatientFlowChart data={patients} />
            </div>
          </div>
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Revenue Analysis
            </h3>
            <div className="chart-container">
              <RevenueChart />
            </div>
          </div>
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Bed Occupancy
            </h3>
            <div className="chart-container">
              <BedOccupancyChart data={stats.availableBeds} />
            </div>
          </div>
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Department Occupancy
            </h3>
            <div className="chart-container">
              <DepartmentOccupancyChart data={patients} />
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="panels-block">
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <ReportGenerator />
          </div>
          <div className={`card ${darkMode ? 'dark' : ''}`}>
            <CommunicationPanel messages={messages} onSend={setMessages} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;