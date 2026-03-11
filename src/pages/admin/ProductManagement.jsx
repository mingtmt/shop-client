import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Popconfirm, message, Typography, Modal, Form, Input, InputNumber, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllProductsForAdmin, createProduct, deleteProduct } from '../../api/product';

const { Title } = Typography;

const ProductManagement = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProductsForAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      message.success('Add new product successfully!');
      closeModal();
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => message.error('Add new product failed: ' + err.response?.data?.message),
  });

  // const updateMutation = useMutation({
  //   mutationFn: updateProductApi,
  //   onSuccess: () => {
  //     message.success('Cập nhật thành công!');
  //     closeModal();
  //     queryClient.invalidateQueries(['admin-products']);
  //   },
  //   onError: (err) => message.error('Lỗi khi cập nhật: ' + err.response?.data?.message),
  // });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success('Delete successfully!');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => message.error('Delete failed: ' + err.response?.data?.message),
  });

  const openModalForCreate = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openModalForEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 4. Xử lý Submit Form
  // const handleSubmit = (values) => {
  //   if (editingId) {
  //     updateMutation.mutate({ id: editingId, updateData: values });
  //   } else {
  //     createMutation.mutate(values);
  //   }
  // };

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
          <Button icon={<EditOutlined />} onClick={() => openModalForEdit(record)}>Edit</Button>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={openModalForCreate}>
          Add new product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={isLoading} />

      {/* Modal dùng chung cho Thêm và Sửa */}
      <Modal
        title={editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={() => {}}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>
             <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Hình ảnh (Tạm thời)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;