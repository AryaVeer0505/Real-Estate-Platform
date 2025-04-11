import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Breadcrumb,
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.png";
import axios from "axios";

const { Header, Sider, Content, Footer } = Layout;
const { Option } = Select;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const userColumns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "gold" : role === "owner" ? "green" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddUser = async (values) => {
    try {
      const userData = values;
      console.log("Submitting user data:", values);

      const response = await axios.post(
        "http://localhost:5001/api/auth/addUser",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      message.success("User added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Add user error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="80"
        className="!bg-black"
      >
        <div className="flex justify-center items-center py-4">
          <img
            src={logo}
            alt="Logo"
            className={`${collapsed ? "h-8" : "h-12"} transition-all duration-300`}
          />
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>Users</Menu.Item>
          <Menu.Item key="3" icon={<BarChartOutlined />}>Properties</Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>Settings</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="bg-white flex justify-between items-center px-4 shadow">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "black", fontSize: 18 }} />
              ) : (
                <MenuFoldOutlined style={{ color: "black", fontSize: 18 }} />
              )
            }
          />
          <Avatar icon={<UserOutlined />} />
        </Header>

        <Content className="m-4">
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          <div className="p-6 bg-white rounded shadow">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="Users" bordered={false}>{users.length}</Card>
              </Col>
              <Col span={8}>
                <Card title="Properties" bordered={false}>0</Card>
              </Col>
              <Col span={8}>
                <Card title="Active Sessions" bordered={false}>0</Card>
              </Col>
            </Row>
          </div>

          <div className="mt-6 bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Registered Users</h2>
              <Button type="primary" onClick={showModal} className="bg-black">
                Add User
              </Button>
            </div>

            <Table
              dataSource={users.map((user, index) => ({ ...user, key: index }))}
              columns={userColumns}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Content>

        <Footer className="text-center">Admin Dashboard ©2025</Footer>
      </Layout>

      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="top-0"
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="number" label="Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
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
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="user">User</Option>
              <Option value="owner">Owner</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-black w-full">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
