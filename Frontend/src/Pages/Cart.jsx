import React, { useState, useEffect } from "react";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance.js";
import { message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("You must be logged in to view your cart.");
          return;
        }

        const response = await axiosInstance.get(`${baseURL}/api/cart/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCart(response.data.cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        message.error("An error occurred while fetching the cart.");
        toast.success("Removed from cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to remove items.");
        return;
      }

      const response = await axiosInstance.post(
        `${baseURL}/api/cart/remove`,
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCart((prevCart) =>
          prevCart.filter(
            (item) => item.property && item.property._id !== propertyId
          )
        );

        toast.success("Removed from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.property?.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Your Cart
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : cart.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem) => {
                const property = cartItem.property;
                if (!property) {
                  return null;
                }
                return (
                  <tr key={property._id} className="border-t">
                    <td className="px-6 py-4">
                      <img
                        src={
                          property.images?.[0]
                            ? `${baseURL}${property.images[0]}`
                            : "/default-property.jpg"
                        }
                        alt={property.title}
                        className="w-1/3 h-28 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {property.title || "No Title"}
                    </td>
                    <td className="px-6 py-4">
                      {property.location || "No Location"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{property.price || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemoveFromCart(property._id)}
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

          <div className="mt-6 bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-lg font-semibold text-gray-700">
              
              Total Price:{" "}
              <span className="text-green-600 font-bold">₹{getTotal()}</span>
            </div>
            <NavLink
              to="/checkout"
              className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              Proceed to Checkout
            </NavLink>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;
