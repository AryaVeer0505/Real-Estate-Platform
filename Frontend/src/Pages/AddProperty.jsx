import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Upload, Input, Button, Select, message } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../../axiosInnstance.js";
import { baseURL } from "../../config.js";
import Loader from "../Components/Loader.jsx";

const MySwal = withReactContent(Swal);
const { Option } = Select;

const AddProperty = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  const token = localStorage.getItem("token");
  const rawUserType = localStorage.getItem("userType");

  console.log("Token:", token);
  console.log("User Type (Raw):", rawUserType);
  
  // Check the type and value of userType
  const userType = rawUserType ? rawUserType.trim().toLowerCase() : null;
  console.log("User Type (Processed):", userType);

  if (!token) {
    console.log("Redirecting to owner login due to missing token...");
    MySwal.fire({
      title: "Access Denied",
      text: "You must be logged in as an owner to access this page.",
      icon: "warning",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/login/owner");
    });
    return;
  }

  if (userType !== "owner") {
    console.log("Redirecting to home due to user type:", userType);
    MySwal.fire({
      title: "Access Denied",
      text: "Only property owners can access this page.",
      icon: "warning",
      confirmButtonText: "Back to Home",
    }).then(() => {
      navigate("/");
    });
  }
}, [navigate]);


  const handleSubmit = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      let uploadedFileUrls = [];

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file.originFileObj);
        });

        const uploadResponse = await axiosInstance.post(
          `${baseURL}/api/uploadFile/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fileUrls = uploadResponse?.data?.fileUrls;

        if (!fileUrls || !Array.isArray(fileUrls)) {
          message.error("File upload failed");
          setLoading(false);
          return;
        }

        uploadedFileUrls = fileUrls;
        setImageUrl(uploadedFileUrls);
        message.success("Files uploaded successfully");
      }

      values.images = uploadedFileUrls;

      const response = await axiosInstance.post(
        `${baseURL}/api/property/addProperty`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        MySwal.fire({
          title: "Success!",
          text: "Property added successfully!",
          icon: "success",
          confirmButtonText: "Go to Dashboard",
        }).then(() => {
          form.resetFields();
          setSelectedFiles([]);
          navigate("/ownerDashboard");
        });
      } else {
        MySwal.fire({
          title: "Error",
          text: response.data.message || "Failed to add property",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Submit Error:", error);
      MySwal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setLoading(false);
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 5) {
      message.error("You can upload a maximum of 5 images.");
      return;
    }
    setSelectedFiles(fileList);
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center min-h-screen mt-5 mb-10">
          <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Add Property
            </h2>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <Form.Item
                  name="title"
                  label="Property Title"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Please input the property title!",
                    },
                  ]}
                >
                  <Input placeholder="e.g. Cozy Family Home" />
                </Form.Item>

                <Form.Item
                  name="location"
                  label="Location"
                  className="flex-1"
                  rules={[
                    { required: true, message: "Please input the location!" },
                  ]}
                >
                  <Input placeholder="e.g. Shimla" />
                </Form.Item>
              </div>
              <div className="flex gap-4">
                <Form.Item
                  name="price"
                  label="Price"
                  className="flex-1"
                  rules={[
                    { required: true, message: "Please input the price!" },
                  ]}
                >
                  <Input placeholder="e.g. ₹65,00,000" />
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Property Type"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Please select the property type!",
                    },
                  ]}
                >
                  <Select placeholder="Select Property Type">
                    <Option value="apartment">Apartment</Option>
                    <Option value="villa">Villa</Option>
                    <Option value="familyhouse">Family House</Option>
                    <Option value="rooms">Rooms</Option>
                    <Option value="pg">PG</Option>
                    <Option value="flats">Flats</Option>
                    <Option value="officespaces">Office Spaces</Option>
                    <Option value="plot">Plot</Option>
                  </Select>
                </Form.Item>
              </div>
              <Form.Item label="Upload Files">
                <Upload
                  fileList={selectedFiles}
                  beforeUpload={() => false}
                  onChange={handleFileChange}
                  showUploadList={false}
                  multiple={true}
                >
                  <Button icon={<UploadOutlined />}>
                    Select Files (Max-5)
                  </Button>
                </Upload>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 bg-gray-100 border rounded-md overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file.originFileObj)}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1/2 px-1 cursor-pointer rounded-full"
                          onClick={() => {
                            const newFileList = selectedFiles.filter(
                              (_, i) => i !== index
                            );
                            setSelectedFiles(newFileList);
                          }}
                        >
                          X
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Item>
           
              <Form.Item
                name="amenities"
                label="Amenities"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one amenity!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select available amenities"
                  allowClear
                >
                  <Option value="parking">Parking</Option>
                  <Option value="gym">Gym</Option>
                  <Option value="pool">Swimming Pool</Option>
                  <Option value="wifi">Wi-Fi</Option>
                  <Option value="security">24/7 Security</Option>
                  <Option value="garden">Garden</Option>
                  <Option value="elevator">Elevator</Option>
                  <Option value="ac">Air Conditioning</Option>
                  <Option value="laundry">Laundry</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Write a short description..."
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                >
                  Submit Property
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
