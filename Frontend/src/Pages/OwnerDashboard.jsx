import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
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
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { baseURL } from "../../config.js";
import axiosInstance from "../../axiosInnstance.js";
import Loader from "../Components/Loader.jsx";
import { ToastContainer, toast } from "react-toastify";

const { Option } = Select;
const { Sider, Content } = Layout;

const OwnerDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("properties");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] =
    useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

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
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `${baseURL}/api/appointment/ownerAppointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data.appointments || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      message.error("Failed to fetch appointments");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "properties") {
      fetchProperties();
    } else if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

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

  const openEditModal = (record) => {
    setEditingAppointment(record);
    form.setFieldsValue({ status: record.status });
    setIsAppointmentModalVisible(true);
  };

  const handleUpdateStatus = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.put(
        `${baseURL}/api/appointment/update/${editingAppointment._id}`,
        { status: values.status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        message.success("Appointment updated successfully");
        setIsAppointmentModalVisible(false);
        setEditingAppointment(null);
        fetchAppointments();
      } else {
        message.error("Failed to update appointment");
      }
    } catch (error) {
      message.error("Error updating appointment");
    }
  };

  const handleDeleteAppointment = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(
        `${baseURL}/api/appointment/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        message.success("Appointment deleted successfully");
        fetchAppointments();
      } else {
        message.error("Failed to delete appointment");
      }
    } catch (error) {
      message.error("Error deleting appointment");
    }
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="text-white text-center font-bold my-4">OWNER PANEL</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["properties"]}
          onClick={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="properties" icon={<HomeOutlined />}>
            My Properties
          </Menu.Item>
          <Menu.Item key="appointments" icon={<CalendarOutlined />}>
            Scheduled Appointments
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "16px" }}>
          {activeTab === "properties" && (
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  My Properties
                </h2>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenModal}
                >
                  Add Property
                </Button>
              </div>
              <Table columns={columns} dataSource={properties} rowKey="_id" />
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Scheduled Appointments
              </h2>
              <Table
                dataSource={appointments}
                rowKey="_id"
                loading={loading}
                columns={[
                  {
                    title: "Property",
                    dataIndex: "propertyId",
                    render: (property) => property?.title || "N/A",
                  },
                  {
                    title: "User",
                    dataIndex: "userInfo",
                    render: (user) => user?.username || user?.name || "N/A",
                  },
                  {
                    title: "Email",
                    dataIndex: "userInfo",
                    render: (user) => user?.email || "N/A",
                  },

                  {
                    title: "Date",
                    dataIndex: "appointmentDate",
                    render: (date) => new Date(date).toLocaleDateString(),
                  },

                  {
                    title: "Status",
                    dataIndex: "status",
                    render: (status) => (
                      <Tag color={status === "confirmed" ? "green" : "orange"}>
                        {status?.toUpperCase()}
                      </Tag>
                    ),
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          className="mr-2"
                          onClick={() => openEditModal(record)}
                        />
                        <Popconfirm
                          title="Are you sure to delete this appointment?"
                          onConfirm={() => handleDeleteAppointment(record._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </Content>
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
                rules={[{ required: true, message: "Please input the title!" }]}
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
                rules={[{ required: true, message: "Please input the price!" }]}
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
              <Button icon={<UploadOutlined />}>Select Files (Max-5)</Button>
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
                {editingProperty ? "Update Property" : "Add Property"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Appointment Status"
        open={isAppointmentModalVisible}
        onCancel={() => {
          setIsAppointmentModalVisible(false);
          setEditingAppointment(null);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdateStatus}
          initialValues={{ status: editingAppointment?.status }}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select status">
              <Option value="confirmed">Confirmed</Option>
              <Option value="pending">Pending</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsAppointmentModalVisible(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </Layout>
  );
};

export default OwnerDashboard;
