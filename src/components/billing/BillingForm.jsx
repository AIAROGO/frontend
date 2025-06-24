import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const BillingForm = ({ invoice, onClose }) => {
  const [formData, setFormData] = useState({
    patient: invoice?.patient || '',
    amount: invoice?.amount || '',
    date: invoice?.date || '',
    status: invoice?.status || 'Pending',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call
    console.log('Invoice data:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Patient Name</label>
        <Input type="text" name="patient" value={formData.patient} onChange={handleChange} placeholder="Enter patient name" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input type="date" name="date" value={formData.date} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full py-2 px-4 rounded-lg border bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gray-500 text-white mr-2" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-600 text-white" type="submit">
          {invoice ? 'Update' : 'Add'} Invoice
        </Button>
      </div>
    </form>
  );
};

export default BillingForm;