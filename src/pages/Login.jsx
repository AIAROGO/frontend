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
      password: credentials.password.trim()
    };
    console.log('Sending login credentials:', trimmedCredentials);
    setError('');
    setSuccess('');
    try {
      await login(trimmedCredentials.username, trimmedCredentials.password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 4000); // Navigate after showing success message
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center', marginBottom: '24px' }}>Login to MediCare Pro</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#b71c1c', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="password" style={{ fontWeight: '500' }}>Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
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
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
          >
            Login
          </button>
        </form>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link 
            to="/forgot-password" 
            onClick={() => console.log('Navigating to forgot-password')}
            style={{ 
              color: '#1976d2', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Forgot password?
          </Link>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #eee', 
          marginTop: '24px', 
          paddingTop: '16px',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '12px' }}>Don't have an account?</p>
          <Link 
            to="/register" 
            style={{ 
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              border: '1px solid #ddd',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;