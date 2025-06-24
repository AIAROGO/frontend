import axios from './axiosInstance';

export const fetchInvoices = async () => {
  const response = await axios.get('/billing');
  return response.data;
};

export const addInvoice = async (invoice) => {
  const response = await axios.post('/billing', invoice);
  return response.data;
};

export const updateInvoice = async (id, invoice) => {
  const response = await axios.put(`/billing/${id}`, invoice);
  return response.data;
};