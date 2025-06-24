import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const StaffForm = ({ staff, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    status: 'Active',
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        department: staff.department || '',
        status: staff.status || 'Active',
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const staffData = {
      ...formData,
      id: staff?.id || `S-${Date.now()}`, // Assign ID if new staff
    };

    if (onSubmit) onSubmit(staffData); // Callback to parent component
    onClose(); // Close modal
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Role</label>
        <Input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Enter role" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Department</label>
        <Input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Enter department" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full py-2 px-4 rounded-lg border bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gray-500 text-white mr-2" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-blue-600 text-white" type="submit">
          {staff ? 'Update' : 'Add'} Staff
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;
