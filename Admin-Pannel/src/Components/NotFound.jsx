import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🤖</div>
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Oops!</h1>
        <h2 className="text-2xl text-gray-700 mb-4">We couldn't find that page.</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-200"
        >
          Take Me Back
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
