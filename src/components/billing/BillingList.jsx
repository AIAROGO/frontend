import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../../components/common/Modal';
import BillingForm from './BillingForm';
import BillingDetails from './BillingDetails';

const BillingList = () => {
  const { darkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Mock data (replace with API call)
  const invoices = [
    {
      id: 'B-20250616-001',
      patient: 'John Smith',
      amount: 1500,
      date: '2025-06-16',
      status: 'Paid',
    },
    // Add more invoices
  ];

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.patient}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${invoice.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleView(invoice)} className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button onClick={() => handleEdit(invoice)} className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Invoice">
        <BillingForm invoice={selectedInvoice} onClose={() => setIsEditModalOpen(false)} />
      </Modal>
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Invoice Details">
        <BillingDetails invoice={selectedInvoice} />
      </Modal>
    </div>
  );
};

export default BillingList;