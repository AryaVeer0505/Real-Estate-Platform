import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { baseURL } from "../../config";
import axiosInstance from "../../axiosInnstance.js";
import { toast, ToastContainer } from "react-toastify";
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view properties.");
          return;
        }

        const propertiesResponse = await axiosInstance.get(`${baseURL}/api/property/allProperties`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favoritesResponse = await axiosInstance.get(`${baseURL}/api/property/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (propertiesResponse.status === 200) {
          setProperties(propertiesResponse.data.properties);
        }

        if (favoritesResponse.status === 200) {
          setFavorites(favoritesResponse.data.favorites.map((fav) => fav._id));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add favorites.");
        return;
      }

      const action = favorites.includes(propertyId) ? "remove" : "add";

      const response = await axiosInstance.post(
        `${baseURL}/api/property/favorite`,
        { propertyId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setFavorites((prev) =>
          action === "add" ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
        );
        toast.success(response.data.message || 
          (action === "add" ? "Added to favorites" : "Removed from favorites"));
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("Failed to update favorite.");
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
        `${baseURL}/api/property/cart/add`,
        { propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || property.type.toLowerCase() === selectedCategory.toLowerCase();

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
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Categories</h3>
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
                <span className="text-2xl font-bold mb-2">Available Listings</span>
                
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
                <div key={property._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                  <img
                    src={property.images?.[0] ? `${baseURL}${property.images[0]}` : "/default-property.jpg"}
                    alt={property.title}
                    className="w-full h-60 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-green-500 text-2xl font-bold">₹{property.price}</p>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <button 
                      onClick={() => handleFavorite(property._id)} 
                      className="px-2 py-1 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
                    >
                      {favorites.includes(property._id) ? (
                        <HeartFilled className="text-red-500" />
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
