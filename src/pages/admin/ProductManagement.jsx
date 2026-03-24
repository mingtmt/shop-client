import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Popconfirm, message, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getAllProductsForAdmin, publishProduct, unpublishProduct, deleteProduct } from '../../api/product';
import ProductModal from './components/ProductModal';

const { Title } = Typography;

const ProductManagement = () => {
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProductsForAdmin,
  });

  const publishMutation = useMutation({
    mutationFn: publishProduct,
    onSuccess: () => {
      message.success('Product published successfully!');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => message.error('Publish failed: ' + err.response?.data?.message),
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishProduct,
    onSuccess: () => {
      message.success('Product unpublished successfully!');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => message.error('Unpublish failed: ' + err.response?.data?.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success('Delete successfully!');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => message.error('Delete failed: ' + err.response?.data?.message),
  });

  const handleOpenCreate = () => {
    setEditingProduct(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (url) => <img src={url || 'https://via.placeholder.com/50'} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />,
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <a>{text || 'N/A'}</a>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Status',
      dataIndex: 'isDraft',
      key: 'isDraft',
      render: (isDraft) => (
        <Tag color={isDraft ? 'red' : 'green'}>
          {isDraft ? 'Draft' : 'Published'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.isDraft ? (
            <Popconfirm
              title="Publish this product?"
              description="This product will be visible to users."
              onConfirm={() => publishMutation.mutate(record._id)}
              okText="Publish"
              cancelText="Cancel"
            >
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                size='small'
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                loading={publishMutation.isPending}
              >
                Publish
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Unpublish this product?"
              description="This product will be hidden from users."
              onConfirm={() => unpublishMutation.mutate(record._id)}
              okText="Unpublish"
              cancelText="Cancel"
            >
              <Button 
                danger 
                icon={<StopOutlined />}
                size='small'
                loading={unpublishMutation.isPending}
              >
                Unpublish
              </Button>
            </Popconfirm>
          )}
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>Edit</Button>
          <Popconfirm 
            title="Are you sure to delete this product?" 
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={3}>Product Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
          Add new product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={isLoading} />

      {/* Modal for creating/editing product */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingProduct={editingProduct} 
      />
    </div>
  );
};

export default ProductManagement;