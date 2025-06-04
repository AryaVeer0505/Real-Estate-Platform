import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInnstance";
import { baseURL } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";

const getStatusBadge = (status) => {
  const base = "inline-block px-2 py-1 rounded-full text-xs font-semibold ";
  if (status.toLowerCase() === "paid") return base + "bg-green-100 text-green-700";
  if (status.toLowerCase() === "pending") return base + "bg-yellow-100 text-yellow-700";
  return base + "bg-red-100 text-red-700";
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your orders.");
        return;
      }

      const response = await axiosInstance.get(`${baseURL}/api/order/myOrders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Orders
      </h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Properties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm break-words">{order._id}</td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(order.paymentStatus)}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      {order.properties.map((property, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={
                              property.image?.startsWith("http")
                                ? property.image
                                : `${baseURL}${property.image}`
                            }
                            alt={property.title}
                            className="w-14 h-12 object-cover rounded border"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{property.title}</p>
                            <p className="text-xs text-gray-500">
                            ₹{property.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MyOrders;
