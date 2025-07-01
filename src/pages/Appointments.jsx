import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AppointmentList from '../components/appointments/AppointmentList';

const Appointments = () => {
  const { darkMode, sidebarOpen } = useTheme();
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAppointments = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/appointments', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointments(response.data);
        } catch (err) {
          console.error('Error fetching appointments:', err.response?.data || err.message);
          setError('Failed to load appointments.');
        }
      };
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/appointments', newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments([...appointments, response.data]);
      setNewAppointment({ patientName: '', doctorName: '', date: '', time: '' });
      setError('');
    } catch (err) {
      console.error('Error creating appointment:', err.response?.data || err.message);
      setError('Failed to create appointment.');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Appointments</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        <div className="card p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Schedule New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block mb-2 font-medium">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={newAppointment.patientName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div>
                <label htmlFor="doctorName" className="block mb-2 font-medium">Doctor Name</label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={newAppointment.doctorName}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter doctor name"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block mb-2 font-medium">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newAppointment.date}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block mb-2 font-medium">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter time"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Schedule Appointment
            </button>
          </form>
        </div>
        <div className="card p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Upcoming Appointments </h3>
          {appointments.length === 0 ? (
            <p className="text-blue-500">No appointments scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 text-sm font-medium text-gray-700">Patient</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700">Doctor</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-700">{appointment.patientName}</td>
                      <td className="py-3 px-4 text-gray-700">{appointment.doctorName}</td>
                      <td className="py-3 px-4 text-gray-700">{appointment.date}</td>
                      <td className="py-3 px-4 text-gray-700">{appointment.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      
      </div>
    </main>
  );
};

export default Appointments;