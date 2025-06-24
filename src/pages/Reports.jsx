import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ReportList from '../components/reports/ReportList';

const Reports = () => {
  const { darkMode, sidebarOpen } = useTheme();

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Reports</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg !rounded-button whitespace-nowrap">
            Generate Report
          </button>
        </div>
        <ReportList />
      </div>
    </main>
  );
};

export default Reports;