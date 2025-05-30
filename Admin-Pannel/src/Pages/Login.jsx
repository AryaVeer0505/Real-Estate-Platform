import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../Components/Loader.jsx';
import { baseURL } from '../../config.js';
import axiosInstance from '../../axiosInnstance.js';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;
  
    try {
      const response = await axiosInstance.post(`${baseURL}/api/auth/login`, {
        email,
        password,
        role:'admin', 
      });
  
      if (response.data.success) {
        message.success(response.data.message);
        toast.success('Successfully Logged In', { position: 'top-center' });
  
        if (response.data.payload) {
          localStorage.setItem("email", response.data.payload.email);
          localStorage.setItem("role", response.data.payload.role);
          localStorage.setItem("username", response.data.payload.username);
          localStorage.setItem("token", response.data.token);
        }
        console.log("Token saved:", response.data.token);

  
        setTimeout(() => {
          navigate('/dashboard');
          setLoading(false);
        }, 3000);
      } else {
        message.error(response.data.message);
        toast.error('Failed to login', { position: 'top-center' });
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Login failed';
      message.error(errorMsg);
      toast.error(errorMsg, { position: 'top-center' });
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-sm border border-green-400">
            <h2 className="text-2xl font-bold text-center mb-6 capitalize">
              Admin Login
            </h2>

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-500" />}
                  placeholder="Email"
                  className="py-2 px-4 w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-500" />}
                  placeholder="Password"
                  className="py-2 px-4 w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between items-center">
                  <Checkbox className="text-gray-600">Remember me</Checkbox>
                  <NavLink to="/forgotPassword" className="text-green-600 hover:underline">
                    Forgot password?
                  </NavLink>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-full transition"
                >
                  Log in
                </Button>
              </Form.Item>

            </Form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
