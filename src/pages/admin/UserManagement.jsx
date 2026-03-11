import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Tag, Space, Button, Popconfirm, message, Typography } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import { getAllUsers, updateUserStatus, deleteUser } from '../../api/user';

const { Title } = Typography;

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (data) => {
      message.success(`Update ${data.name}'s status successfully!`);
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => message.error(err.response?.data?.message || 'Update failed, please try again.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      message.success('Delete successfully!');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (err) => message.error(err.response?.data?.message || 'Delete failed, please try again.'),
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Full name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text || 'N/A'}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.isActive ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => updateStatusMutation.mutate({ id: record._id, isActive: false })}
              okText="Deactive"
              cancelText="Cancel"
            >
              <Button 
                danger 
                icon={<StopOutlined />}
                size='small'
                loading={updateStatusMutation.isPending}
              >
                Deactive
              </Button>
            </Popconfirm>
          ) : (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size='small'
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => updateStatusMutation.mutate({ id: record._id, isActive: true })}
              loading={updateStatusMutation.isPending}
            >
              Active
            </Button>
          )}
          <Popconfirm
            title="Are you sure?"
            description="You won't be able to revert this!"
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={3}>User Management</Title>
        <Button type="primary" icon={<UserOutlined />}>Add new user</Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserManagement;