import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const InventoryForm = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    quantity: item?.quantity || '',
    category: item?.category || '',
    status: item?.status || 'In Stock',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call
    console.log('Inventory data:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Item Name</label>
        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter item name" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full py-2 px-4 rounded-lg border bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gray-500 text-white mr-2" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-600 text-white" type="submit">
          {item ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;