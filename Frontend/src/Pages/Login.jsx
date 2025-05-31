import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Components/Loader.jsx";
import { baseURL } from "../../config.js";
import axiosInstance from "../../axiosInnstance.js";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await axiosInstance.post(`${baseURL}/api/auth/login`, {
        email,
        password,
        role,
      });

      if (response.data.success) {
        message.success(response.data.message);
        toast.success("Successfully Logged In", { position: "top-center" });

        const { payload, token } = response.data;

        if (payload) {
          const {
            _id,
            username,
            email: userEmail,
            role: userRoleFromPayload,
          } = payload;

          const userRole = userRoleFromPayload
            ? userRoleFromPayload.trim().toLowerCase()
            : "user";

          localStorage.setItem(
            "user",
            JSON.stringify({
              _id,
              username,
              email: userEmail,
              role: userRole,
            })
          );

          localStorage.setItem("userType", userRole);
        }

        if (token) {
          localStorage.setItem("token", token);
        }

        window.dispatchEvent(new Event("loginStatusChanged"));

        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 3000);
      } else {
        message.error(response.data.message);
        toast.error("Failed to login", { position: "top-center" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Login failed";
      message.error(errorMsg);
      toast.error(errorMsg, { position: "top-center" });
      setLoading(false);
    }
  };

  const responseGoogle = async (authResult) => {
    setLoading(true);
    try {
      if (authResult.code) {
        const payload = { code: authResult.code, role };

        const res = await axios.post(
          `${baseURL}/api/auth/google`,
          payload
        );
        const { user, isNewUser } = res.data;

        const { email, name, image, token, role: userRole, _id } = user;

        const userInfo = {
          _id,
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
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-sm border border-green-400">
            <h2 className="text-2xl font-bold text-center mb-6 capitalize">
              Login as {role === "owner" ? "Property Owner" : "User"}
            </h2>

            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-500" />}
                  placeholder="Email"
                  className="py-2 px-4 w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring focus:ring-blue-200"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
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
                  <NavLink
                    to={`/forgotPassword/${role}`}
                    className="text-green-600 hover:underline"
                  >
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

              <div className="text-center text-gray-600">
                Don't have an account?
                <NavLink
                  to={`/register/${role}`}
                  className="text-green-600 hover:underline ml-1"
                >
                  Register as {role === "owner" ? "Owner" : "User"}
                </NavLink>
              </div>
            </Form>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-700 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 rounded-md py-2 font-medium hover:bg-gray-100 transition mb-4"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="G"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
