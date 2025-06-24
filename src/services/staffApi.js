import axios from './axiosInstance';

export const fetchStaff = async () => {
  const response = await axios.get('/staff');
  return response.data;
};

export const addStaff = async (staff) => {
  const response = await axios.post('/staff', staff);
  return response.data;
};

export const updateStaff = async (id, staff) => {
  const response = await axios.put(`/staff/${id}`, staff);
  return response.data;
};