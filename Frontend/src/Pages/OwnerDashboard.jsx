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

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in to view your properties.");
        return;
      }

      const response = await axiosInstance.get(
        `${baseURL}/api/property/allProperties`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setProperties(response.data.properties);
      } else {
        message.error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      message.error("An error occurred while fetching properties.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleAddProperty = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You must be logged in to add a property.");
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        uploadedFileUrls = uploadResponse?.data?.fileUrls || [];
        if (!uploadedFileUrls.length) {
          message.error("File upload failed");
          return;
        }
        values.images = uploadedFileUrls;
      }

      const response = await axiosInstance.post(
        `${baseURL}/api/property/addProperty`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Property added successfully!");
        form.resetFields();
        setSelectedFiles([]);
        handleCloseModal();
        fetchProperties();
      } else {
        message.error("Failed to add property");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      message.error("An error occurred while adding the property.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 5) {
      message.error("You can upload a maximum of 5 images.");
      return;
    }
    setSelectedFiles(fileList);
  };

  const handleDelete = async (propertyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You must be logged in to delete a property.");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `${baseURL}/api/property/deleteProperty/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        message.success("Property deleted successfully!");
        fetchProperties();
      } else {
        message.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      message.error("An error occurred while deleting the property.");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) =>
        images && images.length > 0 ? (
          <img
            src={images[0]}
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
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              message.info("Edit functionality is not implemented yet.")
            }
            className="mr-2"
          />
          <Popconfirm
            title="Are you sure to delete this property?"
            onConfirm={() => handleDelete(record._id)}
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
        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
            >
              Add Property
            </Button>
          </div>

          <Table columns={columns} dataSource={properties} rowKey="_id" />

          <Modal
            title="Add New Property"
            open={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}
          >
            <Form layout="vertical" form={form} onFinish={handleAddProperty}>
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
                    <InputNumber style={{ width: "100%" }} />
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
                    Add Property
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
