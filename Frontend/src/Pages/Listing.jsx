import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const properties = [
  { id: 1, img: assets.project_img_1, title: "Luxury Villa", location: "Los Angeles, CA", price: "$2,500,000" },
  { id: 2, img: assets.project_img_2, title: "Modern Apartment", location: "New York, NY", price: "$850,000" },
  { id: 3, img: assets.project_img_3, title: "Cozy Family Home", location: "Miami, FL", price: "$650,000" },
];

const Listing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Available Listings</h2>

     
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
              <img src={property.img} alt={`${property.title} in ${property.location}`} className="w-full h-60 object-cover rounded-t-lg" loading="lazy" />
              <div className="p-5 flex flex-col items-center">
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-green-500 font-bold text-lg">{property.price}</p>
                <NavLink to={`/property/${property.id}`} className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition hover:bg-green-600">
                  View Details
                </NavLink>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Listing;
