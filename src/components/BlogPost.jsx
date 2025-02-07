import React from 'react';

const BlogPost = ({ title, author, date, image, excerpt }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">By {author} on {date}</p>
        <p className="text-gray-700">{excerpt}</p>
      </div>
    </div>
  );
};

export default BlogPost;