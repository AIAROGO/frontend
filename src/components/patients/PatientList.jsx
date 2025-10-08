// src/pages/patients/PatientList.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const { darkMode } = useTheme();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/patients', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map backend data to match frontend format
        const formattedPatients = response.data.map((patient) => ({
          id: patient.id,
          name: patient.name,
          age: `${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years, ${patient.gender}`,
          department: patient.department || 'General',
          doctor: patient.doctor || 'Unassigned',
          status: patient.status || 'Active',
          img: patient.profilePic ||
            'https://readdy.ai/api/search-image?query=portrait%20of%20a%20person%2C%20professional%20headshot%2C%20clean%20background%2C%20natural%20lighting%2C%20high%20quality&width=100&height=100&seq=2&orientation=squarish',
        }));
        setPatients(formattedPatients);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch patients');
        console.error('Error fetching patients:', err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-md p-6`}>
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b`}>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={patient.img}
                        alt="Patient"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.age}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">{patient.id}</td>
                <td className="px-6 py-4 text-sm">{patient.department}</td>
                <td className="px-6 py-4 text-sm">{patient.doctor}</td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      patient.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/patients/view/${patient.id}`)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button
                    onClick={() => navigate(`/patients/edit/${patient.id}`)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
