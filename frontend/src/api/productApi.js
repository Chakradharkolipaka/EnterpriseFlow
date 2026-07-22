import axiosClient from './axiosClient';

export const getProducts = (params) => {
  return axiosClient.get('/products', { params });
};

export const getProduct = (id) => {
  return axiosClient.get(`/products/${id}`);
};

export const createProduct = (data) => {
  return axiosClient.post('/products', data);
};

export const updateProduct = (id, data) => {
  return axiosClient.put(`/products/${id}`, data);
};

export const adjustStock = (id, data) => {
  return axiosClient.post(`/products/${id}/stock`, data);
};

export const getStockLog = (id, params) => {
  return axiosClient.get(`/products/${id}/stock-log`, { params });
};
