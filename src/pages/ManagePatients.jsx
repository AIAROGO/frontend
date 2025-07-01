import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagePatients = () => {
  const { darkMode, sidebarOpen } = useTheme();
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPatients = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/patients', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPatients(response.data);
        } catch (err) {
          console.error('Error fetching patients:', err.response?.data || err.message);
          setError('Failed to load patients.');
        }
      };
      fetchPatients();
    }
  }, [isAuthenticated]);

  // Clear alert message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(patients.filter((patient) => patient._id !== id));
    } catch (err) {
      console.error('Error deleting patient:', err.response?.data || err.message);
      setError('Failed to delete patient.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/patients/edit/${id}`); // Assuming an edit route (to be added in App.jsx)
  };

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 min-h-screen flex justify-center items-center`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Patients</h2>
          <button
            onClick={() => navigate('/patients/add')}
            className="btn-primary"
          >
            Add Patient
          </button>
        </div>
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        <div className="card p-6">
          <h3 className="text-lg font-medium mb-4">Patient List</h3>
          {patients.length === 0 ? (
            <p className="text-[var(--accent)]">No patients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-2 px-4">Profile</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Age</th>
                    <th className="py-2 px-4">Gender</th>
                    <th className="py-2 px-4">Contact</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id} className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4">
                        <img
                          src={patient.profilePic || 'https://via.placeholder.com/40'}
                          alt={patient.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="py-2 px-4">{patient.name}</td>
                      <td className="py-2 px-4">{patient.age}</td>
                      <td className="py-2 px-4">{patient.gender}</td>
                      <td className="py-2 px-4">{patient.contact}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleEdit(patient._id)}
                          className="btn-secondary mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(patient._id)}
                          className="btn-primary"
                        >
                          Delete
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
    </main>
  );
};

export default ManagePatients;