import { useNavigate, Link } from 'react-router-dom';
import { Layout, Button, Space, Dropdown, Avatar, message } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../api/auth';
import { authUtils } from '../utils/auth';

const { Header } = Layout;

export const AppHeader = () => {
  const navigate = useNavigate();
  const accessToken = authUtils.getAccessToken();

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
    authUtils.clearTokens();
    navigate('/');
  };

  const handleLogout = () => {
    if (accessToken) {
      mutation.mutate();
    } else {
      performLocalLogout();
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <ProfileOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true, 
      onClick: () => handleLogout(),
    },
  ];

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529' }}>
      <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
        <Link to="/" style={{ color: 'inherit' }}>Tomato Shop</Link>
      </div>
      <Space>
        <Link to="/" style={{ color: 'white', marginRight: '20px' }}>Products</Link>
        {accessToken ? (
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span style={{ color: 'white' }}>Account</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="link" onClick={() => navigate('/login')} style={{ color: 'white' }}>
              Login
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
};