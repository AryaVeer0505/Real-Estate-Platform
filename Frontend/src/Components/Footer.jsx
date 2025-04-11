import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              <span className="text-green-400">Dream</span>Estates
            </h2>
            <p className="text-gray-300">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their dream spaces.
            </p>
            
            <div className="flex space-x-4 text-xl">
              <a 
                href="https://facebook.com" 
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://twitter.com" 
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://instagram.com" 
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://linkedin.com" 
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://youtube.com" 
                aria-label="YouTube"
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                  activeClassName="text-blue-400 font-medium"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/listing" 
                  className="text-gray-300 hover:text-white transition-colors"
                  activeClassName="text-blue-400 font-medium"
                >
                  Properties
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/agents" 
                  className="text-gray-300 hover:text-white transition-colors"
                  activeClassName="text-blue-400 font-medium"
                >
                  Agents
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors"
                  activeClassName="text-blue-400 font-medium"
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors"
                  activeClassName="text-blue-400 font-medium"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Services
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors">Buy Properties</li>
              <li className="hover:text-white transition-colors">Rent Properties</li>
              <li className="hover:text-white transition-colors">Sell Properties</li>
              <li className="hover:text-white transition-colors">Property Valuation</li>
              <li className="hover:text-white transition-colors">Mortgage Services</li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <MdLocationOn className="mt-1 mr-2 text-blue-400" />
                <span>Shimla</span>
              </li>
              <li className="flex items-center">
                <MdPhone className="mr-2 text-blue-400" />
                <span>7018800377</span>
              </li>
              <li className="flex items-center">
                <MdEmail className="mr-2 text-blue-400" />
                <span>aryaveerkanwar11458@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} DreamEstate. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <NavLink to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </NavLink>
            <NavLink to="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;