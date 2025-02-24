import React from 'react';

const TestimonialCard = ({ name, image, testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
      <div className="flex items-center mb-4">
        <img 
          src={image || "/placeholder.svg"} 
          alt={name} 
          className="w-16 h-16 rounded-full mr-4 object-cover" 
        />
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
      </div>
      <p className="text-gray-600 italic">&ldquo;{testimonial}&rdquo;</p>
    </div>
  );
};

export default TestimonialCard; 
