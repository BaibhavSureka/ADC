import React from 'react';

const EventCard = ({ title, date, description, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-56 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-blue-600 mb-4 font-medium">{date}</p>
        <p className="text-gray-600">{description}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default EventCard;