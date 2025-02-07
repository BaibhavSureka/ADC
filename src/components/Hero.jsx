import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-fade-in-down">
          Your Mental Health Matters
        </h1>
        <p className="text-lg md:text-2xl mt-4 text-white drop-shadow-md animate-fade-in-up max-w-2xl mx-auto">
          Join us in creating a supportive community for mental wellness and personal growth.
        </p>
        <Link 
          to="/events" 
          className="mt-6 inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-110 animate-bounce"
        >
          Explore More
        </Link>
      </div>
    </div>
  );
};

export default Hero;
