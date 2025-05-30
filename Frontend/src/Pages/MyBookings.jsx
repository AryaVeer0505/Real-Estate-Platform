import React, { useEffect, useState } from "react";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance.js";
import { message, Spin, Modal, Tag } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { confirm } = Modal;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const disabledDate = (current) => {

    return current && current < dayjs().startOf("day");
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in to view your appointments.");
        return;
      }

      const res = await axiosInstance.get(
        `${baseURL}/api/appointment/myBookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        const formattedBookings = (res.data.bookings || []).map((booking) => ({
          ...booking,
          status: booking.status || "pending",
        }));
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDateTimeChange = async (appointmentId, newDate, newTime) => {
    try {
      setUpdatingId(appointmentId);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to update appointments.");
        return;
      }

      const existingAppointment = bookings.find((b) => b._id === appointmentId);
      if (!existingAppointment) {
        toast.error("Appointment not found.");
        return;
      }

      const currentDateTime = dayjs(existingAppointment.appointmentDate);

      let updatedDateTime;
      if (newDate && newTime) {

        updatedDateTime = dayjs(`${newDate} ${newTime}`);
      } else if (newDate) {

        const originalTime = currentDateTime.format("HH:mm");
        updatedDateTime = dayjs(`${newDate} ${originalTime}`);
      } else if (newTime) {

        const originalDate = currentDateTime.format("YYYY-MM-DD");
        updatedDateTime = dayjs(`${originalDate} ${newTime}`);
      } else {
        toast.error("Please select a valid date or time.");
        return;
      }

      if (updatedDateTime.isBefore(dayjs())) {
        toast.error("Appointment must be in the future");
        return;
      }

      const res = await axiosInstance.put(
        `${baseURL}/api/appointment/update/${appointmentId}`,
        { appointmentDate: updatedDateTime.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === appointmentId
              ? { ...booking, appointmentDate: updatedDateTime.toISOString() }
              : booking
          )
        );
        toast.success("Appointment updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update appointment. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusTag = (status) => {
    let color = "default";
    switch (status) {
      case "confirmed":
        color = "green";
        break;
      case "pending":
        color = "orange";
        break;
      case "cancelled":
        color = "red";
        break;
      default:
        color = "blue";
    }
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 max-w-6xl mx-auto m-2">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Appointments
      </h2>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">You have no appointments yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Property</th>
                <th className="px-6 py-3 text-left">Date & Time</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const property = booking.propertyId;
                if (!property) return null;

                const bookingDateTime = dayjs(booking.appointmentDate);
                const isUpdating = updatingId === booking._id;

                return (
                  <tr key={booking._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={
                            property.images?.[0]
                              ? `${baseURL}${property.images[0]}`
                              : "/default-property.jpg"
                          }
                          alt={property.title}
                          className="w-16 h-12 object-cover rounded mr-4"
                        />
                        <div>
                          <p className="font-medium">
                            {property.title || "No Title"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {property.location || "No Location"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 w-64">
                        <DatePicker
                          value={dayjs(booking.appointmentDate)}
                          onChange={(date) => {
                            const newDate = date?.format("YYYY-MM-DD");
                            const currentTime = dayjs(
                              booking.appointmentDate
                            ).format("HH:mm");
                            handleDateTimeChange(
                              booking._id,
                              newDate,
                              currentTime
                            );
                          }}
                          disabledDate={disabledDate}
                          className="w-full"
                          disabled={isUpdating}
                        />

                        <TimePicker
                          value={dayjs(booking.appointmentDate)}
                          onChange={(time) => {
                            const newTime = time?.format("HH:mm");
                            const currentDate = dayjs(
                              booking.appointmentDate
                            ).format("YYYY-MM-DD");
                            handleDateTimeChange(
                              booking._id,
                              currentDate,
                              newTime
                            );
                          }}
                          format="HH:mm"
                          minuteStep={15}
                          className="w-full"
                          disabled={isUpdating}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusTag(booking.status)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{property.price?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveAppointment(booking._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        disabled={booking.status === "cancelled"}
                      >
                        <DeleteOutlined />
                        {booking.status === "cancelled"
                          ? "Cancelled"
                          : "Remove"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MyBookings;
