import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const EmergencyCases = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({ patientId: '', description: '', status: 'active' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axiosInstance.get('/emergency-cases');
        setCases(response.data);
      } catch (err) {
        setError('Failed to fetch emergency cases.');
      } finally {
        setLoading(false);
      }
    };
    if (user && ['Admin', 'Nurse'].includes(user.role)) fetchCases();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/emergency-cases/${editId}` : '/emergency-cases';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);
      setCases(editId ? cases.map((c) => (c.id === editId ? response.data : c)) : [...cases, response.data]);
      resetForm();
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} emergency case.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this emergency case?')) {
      try {
        await axiosInstance.delete(`/emergency-cases/${id}`);
        setCases(cases.filter((c) => c.id !== id));
      } catch (err) {
        setError('Failed to delete emergency case.');
      }
    }
  };

  const handleEdit = (caseItem) => {
    setEditId(caseItem.id);
    setFormData({ patientId: caseItem.patientId, description: caseItem.description, status: caseItem.status });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ patientId: '', description: '', status: 'active' });
    setError(null);
  };

  if (!user || !['Admin', 'Nurse'].includes(user.role)) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to manage emergency cases.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Emergency Cases</h1>
        <button
          className="btn-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={() => navigate('/system-settings')}
        >
          Admin Settings
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {editId ? 'Edit Emergency Case' : 'Add New Emergency Case'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient ID</label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {editId ? 'Update' : 'Add'}
            </button>
            {(editId || formData.patientId) && (
              <button
                type="button"
                className="btn-secondary px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Active Cases</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading cases...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : cases.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No emergency cases recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Patient ID</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{c.patientId}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{c.description}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{c.status}</td>
                    <td className="p-3">
                      <button
                        className="btn-primary text-white px-2 py-1 mr-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                        onClick={() => handleDelete(c.id)}
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
  );
};

export default EmergencyCases;