import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import StaffList from '../components/staff/StaffList';
import StaffForm from '../components/staff/StaffForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const Staff = () => {
  const { sidebarOpen } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]); // ⬅️ Central staff data

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ⬅️ Add new staff and update state
  const handleAddStaff = (newStaff) => {
    const newEntry = { ...newStaff, id: `S-${Date.now()}` }; // Generate unique ID
    setStaffList((prev) => [...prev, newEntry]);
    closeModal(); // Close the modal
  };

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Staff</h2>
          <Button className="bg-blue-600 text-white" onClick={openModal}>
            Add Staff
          </Button>
        </div>

        {/* Staff list receives live-updated staffList */}
        <StaffList staffList={staffList} setStaffList={setStaffList} />

        {/* Modal to add new staff */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Staff">
          <StaffForm onSubmit={handleAddStaff} onClose={closeModal} />
        </Modal>
      </div>
    </main>
  );
};

export default Staff;
