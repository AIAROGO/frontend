import React from 'react';
import { useTheme } from '../context/ThemeContext';
import PatientFlowChart from '../components/dashboard/PatientFlowChart'; // Default import
import BedOccupancyChart from '../components/dashboard/BedOccupancyChart'; // Default import
import RevenueChart from '../components/dashboard/RevenueChart'; // Default import
import DepartmentOccupancyChart from '../components/dashboard/DepartmentOccupancyChart'; // Default import
import StatsCard from '../components/dashboard/StatsCard'; // Default import

const Dashboard = () => {
  const { darkMode, sidebarOpen } = useTheme();

  const stats = [
    { icon: 'user-injured', title: 'Total Patients', value: '1,284', change: '12%', changeText: 'from last month', iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { icon: 'procedures', title: 'Available Beds', value: '48/220', change: '8%', changeText: 'from last week', iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { icon: 'calendar-check', title: 'Appointments', value: '42', change: '5%', changeText: 'from yesterday', iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { icon: 'user-md', title: 'Staff On Duty', value: '86', changeText: '24 doctors, 62 nurses', iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ];

  const patients = [
    { name: 'John Smith', id: 'P-20250616-001', age: '45 years, Male', department: 'Cardiology', doctor: 'Dr. Michael Chen', status: 'Active', img: 'profile.jpg' },
  ];

  const appointments = [
    { time: '09:00 AM', patient: 'David Miller', doctor: 'Dr. James Wilson', type: 'Check-up', status: 'Confirmed' },
  ];

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-gray-500">Welcome back, Dr. Johnson. Here's what's happening today.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="font-medium">Emergency Alert: Code Blue in Cardiology Department</p>
              <p className="text-sm">Emergency response team has been dispatched. Please clear the area.</p>
            </div>
            <div className="ml-auto">
              <button className="text-red-500 hover:text-red-700 cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <PatientFlowChart />
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <BedOccupancyChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <RevenueChart />
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <DepartmentOccupancyChart />
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Patients</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer !rounded-button whitespace-nowrap">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={patient.img} alt="Patient" className="h-full w-full object-cover object-top" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : patient.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Appointments table omitted for brevity */}
      </div>
    </main>
  );
};

export default Dashboard;