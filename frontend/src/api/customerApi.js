import axiosClient from './axiosClient';

export const getCustomers = (params) => {
  return axiosClient.get('/customers', { params });
};

export const getCustomer = (id) => {
  return axiosClient.get(`/customers/${id}`);
};

export const createCustomer = (data) => {
  return axiosClient.post('/customers', data);
};

export const updateCustomer = (id, data) => {
  return axiosClient.put(`/customers/${id}`, data);
};

export const addFollowUpNote = (id, text) => {
  return axiosClient.post(`/customers/${id}/followups`, { text });
};
