import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-blue-600 font-bold mb-2">ADC</h3>
            <p className="text-gray-600">Awareness, Development, and Care</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-gray-900 font-semibold mb-2">Quick Links</h4>
            <ul className="text-gray-600">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link to="/events" className="hover:text-blue-600">Events</Link></li>
              <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
              <li><Link to="/resources" className="hover:text-blue-600">Resources</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-gray-900 font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-gray-900 font-semibold mb-2">Newsletter</h4>
            <form className="flex">
              <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 ADC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;