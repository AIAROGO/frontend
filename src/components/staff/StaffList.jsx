import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../../components/common/Modal';
import StaffForm from './StaffForm';
import StaffDetails from './StaffDetails';

const StaffList = () => {
  const { darkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Mock data (replace with API call)
  const staff = [
    {
      id: 'S-20250616-001',
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      department: 'Cardiology',
      status: 'Active',
      img: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20male%20doctor%2C%20high%20quality%20headshot%2C%20clean%20background&width=100&height=100&seq=1&orientation=squarish',
    },
    // Add more staff
  ];

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map((staffMember) => (
              <tr key={staffMember.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img src={staffMember.img} alt="Staff" className="h-full w-full object-cover object-top" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{staffMember.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{staffMember.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{staffMember.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{staffMember.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staffMember.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {staffMember.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleView(staffMember)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button onClick={() => handleEdit(staffMember)} className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Staff">
        <StaffForm staff={selectedStaff} onClose={() => setIsEditModalOpen(false)} />
      </Modal>
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Staff Details">
        <StaffDetails staff={selectedStaff} />
      </Modal>
    </div>
  );
};

export default StaffList;