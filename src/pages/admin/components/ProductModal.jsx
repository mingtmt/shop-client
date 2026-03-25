import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message, Typography, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductDetails, createProduct, updateProduct } from '../../../api/product';

const { Title } = Typography;

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};

const ProductModal = ({ isOpen, onClose, editingProductId }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const selectedType = Form.useWatch('type', form);

  const { data: fullProduct, isFetching } = useQuery({
    queryKey: ['product-details', editingProductId],
    queryFn: () => getProductDetails(editingProductId),
    enabled: !!editingProductId && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingProductId && fullProduct) {
        const formValues = { ...fullProduct };

        if (formValues.thumbnail && typeof formValues.thumbnail === 'string') {
          formValues.thumbnail = [{
            uid: '-1',
            name: 'thumbnail.png',
            status: 'done',
            url: formValues.thumbnail,
          }];
        }

        form.setFieldsValue(formValues);
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, editingProductId, fullProduct, form]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      message.success('Add product successfully!');
      queryClient.invalidateQueries(['admin-products']);
      onClose();
    },
    onError: (err) => message.error('Add product failed: ' + (err.response?.data?.message || err.message)),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      message.success('Update product successfully!');
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['product-detail', editingProductId]);
      onClose();
    },
    onError: (err) => message.error('Lỗi cập nhật SP: ' + (err.response?.data?.message || err.message)),
  });

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('stock', values.stock);
    formData.append('type', values.type);

    if (values.thumbnail && values.thumbnail.length > 0 && values.thumbnail[0].originFileObj) {
      formData.append('thumbnail', values.thumbnail[0].originFileObj);
    }

    if (values.attributes) {
      Object.keys(values.attributes).forEach((key) => {
        if (values.attributes[key] !== undefined && values.attributes[key] !== null) {
          formData.append(`attributes[${key}]`, values.attributes[key]);
        }
      });
    }

    if (editingProductId) {
      updateMutation.mutate({ id: editingProductId, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Modal
      title={editingProductId ? "Edit product" : "Add new product"}
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending || updateMutation.isPending || isFetching}
      width={700}
      destroyOnHidden
    >
      <Spin spinning={isFetching} description="Loading...">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="name" label="Product name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Product type" rules={[{ required: true }]}>
              <Select
                placeholder="Select product type"
                options={[
                  { value: 'smartphone', label: 'Smartphone' },
                  { value: 'laptop', label: 'Laptop' },
                  { value: 'tablet', label: 'Tablet' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="price" label="Price (VND)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: !editingProductId, message: 'Please upload an image!' }]}
          >
            <Upload name="logo" listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          {/* DYNAMIC ATTRIBUTES */}
          {selectedType && (
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
              <Title level={5} style={{ marginTop: 0 }}>Attributes ({selectedType})</Title>

              {selectedType === 'smartphone' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item name={['attributes', 'manufacturer']} label="Manufacturer"><Input /></Form.Item>
                  <Form.Item name={['attributes', 'model']} label="Model"><Input /></Form.Item>
                  <Form.Item name={['attributes', 'releaseYear']} label="Release year"><InputNumber style={{ width: '100%' }} /></Form.Item>
                  <Form.Item name={['attributes', 'os']} label="OS"><Input /></Form.Item>
                  <Form.Item name={['attributes', 'simType']} label="SIM type"><Input /></Form.Item>
                  <Form.Item name={['attributes', 'displayTechnology']} label="Display technology"><Input /></Form.Item>
                </div>
              )}

              {selectedType === 'laptop' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Form.Item name={['attributes', 'cpu']} label="CPU"><Input /></Form.Item>
                  <Form.Item name={['attributes', 'ram']} label="RAM"><Input /></Form.Item>
                </div>
              )}
            </div>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};

export default ProductModal;