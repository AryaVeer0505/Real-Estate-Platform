import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DatePicker, Button, Divider, TimePicker } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../../axiosInnstance.js";
import { baseURL } from "../../config.js";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const Property = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("10:00");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerChecked, setOwnerChecked] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);

  const containerStyle = {
    width: "100%",
    height: "300px",
  };

  const defaultCenter = {
    lat: 28.6139,
    lng: 77.209,
  };

  const mapCenter = {
    lat: property?.coordinates?.lat || defaultCenter.lat,
    lng: property?.coordinates?.lng || defaultCenter.lng,
  };

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
 const fetchOwnerDetails = async (ownerId, ownerType) => {
  try {
    setLoading(true);
    console.log("Fetching owner with ID:", ownerId);


    if (typeof ownerId === "object") {
 
      ownerId = ownerId._id || ownerId.toString();
    }

 
    const typeParam = ownerType === "GoogleUser" ? "google" : "regular";


    const response = await axiosInstance.get(
      `${baseURL}/api/auth/getUser/${ownerId}?type=${typeParam}`
    );

    if (response.status === 200) {
      const owner = response.data;
      setOwnerDetails({
        name: owner.username,
        email: owner.email,
        profilePicture: owner.profilePicture || null,
        phone: owner.phone || "Not provided",
        userType: owner.role || owner.userType,
        createdAt: owner.createdAt,
      });
    }
  } catch (error) {
    console.error("Error fetching owner details:", error);
    setOwnerDetails({
      name: "Owner",
      email: "Not available",
      profilePicture: null,
      phone: "Not provided",
    });
  } finally {
    setLoading(false);
  }
};


    if (property?.ownerId && property?.ownerType) {
      fetchOwnerDetails(property.ownerId, property.ownerType);
    }
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

          const isOwnerCheck =
            loggedInUserId &&
            ownerId &&
            ownerId.toString() === loggedInUserId.toString() &&
            ownerType === loggedInUserType;

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

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axiosInstance.get("/api/favorite/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const favoriteIds = response.data.favorites
            .filter((fav) => fav && fav._id)
            .map((fav) => fav._id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

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

        if (isFavorite) {
          setFavorites(favorites.filter((id) => id !== propertyId));
        } else {
          setFavorites([...favorites, propertyId]);
        }
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

      await axiosInstance.post(
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
      const [hours, minutes] = appointmentTime.split(":").map(Number);
      const bookingDateTime = dayjs(appointmentDate)
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", 0)
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
      let errorMsg = "Owners can't book appointment for their own properties";
      if (error.response) {
        errorMsg =
          error.response.data.message ||
          (error.response.status === 400
            ? "Invalid date/time format"
            : "Booking failed");
      }
      toast.error(errorMsg, { position: "top-center" });
    }
  };

  const nextImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % property.images.length
      );
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + property.images.length) % property.images.length
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Property not found
          </h1>
          <p className="text-gray-600 mt-2">
            The property you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            to="/"
            className="text-green-600 hover:underline mt-4 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* First Row - Images and Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Side - Images */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative w-full h-[400px] md:h-[500px]">
              {property.images?.length > 0 ? (
                <>
                  <img
                    src={`${baseURL}${property.images[currentImageIndex]}`}
                    alt={property.title || "Property"}
                    className="w-full h-full object-cover"
                  />
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow hover:bg-green-50 transition"
                        aria-label="Previous image"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-green-600 p-3 rounded-full shadow hover:bg-green-50 transition"
                        aria-label="Next image"
                      >
                        &gt;
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Property Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-green-600">
                {property.title || "Untitled Property"}
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFavorite(property._id)}
                  className={`p-2 rounded-full shadow ${
                    favorites.includes(property._id)
                      ? "text-red-500 bg-red-100"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  aria-label={
                    favorites.includes(property._id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {favorites.includes(property._id) ? (
                    <HeartFilled className="text-xl" />
                  ) : (
                    <HeartOutlined className="text-xl" />
                  )}
                </button>
                <button
                  onClick={() => handleAddToCart(property._id)}
                  className="p-2 rounded-full shadow text-green-500 hover:bg-green-100"
                  aria-label="Add to cart"
                >
                  <ShoppingCartOutlined className="text-xl" />
                </button>
              </div>
            </div>

            <p className="text-lg text-gray-700 mt-2">
              📍 {property.location || "Location not specified"}
            </p>
            <p className="text-2xl text-green-500 font-semibold mt-2">
              💰{" "}
              {property.price
                ? `₹${property.price.toLocaleString()}`
                : "Price not available"}
            </p>
            <p className="text-md text-gray-600 mt-2">
              🏠 {property.type || "Type not specified"}
            </p>
            {property.description && (
              <p className="text-gray-700 mt-4">{property.description}</p>
            )}

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
                    <li key={i} className="flex items-center">
                      <span className="text-green-500 mr-1">✔️</span> {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Second Row - Owner Details and Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Side - Owner Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
              <UserOutlined className="mr-2" /> Owner Details
            </h2>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {ownerDetails?.name || "Property Owner"}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <MailOutlined className="text-green-500 mr-3 text-lg" />
                  <span className="break-all">
                    {ownerDetails?.email || "Email not available"}
                  </span>
                </div>

                <div className="flex items-center">
                  <PhoneOutlined className="text-green-500 mr-3 text-lg" />
                  <span>{ownerDetails?.phone || "Phone not provided"}</span>
                </div>

                {ownerDetails?.createdAt && (
                  <div className="flex items-center">
                    <CalendarOutlined className="text-green-500 mr-3 text-lg" />
                    <span>
                      Member since{" "}
                      {dayjs(ownerDetails.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                )}
              </div>

              {isOwner && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700">
                  <p>This is your property listing</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Booking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">
                📅 Book Appointment
              </h2>

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
                      onChange={(time, timeString) =>
                        setAppointmentTime(timeString)
                      }
                      defaultValue={dayjs().hour(10).minute(0)}
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="primary"
                    block
                    onClick={handleBooking}
                    className="mt-3 h-10"
                  >
                    Book Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">📍 Location on Map</h3>
          <div className="bg-white p-4 rounded-xl shadow">
            <LoadScript googleMapsApiKey="AIzaSyBaSlPIju7RzKzTZ4Mp4s8Ha56-cd1isu4">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Related Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-52 w-full">
                    {item.images?.[0] ? (
                      <img
                        src={`${baseURL}${item.images[0]}`}
                        alt={item.title || "Property"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-green-600">
                      {item.title || "Untitled Property"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      📍 {item.location || "Location not specified"}
                    </p>
                    <p className="text-green-500 font-bold">
                      💰{" "}
                      {item.price
                        ? `₹${item.price.toLocaleString()}`
                        : "Price not available"}
                    </p>
                    <p className="text-sm text-gray-500">
                      🏠 {item.type || "Type not specified"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Link
                        to={`/property/${item._id}`}
                        className="text-sm text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                      >
                        View Details
                      </Link>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFavorite(item._id)}
                          className={`p-1 rounded-full ${
                            favorites.includes(item._id)
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                          aria-label={
                            favorites.includes(item._id)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {favorites.includes(item._id) ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )}
                        </button>
                        <button
                          onClick={() => handleAddToCart(item._id)}
                          className="p-1 rounded-full text-green-500"
                          aria-label="Add to cart"
                        >
                          <ShoppingCartOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Property;
