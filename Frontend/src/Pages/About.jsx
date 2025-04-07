import React from 'react';
import { assets } from '../assets/assets';
const About = () => {
  return (
    <div className="bg-gray-50 text-gray-900 py-16 px-6">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
      
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold text-green-500">About Us</h1>
          <p className="text-lg leading-relaxed text-gray-700">
            Welcome to <span className="font-bold">Dream Estates</span>, where your dream home becomes a reality.
            We take pride in offering exclusive listings that match your lifestyle and aspirations.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            With our dedicated team of experts, we guide you through every step — from browsing properties to signing the final deal — ensuring a smooth and stress-free experience.
          </p>
        </div>
        <div className="flex-1">
          <img 
            src={assets.home_img}
            alt="Dream Home"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 grid gap-10 md:grid-cols-3">

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To connect individuals and families with homes they love through personalized service and exceptional listings.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-3">Our Values</h2>
          <p className="text-gray-600 leading-relaxed">
            Integrity, trust, and commitment drive everything we do, ensuring clients receive the best experience.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-3">Our Expertise</h2>
          <p className="text-gray-600 leading-relaxed">
            With years of experience, we specialize in helping clients find properties that meet their unique needs.
          </p>
        </div>
      </div>

      <div className="text-center py-12 mt-16 bg-green-500 text-white">
        <h3 className="text-3xl font-bold">Start Your Journey Today</h3>
        <p className="text-lg mt-2">Let us help you find a place you'll love to call home.</p>
        <a
          href="/contact"
          className="mt-5 inline-block bg-white text-green-500 px-6 py-3 text-lg font-bold rounded-lg transition hover:bg-green-100"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default About;
