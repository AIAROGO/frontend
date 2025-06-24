import React from 'react';

const Button = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg !rounded-button whitespace-nowrap ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;