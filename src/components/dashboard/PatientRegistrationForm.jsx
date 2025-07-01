import React, { useState } from 'react';

const PatientRegistrationForm = ({ patients, setPatients }) => {
  const [formData, setFormData] = useState({ name: '', age: '', department: '', doctor: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = {
      id: `P-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 1000)}`,
      ...formData,
      age: `${formData.age} years`,
      status: 'Active',
      img: 'profile.jpg',
    };
    setPatients([...patients, newPatient]);
    setFormData({ name: '', age: '', department: '', doctor: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Patient Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        placeholder="Age"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        placeholder="Department"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={formData.doctor}
        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
        placeholder="Assigned Doctor"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Register Patient
      </button>
    </form>
  );
};

export default PatientRegistrationForm;