import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const getActiveClass = ({ isActive }) =>
    isActive 
      ? "text-green-400 font-bold text-lg transition ease-in-out duration-150" 
      : "text-lg text-white font-bold hover:text-green-500 transition ease-in-out duration-150";

  return (
    <nav 
      className="w-full bg-black text-white flex items-center justify-between py-3 px-6 relative"
      aria-label="Main Navigation" 
      aria-expanded={isMenuOpen}
    >
      <div className="flex items-center gap-3">
        <img src={assets.logo} alt="Dream Estates Logo" className="w-10 h-10" />
        <h2 className="text-2xl font-bold">
          <span className="text-green-400">Dream</span>Estates
        </h2>
      </div>
      <div className="md:hidden">
        {isMenuOpen ? (
          <CloseOutlined 
            className="text-2xl cursor-pointer" 
            onClick={toggleMenu} 
            aria-label="Close menu" 
          />
        ) : (
          <MenuOutlined 
            className="text-2xl cursor-pointer" 
            onClick={toggleMenu} 
            aria-label="Open menu" 
          />
        )}
      </div>

      <ul 
        className={`flex gap-15 ${
          isMenuOpen 
            ? 'absolute top-16 left-0 w-full bg-black flex-col items-center py-4 transition-all duration-300 ease-in-out z-50 h-screen overflow-hidden' 
            : 'hidden'
        } md:flex`}
      >
        <li><NavLink to="/" className={getActiveClass}>Home</NavLink></li>
        <li><NavLink to="/listing" className={getActiveClass}>Listing</NavLink></li>
        <li><NavLink to="/about" className={getActiveClass}>About</NavLink></li>
        <li><NavLink to="/contact" className={getActiveClass}>Contact</NavLink></li>
        <li><NavLink to="/property/:id" className={getActiveClass}>Add Property</NavLink></li>
        <li><NavLink to="/login" className="block md:hidden bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold transition duration-300 hover:bg-gray-600">Login</NavLink></li>
      </ul>
      <div className="hidden md:block">
        <NavLink
          to="/login"
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-bold transition duration-300 hover:bg-gray-600"
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;