import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();


  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes("users")) return ["2"];
    if (path.includes("properties")) return ["3"];
    return ["1"];
  };

  return (
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

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()} 
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <NavLink to="/dashboard/users">Users</NavLink>
        </Menu.Item>
        <Menu.Item key="3" icon={<BarChartOutlined />}>
          <NavLink to="/dashboard/properties">Properties</NavLink>
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default Sidebar;
