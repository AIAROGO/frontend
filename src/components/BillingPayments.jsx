import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const BillingPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState({ patientId: '', amount: '', status: 'pending' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axiosInstance.get('/billing');
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch billing records.');
      } finally {
        setLoading(false);
      }
    };
    if (user && ['Admin', 'Receptionist'].includes(user.role)) fetchBills();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `/billing/${editId}` : '/billing';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);
      setBills(editId ? bills.map((bill) => (bill.id === editId ? response.data : bill)) : [...bills, response.data]);
      resetForm();
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'add'} billing record.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this billing record?')) {
      try {
        await axiosInstance.delete(`/billing/${id}`);
        setBills(bills.filter((bill) => bill.id !== id));
      } catch (err) {
        setError('Failed to delete billing record.');
      }
    }
  };

  const handleEdit = (bill) => {
    setEditId(bill.id);
    setFormData({ patientId: bill.patientId, amount: bill.amount, status: bill.status });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ patientId: '', amount: '', status: 'pending' });
    setError(null);
  };

  if (!user || !['Admin', 'Receptionist'].includes(user.role)) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to manage billing.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Billing & Payments</h1>
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
          {editId ? 'Edit Billing Record' : 'Add New Billing'}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              step="0.01"
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
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
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
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Billing Records</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading billing data...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : bills.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No billing records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Patient ID</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{bill.patientId}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">${bill.amount.toFixed(2)}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{bill.status}</td>
                    <td className="p-3">
                      <button
                        className="btn-primary text-white px-2 py-1 mr-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => handleEdit(bill)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
                        onClick={() => handleDelete(bill.id)}
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

export default BillingPayments;