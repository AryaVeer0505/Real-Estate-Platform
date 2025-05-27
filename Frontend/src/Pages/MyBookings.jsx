import React, { useEffect, useState } from "react";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance.js";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("You must be logged in to view your appointments.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get(
          `${baseURL}/api/appointment/myBookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          setBookings(res.data.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        message.error("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleRemoveAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to remove appointments.");
        return;
      }

      const res = await axiosInstance.delete(
        `${baseURL}/api/appointment/delete/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b._id !== appointmentId));
        toast.success("Appointment removed.");
      }
    } catch (error) {
      console.error("Failed to remove appointment:", error);
      toast.error("Failed to remove appointment.");
    }
  };

  const handleDateChange = async (appointmentId, newDate) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to update appointments.");
        return;
      }

      const res = await axiosInstance.put(
        `${baseURL}/api/appointment/update/${appointmentId}`,
        { appointmentDate: newDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === appointmentId
              ? { ...booking, appointmentDate: newDate }
              : booking
          )
        );
        toast.success("Appointment date updated.");
      }
    } catch (error) {
      console.error("Failed to update appointment date:", error);
      toast.error("Failed to update appointment date.");
    }
  };
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  if (loading)
    return <p className="text-center">Loading your appointments...</p>;

  return (
    <div className=" bg-gray-100 p-6 max-w-6xl mx-auto m-2">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Appointments
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You have no appointments yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Appointment Date</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const property = booking.propertyId;
                if (!property) return null; 

                return (
                  <tr key={booking._id} className="border-t">
                    <td className="px-6 py-4">
                      <img
                        src={
                          property.images?.[0]
                            ? `${baseURL}${property.images[0]}`
                            : "/default-property.jpg"
                        }
                        alt={property.title}
                        className="w-24 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {property.title || "No Title"}
                    </td>
                    <td className="px-6 py-4">
                      {property.location || "No Location"}
                    </td>
                    <td className="px-6 py-4">
                      <DatePicker
                        value={dayjs(booking.appointmentDate)}
                        onChange={(date) =>
                          handleDateChange(
                            booking._id,
                            date ? date.format("YYYY-MM-DD") : null
                          )
                        }
                        disabledDate={disabledDate}
                        className="border rounded p-1 w-full"
                        format="YYYY-MM-DD"
                      />
                    </td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{property.price?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveAppointment(booking._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <DeleteOutlined /> Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default MyBookings;
