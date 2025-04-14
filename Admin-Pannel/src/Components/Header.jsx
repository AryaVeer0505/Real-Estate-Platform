import React from "react";
import { Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Header = ({ collapsed, setCollapsed }) => {
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

      <Link to="/login">
        <Button type="primary" className="bg-black">
          Login
        </Button>
      </Link>
    </div>
  );
};

export default Header;
