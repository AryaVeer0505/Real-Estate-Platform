import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tag } from "antd";
import axios from "axios";
import { Layout, Row, Col, Card, Avatar } from "antd";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

const { Option } = Select;
const { Content, Footer } = Layout;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/auth/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      message.error("Failed to load users");
      setUsers([]);
    }
  };

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddUser = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/addUser",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success("User added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error("Add user error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const userColumns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
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
        <Tag color={role === "admin" ? "gold" : role === "owner" ? "green" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-4">
          <div className="p-6 bg-white rounded shadow">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Users" bordered={false}>
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
              <Button type="primary" onClick={showModal} className="bg-black">
                Add User
              </Button>
            </div>

            <Table
              dataSource={users.map((user, index) => ({ ...user, key: index }))}
              columns={userColumns}
              pagination={{ pageSize: 5 }}
            />

            <Modal
              title="Add New User"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
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
          </div>
        </Content>

        <Footer className="text-center">Admin Dashboard ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default Users;
