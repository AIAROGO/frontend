import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Clear alert messages and credentials after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
        setCredentials({ username: '', password: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedCredentials = {
      username: credentials.username.trim(),
      password: credentials.password.trim(),
    };
    console.log('Sending login credentials:', trimmedCredentials);
    setError('');
    setSuccess('');
    try {
      await login(trimmedCredentials.username, trimmedCredentials.password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <div className="login-form-card">
        <h2>Login to MediCare Pro</h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <div className="password-toggle-container">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            onClick={() => console.log('Navigating to forgot-password')}
            className="link"
          >
            Forgot password?
          </Link>
        </div>

       
      </div>
    </div>
  );
};

export default Login;