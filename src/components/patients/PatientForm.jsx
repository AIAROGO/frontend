import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const countries = [
  { name: 'Kenya', code: '+254' },
  { name: 'USA', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'India', code: '+91' },
];

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/patients/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Fetched patient:', response.data);
          setFormData({
            name: response.data.name || '',
            date_of_birth: response.data.date_of_birth ? response.data.date_of_birth.split('T')[0] : '',
            gender: response.data.gender || '',
            country_code: response.data.country_code || '+254',
            phone: response.data.phone || '',
            department: response.data.department || '',
            doctor: response.data.doctor || '',
            status: response.data.status || 'Active',
            medical_history: response.data.medical_history || '',
            profilePic: null,
          });
          setPreview(response.data.profilePic || null);
        } catch (err) {
          console.error('Error fetching patient:', err);
          setFetchError(
            err.response?.status === 404
              ? 'Patient not found.'
              : err.response?.data?.message || 'Failed to load patient data.'
          );
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData((prev) => ({ ...prev, profilePic: files[0] || null }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name === 'phone') {
      setFormData((prev) => ({ ...prev, phone: value.replace(/\D/g, '') }));
    } else if (name === 'name' || name === 'department' || name === 'doctor' || name === 'medical_history') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^a-zA-Z\s]/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (formData.name.length > 20) newErrors.name = 'Name must not exceed 20 characters.';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    if (!formData.department.trim()) newErrors.department = 'Department is required.';
    if (!formData.doctor.trim()) newErrors.doctor = 'Doctor is required.';
    if (!formData.medical_history.trim()) newErrors.medical_history = 'Medical history is required.';
    if (formData.phone.length < 7 || formData.phone.length > 15) {
      newErrors.phone = 'Phone must be 7-15 digits long.';
    }
    const fullPhone = `${formData.country_code}${formData.phone}`;
    if (!/^\+\d{1,4}\d{7,15}$/.test(fullPhone)) {
      newErrors.phone = 'Invalid phone number format.';
    }
    const age = formData.date_of_birth
      ? new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear()
      : null;
    if (age === null || age > 130) newErrors.date_of_birth = 'Invalid age (over 130?).';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrors({ submit: 'Please log in to save patient data.' });
      return;
    }

    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'profilePic' && value) formDataToSend.append(key, value);
      });
      if (formData.profilePic) formDataToSend.append('profilePic', formData.profilePic);

      console.log('Submitting form data:', Array.from(formDataToSend.entries()));
      const token = localStorage.getItem('token');
      const url = isEditMode ? `http://localhost:5000/api/patients/${id}` : 'http://localhost:5000/api/patients';
      const method = isEditMode ? 'put' : 'post';
      const response = await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`${isEditMode ? 'Patient updated' : 'Patient added'}:`, response.data);
      setErrors({ submit: isEditMode ? 'Patient updated successfully.' : 'Patient added successfully.' });
      setTimeout(() => navigate('/patients'), 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors({
        submit:
          err.response?.status === 401
            ? 'Unauthorized: Please log in again.'
            : err.response?.status === 400
            ? err.response?.data?.message || 'Invalid input data.'
            : err.response?.data?.message || 'Failed to save patient.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (fetchError) return <div className="text-red-500 text-center py-8">{fetchError}</div>;

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        className={`form-card ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}
      >
        <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Patient' : 'Add Patient'}</h2>

        <div className="form-group">
          <label htmlFor="name" className="block mb-1 text-sm font-medium">Full Name</label>
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

        <div className="form-group">
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

        <div className="form-group">
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
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div className="form-group">
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

        <div className="form-group">
          <label htmlFor="department" className="block mb-1 text-sm font-medium">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="doctor" className="block mb-1 text-sm font-medium">Doctor</label>
          <input
            type="text"
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.doctor && <p className="text-red-500 text-sm">{errors.doctor}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="status" className="block mb-1 text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="medical_history" className="block mb-1 text-sm font-medium">Medical History</label>
          <textarea
            id="medical_history"
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            rows="3"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.medical_history && <p className="text-red-500 text-sm">{errors.medical_history}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="profilePic" className="block mb-1 text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {preview && (
            <div className="preview-image">
              <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mt-2 object-cover" />
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="btn-primary mt-6 w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Patient' : 'Add Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="text-blue-600 text-sm hover:underline mt-4 w-full text-center"
          >
            Cancel
          </button>
        </div>
        {errors.submit && (
          <div className={`alert mt-4 ${errors.submit.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientForm;