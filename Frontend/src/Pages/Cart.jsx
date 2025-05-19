import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { baseURL } from '../../config';
import axiosInstance from '../../axiosInnstance.js';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('You must be logged in to view your cart.');
          return;
        }

        const response = await axiosInstance.get(`${baseURL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCart(response.data.cart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        message.error('An error occurred while fetching the cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(`${baseURL}/api/cart/remove`, { propertyId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCart(response.data.cart);
        message.success('Removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Cart</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : cart.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((property) => (
            <div key={property._id} className="bg-white shadow-lg rounded-lg p-4">
              <img src={property.images?.[0] || '/default-property.jpg'} alt={property.title} className="w-full h-48 object-cover rounded" />
              <h3 className="mt-2 text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-500">{property.location}</p>
              <p className="text-green-500 font-bold">${property.price}</p>

              <button onClick={() => handleRemoveFromCart(property._id)} className="text-red-500 mt-4">
                <DeleteOutlined /> Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
