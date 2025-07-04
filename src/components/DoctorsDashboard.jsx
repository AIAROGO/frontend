import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || 'mock-token';
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [patientsResp, appointmentsResp, notificationsResp] = await Promise.all([
          axiosInstance.get('/api/patients').catch(() => ({
            data: [
              { _id: '1', name: 'John Doe', status: 'Active', date_of_birth: '1985-06-15', gender: 'male', phone: '1234567890', country_code: '+1', notes: 'Stable condition' },
              { _id: '2', name: 'Jane Smith', status: 'Pending', date_of_birth: '1990-03-22', gender: 'female', phone: '9876543210', country_code: '+1', notes: 'Follow-up needed' },
            ],
          })),
          axiosInstance.get('/api/appointments').catch(() => ({
            data: [
              { id: '1', patientName: 'John Doe', time: '2025-07-03T10:00:00', status: 'Pending' },
              { id: '2', patientName: 'Jane Smith', time: '2025-07-03T14:00:00', status: 'Confirmed' },
            ],
          })),
          axiosInstance.get('/api/notifications').catch(() => ({
            data: [
              { id: 1, message: 'New patient added.', timestamp: new Date().toLocaleTimeString() },
              { id: 2, message: 'Appointment scheduled.', timestamp: new Date().toLocaleTimeString() },
            ],
          })),
        ]);
        setPatients(Array.isArray(patientsResp.data) ? patientsResp.data : []);
        setAppointments(Array.isArray(appointmentsResp.data) ? appointmentsResp.data : []);
        setNotifications(Array.isArray(notificationsResp.data) ? notificationsResp.data : []);
      } catch (err) {
        setError('Failed to fetch data. Displaying fallback data.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && user.role?.toLowerCase() === 'doctor') {
      fetchData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      await axiosInstance.put(`/api/appointments/${appointmentId}`, { status: action });
      setAppointments(appointments.map((appt) =>
        appt.id === appointmentId ? { ...appt, status: action } : appt
      ));
      setNotifications([...notifications, {
        id: notifications.length + 1,
        message: `Appointment ${appointmentId} ${action}.`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (err) {
      setError(`Failed to ${action} appointment.`);
      console.error('Appointment action error:', err);
    }
  };

  const handleEHRUpdate = async (patientId, notes) => {
    if (!notes) return;
    try {
      await axiosInstance.put(`/api/patients/${patientId}`, { notes });
      setPatients(patients.map((p) =>
        p._id === patientId ? { ...p, notes } : p
      ));
      setNotifications([...notifications, {
        id: notifications.length + 1,
        message: `EHR updated for patient ${patientId}.`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (err) {
      setError('Failed to update EHR.');
      console.error('EHR update error:', err);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-400 animate-pulse">
        Loading...
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== 'doctor') {
    return (
      <div className="mx-auto max-w-7xl p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Doctor Dashboard</h1>
          <div className="flex space-x-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              onClick={() => navigate('/patients/add')}
            >
              <i className="fas fa-plus mr-2"></i>Add Patient
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <i className="fas fa-bell mr-2"></i> Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No new notifications.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notif) => (
                <li key={notif.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  <span>{notif.message} - {notif.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <i className="fas fa-user-injured mr-2"></i> Patients
            </h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-user-injured text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">No patients found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Age</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gender</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">
                        <span
                          className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={() => navigate(`/patients/${patient._id}`)}
                        >
                          {patient.name}
                        </span>
                      </td>
                      <td className="px-4 py-2">{patient.date_of_birth ? `${calculateAge(patient.date_of_birth)} years` : 'N/A'}</td>
                      <td className="px-4 py-2 capitalize">{patient.gender || 'N/A'}</td>
                      <td className="px-4 py-2">{patient.country_code ? `${patient.country_code} ${patient.phone}` : 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.status === 'Active' ? 'bg-green-100 text-green-800' :
                          patient.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {patient.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                          onClick={() => navigate(`/patients/edit/${patient._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                          onClick={() => handleEHRUpdate(patient._id, prompt('Enter new notes:', patient.notes || ''))}
                        >
                          Update Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
            <i className="fas fa-calendar-check mr-2"></i> Today’s Appointments
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-calendar-check text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">No appointments today.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">{appt.patientName}</td>
                      <td className="px-4 py-2">{new Date(appt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
                          onClick={() => handleAppointmentAction(appt.id, 'confirmed')}
                          disabled={appt.status !== 'Pending'}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                          onClick={() => handleAppointmentAction(appt.id, 'cancelled')}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;