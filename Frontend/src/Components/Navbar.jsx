import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import Logo from "../assets/logo.png";

const LoginDropdown = () => (
  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
    <NavLink to="/login/user" className="block px-4 py-2 hover:bg-gray-200 font-medium">Login as User</NavLink>
    <NavLink to="/login/owner" className="block px-4 py-2 hover:bg-gray-200 font-medium">Login as Property Owner</NavLink>
  </div>
);

const UserDropdown = ({ onLogout }) => (
  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
    <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-200 font-medium">My Profile</NavLink>
    <button onClick={onLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200 font-medium">Logout</button>
  </div>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'User';

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('loginStatusChanged', updateLoginStatus);
    return () => window.removeEventListener('loginStatusChanged', updateLoginStatus);
  }, []);

  // 🔒 Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    setIsLoggedIn(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
    navigate('/');
  };

  const getActiveClass = ({ isActive }) =>
    isActive
      ? "text-green-400 font-bold text-lg"
      : "text-lg text-white font-bold hover:text-green-500 transition";

  return (
    <nav className="w-full bg-black text-white flex items-center justify-between py-3 px-6 relative z-50">
      <NavLink to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Dream Estates Logo" className="w-10 h-10" />
        <h2 className="text-2xl font-bold">
          <span className="text-green-400">Dream</span>Estates
        </h2>
      </NavLink>

      <div className="md:hidden">
        {isMenuOpen ? (
          <CloseOutlined onClick={toggleMenu} className="text-2xl cursor-pointer" />
        ) : (
          <MenuOutlined onClick={toggleMenu} className="text-2xl cursor-pointer" />
        )}
      </div>

      <ul className={`flex gap-15 ${isMenuOpen ? 'absolute top-16 left-0 w-full bg-black flex-col items-center py-4 h-screen' : 'hidden'} md:flex md:static md:flex-row md:items-center`}>
        <li><NavLink to="/" className={getActiveClass}>Home</NavLink></li>
        <li><NavLink to="/listing" className={getActiveClass}>Listing</NavLink></li>
        <li><NavLink to="/about" className={getActiveClass}>About</NavLink></li>
        <li><NavLink to="/contact" className={getActiveClass}>Contact</NavLink></li>
        <li><NavLink to="/addProperty" className={getActiveClass}>Add Property</NavLink></li>

        <li className="block md:hidden relative dropdown-container">
          {isLoggedIn ? (
            <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <UserOutlined /> 
            </button>
          ) : (
            <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
              Login
            </button>
          )}
          {isDropdownOpen && (isLoggedIn ? <UserDropdown onLogout={handleLogout} /> : <LoginDropdown />)}
        </li>
      </ul>

      <div className="hidden md:block relative dropdown-container">
        {isLoggedIn ? (
          <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <UserOutlined />
          </button>
        ) : (
          <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
            Login
          </button>
        )}
        {isDropdownOpen && (isLoggedIn ? <UserDropdown onLogout={handleLogout} /> : <LoginDropdown />)}
      </div>
    </nav>
  );
};

export default Navbar;
