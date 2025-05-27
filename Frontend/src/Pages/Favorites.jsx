import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../axiosInnstance.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeartFilled } from "@ant-design/icons";
import { baseURL } from "../../config.js";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view your favorites.");
          return;
        }

        const response = await axiosInstance.get("/api/favorite/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setFavorites(response.data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to remove a favorite.");
        return;
      }

      const response = await axiosInstance.delete(
        `/api/favorite/favorites/remove/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setFavorites((prev = []) =>
          prev.filter((item) => item && item._id !== propertyId)
        );

        toast.success("Removed from favorites.");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Favorites
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => {
            if (!property) return null;

            return (
              <div
                key={property._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
              >
                <div className="relative">
                  <img
                    src={
                      property.images?.[0]
                        ? `${baseURL}${property.images[0]}`
                        : "/default-property.jpg"
                    }
                    alt={property.title || "Property Image"}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                  <p className="text-green-500 text-2xl font-bold">
                    ₹{property.price}
                  </p>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => handleRemoveFavorite(property._id)}
                    className="px-2 py-1 bg-white text-red-500 rounded-full shadow-lg hover:bg-gray-200 transition"
                  >
                    <HeartFilled className="text-red-500 text-lg" />
                  </button>

                  <NavLink
                    to={`/property/${property._id}`}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    View Details
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No favorites added yet.
        </p>
      )}
    </div>
  );
};

export default Favorites;
