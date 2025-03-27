import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Pages/Login'
import AddProperty from './Pages/AddProperty'
import About from './Pages/About'
import Listing from './Pages/Listing'
import Contact from './Pages/Contact'
import Register from './Pages/Register'
import Property from './Pages/Property'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/listing" element={<Listing/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/addProperty" element={<AddProperty/>}/>
      <Route path="/property/:id" element={<Property/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
  </StrictMode>,
)
