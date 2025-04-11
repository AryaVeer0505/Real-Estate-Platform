import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Components/Loader';
import Newsletter from '../Components/NewsLetter';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/contact_us/contact',values);
      console.log('Form Submitted:', response.data);
      toast.success('Your message has been sent successfully!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send your message. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Validation Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50">
       
          <div className="bg-green-600 text-white py-16 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Have questions about a property, want to list your own, or need help navigating your real estate journey? We'd love to help!
            </p>
          </div>

    
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 max-w-6xl mx-auto px-4 py-12">
   
            <div className="flex-1 text-gray-700 space-y-4">
              <h2 className="text-2xl font-semibold">Get in Touch</h2>
              <p>
                Fill out the form and our team will get back to you within 24 hours. You can contact us about:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Property inquiries</li>
                <li>Scheduling property visits</li>
                <li>Listing your own property</li>
                <li>Feedback or support</li>
              </ul>
              <p>
                Prefer direct contact? Email us at <span className="font-semibold">support@yourrealestate.com</span>
              </p>
            </div>
            <div className="flex-1 w-full">
              <Card
                bordered={false}
                className="w-full shadow-lg p-6 bg-white rounded-xl"
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
                      prefix={<UserOutlined className="text-blue-500" />}
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
                      prefix={<MailOutlined className="text-blue-500" />}
                      placeholder="Your Email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[
                      { required: true, message: 'Please enter your message!' },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Your Message"
                      prefix={<MessageOutlined className="text-blue-500" />}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>

          <div className="bg-gray-100">
            <Newsletter />
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Contact;
