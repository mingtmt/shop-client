import axiosInstance from './axiosInstance';

export const register = async (userData) => {
  const { data } = await axiosInstance.post('/v1/auth/register', userData);
  return data.data;
}

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/v1/auth/login', credentials);
  return data.data; 
};

export const logout = async () => {
  await axiosInstance.post('/v1/auth/logout');
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get('/v1/auth/me');
  return data.data;
};

export const updateProfile = async (updateData) => {
  const { data } = await axiosInstance.patch(`v1/users`, updateData);
  return data.data;
};