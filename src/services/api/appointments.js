import axios from './axiosInstance';

// ✅ Backend base URL (make sure backend is running on port 5000)
const API_BASE_URL = 'http://localhost:5000/api/appointments';

// ✅ Get all appointments
export const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    console.log('✅ Appointments fetched:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error fetching appointments:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network error fetching appointments:', error.message);
    }
    throw error;
  }
};

// ✅ Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(API_BASE_URL, appointmentData);
    console.log('✅ Appointment created:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error creating appointment:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network error creating appointment:', error.message);
    }
    throw error;
  }
};
