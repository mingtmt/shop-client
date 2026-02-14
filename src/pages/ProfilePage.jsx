import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Card, Descriptions, Avatar, Typography, Spin, Alert, Tag, Divider, Modal, Form, message, Button, Input } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, SafetyCertificateOutlined, EditOutlined } from '@ant-design/icons';
import { getProfile, updateProfile } from '../api/auth';

const { Title } = Typography;

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      message.success('Update successfully!');
      setIsModalOpen(false);
      queryClient.invalidateQueries(['profile']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Update failed, please try again.');
    }
  });

  useEffect(() => {
    if (user && isModalOpen) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, isModalOpen, form]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  
  if (error) return (
    <Alert 
      title="Error" 
      description="Cannot fetch your profile. Please try again later." 
      type="error" 
      showIcon 
    />
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card 
        variant="outlined" className="profile-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        extra={<Button type="primary" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)}>Edit</Button>}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={100} icon={<UserOutlined />} src={user.avatarUrl} />
          <Title level={2} style={{ marginTop: 16 }}>{user.name}</Title>
          <Tag color="gold"><SafetyCertificateOutlined /> {user.role || 'User'}</Tag>
        </div>

        <Divider titlePlacement="left">Your information</Divider>
        
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label={<span><UserOutlined /> Full name</span>}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label={<span><CalendarOutlined /> Joined</span>}>
            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: 'right', color: '#8c8c8c' }}>
          * This information is not editable.
        </div>
      </Card>

      <Modal
        title="Edit your profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={updateMutation.isPending}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" onFinish={(values) => updateMutation.mutate(values)}>
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Email is not valid!' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;