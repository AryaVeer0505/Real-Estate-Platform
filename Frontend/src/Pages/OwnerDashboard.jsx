import React, { useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, InputNumber, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const OwnerDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span className="space-x-2">
          <Button type="link">Edit</Button>
          <Button type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  const handleAddProperty = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('location', values.location);
    formData.append('price', values.price);

    values.images?.fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/properties', formData);
      message.success('Property added!');
      form.resetFields();
      setIsModalVisible(false);
      // Optional: refetch property list here
    } catch (err) {
      message.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Property
        </Button>
      </div>

      <Table columns={columns} rowKey="_id" />

      <Modal
        title="Add Property"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProperty}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="images"
            label="Property Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
            rules={[{ required: true, message: 'Please upload images' }]}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              multiple
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>Upload (max: 5)</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
