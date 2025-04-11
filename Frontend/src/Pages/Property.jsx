import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { assets } from "../assets/assets";

const Property = () => {
  const { id } = useParams(); 
  const [appointmentDate, setAppointmentDate] = useState(null);

  const handleBooking = () => {
    if (!appointmentDate) {
      message.warning("Please select a date first.");
      return;
    }

    message.success(`Appointment booked for ${dayjs(appointmentDate).format("DD MMM, YYYY")}`);
    setAppointmentDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
  
        <div className="w-full h-[500px] md:h-auto">
          <img
            src={assets.project_img_1}
            alt="Property"
            className="w-full h-full object-cover"
          />
        </div>

        
        <div className="p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-green-600">Luxury Oceanview Villa</h1>
            <p className="text-gray-600 text-sm mb-1">🏙️ Location: Los Angeles, CA</p>
            <p className="text-green-500 font-semibold text-lg mb-3">💵 $2,500,000</p>

            <p className="text-gray-700 mb-6">
              This luxury villa boasts a panoramic ocean view, 5 spacious bedrooms, 4 bathrooms, an infinity pool, a modern kitchen, and a private garden. Located in a serene neighborhood just minutes from downtown LA, it's perfect for peaceful yet luxurious living.
            </p>

         
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">🏡 Features & Amenities:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                <li>5 Bedrooms & 4 Bathrooms</li>
                <li>Infinity Pool & Jacuzzi</li>
                <li>Smart Home System</li>
                <li>2-Car Garage</li>
                <li>Private Garden</li>
                <li>Security System</li>
              </ul>
            </div>
          </div>

    
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">📅 Book an Appointment</h4>
            <div className="flex flex-wrap gap-3 items-center">
              <DatePicker
                value={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                placeholder="Select Date"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
              <Button
                type="primary"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">📞 Contact the Property Owner</h2>
        <p className="text-sm text-gray-600 mb-2">Name: John Doe</p>
        <p className="text-sm text-gray-600 mb-2">Phone: +1 234 567 890</p>
        <p className="text-sm text-gray-600">Email: john.doe@example.com</p>
      </div>
    </div>
  );
};

export default Property;
