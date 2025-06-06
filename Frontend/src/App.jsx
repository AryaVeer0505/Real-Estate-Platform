import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Listing from './Pages/Listing.jsx';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
import Property from './Pages/Property.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import AddProperty from './Pages/AddProperty.jsx';
import NotFound from './Components/NotFound.jsx';
import OwnerDashboard from './Pages/OwnerDashboard.jsx';
import Cart from './Pages/Cart.jsx';
import Favorites from './Pages/Favorites.jsx';
import MyBookings from './Pages/MyBookings.jsx';
import MyOrders from './Pages/MyOrders.jsx';
// AIzaSyBaSlPIju7RzKzTZ4Mp4s8Ha56-cd1isu4
// AIzaSyCPICl1RXlH50GJSbzbCbF211N8RZGJB4s 

const App = () => {
  const location = useLocation();
  const isNotFound = location.pathname === '*' || location.pathname === '/404';
 

  return (
    <>
      {!isNotFound && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/property/:id" element={<Property />} />
        <Route path="/addProperty" element={<AddProperty />} />
        <Route path="/forgotPassword/:role" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myOrders" element={<MyOrders />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path='/ownerDashboard' element={<OwnerDashboard/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isNotFound && <Footer />}
    </>
  );
};

export default App;
