import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Table,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader";

const { Content, Footer } = Layout;
const { Option } = Select;

const Properties = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [properties, setProperties] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Please login as admin to fetch properties");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(
        `${baseURL}/api/property/allProperties?all=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response || !response.data) {
        message.error("No response from server");
        return;
      }

      console.log("API Response:", response.data);

      if (response.data.success) {
        setProperties(response.data.properties);
      } else {
        message.error(response.data.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      if (err?.response?.status === 401) {
        message.error("Session expired. Please log in again.");
      } else {
        message.error("An error occurred while fetching properties");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddOrUpdateProperty = async (values) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as an owner");
      return;
    }

    try {
      let uploadedFileUrls = [];

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

        const fileUrls = uploadResponse?.data?.fileUrls;
        if (!fileUrls || !Array.isArray(fileUrls)) {
          message.error("File upload failed");
          return;
        }

        uploadedFileUrls = fileUrls;
        values.images = uploadedFileUrls;
      } else if (editingProperty) {
        values.images = editingProperty.images;
      }

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
        toast.success(
          editingProperty ? "Property updated!" : "Property added!"
        );
        setIsModalVisible(false);
        form.resetFields();
        setSelectedFiles([]);
        setEditingProperty(null);
        fetchProperties();
      } else {
        if (
          response.data.message ===
          "Please add a new property, this property is already listed"
        ) {
          toast.error(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 5) {
      message.error("You can upload a maximum of 5 images.");
      return;
    }
    setSelectedFiles(fileList);
  };

  const handleDeleteProperty = async (propertyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as an owner");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `${baseURL}/api/property/deleteProperty/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Property deleted successfully");
        fetchProperties();
      } else {
        toast.error(response.data.message || "Failed to delete property");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the property");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) =>
        images && images.length > 0 ? (
          <img
            src={`${baseURL}${images[0]}`}
            alt="Property"
            style={{
              width: 80,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === "Sold"
                ? "green"
                : status === "Not Sold"
                ? "red"
                : "orange",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProperty(record);
              form.setFieldsValue(record);
              setSelectedFiles([]);
              setIsModalVisible(true);
            }}
            className="mr-2"
          />
          <Popconfirm
            title="Are you sure to delete this property?"
            onConfirm={() => handleDeleteProperty(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout>
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content className="m-4">
              <div className="p-6 bg-white rounded shadow">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="Total Properties" bordered={false}>
                      {properties.length}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Active Sessions" bordered={false}>
                      0
                    </Card>
                  </Col>
                </Row>
                <div className="mt-6 flex justify-end">
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsModalVisible(true);
                      form.resetFields();
                      setSelectedFiles([]);
                      setEditingProperty(null);
                    }}
                  >
                    Add Property
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={properties}
                  rowKey="_id"
                  className="mt-6"
                  pagination={false}
                />
              </div>
            </Content>
            <Footer className="text-center">Properties Overview ©2025</Footer>
          </Layout>

          <Modal
            title={editingProperty ? "Edit Property" : "Add New Property"}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
              setSelectedFiles([]);
              setEditingProperty(null);
            }}
            footer={null}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleAddOrUpdateProperty}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Property Title"
                    rules={[
                      { required: true, message: "Please input the title!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      { required: true, message: "Please input the location!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      { required: true, message: "Please input the price!" },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: "Please select type!" }]}
                  >
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
                  <Button icon={<UploadOutlined />}>
                    Select Files (Max-5)
                  </Button>
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
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1/2 px-1 cursor-pointer rounded-full"
                          onClick={() => {
                            const newFileList = selectedFiles.filter(
                              (_, i) => i !== index
                            );
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
              <Form.Item
                name="amenities"
                label="Amenities"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one amenity!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select available amenities"
                  allowClear
                >
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
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please select the status!" },
                ]}
              >
                <Select placeholder="Select status">
                  <Option value="Sold">Sold</Option>
                  <Option value="Not Sold">Not Sold</Option>
                  <Option value="Pending">Pending</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end">
                  <Button type="primary" htmlType="submit">
                    {editingProperty ? "Update Property" : "Add Property"}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
          <ToastContainer />
        </Layout>
      )}
    </div>
  );
};

export default Properties;
