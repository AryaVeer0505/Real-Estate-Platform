import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, UserOutlined, HeartOutlined,ShoppingCartOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
import Logo from "../assets/logo.png";

const LoginDropdown = () => (
  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
    <NavLink to="/login/user" className="block px-4 py-2 hover:bg-gray-200 font-medium">Login as Buyer</NavLink>
    <NavLink to="/login/owner" className="block px-4 py-2 hover:bg-gray-200 font-medium">Login as Property Owner</NavLink>
  </div>
);

const UserDropdown = ({ onLogout, userRole }) => (
  <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
    {userRole === 'owner' && (
      <NavLink to="/ownerDashboard" className=" px-4 py-2 hover:bg-gray-200 font-medium flex items-center gap-2">
        <DashboardOutlined /> Dashboard
      </NavLink>
    )}
   
    <NavLink to="/favorites" className=" px-4 py-2 hover:bg-gray-200 font-medium flex items-center gap-2">
      <HeartOutlined /> Favorites
    </NavLink>

    <NavLink to="/myBookings" className=" px-4 py-2 hover:bg-gray-200 font-medium flex items-center gap-2">
      <ShoppingCartOutlined /> My Appointments
    </NavLink>
  
    <button onClick={onLogout} className=" w-full text-left px-4 py-2 hover:bg-gray-200 font-medium flex items-center gap-2">
      <LogoutOutlined /> Logout
    </button>
  </div>
);


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;

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
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);
  };

  window.addEventListener("loginStatusChanged", updateLoginStatus);

  updateLoginStatus();

  return () => window.removeEventListener("loginStatusChanged", updateLoginStatus);
}, []);



  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
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
    localStorage.removeItem('user');

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
          {isDropdownOpen && (
            isLoggedIn
              ? <UserDropdown onLogout={handleLogout} userRole={userRole} />
              : <LoginDropdown />
          )}
        </li>
        <li className="block md:hidden">
  <NavLink
    to="/cart"
    className="text-black px-4 py-2 rounded-lg bg-white text-xl hover:bg-gray-500 hover:text-white transition flex items-center gap-2"
  >
    <ShoppingCartOutlined /> Cart
  </NavLink>
</li>

      </ul>

      <div className="hidden md:flex gap-6 relative dropdown-container">
  {isLoggedIn ? (
    <>
      <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
        <UserOutlined />
      </button>
      <NavLink to="/cart" className="text-black px-3 rounded-lg bg-white  text-2xl hover:bg-gray-500 hover:text-white transition">
        <ShoppingCartOutlined />
      </NavLink>
    </>
  ) : (
    <button onClick={toggleDropdown} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
      Login
    </button>
  )}

  {isDropdownOpen && (
    isLoggedIn
      ? <UserDropdown onLogout={handleLogout} userRole={userRole} />
      : <LoginDropdown />
  )}
</div>

    </nav>
  );
};

export default Navbar;