import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNavClick = (id) => {
    scrollToSection(id);
    setIsOpen(false);
  };
  
  return (
    <header className="bg-[#f5f5dc] shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img src="/adclogo.png" alt="ADC Logo" className="h-10 w-10 mr-2" />
            <button onClick={() => scrollToSection('home')} className="text-2xl font-bold text-black">
              ADC
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-800 hover:text-gray-600">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-800 hover:text-gray-600">
              About Us
            </button>
            <button onClick={() => scrollToSection('events')} className="text-gray-800 hover:text-gray-600">
              Events
            </button>
            <button onClick={() => scrollToSection('resources')} className="text-gray-800 hover:text-gray-600">
              Resources
            </button>
          </div>
          
          {/* Join Us Button and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToSection('contact')} className="hidden md:block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
              Join us
            </button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu} 
                className="p-2 text-gray-800 focus:outline-none"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Mobile Menu Overlay */}
              {isOpen && (
                <div className="fixed inset-0 z-50 bg-white">
                  <div className="flex justify-end p-4">
                    <button 
                      onClick={toggleMenu} 
                      className="p-2 text-gray-800 focus:outline-none"
                      aria-label="Close menu"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <nav className="flex flex-col items-center gap-6 p-8">
                    <button 
                      onClick={() => handleNavClick('home')} 
                      className="text-xl font-medium text-gray-800 hover:text-green-600"
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => handleNavClick('about')} 
                      className="text-xl font-medium text-gray-800 hover:text-green-600"
                    >
                      About Us
                    </button>
                    <button 
                      onClick={() => handleNavClick('events')} 
                      className="text-xl font-medium text-gray-800 hover:text-green-600"
                    >
                      Events
                    </button>
                    <button 
                      onClick={() => handleNavClick('resources')} 
                      className="text-xl font-medium text-gray-800 hover:text-green-600"
                    >
                      Resources
                    </button>
                    <button 
                      onClick={() => handleNavClick('contact')} 
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md w-full"
                    >
                      Join us
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}