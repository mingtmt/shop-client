import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { DashboardOutlined, ShoppingOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Quản lý sản phẩm' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý người dùng' },
    { key: '/', icon: <ArrowLeftOutlined />, label: 'Về trang Web Client' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: 'white', textAlign: 'center', lineHeight: '32px' }}>
          ADMIN PANEL
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={[window.location.pathname]} 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;