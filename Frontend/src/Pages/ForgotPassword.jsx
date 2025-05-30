import React from 'react';
import axios from 'axios';
import { baseURL } from '../../config.js';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Input, Button } from 'antd';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { role } = useParams();

  const validRoles = ['user', 'owner', 'admin'];
  const safeRole = validRoles.includes(role) ? role : 'user';

  const handleSubmit = async (values) => {
    const { email, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/password/forgotPassword`, {
        email,
        newPassword,
        role: safeRole, // Send role to backend
      });

      if (res.status === 200) {
        toast.success("Password reset successfully.");
        form.resetFields();
      } else {
        toast.error(res.data?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">
        Reset Password ({safeRole.charAt(0).toUpperCase() + safeRole.slice(1)})
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email.' },
            { type: 'email', message: 'Please enter a valid email.' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter your new password.' },
            { min: 6, message: 'Password must be at least 6 characters.' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your new password.' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Reset Password
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4 text-center">
        <Button type="link" onClick={() => navigate(`/login/${safeRole}`)}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
