import axiosInstance from './axiosInstance';

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/v1/auth/login', credentials);
  return data.data; 
};

export const logout = async () => {
  await axiosInstance.post('/v1/auth/logout');
};