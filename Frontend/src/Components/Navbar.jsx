import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import menu_icon from '../assets/menu_icon.svg'
import cross_icon from '../assets/cross_icon.svg'

const Navbar = () => {
  const [showMobileMenu,setShowMobileMenu]=useState(false)
  useEffect(()=>{
     if(showMobileMenu){
      document.body.style.overflow='hidden'
     }
     else{
      document.body.style.overflow='auto'
     }
     return ()=>{
      document.body.style.overflow='auto'
     }
  },[showMobileMenu])

  const getActiveClass = ({ isActive }) =>
    isActive ? "text-green-400 font-bold text-xl transition ease-in-out duration-150"
      : "text-xl text-white font-bold hover:text-green-500 text-white transition ease-in-out duration-150";

  return (
    <div className="fixed w-full top-0 left-0 bg-transparent z-50">
      <div className="flex justify-between px-10 md:px-15 py-4 items-center lg:px-30 mx-auto ">

        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10"/>
          <h3 className="text-white text-3xl font-bold">Estates</h3>
        </NavLink>

        <ul className="gap-13 text-lg text-white font-bold hidden md:flex">
          <NavLink to="/" className={getActiveClass}>Home</NavLink>
          <NavLink to="/about" className={getActiveClass}>About</NavLink>
          <NavLink to="/contact" className={getActiveClass}>Contact</NavLink>
          <NavLink to="/listing" className={getActiveClass}>Listing</NavLink>
          <NavLink to="/addProperty" className={getActiveClass}>Add Property</NavLink>
        </ul>

        <NavLink 
          to="/login"
          className="hidden md:block text-white font-bold bg-green-500 rounded-sm py-2 px-5 text-xl hover:bg-gray-500 transition-all ease-in-out duration-300"
        >
          Login
        </NavLink>
        <img onClick={()=>setShowMobileMenu(true)} src={menu_icon} className="md:hidden w-7 cursor-pointer" alt="" />
      </div>
     <div className={`md:hidden ${showMobileMenu ? 'fixed w-full':'h-0 w-0'}  right-0 top-0 bottom-0 overflow-hidden bg-white transition-all`}>
      <div className="flex justify-end p-6 cursor-pointer"> 
        <img onClick={()=>setShowMobileMenu(false)} src={cross_icon} className="w-6" alt="" />
      </div>
      <ul className="flex flex-col items-center gap-10 mt-5 px-5 text-lg font-medium text-black">
        <NavLink to='/' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl hover:text-green-500 transition ease-in-out duration-200'>Home</NavLink>
        <NavLink to='/about' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl hover:text-green-500 transition ease-in-out duration-200'>About</NavLink>
        <NavLink to='/contact' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl hover:text-green-500 transition ease-in-out duration-200'>Contact</NavLink>
        <NavLink to='/listing' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl hover:text-green-500 transition ease-in-out duration-200'>Listing</NavLink>
        <NavLink to='/property/:id' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl hover:text-green-500 transition ease-in-out duration-200'>Add Property</NavLink>
        <NavLink to='/login' onClick={()=>setShowMobileMenu(false)} className='border-b text-2xl bg-green-500 text-white py-2 px-4 rounded hover:bg-gray-500 transition ease-in-out duration-200'>Login</NavLink>
      </ul>
     </div>
    </div>
  );
};

export default Navbar;
