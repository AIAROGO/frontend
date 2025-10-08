// StaffList.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../../components/common/Modal';
import StaffForm from './StaffForm';
import StaffDetails from './StaffDetails';

const StaffList = ({ staffList = [], setStaffList }) => {
  const { darkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // View staff details
  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsDetailsModalOpen(true);
  };

  // Open edit form
  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  // Handle updating staff after edit
  const handleUpdate = (updatedStaff) => {
    setStaffList((prevList) =>
      prevList.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff
      )
    );
    setIsEditModalOpen(false);
  };

  // Delete staff
  const handleDelete = (id) => {
    setStaffList((prevList) => prevList.filter((staff) => staff.id !== id));
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      {staffList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">No staff found. Add a new one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(staffList) &&
                staffList.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img
                            src={
                              staffMember.img ||
                              'https://via.placeholder.com/100x100?text=Staff'
                            }
                            alt="Staff"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{staffMember.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{staffMember.id}</td>
                    <td className="px-6 py-4 text-sm">{staffMember.role}</td>
                    <td className="px-6 py-4 text-sm">{staffMember.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staffMember.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {staffMember.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleView(staffMember)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(staffMember)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(staffMember.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff"
      >
        <StaffForm
          staff={selectedStaff}
          onSubmit={handleUpdate}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Staff Details"
      >
        <StaffDetails staff={selectedStaff} />
      </Modal>
    </div>
  );
};

export default StaffList;
