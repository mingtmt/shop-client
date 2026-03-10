import axiosInstance from './axiosInstance';

// admin
export const getAllUsers = async () => {
  const { data } = await axiosInstance.get('/v1/users');
  return data.data;
};

export const updateUserStatus = async ({ id, isActive }) => {
  const { data } = await axiosInstance.patch(`/v1/users/${id}/status`, { isActive });
  return data.data;
}

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/v1/users/${id}`);
  return data.data;
}