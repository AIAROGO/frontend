import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import StaffList from '../components/staff/StaffList';
import StaffForm from '../components/staff/StaffForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const Staff = () => {
  const { darkMode, sidebarOpen } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Staff</h2>
          <Button className="bg-blue-600 text-white" onClick={openModal}>
            Add Staff
          </Button>
        </div>
        <StaffList />
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Staff">
          <StaffForm onClose={closeModal} />
        </Modal>
      </div>
    </main>
  );
};

export default Staff;