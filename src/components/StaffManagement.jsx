import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../services/api/axiosInstance';

const StaffManager = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]); 
  const [formData, setFormData] = useState({ name: '', role: '', email: '', country_code: '+254', phone: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (authLoading) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/staff');
        console.log('🟩 Staff API response:', response.data);

        // Detect if backend response contains an object with staff list
        const staffData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.staff)
          ? response.data.staff
          : [];

        setStaff(staffData);
      } catch (err) {
        console.error('❌ Error fetching staff:', err);
        setError(err.response?.data?.message || 'Failed to fetch staff data.');
        setStaff([]); // Reset to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const url = editId ? `/api/staff/${editId}` : '/api/staff';
      const method = editId ? 'put' : 'post';
      const response = await axiosInstance[method](url, formData);

      const updatedData = response.data;

      setStaff((prev) =>
        editId
          ? prev.map((s) => (s.id === editId ? updatedData : s))
          : [...prev, updatedData]
      );

      resetForm();
      navigate('/staff-management');
    } catch (err) {
      console.error('❌ Error saving staff:', err);
      setError('Failed to save staff. Please check the form and try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axiosInstance.delete(`/api/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('❌ Error deleting staff:', err);
      setError('Failed to delete staff member.');
    }
  };

  const handleEdit = (staffMember) => {
    setEditId(staffMember.id);
    setFormData({
      name: staffMember.name || '',
      role: staffMember.role || '',
      email: staffMember.email || '',
      country_code: staffMember.country_code || '+254',
      phone: staffMember.phone || '',
    });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', role: '', email: '', country_code: '+254', phone: '' });
    setError('');
  };

  // 🧠 Safe filtering
  const filteredStaff = Array.isArray(staff)
  ? staff.filter(
      (member) =>
        member?.name?.toLowerCase().includes(search.toLowerCase()) ||
        member?.email?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


  if (authLoading) {
    return <div className="p-4 text-center text-gray-600 dark:text-gray-400">Authenticating...</div>;
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Staff Management
          </h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            onClick={() => navigate('/settings')}
          >
            Admin Settings
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <div className="flex space-x-2">
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="+254">Kenya (+254)</option>
                  <option value="+1">USA (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+91">India (+91)</option>
                </select>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
                {editId ? 'Update' : 'Add'}
              </button>
              {(editId || formData.name || formData.role || formData.email || formData.phone) && (
                <button
                  type="button"
                  className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Staff Directory */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Staff Directory</h2>
          <div className="relative w-full md:w-64 mb-6">
            <input
              type="text"
              placeholder="Search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <i className="fas fa-user-tie text-4xl mb-2"></i>
              <p>No staff members found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    {['Name', 'Role', 'Email', 'Contact', 'Status', 'Actions'].map((header) => (
                      <th key={header} className="p-2 text-left text-xs font-medium uppercase">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s) => (
                    <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-2">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={() => navigate(`/staff-details/${s.id}`)}
                        >
                          {s.name}
                        </button>
                      </td>
                      <td className="p-2">{s.role}</td>
                      <td className="p-2">{s.email}</td>
                      <td className="p-2">{s.country_code} {s.phone}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            s.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : s.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {s.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-2 flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
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
    </div>
  );
};

export default StaffManager;
