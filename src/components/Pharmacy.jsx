import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const Pharmacy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', expiryDate: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axiosInstance.get('/pharmacy');
        setMedications(response.data);
      } catch (err) {
        setError('Failed to fetch medications.');
      } finally {
        setLoading(false);
      }
    };
    if (user && ['Admin', 'Pharmacist'].includes(user.role)) fetchMedications();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/pharmacy/${editId}` : '/pharmacy';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);
      setMedications(editId ? medications.map((med) => (med.id === editId ? response.data : med)) : [...medications, response.data]);
      resetForm();
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} medication.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await axiosInstance.delete(`/pharmacy/${id}`);
        setMedications(medications.filter((med) => med.id !== id));
      } catch (err) {
        setError('Failed to delete medication.');
      }
    }
  };

  const handleEdit = (medication) => {
    setEditId(medication.id);
    setFormData({ name: medication.name, quantity: medication.quantity, expiryDate: medication.expiryDate });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', quantity: '', expiryDate: '' });
    setError(null);
  };

  if (!user || !['Admin', 'Pharmacist'].includes(user.role)) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to manage pharmacy inventory.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pharmacy Management</h1>
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
          {editId ? 'Edit Medication' : 'Add New Medication'}
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
              placeholder="Enter medication name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Medication Inventory</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading inventory...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : medications.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No medications in inventory.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Name</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Quantity</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Expiry Date</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr
                    key={med.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{med.name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{med.quantity}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{new Date(med.expiryDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        className="btn-primary text-white px-2 py-1 mr-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => handleEdit(med)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                        onClick={() => handleDelete(med.id)}
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

export default Pharmacy;