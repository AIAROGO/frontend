import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api/axiosInstance';

const ReportsAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };
    if (user && ['Admin', 'Analyst'].includes(user.role)) fetchReports();
  }, [user]);

  if (!user || !['Admin', 'Analyst'].includes(user.role)) {
    return (
      <div className="container p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to view reports and analytics.</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Report Overview</h2>
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 animate-pulse">Loading reports...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">No reports available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Report ID</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Type</th>
                  <th className="p-3 text-left text-gray-700 dark:text-gray-300">Generated On</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">{report.id}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{report.type}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{new Date(report.generatedOn).toLocaleDateString()}</td>
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

export default ReportsAnalytics;