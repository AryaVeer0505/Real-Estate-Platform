import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Components/Loader';
import { baseURL } from '../../config';
import axiosInstance from '../../axiosInnstance.js'

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log('Data Submitted: ', values);
    setLoading(true);

    try {
      const { email, password } = values;
      const response = await axiosInstance.post(`${baseURL}/api/auth/login`, { email, password });

      if (response.data.success) {
        message.success(response.data.message);
        toast.success('Successfully Logged In', { position: 'top-center' });

        if (response.data.payload) {
          localStorage.setItem('username', response.data.payload.username || '');
          localStorage.setItem('email', response.data.payload.email || '');
        }
        

        setTimeout(() => {
          navigate('/');
          setLoading(false);
        }, 3000);

        console.log('Successfully logged in');
      } else {
        message.error(response.data.message);
        toast.error('Failed to login', { position: 'top-center' });
        setLoading(false);
      }
    } catch (error) {
      console.log('Error message', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed', { position: 'top-center' });
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} className="space-y-4">
              <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input
                  prefix={<UserOutlined className="text-gray-500" />}
                  placeholder="Email"
                  className="py-2 px-4 w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                <Input
                  prefix={<LockOutlined className="text-gray-500" />}
                  type="password"
                  placeholder="Password"
                  className="py-2 px-4 w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between items-center">
                  <Checkbox className="text-gray-600">Remember me</Checkbox>
                  <a href="#" className="text-green-600 hover:underline">
                    Forgot password?
                  </a>
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

              <div className="text-center text-gray-600">
                Don't have an account?
                <NavLink to="/register" className="text-green-600 hover:underline ml-1">
                  Register now!
                </NavLink>
              </div>
            </Form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
