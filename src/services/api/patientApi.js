import axios from './axiosInstance';

export const fetchPatients = async () => {
  const response = await axios.get('/patients');
  return response.data;
};

export const addPatient = async (patient) => {
  const response = await axios.post('/patients', patient);
  return response.data;
};