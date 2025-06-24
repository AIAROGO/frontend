import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../../components/common/Modal';
import InventoryForm from './InventoryForm';
import InventoryDetails from './InventoryDetails';

const InventoryList = () => {
  const { darkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data (replace with API call)
  const inventory = [
    {
      id: 'I-20250616-001',
      name: 'Syringe 5ml',
      quantity: 500,
      category: 'Medical Supplies',
      status: 'In Stock',
    },
    // Add more items
  ];

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleView(item)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Inventory Item">
        <InventoryForm item={selectedItem} onClose={() => setIsEditModalOpen(false)} />
      </Modal>
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Inventory Details">
        <InventoryDetails item={selectedItem} />
      </Modal>
    </div>
  );
};

export default InventoryList;