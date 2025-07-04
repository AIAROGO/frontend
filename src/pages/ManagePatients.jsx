import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPatients, deletePatient } from '../services/api/patientApi';

const ManagePatients = () => {
  const { darkMode, sidebarOpen } = useTheme();
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      const getPatients = async () => {
        try {
          setLoading(true);
          const data = await fetchPatients();
          console.log('Patients data:', JSON.stringify(data, null, 2)); // Debug
          setPatients(data);
        } catch (err) {
          console.error('Error in getPatients:', err);
          setError(
            err.response?.status === 401
              ? 'Unauthorized: Please log in again.'
              : err.response?.data?.message || 'Failed to load patients.'
          );
        } finally {
          setLoading(false);
        }
      };
      getPatients();
    } else {
      setError('Please log in to view patients.');
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid patient ID.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }
    try {
      setDeletingId(id);
      console.log('Deleting patient with ID:', id);
      await deletePatient(id);
      setPatients(patients.filter((patient) => patient.id !== id));
      setError('Patient deleted successfully');
    } catch (err) {
      console.error('Error in handleDelete:', err);
      setError(
        err.response?.status === 404
          ? 'Patient not found.'
          : err.response?.status === 401
          ? 'Unauthorized: Please log in again.'
          : err.response?.data?.message || 'Failed to delete patient.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    if (!id) {
      setError('Invalid patient ID.');
      return;
    }
    console.log('Edit clicked for patient ID:', id);
    setEditingId(id);
    navigate(`/patients/edit/${id}`);
    setEditingId(null);
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

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage Patients</h2>
          <button
            onClick={() => {
              console.log('Navigating to /patients/add');
              navigate('/patients/add');
            }}
            className="btn-primary px-3 py-1"
          >
            Add Patient
          </button>
        </div>

        {error && (
          <div
            className={`mb-4 p-3 rounded-md ${
              error.includes('success')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {error}
          </div>
        )}

        <div className="card p-6">
          <h3 className="text-lg font-medium mb-4">Patient List</h3>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : patients.length === 0 ? (
            <p className="text-[var(--accent)] py-4 text-center">No patients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-3 px-4">Profile</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Age</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id} // Use id instead of _id
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-color)]"
                    >
                      <td className="py-3 px-4">
                        <img
                          src={patient.profilePic || 'https://via.placeholder.com/40'}
                          alt={patient.name || 'Patient'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{patient.name || 'N/A'}</td>
                      <td className="py-3 px-4">{calculateAge(patient.date_of_birth)}</td>
                      <td className="py-3 px-4 capitalize">{patient.gender || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {patient.country_code && patient.phone
                          ? `${patient.country_code} ${patient.phone}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            patient.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : patient.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {patient.status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(patient.id)}
                            className="btn-secondary px-3 py-1"
                            disabled={editingId === patient.id}
                          >
                            {editingId === patient.id ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              'Edit'
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                            disabled={deletingId === patient.id}
                          >
                            {deletingId === patient.id ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
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