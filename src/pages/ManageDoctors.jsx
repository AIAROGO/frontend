import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/api/axiosInstance';

const ManageDoctors = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ 
    id: null, 
    user_id: '', 
    specialty: '', 
    license_number: '', 
    phone: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axiosInstance.get('/api/doctors', config);
      setDoctors(response.data || []);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error(err);
      // Fallback mock data
      setDoctors([
        { id: 1, user_id: 101, specialty: 'Cardiology', license_number: 'LIC-12345', phone: '+1-123-456-7890', user: { name: 'Dr. John Doe' } },
        { id: 2, user_id: 102, specialty: 'Neurology', license_number: 'LIC-67890', phone: '+1-987-654-3210', user: { name: 'Dr. Jane Smith' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.specialty || !formData.license_number || !formData.phone) return;

    if (editingId) {
      // Update
      setDoctors(doctors.map(d => d.id === editingId ? { ...formData, id: editingId } : d));
      setEditingId(null);
    } else {
      // Add new
      const newDoctor = { ...formData, id: Date.now() };
      setDoctors([...doctors, newDoctor]);
    }

    setShowForm(false);
    setFormData({ id: null, user_id: '', specialty: '', license_number: '', phone: '' });
    fetchDoctors(); // Refresh from API if needed
  };

  const handleEdit = (doctor) => {
    setFormData({ id: doctor.id, user_id: doctor.user_id, specialty: doctor.specialty, license_number: doctor.license_number, phone: doctor.phone });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setDoctors(doctors.filter(d => d.id !== id));
      fetchDoctors(); // Refresh
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: null, user_id: '', specialty: '', license_number: '', phone: '' });
    setShowForm(false);
  };

  const toggleForm = () => {
    if (!showForm) {
      setFormData({ id: null, user_id: '', specialty: '', license_number: '', phone: '' });
      setEditingId(null);
    }
    setShowForm(!showForm);
  };

  const filteredDoctors = doctors.filter(doctor =>
    (doctor.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Manage Doctors</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Doctor Button */}
        <button
          onClick={toggleForm}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Doctor'}
        </button>

        {/* Doctor Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <input
              type="number"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              placeholder="User ID"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder={editingId ? "Edit Specialty" : "Specialty"}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              placeholder={editingId ? "Edit License Number" : "License Number"}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={editingId ? "Edit Phone" : "Phone"}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              >
                {editingId ? 'Update Doctor' : 'Add Doctor'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Doctors Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md p-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Specialty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">License</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2">{doctor.user_id}</td>
                      <td className="px-4 py-2">{doctor.user?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{doctor.specialty}</td>
                      <td className="px-4 py-2">{doctor.license_number}</td>
                      <td className="px-4 py-2">{doctor.phone}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Total doctors: {filteredDoctors.length}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;