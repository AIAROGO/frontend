import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import StaffList from '../components/staff/StaffList';
import StaffForm from '../components/staff/StaffForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const Staff = () => {
  const { sidebarOpen } = useTheme();

  // ✅ Always start with a valid array
  const [staffList, setStaffList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Modal open/close handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ✅ Add new staff safely
  const handleAddStaff = (newStaff) => {
    if (!newStaff || !newStaff.name) return; // Prevent invalid input
    const newEntry = { ...newStaff, id: `S-${Date.now()}` }; // Unique ID
    setStaffList((prev) => Array.isArray(prev) ? [...prev, newEntry] : [newEntry]);
    closeModal(); // Close after adding
  };

  return (
    <main
      className={`pt-16 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      } min-h-screen transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-900`}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Staff Management
          </h2>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={openModal}>
            + Add Staff
          </Button>
        </div>

        {/* ✅ Pass correct props */}
        <StaffList staffList={staffList} setStaffList={setStaffList} />

        {/* Modal for adding new staff */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Staff Member">
          <StaffForm onSubmit={handleAddStaff} onClose={closeModal} />
        </Modal>
      </div>
    </main>
  );
};

export default Staff;
