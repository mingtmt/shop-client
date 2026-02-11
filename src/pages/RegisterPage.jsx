import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { authUtils } from '../utils/auth';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.tokens) {
        authUtils.saveTokens(data.tokens.accessToken, data.tokens.refreshToken);
        message.success('Register and login successfully!');
        navigate('/');
        window.location.reload();
      }
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Register failed, please try again.');
    }
  });

  const onFinish = (values) => {
    const { confirm, ...registerData } = values;
    mutation.mutate(registerData);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <Card style={{ width: 450, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>Register Account</Title>
          <Text type="secondary">Please enter your information</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Full name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Email is not valid!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%' }} 
              size="large"
              loading={mutation.isPending}
            >
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            You have an account? <Link to="/login">Login now</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;