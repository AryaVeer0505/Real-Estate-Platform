import React, { useState } from "react";
import { LockOutlined, UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader";
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams();

  const showSuccessToast = (message) => toast.success(message, { position: "top-center" });
  const showErrorToast = (message) => toast.error(message, { position: "top-center" });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, role };
      const response = await axios.post("http://localhost:5001/api/auth/register", payload);
      showSuccessToast("Registration Successful! Redirecting to login...");
      setTimeout(() => navigate(`/login/${role}`), 2000);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to register");
      setLoading(false);
    }
  };
const responseGoogle = async (authResult) => {
  setLoading(true);
  try {
    if (authResult.code) {
      // Pass the role parameter along with the code
      const payload = { code: authResult.code, role };

      const res = await axios.post("http://localhost:5001/api/auth/google", payload);
      const { user, isNewUser } = res.data;

      const { email, name, image, token, role: userRole } = user;

      const userInfo = {
        email,
        name,
        role: userRole,
        image,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userRole); 

      window.dispatchEvent(new Event("loginStatusChanged"));

      const successMessage = isNewUser 
        ? "Registration Successful!" 
        : "Login Successful!";

      toast.success(successMessage, { position: "top-center" });
      setTimeout(() => navigate(`/`), 2000);
    } else {
      throw new Error("Google authentication failed");
    }
  } catch (error) {
    console.error("Error during Google authentication:", error.message);
    toast.error("Failed to login", { position: "top-center" });
  } finally {
    setLoading(false);
  }
};


  
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-green-400">
            <h2 className="text-2xl font-semibold text-center mb-4 capitalize">
              Register as {role === "owner" ? "Property Owner" : "Buyer"}
            </h2>

            <Form name="register" onFinish={onFinish}>
              <Form.Item name="username" rules={[{ required: true, message: "Please enter your username!" }, { min: 3, message: "Username must be at least 3 characters!" }]}>  
                <Input prefix={<UserOutlined />} placeholder="User Name" />
              </Form.Item>

              <Form.Item name="number" rules={[{ required: true, message: "Please enter your mobile number!" }, { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number!" }]}>  
                <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" type="tel" />
              </Form.Item>

              <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>  
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: "Please create your password!" }, { min: 6, message: "Password must be at least 6 characters!" }]}>  
                <Input prefix={<LockOutlined />} type="password" placeholder="Create Password" />
              </Form.Item>

              <Form.Item name="confirmPassword" dependencies={["password"]} rules={[{ required: true, message: "Please confirm your password!" }, ({ getFieldValue }) => ({ validator(_, value) { return !value || getFieldValue("password") === value ? Promise.resolve() : Promise.reject(new Error("Passwords do not match!")); } })]}>  
                <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Register
                </Button>
                <p className="text-center mt-2">
                  Or <NavLink to={`/login/${role}`} className="text-green-600 hover:underline">Login now!</NavLink>
                </p>
              </Form.Item>

            </Form>
            
            <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-3 text-gray-700 text-sm">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button onClick={() => googleLogin()} className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 rounded-md py-2 font-medium hover:bg-gray-100 transition mb-4">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" className="w-5 h-5" />
                Continue with Google
              </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
