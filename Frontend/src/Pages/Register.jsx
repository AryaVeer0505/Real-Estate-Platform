import React, { useState } from "react";
import {LockOutlined,UserOutlined,PhoneOutlined,MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams(); 

  const showSuccessToast = (message) =>
    toast.success(message, { position: "top-center" });
  const showErrorToast = (message) =>
    toast.error(message, { position: "top-center" });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, role }; 
      const response = await axios.post("http://localhost:5001/api/auth/register",payload);

      showSuccessToast("Registration Successful! Redirecting to login...");

      setTimeout(() => {
        navigate(`/login/${role}`);
      }, 3000);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to register"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-green-400">
            <h2 className="text-2xl font-semibold text-center mb-4 capitalize">
              Register as {role === "owner" ? "Property Owner" : "User"}
            </h2>

            <Form
              name="register"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                  {
                    min: 3,
                    message: "Username must be at least 3 characters long!",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="User Name" />
              </Form.Item>

              <Form.Item
                name="number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number!",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Mobile Number"
                  type="tel"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please create your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Create Password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Register
                </Button>
                <p className="text-center mt-2">
                  Or{" "}
                  <NavLink
                    to={`/login/${role}`}
                    className="text-green-600 hover:underline"
                  >
                    Login now!
                  </NavLink>
                </p>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
