import React, { useState, useEffect } from "react";
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
import { baseURL } from "../../config.js";
import axiosInstance from "../../axiosInnstance.js";
import Loader from "../Components/Loader";
import dayjs from "dayjs";

const { Content, Footer } = Layout;
const { Option } = Select;

const Appointments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form] = Form.useForm();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Please login to fetch appointments");
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get(
        `${baseURL}/api/appointment/allAppointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const formattedAppointments = response.data.appointments.map(
          (appointment) => ({
            _id: appointment._id,
            username: appointment.username || "N/A",
            email: appointment.email || "N/A",
            title: appointment.title || "N/A",
            dateTime: dayjs(appointment.appointmentDate).format(
              "YYYY-MM-DD HH:mm"
            ),
            date: dayjs(appointment.appointmentDate).format("YYYY-MM-DD"),
            time: dayjs(appointment.appointmentDate).format("HH:mm"),
            status: appointment.status,
          })
        );

        setAppointments(formattedAppointments);
      } else {
        message.error(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      message.error("An error occurred while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openEditModal = (record) => {
    setEditingAppointment(record);
    form.setFieldsValue({
      status: record.status.toLowerCase(),
    });
    setIsModalVisible(true);
  };
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleUpdateStatus = async (values) => {
  const token = localStorage.getItem("token");
  if (!token) {
    message.error("You must be logged in to update appointment");
    return;
  }

  try {
    const response = await axiosInstance.put(
      `${baseURL}/api/appointment/update/${editingAppointment._id}`,
      { 
        status: values.status 
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      message.success("Appointment status updated successfully");
      setIsModalVisible(false);
      setEditingAppointment(null);
      fetchAppointments();
    } else {
      message.error(response.data.message || "Failed to update appointment");
    }
  } catch (error) {
    console.error("Update error:", error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        "An error occurred while updating appointment";
    message.error(errorMessage);
  }
};
  const handleDeleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("You must be logged in to delete appointment");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `${baseURL}/api/appointment/delete/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        message.success("Appointment deleted successfully");
        fetchAppointments();
      } else {
        message.error(response.data.message || "Failed to delete appointment");
      }
    } catch (error) {
      message.error("An error occurred while deleting appointment");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Property Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a, b) =>
        dayjs(a.time, "HH:mm").unix() - dayjs(b.time, "HH:mm").unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gray";
        if (status === "Confirmed") color = "green";
        else if (status === "Cancelled") color = "red";
        else if (status === "Pending") color = "orange";
        return <span style={{ color }}>{status}</span>;
      },
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
                    <Card title="Total Appointments" bordered={false}>
                      {appointments.length}
                    </Card>
                  </Col>
                </Row>
                <Table
                  columns={columns}
                  dataSource={appointments}
                  rowKey="_id"
                  className="mt-6"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </Content>
            <Footer className="text-center">Appointments Overview ©2025</Footer>
          </Layout>
          <Modal
            title="Update Appointment Status"
            visible={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingAppointment(null);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateStatus}
              initialValues={{
                status: editingAppointment?.status?.toLowerCase(),
              }}
            >
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select placeholder="Select status">
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end">
                  <Button type="primary" htmlType="submit">
                    Update Status
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      )}
    </div>
  );
};

export default Appointments;
