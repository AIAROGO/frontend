import axios from './axiosInstance';

export const fetchPatients = async () => {
  try {
    const response = await axios.get('/api/patients');
    console.log('fetchPatients response:', response.data);
    return response.data;
  } catch (error) {
    console.error('fetchPatients error:', error.response?.data || error.message);
    throw error;
  }
};

export const addPatientFormData = async (formData) => {
  try {
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }
    const response = await axios.post('/api/patients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('addPatient response:', response.data);
    return response.data;
  } catch (error) {
    console.error('addPatient error:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await axios.delete(`/api/patients/${id}`);
    console.log('deletePatient response:', response.data);
    return response.data;
  } catch (error) {
    console.error('deletePatient error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPatientById = async (id) => {
  try {
    const response = await axios.get(`/api/patients/${id}`);
    console.log('getPatientById response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getPatientById error:', error.response?.data || error.message);
    throw error;
  }
};