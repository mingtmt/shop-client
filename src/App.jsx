import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader } from './components/AppHeader';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const { Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          mingtmt's Shop Client ©2026
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;