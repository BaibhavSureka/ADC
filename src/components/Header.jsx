import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">ADC</Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-600">Events</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/testimonials-blogs" className="text-gray-700 hover:text-blue-600">Testimonials & Blogs</Link>
            <Link to="/resources" className="text-gray-700 hover:text-blue-600">Resources</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;