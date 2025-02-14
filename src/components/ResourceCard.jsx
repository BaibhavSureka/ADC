const ResourceCard = ({ title, description, link }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <a href={link} className="text-blue-500 hover:underline">
        Learn More
      </a>
    </div>
  )
}

export default ResourceCard

