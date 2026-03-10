import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

const { Content, Footer } = Layout;

const ClientLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      
      <Content style={{ padding: "24px", background: "#fff" }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center" }}>
        mingtmt's Shop Client ©2026 - Built with React & Vite
      </Footer>
    </Layout>
  );
};

export default ClientLayout;