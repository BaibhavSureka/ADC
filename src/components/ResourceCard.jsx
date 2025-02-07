import React from 'react';

const ResourceCard = ({ title, description, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <a href={link} className="text-blue-600 hover:underline">Learn More</a>
    </div>
  );
};

export default ResourceCard;