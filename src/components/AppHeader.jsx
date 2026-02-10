import { useNavigate, Link } from 'react-router-dom';
import { Layout, Button, Space, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../api/auth';

const { Header } = Layout;

export const AppHeader = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      message.success('Logout successfully!');
      performLocalLogout();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      performLocalLogout();
    }
  });

  const performLocalLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleLogout = () => {
    if (accessToken) {
      mutation.mutate();
    } else {
      performLocalLogout();
    }
  };

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529' }}>
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
        <Link to="/" style={{ color: 'inherit' }}>Tomato Shop</Link>
      </div>
      <Space>
        <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Products</Link>
        {accessToken ? (
          <Button type="primary" danger onClick={handleLogout}>Logout</Button>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Space>
    </Header>
  );
};