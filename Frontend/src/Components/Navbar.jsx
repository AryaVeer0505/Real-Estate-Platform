import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <div className='flex justify-between px-10 py-5 bg-black'>
      <h3 className='text-white'>Logo</h3>
      <ul className='flex gap-10 text-white'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
        <NavLink to='/listing'>Lsting</NavLink>
        <NavLink to='/addProperty'>Add Property</NavLink>
      </ul>
      <div className='text-white'>
        <NavLink to='/login' >Login</NavLink>
      </div>
    </div>
  )
}

export default Navbar
