import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DatePicker, Button, message, Divider, TimePicker } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../axiosInnstance.js";
import { baseURL } from "../../config.js";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";

const Property = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerChecked, setOwnerChecked] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState([]);

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      if (!property) return;

      try {
        const response = await axiosInstance.get(
          `${baseURL}/api/property/related`,
          {
            params: {
              type: property.type,
              location: property.location,
              excludeId: property._id,
            },
          }
        );
        if (response.status === 200) {
          setRelatedProperties(response.data.relatedProperties);
        }
      } catch (error) {
        console.error("Error fetching related properties", error);
      }
    };

    fetchRelatedProperties();
  }, [property]);

  useEffect(() => {
  const fetchPropertyAndBookingStatus = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(
      `${baseURL}/api/property/${id}`
    );

    if (response.status === 200) {
      setProperty(response.data.property);
      const user = JSON.parse(localStorage.getItem("user")) || null;
      const ownerId = response.data.property.ownerId;
      const ownerType = response.data.property.ownerType;

      const loggedInUserId = user?._id;
      const loggedInUserType = user?.googleId ? "GoogleUser" : "User";

      // Check if current user is the owner (regardless of auth type)
      const isOwnerCheck = loggedInUserId && ownerId && 
                         (ownerId.toString() === loggedInUserId.toString()) && 
                         (ownerType === loggedInUserType);
      
      setIsOwner(isOwnerCheck);
      setOwnerChecked(true);

      if (loggedInUserId && !isOwnerCheck) {
        const token = localStorage.getItem("token");
        if (token) {
          const bookingResp = await axiosInstance.get(
            `${baseURL}/api/appointment/checkBooking/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (bookingResp.status === 200) {
            setAppointmentBooked(bookingResp.data.booked);
          } else {
            setAppointmentBooked(false);
          }
        }
      } else {
        setAppointmentBooked(false);
      }
    }
  } catch (error) {
    toast.error("Error fetching property or booking info", {
      position: "top-center",
    });
    setOwnerChecked(true);
    setAppointmentBooked(false);
  } finally {
    setLoading(false);
  }
};

    fetchPropertyAndBookingStatus();
  }, [id]);

  const handleBooking = async () => {
    if (isOwner) {
      toast.error("Owners cannot book their own properties.", {
        position: "top-center",
      });
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select a date first.", { position: "top-center" });
      return;
    }

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?._id) {
      toast.error("You must be logged in to book an appointment.", {
        position: "top-center",
      });
      return;
    }

    try {
      // Parse the selected time
      const [hours, minutes] = appointmentTime.split(":").map(Number);
      
      // Create full ISO string with date and time
      const bookingDateTime = dayjs(appointmentDate)
        .set('hour', hours)
        .set('minute', minutes)
        .set('second', 0)
        .toISOString();

      const response = await axiosInstance.post(
        `${baseURL}/api/appointment/newAppointment`,
        {
          propertyId: id,
          appointmentDate: bookingDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Appointment booked successfully!", {
          position: "top-center",
        });
        setAppointmentDate(null);
        setAppointmentBooked(true);
      } else {
        toast.error("Failed to book appointment.", { position: "top-center" });
      }
    } catch (error) {
      let errorMsg = "Error booking appointment.";
      if (error.response) {
        errorMsg = error.response.data.message || 
          (error.response.status === 400 ? "Invalid date/time format" : "Booking failed");
      }
      toast.error(errorMsg, { position: "top-center" });
    }
  };

  const nextImage = () => {
    if (property.images?.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % property.images.length
      );
    }
  };

  const prevImage = () => {
    if (property.images?.length > 1) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.images.length) % property.images.length
      );
    }
  };

  if (loading || !property) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-screen-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative w-full h-[400px] md:h-[500px]">
          <img
            src={
              property.images?.length > 0
                ? `${baseURL}${property.images[currentImageIndex]}`
                : "/default-property.jpg"
            }
            alt="Property"
            className="w-full h-full object-cover rounded-xl"
          />
          {property.images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow"
              >
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow"
              >
                &gt;
              </button>
            </>
          )}
        </div>

        <div className="p-8 md:p-12 space-y-6">
          <h1 className="text-4xl font-bold text-green-600">
            {property.title}
          </h1>
          <p className="text-lg text-gray-700">📍 {property.location}</p>
          <p className="text-2xl text-green-500 font-semibold">
            💰 ${property.price}
          </p>
          <p className="text-md text-gray-600">🏠 {property.type}</p>
          <p className="text-gray-700">{property.description}</p>

          {property.features?.length > 0 && (
            <>
              <Divider />
              <h3 className="text-lg font-bold">🔑 Features</h3>
              <ul className="list-disc pl-5">
                {property.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          )}

          {property.amenities?.length > 0 && (
            <>
              <Divider />
              <h3 className="text-lg font-bold">🏡 Amenities</h3>
              <ul className="grid grid-cols-2 gap-2">
                {property.amenities.map((a, i) => (
                  <li key={i}>✔️ {a}</li>
                ))}
              </ul>
            </>
          )}

          <Divider />
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">📅 Book Appointment</h2>

            {!ownerChecked ? (
              <p>Checking owner status...</p>
            ) : isOwner ? (
              <div className="text-red-500 font-semibold">
                ⚠️ You are the owner of this property. Booking is not allowed.
              </div>
            ) : appointmentBooked ? (
              <p className="text-green-600 font-semibold">
                ✅ You have already booked an appointment for this property.
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <div className="mb-2 font-medium">Select Date:</div>
                  <DatePicker
                    value={appointmentDate}
                    onChange={(date) => setAppointmentDate(date)}
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-medium">Select Time:</div>
                  <TimePicker
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(time, timeString) => setAppointmentTime(timeString)}
                    defaultValue={dayjs().hour(10).minute(0)}
                    className="w-full"
                  />
                </div>
                <Button
                  type="primary"
                  block
                  onClick={handleBooking}
                  className="mt-3"
                >
                  Book Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {relatedProperties.length > 0 && (
        <div className="max-w-screen-xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Related Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProperties.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    item.images?.[0]
                      ? `${baseURL}${item.images[0]}`
                      : "/default-property.jpg"
                  }
                  alt="Related Property"
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold text-green-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">📍 {item.location}</p>
                  <p className="text-green-500 font-bold">💰 ${item.price}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                  <a
                    href={`/property/${item._id}`}
                    className="inline-block mt-2 text-sm text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Property;