import React from 'react'
import { NavLink } from 'react-router'

const Header = () => {
  return (
    <div className='min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden object-cover' style={{backgroundImage:"url('/header_img.png')"}} id='header'>
        <div className='text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white'>
            <h2 className='text-5xl sm:text-6xl md:text-[82px] inline-block max-w-3xl font-semibold pt-20'>Find Your Dream Home</h2>
            
            <div className='gap-5 mt-16 space-x-6'>
               <NavLink to='/listing' className='border border-white px-8 py-3 rounded hover:bg-gray-400 transition ease-in-out duration-300 font-bold text-2xl'>Listing</NavLink>
               <NavLink to='/about' className='bg-green-500 px-8 py-3 rounded hover:bg-gray-400 transition ease-in-out duration-300 font-bold text-xl'>About us</NavLink>
            </div>
        </div>
    </div>
  )
}

export default Header
