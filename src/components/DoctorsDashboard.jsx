import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState({ 
    patients: [], 
    appointments: [], 
    notifications: [] 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    if (authLoading || !user || user.role?.toLowerCase() !== 'doctor') return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || 'mock-token';
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const requests = [
          axiosInstance.get('/api/patients', config).catch(() => ({
            data: [
              { _id: '1', name: 'John Doe', status: 'Active', date_of_birth: '1985-06-15', gender: 'male', phone: '1234567890', country_code: '+1', notes: 'Stable condition' },
              { _id: '2', name: 'Jane Smith', status: 'Pending', date_of_birth: '1990-03-22', gender: 'female', phone: '9876543210', country_code: '+1', notes: 'Follow-up needed' },
            ]
          })),
          axiosInstance.get('/api/appointments', config).catch(() => ({
            data: [
              { id: '1', patientName: 'John Doe', time: '2025-07-03T10:00:00', status: 'Pending' },
              { id: '2', patientName: 'Jane Smith', time: '2025-07-03T14:00:00', status: 'Confirmed' },
            ]
          })),
          axiosInstance.get('/api/notifications', config).catch(() => ({
            data: [
              { id: 1, message: 'New patient added.', timestamp: new Date().toLocaleTimeString() },
              { id: 2, message: 'Appointment scheduled.', timestamp: new Date().toLocaleTimeString() },
            ]
          }))
        ];

        const [patientsResp, appointmentsResp, notificationsResp] = await Promise.all(requests);
        
        setData({
          patients: patientsResp.data || [],
          appointments: appointmentsResp.data || [],
          notifications: notificationsResp.data || []
        });
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Handle appointment status changes
  const updateAppointment = (id, status) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(appt => 
        appt.id === id ? { ...appt, status } : appt
      ),
      notifications: [
        ...prev.notifications,
        { 
          id: prev.notifications.length + 1,
          message: `Appointment ${id} ${status}.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    }));
  };

  // Handle patient notes updates
  const updatePatientNotes = (id, notes) => {
    if (!notes) return;
    
    setData(prev => ({
      ...prev,
      patients: prev.patients.map(p => 
        p._id === id ? { ...p, notes } : p
      ),
      notifications: [
        ...prev.notifications,
        { 
          id: prev.notifications.length + 1,
          message: `EHR updated for patient ${id}.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    }));
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
  const filteredPatients = data.patients.filter(patient =>
    patient.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Access denied
  if (!user || user.role?.toLowerCase() !== 'doctor') {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header without the Profile button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Doctor Dashboard
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              onClick={() => navigate('/patients/add')}
            >
              <i className="fas fa-plus mr-2"></i>Add Patient
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Notifications */}
        <DashboardSection 
          title="Notifications" 
          icon="bell"
          loading={loading}
          isEmpty={data.notifications.length === 0}
          emptyMessage="No new notifications"
        >
          <ul className="space-y-2">
            {data.notifications.map(notif => (
              <li 
                key={notif.id} 
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                {notif.message} - {notif.timestamp}
              </li>
            ))}
          </ul>
        </DashboardSection>

        {/* Patients */}
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
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {['Name', 'Age', 'Gender', 'Contact', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="p-2 text-left text-xs font-medium uppercase">
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
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
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

        {/* Appointments */}
        <DashboardSection 
          title="Today's Appointments" 
          icon="calendar-check"
          loading={loading}
          isEmpty={data.appointments.length === 0}
          emptyMessage="No appointments today"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {['Patient', 'Time', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="p-2 text-left text-xs font-medium uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.appointments.map(appt => (
                  <tr key={appt.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{appt.patientName}</td>
                    <td className="p-2">{new Date(appt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-2">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="p-2 flex gap-2">
                      <button 
                        className={`px-3 py-1 rounded-lg transition ${
                          appt.status !== 'Pending' 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                        onClick={() => updateAppointment(appt.id, 'confirmed')}
                        disabled={appt.status !== 'Pending'}
                      >
                        Confirm
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-lg transition ${
                          appt.status !== 'Pending' 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        onClick={() => updateAppointment(appt.id, 'cancelled')}
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
      </div>
    </div>
  );
};

// Reusable section component
const DashboardSection = ({ title, icon, children, loading, isEmpty, emptyMessage, headerContent }) => (
  <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
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
    Active: 'bg-green-100 text-green-800',
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    }`}>
      {status || 'Unknown'}
    </span>
  );
};

export default DoctorDashboard;