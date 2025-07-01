import React, { useState } from 'react';

const StaffManager = ({ staff, setStaff }) => {
  const [formData, setFormData] = useState({ name: '', role: '', contact: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStaff([...staff, formData]);
    setFormData({ name: '', role: '', contact: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="Role"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder="Contact Email"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Staff
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{staffMember.name}</td>
              <td className="px-4 py-2">{staffMember.role}</td>
              <td className="px-4 py-2">{staffMember.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManager;