import React, { useState, useEffect } from 'react';
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
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
        if (success) {
          setPatient({
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
            address: '',
          });
          setPreview(null);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      if (!files[0].type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      if (files[0].size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB.');
        return;
      }
      setPatient((prev) => ({ ...prev, profilePic: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setPatient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'date_of_birth', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'country_code', label: 'Country Code' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'department', label: 'Department' },
      { key: 'doctor', label: 'Doctor' },
      { key: 'status', label: 'Status' },
      { key: 'medical_history', label: 'Medical History' },
    ];
    for (const { key, label } of requiredFields) {
      if (!patient[key] || patient[key].trim() === '') {
        return `Please fill in the ${label} field.`;
      }
    }

    if (patient.name.length < 2 || patient.name.length > 50) {
      return 'Name must be between 2 and 50 characters.';
    }
    if (!/^[a-zA-Z\s]*$/.test(patient.name)) {
      return 'Name must not contain numbers.';
    }
    if (!/^\+\d{1,4}$/.test(patient.country_code)) {
      return 'Country code must be in format like +254.';
    }
    if (!/^\d{7,15}$/.test(patient.phone)) {
      return 'Phone number must be 7-15 digits.';
    }
    if (!/^[a-zA-Z\s]*$/.test(patient.department)) {
      return 'Department must not contain numbers.';
    }
    if (!/^[a-zA-Z\s]*$/.test(patient.doctor)) {
      return 'Doctor must not contain numbers.';
    }
    if (!/^[a-zA-Z\s]*$/.test(patient.medical_history)) {
      return 'Medical History must not contain numbers.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please log in to add a patient.');
      navigate('/login');
      return;
    }

    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(patient).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/patients', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Patient added:', response.data);
      setSuccess('Patient added successfully.');
      setTimeout(() => navigate('/manage-patients'), 2000);
    } catch (err) {
      let errorMessage = 'Failed to add patient.';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = 'Session expired. Please log in again.';
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          errorMessage = err.response.data?.message || 'Server error: Unable to process request.';
        }
      } else {
        errorMessage = err.message;
      }
      console.error('Error adding patient:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="text-2xl font-semibold text-center mb-6">Add New Patient</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={patient.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="date_of_birth" value={patient.date_of_birth} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={patient.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Country Code</label>
            <select name="country_code" value={patient.country_code} onChange={handleChange} required>
              <option value="+254">Kenya (+254)</option>
              <option value="+1">USA (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+91">India (+91)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={patient.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={patient.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={patient.department} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Doctor</label>
            <input type="text" name="doctor" value={patient.doctor} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={patient.status} onChange={handleChange} required>
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
              required
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
                <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mt-2 object-cover" />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary mt-6 w-full">
            Add Patient
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/manage-patients')}
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