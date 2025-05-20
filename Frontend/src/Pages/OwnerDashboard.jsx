// Updated OwnerDashboard.jsx with Add, Update, and Delete functionality
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { baseURL } from "../../config.js";
import axiosInstance from "../../axiosInnstance.js";
import Loader from "../Components/Loader.jsx";

const { Option } = Select;

const OwnerDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `${baseURL}/api/property/allProperties`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperties(response.data.properties);
    } catch (error) {
      message.error("Failed to fetch properties");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleOpenModal = () => {
    setEditingProperty(null);
    setSelectedFiles([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddOrUpdateProperty = async (values) => {
    const token = localStorage.getItem("token");
    try {
      let images = [];

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file.originFileObj);
        });
        const uploadResponse = await axiosInstance.post(
          `${baseURL}/api/uploadFile/upload`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        images = uploadResponse.data.fileUrls || [];
      } else if (editingProperty) {
        images = editingProperty.images;
      }

      values.images = images;

      let response;

      if (editingProperty) {
        response = await axiosInstance.put(
          `${baseURL}/api/property/updateProperty/${editingProperty._id}`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axiosInstance.post(
          `${baseURL}/api/property/addProperty`,
          values,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data.success) {
        message.success(editingProperty ? "Property updated!" : "Property added!");
        fetchProperties();
        setIsModalVisible(false);
        setEditingProperty(null);
        form.resetFields();
        setSelectedFiles([]);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("An error occurred");
    }
  };

  const handleEdit = (record) => {
    setEditingProperty(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(
        `${baseURL}/api/property/deleteProperty/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        message.success("Property deleted successfully!");
        fetchProperties();
      }
    } catch (error) {
      message.error("Failed to delete property");
    }
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 5) {
      message.error("You can upload a maximum of 5 images.");
      return;
    }
    setSelectedFiles(fileList);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      render: (images) =>
        images && images.length > 0 ? (
          <img
            src={`${baseURL}${images[0]}`}
            alt="Property"
            style={{ width: 80, height: 60, objectFit: "cover" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    { title: "Title", dataIndex: "title" },
    { title: "Location", dataIndex: "location" },
    { title: "Price", dataIndex: "price" },
    { title: "Type", dataIndex: "type" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "approved"
            ? "green"
            : status === "pending"
            ? "orange"
            : "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this property?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger className="ml-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Add Property
        </Button>
      </div>

      <Table columns={columns} dataSource={properties} rowKey="_id" />

      <Modal
        title={editingProperty ? "Edit Property" : "Add New Property"}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAddOrUpdateProperty}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Property Title" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}> <InputNumber style={{ width: "100%" }} /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true }]}> 
                <Select placeholder="Select Type">
                  <Option value="apartment">Apartment</Option>
                  <Option value="villa">Villa</Option>
                  <Option value="familyhouse">Family House</Option>
                  <Option value="rooms">Rooms</Option>
                  <Option value="pg">PG</Option>
                  <Option value="flats">Flats</Option>
                  <Option value="officespaces">Office Spaces</Option>
                  <Option value="plot">Plot</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Upload Files">
            <Upload
              fileList={selectedFiles}
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
              multiple={true}
            >
              <Button icon={<UploadOutlined />}>Select Files(Max-5)</Button>
            </Upload>
            {selectedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-gray-100 border rounded-md overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file.originFileObj)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 cursor-pointer rounded-full"
                      onClick={() => {
                        const newFileList = selectedFiles.filter((_, i) => i !== index);
                        setSelectedFiles(newFileList);
                      }}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Form.Item>

          <Form.Item name="amenities" label="Amenities" rules={[{ required: true }]}> 
            <Select mode="multiple" placeholder="Select available amenities">
              <Option value="parking">Parking</Option>
              <Option value="gym">Gym</Option>
              <Option value="pool">Swimming Pool</Option>
              <Option value="wifi">Wi-Fi</Option>
              <Option value="security">24/7 Security</Option>
              <Option value="garden">Garden</Option>
              <Option value="elevator">Elevator</Option>
              <Option value="ac">Air Conditioning</Option>
              <Option value="laundry">Laundry</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                {editingProperty ? "Update Property" : "Add Property"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
