import axiosInstance from './axiosInstance';

export const getAllProducts = async () => {
  const { data } = await axiosInstance.get('/v1/products');
  return data.data;
};