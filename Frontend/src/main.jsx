import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Pages/Login'
import AddProperty from './Pages/AddProperty'
import About from './Pages/About'
import Listing from './Pages/Listing'
import Contact from './Pages/Contact'
import Register from './Pages/Register'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <Routes>
      <Route to="/" element={<Home/>}/>
      <Route to="/login" element={<Login/>}/>
      <Route to="/register" element={<Register/>}/>
      <Route to="/contact" element={<Contact/>}/>
      <Route to="/listing" element={<Listing/>}/>
      <Route to="/about" element={<About/>}/>
      <Route to="/addProperty" element={<AddProperty/>}/>
    </Routes>
    <Footer/>
  </StrictMode>,
)
