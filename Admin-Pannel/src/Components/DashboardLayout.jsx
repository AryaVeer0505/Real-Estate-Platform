import React from "react";
import { Button, Avatar, Dropdown, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    window.dispatchEvent(new Event('loginStatusChanged')); 
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white flex justify-between items-center px-4 py-6 shadow">
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

      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Avatar
          icon={<UserOutlined />}
          className="cursor-pointer"
          style={{ backgroundColor: "#000" }}
        />
      </Dropdown>
    </div>
  );
};

export default Header;
