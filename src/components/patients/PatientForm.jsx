import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getPatientById, addPatient } from '../../services/api/patientApi';
import axiosInstance from '../../services/api/axiosInstance';

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
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    country_code: '+254',
    phone: '',
    department: '',
    doctor: '',
    status: 'Active',
    profilePic: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const patient = await getPatientById(id);
          console.log('Fetched patient:', patient);
          setFormData({
            name: patient.name || '',
            date_of_birth: patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '',
            gender: patient.gender || '',
            country_code: patient.country_code || '+254',
            phone: patient.phone || '',
            department: patient.address || '', // Backend uses address
            doctor: patient.doctor || '',
            status: patient.status || 'Active',
            profilePic: null,
          });
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData((prev) => ({ ...prev, profilePic: files[0] || null }));
    } else if (name === 'phone') {
      const numeric = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: numeric }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!validateAge(formData.date_of_birth)) newErrors.date_of_birth = 'Invalid age (over 130?)';
    if (formData.phone.length < 7 || formData.phone.length > 15)
      newErrors.phone = 'Phone must be 7-15 digits long.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('date_of_birth', formData.date_of_birth);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('country_code', formData.country_code);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.department); // Backend expects address
      formDataToSend.append('doctor', formData.doctor);
      formDataToSend.append('status', formData.status);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      if (id) {
        await axiosInstance.put(`/api/patients/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setErrors({ submit: 'Patient updated successfully' });
      } else {
        await addPatient(formDataToSend);
        setErrors({ submit: 'Patient added successfully' });
      }
      navigate('/manage-patients');
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors({
        submit: err.response?.data?.message || 'Failed to save patient.',
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
        <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Patient' : 'Add Patient'}</h2>

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

        {/* Profile Picture */}
        <div className="mb-4">
          <label htmlFor="profilePic" className="block mb-1 text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Submit */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : id ? 'Update Patient' : 'Add Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/manage-patients')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
        {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
      </form>
    </div>
  );
};

export default PatientForm;