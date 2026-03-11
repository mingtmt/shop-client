import axiosInstance from './axiosInstance';

// admin
export const getAllProductsForAdmin = async () => {
  const { data } = await axiosInstance.get('/v1/admin/products');
  return data.data;
};

export const createProduct = async (productData) => {
  const { data } = await axiosInstance.post('/v1/admin/products', productData);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/v1/admin/products/${id}`);
  return data.data;
};

// guest
export const getAllProducts = async () => {
  const { data } = await axiosInstance.get('/v1/products');
  return data.data;
};