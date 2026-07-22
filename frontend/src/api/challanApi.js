import axiosClient from './axiosClient';

export const getChallans = (params) => {
  return axiosClient.get('/challans', { params });
};

export const getChallan = (id) => {
  return axiosClient.get(`/challans/${id}`);
};

export const createChallan = (data) => {
  return axiosClient.post('/challans', data);
};

export const updateChallan = (id, data) => {
  return axiosClient.put(`/challans/${id}`, data);
};

export const confirmChallan = (id) => {
  return axiosClient.post(`/challans/${id}/confirm`);
};

export const cancelChallan = (id) => {
  return axiosClient.post(`/challans/${id}/cancel`);
};
