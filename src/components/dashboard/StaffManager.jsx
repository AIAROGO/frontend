import React, { useState } from 'react';

const StaffManager = ({ staff = [], setStaff = () => {} }) => {
  const [formData, setFormData] = useState({ id: null, name: '', role: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.contact) return;

    if (editingId) {
      // Update existing staff member
      setStaff(staff.map(member => 
        member.id === editingId ? { ...formData, id: editingId } : member
      ));
      setEditingId(null);
    } else {
      // Add new staff member with unique ID
      const newStaff = { ...formData, id: Date.now() };
      setStaff([...staff, newStaff]);
    }

    // Hide form after submit
    setShowForm(false);
    setFormData({ id: null, name: '', role: '', contact: '' });
  };

  const handleEdit = (member) => {
    setFormData({ id: member.id, name: member.name, role: member.role, contact: member.contact });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: null, name: '', role: '', contact: '' });
    setShowForm(false);
  };

  const toggleForm = () => {
    if (!showForm) {
      setFormData({ id: null, name: '', role: '', contact: '' });
      setEditingId(null);
    }
    setShowForm(!showForm);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Add Staff Button */}
      <button
        onClick={toggleForm}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {showForm ? 'Cancel' : 'Add Staff'}
      </button>

      {/* Staff Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded-lg shadow-md">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={editingId ? "Edit Name" : "Name"}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder={editingId ? "Edit Role" : "Role"}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder={editingId ? "Edit Contact Email" : "Contact Email"}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
            >
              {editingId ? 'Update Staff' : 'Add Staff'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Role</th>
              <th className="px-4 py-2 border text-left">Contact</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(staff) && staff.length > 0 ? (
              staff.map((staffMember) => (
                <tr key={staffMember.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                  <td className="px-4 py-2 border">{staffMember.name}</td>
                  <td className="px-4 py-2 border">{staffMember.role}</td>
                  <td className="px-4 py-2 border">{staffMember.contact}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(staffMember)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition"
                      disabled={editingId === staffMember.id && showForm}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staffMember.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {Array.isArray(staff) && (
        <div className="mt-4 text-sm text-gray-600">
          Total staff members: {staff.length}
        </div>
      )}
    </div>
  );
};

export default StaffManager;