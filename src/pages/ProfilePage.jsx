import { useQuery } from '@tanstack/react-query';
import { Card, Descriptions, Avatar, Typography, Spin, Alert, Tag, Divider } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { getProfile } from '../api/auth';

const { Title } = Typography;

const ProfilePage = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  
  if (error) return (
    <Alert 
      message="Lỗi" 
      description="Không thể tải thông tin hồ sơ. Vui lòng thử lại sau." 
      type="error" 
      showIcon 
    />
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card variant="outlined" className="profile-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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
    </div>
  );
};

export default ProfilePage;