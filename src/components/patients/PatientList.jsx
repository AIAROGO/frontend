import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const PatientList = () => {
  const { darkMode } = useTheme();

  // Mock data (replace with API call later)
  const patients = [
    {
      name: 'John Smith',
      id: 'P-20250616-001',
      age: '45 years, Male',
      department: 'Cardiology',
      doctor: 'Dr. Michael Chen',
      status: 'Active',
      img: 'https://readdy.ai/api/search-image?query=portrait%20of%20a%20middle%20aged%20man%20with%20short%20hair%20and%20glasses%2C%20professional%20headshot%2C%20clean%20background%2C%20natural%20lighting%2C%20high%20quality&width=100&height=100&seq=2&orientation=squarish'
    },
    // Add more patients here
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
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
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
  );
};

export default PatientList;