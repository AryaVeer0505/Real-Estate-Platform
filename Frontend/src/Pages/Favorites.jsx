import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInnstance.js';
import { message } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('You must be logged in to view your favorites.');
          return;
        }

        const response = await axiosInstance.get('/api/property/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setFavorites(response.data.favorites); 
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        message.error('An error occurred while fetching favorites.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Favorites</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property._id} className="bg-white shadow-lg rounded-lg p-4">
              <img src={property.images?.[0] || '/default-property.jpg'} alt={property.title} className="w-full h-48 object-cover rounded" />
              <h3 className="mt-2 text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-500">{property.location}</p>
              <p className="text-green-500 font-bold">${property.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No favorites added yet.</p>
      )}
    </div>
  );
};

export default Favorites;
