import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const countries = [
  { name: 'Kenya', code: '+254' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'India', code: '+91' },
];

const PatientForm = ({ initialData = {}, onSubmit }) => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    date_of_birth: initialData.date_of_birth || '',
    gender: initialData.gender || '',
    country_code: initialData.country_code || '+254',
    phone: initialData.phone || '',
    department: initialData.department || '',
    doctor: initialData.doctor || '',
    status: initialData.status || 'Active',
    img: initialData.img || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numeric = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: numeric }));
    } else if (name === 'name') {
      setFormData((prev) => ({ ...prev, name: value.replace(/[^a-zA-Z\s]/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateAge = (dob) => {
    if (!dob) return false;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age <= 130;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!validateAge(formData.date_of_birth)) newErrors.date_of_birth = 'Invalid age (over 130?)';
    if (formData.phone.length < 7 || formData.phone.length > 15)
      newErrors.phone = 'Phone must be 7-15 digits long.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const fullPhone = formData.country_code + formData.phone;

    if (onSubmit) {
      onSubmit({ ...formData, fullPhone });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}
    >
      <h2 className="text-xl font-semibold mb-4">Patient Form</h2>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 text-sm font-medium">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label htmlFor="date_of_birth" className="block mb-1 text-sm font-medium">Date of Birth</label>
        <input
          type="date"
          id="date_of_birth"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth}</p>}
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label htmlFor="gender" className="block mb-1 text-sm font-medium">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Country Code + Phone */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Phone Number</label>
        <div className="flex space-x-2">
          <select
            name="country_code"
            value={formData.country_code}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-28"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="flex-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Department */}
      <div className="mb-4">
        <label htmlFor="department" className="block mb-1 text-sm font-medium">Department</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Doctor */}
      <div className="mb-4">
        <label htmlFor="doctor" className="block mb-1 text-sm font-medium">Doctor</label>
        <input
          type="text"
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label htmlFor="status" className="block mb-1 text-sm font-medium">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Image */}
      <div className="mb-4">
        <label htmlFor="img" className="block mb-1 text-sm font-medium">Image URL</label>
        <input
          type="text"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Patient
      </button>
    </form>
  );
};

export default PatientForm;
