import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const SystemSettings = () => {
  const { user, generatePassword, users } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.role) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const password = generatePassword(formData.username, formData.role);
      await axiosInstance.post('/users', { username: formData.username, password, role: formData.role });
      setError(null);
      alert(`Generated password for ${formData.username}: ${password}`);
      setFormData({ username: '', role: '' });
    } catch (err) {
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>Only administrators can manage system settings.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Settings</h1>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Generate User Credentials</h2>
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Role</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Lab Tech">Lab Tech</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Password'}
          </button>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Registered Users</h2>
        {Object.entries(users).length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No users registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Username</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Role</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Password</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(users).map(([username, { role, password }]) => (
                  <tr
                    key={username}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{username}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{role}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{password}</td>
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

export default SystemSettings;