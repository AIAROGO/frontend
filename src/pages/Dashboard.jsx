import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!isAuthenticated || !user || user.role?.toLowerCase() !== 'doctor') return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || 'mock-token';
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [patientsRes, appointmentsRes, inventoryRes, notificationsRes] = await Promise.all([
        axiosInstance.get('/api/patients', config).catch(() => ({
          data: [
            { _id: '1', name: 'John Doe', status: 'Active', date_of_birth: '1985-06-15', gender: 'male', phone: '1234567890', country_code: '+1', notes: 'Stable condition' },
            { _id: '2', name: 'Jane Smith', status: 'Pending', date_of_birth: '1990-03-22', gender: 'female', phone: '9876543210', country_code: '+1', notes: 'Follow-up needed' },
          ]
        })),
        axiosInstance.get('/api/appointments', config).catch(() => ({
          data: [
            { id: '1', patientName: 'John Doe', time: '2025-10-08T10:00:00', status: 'Pending' },
            { id: '2', patientName: 'Jane Smith', time: '2025-10-08T14:00:00', status: 'Confirmed' },
          ]
        })),
        axiosInstance.get('/api/inventory', config).catch(() => ({ data: [] })),
        axiosInstance.get('/api/notifications', config).catch(() => ({
          data: [
            { id: 1, message: 'New patient added.', timestamp: new Date().toLocaleTimeString() },
            { id: 2, message: 'Appointment scheduled.', timestamp: new Date().toLocaleTimeString() },
          ]
        })),
      ]);

      const patientsData = Array.isArray(patientsRes.data) ? patientsRes.data : [];
      const appointmentsData = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
      const inventoryData = Array.isArray(inventoryRes.data) ? inventoryRes.data : [];
      const notificationsData = Array.isArray(notificationsRes.data) ? notificationsRes.data : [];

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setInventory(inventoryData);
      setNotifications(notificationsData);

      setStats({
        totalPatients: patientsData.length,
        availableBeds: {
          total: 50,
          occupied: patientsData.filter((p) => p.status === 'Admitted').length,
        },
        appointments: appointmentsData.length,
        staffOnDuty: {
          doctors: 5, // TODO: Fetch dynamic doctor count if endpoint available
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
  }, [isAuthenticated, user]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Handle appointment status changes
  const updateAppointment = (id, status) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status } : appt
    ));
    setNotifications(prev => [
      ...prev,
      { 
        id: prev.length + 1,
        message: `Appointment ${id} ${status}.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Handle patient notes updates
  const updatePatientNotes = (id, notes) => {
    if (!notes) return;
    
    setPatients(prev => prev.map(p => 
      p._id === id ? { ...p, notes } : p
    ));
    setNotifications(prev => [
      ...prev,
      { 
        id: prev.length + 1,
        message: `EHR updated for patient ${id}.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Calculate age from date of birth
  const calculateAge = dob => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="container p-1 text-red-600 text-center text-sm">
        Please log in to access the dashboard.
      </div>
    );
  }

  if (user?.role?.toLowerCase() !== 'doctor') {
    return (
      <div className="container p-1 text-red-600 bg-red-50 border border-red-200 rounded-lg text-center text-sm">
        <p>Access Denied: Doctor Only</p>
        <button
          className="mt-1 bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 text-xs"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
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
      <div className="container px-1 sm:px-2 py-2 sm:py-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="header-container flex flex-col items-center mb-2 sm:mb-4">
          <div className="text-center">
            <h2
              className={`text-base sm:text-lg md:text-3xl font-bold ${
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
              Welcome back, {user.name || 'Doctor'}! Here's what's happening today.
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
        <div className="stats-container space-y-2 mb-6">
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
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`stat-grid-container p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="stat-icon mb-2">
                <i className="fas fa-user-injured text-blue-500"></i>
              </div>
              <div className="stat-title text-sm text-gray-600 dark:text-gray-300">Total Patients</div>
              <div className="stat-value text-xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</div>
              <div className="stat-change text-xs text-gray-500">0% from last month</div>
            </div>
            <div className={`stat-grid-container p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="stat-icon mb-2">
                <i className="fas fa-procedures text-green-500"></i>
              </div>
              <div className="stat-title text-sm text-gray-600 dark:text-gray-300">Available Beds</div>
              <div className="stat-value text-xl font-bold text-gray-900 dark:text-white">{`${stats.availableBeds.total - stats.availableBeds.occupied}/${stats.availableBeds.total}`}</div>
              <div className="stat-change text-xs text-gray-500">0% from last week</div>
            </div>
            <div className={`stat-grid-container p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="stat-icon mb-2">
                <i className="fas fa-calendar-check text-yellow-500"></i>
              </div>
              <div className="stat-title text-sm text-gray-600 dark:text-gray-300">Appointments</div>
              <div className="stat-value text-xl font-bold text-gray-900 dark:text-white">{stats.appointments}</div>
              <div className="stat-change text-xs text-gray-500">0% from yesterday</div>
            </div>
            <div className={`stat-grid-container p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="stat-icon mb-2">
                <i className="fas fa-user-md text-purple-500"></i>
              </div>
              <div className="stat-title text-sm text-gray-600 dark:text-gray-300">Staff On Duty</div>
              <div className="stat-value text-xl font-bold text-gray-900 dark:text-white">{`${stats.staffOnDuty.doctors} doctors, ${stats.staffOnDuty.nurses} nurses`}</div>
              <div className="stat-change text-xs text-gray-500"></div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <DashboardSection 
          title="Notifications" 
          icon="bell"
          loading={loading}
          isEmpty={notifications.length === 0}
          emptyMessage="No new notifications"
        >
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map(notif => (
              <li 
                key={notif.id} 
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                {notif.message} - {notif.timestamp}
              </li>
            ))}
          </ul>
        </DashboardSection>

        {/* Patients Section */}
        <DashboardSection 
          title="Patients" 
          icon="user-injured"
          loading={loading}
          isEmpty={filteredPatients.length === 0}
          emptyMessage="No patients found"
          headerContent={
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`bg-gray-50 dark:bg-gray-700`}>
                  {['Name', 'Age', 'Gender', 'Contact', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="p-2 text-left text-xs font-medium uppercase text-gray-700 dark:text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">
                      <button 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={() => navigate(`/patients/${patient._id}`)}
                      >
                        {patient.name}
                      </button>
                    </td>
                    <td className="p-2">{patient.date_of_birth ? `${calculateAge(patient.date_of_birth)} years` : 'N/A'}</td>
                    <td className="p-2 capitalize">{patient.gender || 'N/A'}</td>
                    <td className="p-2">{patient.country_code ? `${patient.country_code} ${patient.phone}` : 'N/A'}</td>
                    <td className="p-2">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="p-2 flex gap-2">
                      <button 
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-xs"
                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition text-xs"
                        onClick={() => updatePatientNotes(patient._id, prompt('Enter new notes:', patient.notes || ''))}
                      >
                        Update Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        {/* Appointments Section */}
        <DashboardSection 
          title="Today's Appointments" 
          icon="calendar-check"
          loading={loading}
          isEmpty={appointments.length === 0}
          emptyMessage="No appointments today"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`bg-gray-50 dark:bg-gray-700`}>
                  {['Patient', 'Time', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="p-2 text-left text-xs font-medium uppercase text-gray-700 dark:text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{appt.patientName}</td>
                    <td className="p-2">{new Date(appt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-2">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="p-2 flex gap-2">
                      <button 
                        className={`px-3 py-1 rounded-lg transition text-xs ${
                          appt.status !== 'Pending' 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        onClick={() => updateAppointment(appt.id, 'Confirmed')}
                        disabled={appt.status !== 'Pending'}
                      >
                        Confirm
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-lg transition text-xs ${
                          appt.status !== 'Pending' 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        onClick={() => updateAppointment(appt.id, 'Cancelled')}
                        disabled={appt.status !== 'Pending'}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        {/* Charts */}
        <div className="charts-block grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Patient Flow
            </h3>
            <div className="chart-container h-64">
              <PatientFlowChart data={patients} />
            </div>
          </div>
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Revenue Analysis
            </h3>
            <div className="chart-container h-64">
              <RevenueChart />
            </div>
          </div>
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Bed Occupancy
            </h3>
            <div className="chart-container h-64">
              <BedOccupancyChart data={stats.availableBeds} />
            </div>
          </div>
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h3
              className={`text-sm sm:text-base font-semibold mb-2 text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Department Occupancy
            </h3>
            <div className="chart-container h-64">
              <DepartmentOccupancyChart data={patients} />
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="panels-block grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <ReportGenerator />
          </div>
          <div className={`card p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <CommunicationPanel messages={messages} onSend={setMessages} />
          </div>
        </div>

        {/* Add Patient Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            onClick={() => navigate('/patients/add')}
          >
            <i className="fas fa-plus mr-2"></i>Add Patient
          </button>
        </div>
      </div>
    </main>
  );
};

// Reusable section component
const DashboardSection = ({ title, icon, children, loading, isEmpty, emptyMessage, headerContent }) => (
  <section className={`bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6 ${darkMode ? 'border border-gray-700' : ''}`}>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <h2 className={`text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center`}>
        <i className={`fas fa-${icon} mr-2`}></i> {title}
      </h2>
      {headerContent}
    </div>
    
    {loading ? (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : isEmpty ? (
      <div className="text-center py-8">
        <i className={`fas fa-${icon} text-4xl text-gray-400 dark:text-gray-500 mb-2`}></i>
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    ) : (
      children
    )}
  </section>
);

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      statusStyles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }`}>
      {status || 'Unknown'}
    </span>
  );
};

export default Dashboard;