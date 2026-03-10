import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/auth';
import { Spin } from 'antd';

const AdminRoute = ({ children }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isLoading) return <Spin fullscreen />;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;