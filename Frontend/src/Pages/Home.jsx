import React, { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../axiosInnstance.js'
import { baseURL } from '../../config.js';
import Newsletter from '../Components/NewsLetter';
import { assets } from '../assets/assets';

const Home = () => {
  // const [mode, setMode] = useState('buy');
     const [latestProperties, setLatestProperties] = useState([]);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      try {
        const response = await axiosInstance.get(`${baseURL}/api/property/allProperties`);
        if (response.status === 200) {
          setLatestProperties(response.data.properties.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching latest properties:", error);
      }
    };

    fetchLatestProperties();
  }, []);


  return (
    <div className="w-full font-sans">
    
      <div className="relative h-[85vh] flex flex-col md:flex-row items-center justify-center px-10 bg-gray-100 text-black text-left gap-1">
        <div className="absolute inset-0 bg-white bg-opacity-20 z-0"></div>
          {/* <div className="absolute -bottom-5 left-30 z-20 bg-gray-50 bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-6 hidden md:block md:w-auto border border-gray-300"> 
            <div className="flex gap-2 mb-4">
             <button
               onClick={() => setMode('buy')}
               className={`px-4 py-2 rounded-lg font-semibold transition ${
                 mode === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
               }`}
             >
               Buy
             </button>
             <button
               onClick={() => setMode('rent')}
               className={`px-4 py-2 rounded-lg font-semibold transition ${
                 mode === 'rent' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
               }`}
             >
               Rent
             </button>
           </div> 
            <form className="flex flex-col md:flex-row flex-wrap items-center gap-4">
             <input
               type="text"
               placeholder="Location"
               className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
             />
             <input
               type="text"
               placeholder="Price (e.g. $500k-$1M)"
               className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
             />
            <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Property Type</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
               <option value="familyhouse">Family House</option>
             </select>
             <button
               type="submit"
               className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
             >
               Search
             </button>
           </form> 
          </div>  */}
        <div className="relative z-10 max-w-xl mt-32 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide capitalize">Find Your Dream Home</h1>
          <p className="text-2xl text-gray-700 mt-4 leading-relaxed">
            Explore our exclusive listings and discover the perfect property for you and your family.
          </p>
          <NavLink
            to="/listing"
            className="inline-block mt-5 bg-green-500 text-white px-6 py-3 text-lg font-semibold rounded-lg transition hover:bg-green-600 shadow-md transform hover:scale-105"
          >
            View Listings
          </NavLink>
        </div>

        <div className="relative z-10 flex justify-center">
          <img src={assets.home_img} alt="Home" className="w-full max-w-xl md:max-w-2xl rounded-2xl" />
        </div>
      </div>



     
      <div className="py-16 px-6 bg-gray-100 mt-10 mb-15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        
          <div className="max-w-[450px]">
            <img
              src={assets.about_img}
              alt="About Us"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-6xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              At Dream Estate's, we are committed to helping you find the perfect place to call home. 
              With years of experience in the real estate industry, we offer personalized services 
              tailored to meet your needs. Whether you are looking to buy or rent, our team is here 
              to guide you every step of the way.
            </p>
            <NavLink
              to="/about"
              className="bg-green-500 text-white px-5 py-3 rounded-lg font-semibold text-md hover:bg-green-600 transition"
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </div>

      


      <div className="py-12 px-6 text-center bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {latestProperties.map((property, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
              <img src={property.images?.[0] ? `${baseURL}${property.images[0]}` : "/default-property.jpg"} alt={property.title} className="w-full h-60 object-cover rounded-t-lg" />
              <div className="p-5 flex flex-col items-center">
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-green-500 font-bold text-lg">₹{property.price}</p>
                <NavLink
                  to={`/property/${property._id}`}
                  className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition hover:bg-green-600"
                >
                  View Details
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>




  <div className="py-16 px-6 bg-white"> 
    <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { 
          img: assets.buy, 
          title: "Buy Property", 
          desc: "Find your dream home with our exclusive listings." 
        },
        { 
          img: assets.sell, 
          title: "Sell Property", 
          desc: "Get the best value for your property with expert support." 
        },
        { 
          img: assets.rent, 
          title: "Rent Property", 
          desc: "Explore a wide range of properties for rent easily." 
        },
      ].map((service, index) => (
        <div key={index} className="bg-gray-100 p-8 rounded-lg shadow hover:shadow-md transition flex flex-col items-center text-center">
          <img src={service.img} alt={service.title} className="w-25 h-25 rounded-full mb-4" />
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-gray-600">{service.desc}</p>
        </div>
      ))}
    </div>
  </div>
</div>



<div className="py-16 px-6 bg-gray-100">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-8">What Our Clients Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { 
          img: assets.profile_img_1,
          name: "John Doe", 
          feedback: "Dream Estates helped me find the perfect home. Highly recommend!" 
        },
        { 
          img: assets.profile_img_2,
          name: "Joel Smith", 
          feedback: "Smooth experience from start to finish. Very professional team!" 
        },
        { 
          img: assets.profile_img_3,
          name: "Mike Johnson", 
          feedback: "Great listings and amazing service. Thank you Dream Estates!" 
        },
      ].map((testimonial, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center">
          <img src={testimonial.img} alt={testimonial.name} className="w-24 h-24 rounded-full object-cover mb-4" />
          <p className="text-gray-600 italic mb-4">"{testimonial.feedback}"</p>
          <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
        </div>
      ))}
    </div>
  </div>
</div>
 


      <Newsletter />
    </div>
  );
};

export default Home;
