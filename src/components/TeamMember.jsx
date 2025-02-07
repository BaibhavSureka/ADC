import React from 'react';

const TeamMember = ({ name, role, image, bio }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-gray-600 mb-4">{role}</p>
        <p className="text-gray-700">{bio}</p>
      </div>
    </div>
  );
};

export default TeamMember;