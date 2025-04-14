import React, { useState } from "react";
import { Layout, Row, Col, Card } from "antd";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header"; 

const { Content, Footer } = Layout;

const Properties = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="m-4">
          <div className="p-6 bg-white rounded shadow">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Properties" bordered={false}>
                  0
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Active Sessions" bordered={false}>
                  0
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <Footer className="text-center">Properties Overview ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default Properties;
