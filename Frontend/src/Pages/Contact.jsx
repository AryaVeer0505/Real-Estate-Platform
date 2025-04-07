import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, MailOutlined, MessageOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import Loader from '../Components/Loader';

const Contact = () => {
  const [loading,setLoading]=useState(false)
  const onFinish =async (values) => {
    console.log('Form Submitted:', values);
    message.success('Your message has been sent successfully!');
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:5001/api/contact_us/contact", values);
      message.success("Your message has been sent successfully!");
      toast.success("Message Submitted successfully",{
        position:'top-center'
      })
  } catch (error) {
      console.error("Error submitting contact form:", error);
      message.error("Failed to send your message. Please try again.");
      toast.error("Failed to submit message",{
        position:'top-center'
      })
      
  }
  finally{
    setLoading(false)
  }
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  };

  return (
    <>
    {loading ? (
      <Loader/>
    ) :(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card
        title="Contact Us"
        bordered={false}
        className="w-full max-w-md shadow-lg p-6 bg-white rounded-lg"
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-green-500" />} 
              placeholder="Your Name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Enter a valid email address!' },
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-green-500" />} 
              placeholder="Your Email"
            />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: 'Please enter your message!' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Your Message"
              prefix={<MessageOutlined className="text-green-500" />} 
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-green-500 hover:bg-green-600"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
    </div>
    )}
    <ToastContainer/>

    </>
  );
};

export default Contact;
