
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DatePicker, Button, message, Divider } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../axiosInnstance";
import { baseURL } from "../../config";
import Loader from "../Components/Loader";

const Property = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${baseURL}/api/property/${id}`);
        if (response.status === 200) {
          setProperty(response.data.property);
        } else {
          message.error("Failed to load property details.");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        message.error("An error occurred while fetching property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBooking = () => {
    if (!appointmentDate) {
      message.warning("Please select a date first.");
      return;
    }

    message.success(`Appointment booked for ${dayjs(appointmentDate).format("DD MMM, YYYY")}`);
    setAppointmentDate(null);
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (property.images?.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images?.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length
      );
    }
  };

  if (loading || !property) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-screen-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative w-full h-[400px] md:h-[500px] ">
          <img
            src={
              property.images && property.images.length > 0
                ? `${baseURL}${property.images[currentImageIndex]}`
                : "/default-property.jpg"
            }
            alt="Property"
            className="w-full h-full object-cover transition duration-300 ease-in-out rounded-lg"
          />

          {property.images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow-lg"
              >
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow-lg"
              >
                &gt;
              </button>
            </>
          )}

          {property.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    currentImageIndex === index ? "bg-green-500" : "bg-gray-300"
                  }`}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          )}
        </div>

       {/* DETAILS SECTION */}
<div className="p-8 md:p-12 space-y-6">
  <h1 className="text-4xl font-bold text-green-600 text-center md:text-left">{property.title}</h1>
  <div className="space-y-6 md:space-y-8">
    {/* Property Details */}
    <div className="space-y-2">
      <p className="text-gray-700 text-lg">🏙️ <strong>Location:</strong> {property.location}</p>
      <p className="text-green-600 text-2xl font-semibold">💵 ${property.price}</p>
      <p className="text-gray-700 text-md">🏷️ <strong>Type:</strong> {property.type}</p>
      <p className="text-gray-700">{property.description}</p>
    </div>

    {/* Divider */}
    <Divider />

    {/* Property Features */}
    {property.features?.length > 0 && (
      <>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🔑 Key Features</h3>
          <ul className="list-inside list-disc space-y-1">
            {property.features.map((feature, index) => (
              <li key={index} className="text-gray-600">{feature}</li>
            ))}
          </ul>
        </div>
        <Divider />
      </>
    )}

    {/* Property Amenities */}
    {property.amenities?.length > 0 && (
      <>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🏡 Amenities</h3>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {property.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600">
                <span>✔️</span> {amenity}
              </li>
            ))}
          </ul>
        </div>
        <Divider />
      </>
    )}

    {/* APPOINTMENT SECTION */}
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📅 Book an Appointment</h2>
      <DatePicker
        value={appointmentDate}
        onChange={(date) => setAppointmentDate(date)}
        placeholder="Select Date"
        className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
      />
      <Button
        type="primary"
        block
        className="bg-green-500 hover:bg-green-600 text-white"
        onClick={handleBooking}
      >
        Book Now
      </Button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Property;