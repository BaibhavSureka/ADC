import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-[#f5f5dc] shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/adclogo.png" alt="ADC Logo" className="h-10 w-10 mr-2" />
            <Link to="/" className="text-2xl font-bold text-black">
              ADC
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-gray-600">
              About Us
            </Link>
            <Link to="/events" className="text-gray-800 hover:text-gray-600">
              Events
            </Link>
            <Link to="/resources" className="text-gray-800 hover:text-gray-600">
              Resources
            </Link>
          </div>
          <Link to="/join" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
            Join us
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header

