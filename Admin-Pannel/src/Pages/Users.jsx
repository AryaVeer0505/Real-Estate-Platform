import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Popconfirm,
} from "antd";
import { Layout, Row, Col, Card } from "antd";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader.jsx";

const { Option } = Select;
const { Content, Footer } = Layout;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${baseURL}/api/auth/getUsers`);
      setUsers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      message.error("Failed to load users");
      setUsers([]);
      setLoading(false);
    }
  };

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
    // Set form values. Map name to username for consistency
    editForm.setFieldsValue({
      username: user.name || user.username,
      number: user.number || "",
      email: user.email,
      role: user.role,
    });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
    editForm.resetFields();
    setEditLoading(false);
  };

  const handleAddUser = async (values) => {
    try {
      setAddLoading(true);
      // Map username to name to keep backend consistent
      const payload = {
        ...values,
        name: values.username,
      };
      await axiosInstance.post(`${baseURL}/api/auth/addUser`, payload);
      message.success("User added successfully!");
      toast.success("User Added", { position: "top-right" });
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
      setAddLoading(false);
    } catch (error) {
      console.error("Add user error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to add user");
      toast.error("Failed to add new user", { position: "top-right" });
      setAddLoading(false);
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      setEditLoading(true);
      const payload = {
        ...values,
        name: values.username,
      };
      await axiosInstance.put(
        `${baseURL}/api/auth/updateUser/${editingUser._id}`,
        payload
      );
      message.success("User updated successfully!");
      setIsEditModalVisible(false);
      toast.success("User details updated", { position: "top-right" });
      fetchUsers();
      setEditLoading(false);
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update user");
      toast.error("Failed to update user details", { position: "top-right" });
      setEditLoading(false);
    }
  };

const handleDelete = async (userId) => {
  try {
    const res = await axiosInstance.delete(`${baseURL}/api/auth/deleteUser/${userId}`);
    message.success(res.data.message || "User deleted successfully!");
    toast.success("User Deleted", { position: "top-right" });
    await fetchUsers(); 
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to delete user";
    message.error(errorMsg);
  }
};


  const filteredUsers = users.filter((user) =>
    (user.name || user.username || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const userColumns = [
    {
      title: "Username",
      key: "username",
      render: (_, record) => record.username || record.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin" ? "gold" : role === "owner" ? "green" : "blue"
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Auth Type",
      key: "authType",
      render: (record) => (
        <Tag color={record.googleId ? "red" : "cyan"}>
          {record.googleId ? "Google" : "Manual"}
        </Tag>
      ),
    },
   {
  title: "Actions",
  key: "actions",
  render: (_, record) => (
    <>
      {!record.googleId && (
        <Button
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
          className="mr-2"
        />
      )}
     <Popconfirm
  title="Are you sure to delete this user?"
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
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout>
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content className="m-4">
              <div className="p-6 bg-white rounded shadow">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="Total Users" bordered={false}>
                      {users.length}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Active Users" bordered={false}>
                      0
                    </Card>
                  </Col>
                </Row>

                <div className="flex justify-between items-center mb-4 mt-6">
                  <h2 className="text-xl font-semibold">Registered Users</h2>
                  <Button
                    type="primary"
                    onClick={showModal}
                    className="bg-black"
                  >
                    Add User
                  </Button>
                </div>

                <Input.Search
                  placeholder="Search users..."
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                  dataSource={filteredUsers.map((user, index) => ({
                    ...user,
                    key: index,
                  }))}
                  columns={userColumns}
                  pagination={{ pageSize: 5 }}
                />

                <Modal
                  title="Add New User"
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddUser}
                    initialValues={{ role: "user" }}
                  >
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="number"
                      label="Number"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ required: true }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Please confirm your password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="user">User</Option>
                        <Option value="owner">Owner</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-black w-full"
                        loading={addLoading}
                      >
                        Add User
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>

                <Modal
                  title="Edit User"
                  open={isEditModalVisible}
                  onCancel={handleEditCancel}
                  footer={null}
                >
                  <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdateUser}
                  >
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="number"
                      label="Number"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="user">User</Option>
                        <Option value="owner">Owner</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-black w-full"
                        loading={editLoading}
                      >
                        Update User
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2023 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      )}
      <ToastContainer />
    </div>
  );
};

export default Users;
