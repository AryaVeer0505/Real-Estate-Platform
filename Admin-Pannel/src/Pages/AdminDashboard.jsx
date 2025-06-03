import React, { useState, useEffect } from "react";
import {
  Layout,
  Breadcrumb,
  message,
  Card,
  Row,
  Col,
} from "antd";
import axiosInstance from "../../axiosInnstance";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header"; 
import { baseURL } from "../../config";
import Loader from "../Components/Loader.jsx";

const { Content, Footer } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersRes = await axiosInstance.get(`${baseURL}/api/auth/getUsers`);
        console.log("Users Data:", usersRes.data);
        setUsers(usersRes.data);

        const propertiesRes = await axiosInstance.get(`${baseURL}/api/property/allProperties`);
        console.log("Properties Data:", propertiesRes.data);
        if (Array.isArray(propertiesRes.data)) {
          setProperties(propertiesRes.data);
        } else if (propertiesRes.data.properties) {
          setProperties(propertiesRes.data.properties);
        } else {
          message.error("Failed to load properties data.");
        }

        const appointmentsRes = await axiosInstance.get(`${baseURL}/api/appointment/allAppointments`);
        console.log("Appointments Data:", appointmentsRes.data);
        if (Array.isArray(appointmentsRes.data.appointments)) {
          setAppointments(appointmentsRes.data.appointments);
        } else {
          message.error("Failed to load appointments data.");
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
        message.error("Failed to load data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

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
              <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              </Breadcrumb>

              <div className="p-6 bg-white rounded shadow">
                <Row gutter={16}>
                  <Col span={8}>
                    <Card title="Total Users" bordered={false}>
                      {users.length > 0 ? users.length : "No users available"}
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Properties" bordered={false}>
                      {properties.length > 0 ? properties.length : "No properties available"}
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Appointments" bordered={false}>
                      {appointments.length > 0 ? appointments.length : "No appointments available"}
                    </Card>
                  </Col>
                </Row>
              </div>
            </Content>
            <Footer className="text-center">Admin Dashboard ©2025</Footer>
          </Layout>
        </Layout>
      )}
    </div>
  );
};

export default AdminDashboard;
