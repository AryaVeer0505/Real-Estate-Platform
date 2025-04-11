import React from 'react';
import { assets } from '../assets/assets';
import Newsletter from '../Components/NewsLetter';

const About = () => {
  return (
    <div className="bg-white text-gray-800">
    
      <section className="bg-gradient-to-r from-green-50 via-white to-green-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-green-600 mb-6">About Dream Estates</h1>
            <p className="text-lg text-gray-700 mb-4">
              At <span className="font-semibold text-green-500">Dream Estates</span>, we redefine the real estate experience with trust, ease, and innovation. Whether you're searching for a cozy apartment or a luxurious home, we’re here to guide you every step of the way.
            </p>
            <p className="text-lg text-gray-700">
              Our mission is simple — helping you find a place you’ll be proud to call home.
            </p>
          </div>
          <div>
            <img src={assets.home_img} alt="Dream Estates" className="rounded-xl shadow-xl w-full" />
          </div>
        </div>
      </section>

    
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-green-600">1,200+</h2>
            <p className="text-gray-600 mt-2">Properties Listed</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-green-600">800+</h2>
            <p className="text-gray-600 mt-2">Happy Clients</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-green-600">10+ Years</h2>
            <p className="text-gray-600 mt-2">Real Estate Expertise</p>
          </div>
        </div>
      </section>

   
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="p-6 bg-green-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-green-700 mb-3">Personalized Service</h3>
            <p className="text-gray-700">
              We tailor every experience to your unique goals, ensuring you feel confident at every step.
            </p>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-green-700 mb-3">Trusted Professionals</h3>
            <p className="text-gray-700">
              Our expert agents bring market insights, negotiation skills, and honest guidance.
            </p>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-green-700 mb-3">End-to-End Support</h3>
            <p className="text-gray-700">
              From discovery to closing, we support you throughout the entire buying or selling process.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-green-600 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Let's Find Your Dream Home</h2>
        <p className="text-lg mb-6">We’re excited to help you begin the next chapter of your life.</p>
        <a
          href="/contact"
          className="bg-white text-green-600 px-8 py-3 text-lg font-semibold rounded-full hover:bg-green-100 transition"
        >
          Contact Us
        </a>
      </section>
      <Newsletter/>
    </div>
  );
};

export default About;
