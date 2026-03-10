import { Spin } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/auth';
import { authUtils } from '../utils/auth';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const token = authUtils.getAccessToken();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  if (isLoading && !!token) {
    return <Spin fullscreen description="Loading..." />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isError || (user && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;