import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Input = ({ type, placeholder, value, onChange, name, className }) => {
  const { darkMode } = useTheme();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`w-full py-2 px-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Input;