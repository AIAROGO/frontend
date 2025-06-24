import axios from './axiosInstance';

export const fetchReports = async () => {
  const response = await axios.get('/reports');
  return response.data;
};

export const generateReport = async (report) => {
  const response = await axios.post('/reports', report);
  return response.data;
};