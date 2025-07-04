import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPatient = () => {
  const [patient, setPatient] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    country_code: '+254',
    phone: '',
    department: '',
    doctor: '',
    status: 'Active',
    medical_history: '',
    profilePic: null,
  });
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files[0]) {
      setPatient((prev) => ({ ...prev, profilePic: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setPatient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to add a patient.');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      Object.entries(patient).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/patients', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Patient added:', response.data);
      navigate('/patients');
    } catch (err) {
      console.error('Error adding patient:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add patient.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="text-2xl font-semibold text-center mb-6">Add New Patient</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={patient.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="date_of_birth" 
              value={patient.date_of_birth} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={patient.gender} 
              onChange={handleChange} 
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Country Code</label>
            <select 
              name="country_code" 
              value={patient.country_code} 
              onChange={handleChange} 
              required
            >
              <option value="+254">Kenya (+254)</option>
              <option value="+1">USA (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+91">India (+91)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={patient.phone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input 
              type="text" 
              name="department" 
              value={patient.department} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Doctor</label>
            <input 
              type="text" 
              name="doctor" 
              value={patient.doctor} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              name="status" 
              value={patient.status} 
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Medical History</label>
            <textarea 
              name="medical_history" 
              value={patient.medical_history} 
              onChange={handleChange} 
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Profile Picture</label>
            <input 
              type="file" 
              name="profilePic" 
              accept="image/*" 
              onChange={handleChange} 
            />
            {preview && (
              <div className="preview-image">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full mt-2 object-cover" 
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            Add Patient
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/patients')} 
            className="text-blue-600 text-sm hover:underline"
          >
            Back to Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;