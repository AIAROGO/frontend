import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const StaffManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axiosInstance.get('/staff');
        setStaff(response.data);
      } catch (err) {
        setError('Failed to fetch staff data.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'Admin') fetchStaff();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/staff/${editId}` : '/staff';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);
      setStaff(editId ? staff.map((s) => (s.id === editId ? response.data : s)) : [...staff, response.data]);
      resetForm();
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} staff member.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axiosInstance.delete(`/staff/${id}`);
        setStaff(staff.filter((s) => s.id !== id));
      } catch (err) {
        setError('Failed to delete staff member.');
      }
    }
  };

  const handleEdit = (staffMember) => {
    setEditId(staffMember.id);
    setFormData({ name: staffMember.name, role: staffMember.role, email: staffMember.email });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', role: '', email: '' });
    setError(null);
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>Only administrators can manage staff.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
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
          {editId ? 'Edit Staff Member' : 'Add New Staff'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter staff name"
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
              <option value="Nurse">Nurse</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Lab Tech">Lab Tech</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {editId ? 'Update' : 'Add'}
            </button>
            {(editId || formData.name) && (
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Staff Directory</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading staff data...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : staff.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No staff members registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Name</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Role</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Email</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{s.name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{s.role}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{s.email}</td>
                    <td className="p-3">
                      <button
                        className="btn-primary text-white px-2 py-1 mr-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                        onClick={() => handleDelete(s.id)}
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

export default StaffManagement;