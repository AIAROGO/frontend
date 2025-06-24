import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';

const SettingsForm = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    hospitalName: 'MediCare Pro',
    email: 'admin@medicarepro.com',
    phone: '+1234567890',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call
    console.log('Settings data:', formData);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hospital Name</label>
          <Input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            placeholder="Enter hospital name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Theme</label>
          <Button
            className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-${darkMode ? 'white' : 'gray-800'}`}
            onClick={toggleDarkMode}
          >
            Switch to {darkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </div>
        <div className="flex justify-end">
          <Button className="bg-blue-600 text-white" type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;