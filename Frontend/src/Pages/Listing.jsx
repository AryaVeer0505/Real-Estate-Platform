import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance.js";
import { toast, ToastContainer } from "react-toastify";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Loader from "../Components/Loader.jsx";

const categories = [
  "All",
  "rooms",
  "pg",
  "apartment",
  "flats",
  "plot",
  "officespaces",
  "villa",
  "familyhouse",
];

const Listing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to update localStorage favorites
  const updateLocalStorageFavorites = (updatedFavorites) => {
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Fetch favorites from server and return an array of property IDs
  const fetchFavoritesFromServer = async (token) => {
    try {
      const response = await axiosInstance.get("/api/favorite/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Extract just the property IDs
        return response.data.favorites.map((fav) => fav._id);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }

    return [];
  };

  // Fetch properties and favorites on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view properties.");
          setLoading(false);
          return;
        }

        const propertiesResponse = await axiosInstance.get(
          `${baseURL}/api/property/allProperties`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (propertiesResponse.status === 200) {
          setProperties(propertiesResponse.data.properties);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const favoriteIds = await fetchFavoritesFromServer(token);
      setFavorites(favoriteIds);
      updateLocalStorageFavorites(favoriteIds);
    };

    fetchData();
    fetchFavorites();
  }, []);

  // Handle add or remove favorite
  const handleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add favorites.");
        return;
      }

      const isFavorite = favorites.includes(propertyId);

      const endpoint = isFavorite
        ? `/api/favorite/favorites/remove/${propertyId}`
        : "/api/favorite/favorites/add";

      const method = isFavorite ? "delete" : "post";

      const response = await axiosInstance[method](
        endpoint,
        method === "post" ? { propertyId } : null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const successMessage = isFavorite
          ? "Removed from favorites"
          : "Added to favorites";
        toast.success(successMessage);

        // Re-fetch the favorites to update the state accurately
        const updatedFavorites = await fetchFavoritesFromServer(token);
        setFavorites(updatedFavorites);
        updateLocalStorageFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
      toast.error("Failed to update favorites.");
    }
  };

  const handleAddToCart = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      const response = await axiosInstance.post(
        "/api/cart/add",
        { propertyId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

  
        toast.success("Added to cart successfully!");
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  // Filter properties by search term and category
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      property.type.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 p-6 gap-6">
          <div className="md:w-1/4 w-full bg-white p-5 rounded-lg shadow sticky top-6 h-max">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat
                        ? "bg-green-500 text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-3/4 w-full">
            <div className="mb-6 flex flex-col ">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold mb-2">
                  Available Listings
                </span>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or location"
                className="w-full md:w-1/2 lg:w-1/3 p-2 border border-gray-300 rounded-lg outline outline-green-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
                >
                  <img
                    src={
                      property.images?.[0]
                        ? `${baseURL}${property.images[0]}`
                        : "/default-property.jpg"
                    }
                    alt={property.title}
                    className="w-full h-60 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-green-500 text-2xl font-bold">
                      ₹{property.price}
                    </p>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <button
                      onClick={() => handleFavorite(property._id)}
                      className={`px-2 py-1 bg-white rounded-full text-red-500 shadow-lg transition ${
                        favorites.includes(property._id)
                          ? "bg-red-500 "
                          : "hover:bg-gray-300"
                      }`}
                    >
                      {favorites.includes(property._id) ? (
                        <HeartFilled />
                      ) : (
                        <HeartOutlined />
                      )}
                    </button>

                    <button
                      onClick={() => handleAddToCart(property._id)}
                      className="px-2 py-1 bg-white rounded-full shadow-lg hover:bg-gray-500 hover:text-white transition"
                    >
                      <ShoppingCartOutlined className="text-green-500" />
                    </button>

                    <NavLink
                      to={`/property/${property._id}`}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      View Details
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
