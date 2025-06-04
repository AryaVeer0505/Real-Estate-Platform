import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Card,
  Row,
  Col,
  message,
  Button,
  Modal,
  Select,
  Popconfirm,
  Form,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import axiosInstance from "../../axiosInnstance";
import { baseURL } from "../../config";
import Loader from "../Components/Loader";
import dayjs from "dayjs";

const { Content, Footer } = Layout;
const { Option } = Select;

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to view orders");
        return;
      }

      const response = await axiosInstance.get(
        `${baseURL}/api/order/allOrders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        message.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      message.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openEditModal = (record) => {
    setEditingOrder(record);
    form.setFieldsValue({ paymentStatus: record.paymentStatus });
    setIsModalVisible(true);
  };

  const handleUpdateOrder = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.put(
        `${baseURL}/api/order/update/${editingOrder._id}`,
        { paymentStatus: values.paymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        message.success("Order updated");
        setIsModalVisible(false);
        setEditingOrder(null);
        fetchOrders();
      } else {
        message.error(response.data.message || "Update failed");
      }
    } catch (err) {
      message.error("Error updating order");
    }
  };

  const columns = [
    { title: "User", dataIndex: ["user", "username"], key: "user" },
    { title: "Email", dataIndex: ["user", "email"], key: "email" },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const color =
          status === "paid"
            ? "green"
            : status === "pending"
            ? "orange"
            : "gray";
        return (
          <span style={{ color }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
        
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
                    <Card title="Total Orders" bordered={false}>
                      {orders.length}
                    </Card>
                  </Col>
                </Row>

                <Table
                  columns={columns}
                  dataSource={orders}
                  rowKey="_id"
                  className="mt-6"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </Content>
            <Footer className="text-center">Orders Overview ©2025</Footer>
          </Layout>

          <Modal
            title="Update Order Status"
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingOrder(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdateOrder}>
              <Form.Item
                name="paymentStatus"
                label="Payment Status"
                rules={[{ required: true, message: "Select status" }]}
              >
                <Select placeholder="Select status">
                  <Option value="paid">Paid</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Failed</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="float-right"
                >
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      )}
    </div>
  );
};

export default Orders;
