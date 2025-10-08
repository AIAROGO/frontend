import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Clear alerts and email after 5 seconds
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
        setEmail('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email.trim());
      setMessage('Password reset email sent successfully.');
      setError('');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <div className="login-form-card">
        <h2>Reset Password</h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Send Reset Email
          </button>
        </form>

        <div className="border-top mt-4 pt-4 text-center">
          <p className="mb-1">Remember your password?</p>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;