import { Link } from "react-router-dom"
import CountUp from 'react-countup';
import { Facebook, Youtube, Twitter, Instagram } from "lucide-react"

const Home = () => {
  const stats = [
    {
      number: 275,
      suffix: "million +",
      description: "Drug users worldwide",
      icon: "🔍",
    },
    {
      number: 1,
      prefix: "1 in ",
      suffix: "8",
      description: "Battles addiction",
      icon: "💔",
    },
    {
      number: 55,
      suffix: "k+",
      description: "Drug-related deaths",
      icon: "🏥",
    },
    {
      number: 35,
      prefix: "$",
      suffix: "billion+",
      description: "Suffer from mental health",
      icon: "👥",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h2 className="text-green-600 mb-6">Welcome to ADC</h2>
        <h1 className="text-black mb-6 leading-tight flex flex-col items-center">
          <span className="text-6xl w-[120%]">CHOOSE</span>
          <span className="text-5xl w-[90%]">LIFE</span>
          <span className="text-6xl w-[120%]">OVER</span>
          <span className="text-5xl w-[90%]">HIGHS</span>
        </h1>


        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
          Welcome to our Anti-Drug Club, where we are committed to creating a safe and drug-free environment for our
          community. Our mission is to educate, support, and empower individuals to make informed choices and lead
          healthy, fulfilling lives
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors">
          Get Involved
        </button>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl text-black font-bold mb-4">club gallery</h2>
        <p className="text-2xl text-black mb-12">or a video</p>
        <div className="bg-gray-100 h-96 rounded-lg"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <p className="text-center mb-12 text-lg">
            "Every year, over 500,000 lives are lost due to drug abuse. Be the change."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="bg-green-600 rounded-full p-4 mb-4 w-16 h-16 flex items-center justify-center text-2xl">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {stat.prefix}
                  <CountUp end={stat.number} duration={2.5} />
                  {stat.suffix}
                </h3>
                <p className="text-gray-400">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti Drug Club Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-6xl text-black font-bold text-center mb-2">ANTI DRUG CLUB</h2>
        <p className="text-4xl text-center text-black  mb-16">Transforming Lives, One Story at a Time</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-full p-2 mr-3">
                <img src="/1.png" alt="Icon" className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-black font-semibold">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              At our organization, we are dedicated to creating a compassionate and informative environment that
              empowers college students to make healthy choices and seek the support they need.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-full p-2 mr-3">
                <img src="/2.png" alt="Icon" className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-black font-semibold">Our Values</h3>
            </div>
            <p className="text-gray-600">
              We believe in fostering a community of compassion, where students feel empowered to take control of their
              health and seek help without stigma or judgment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
  <div className="flex items-center mb-4">
    <div className="bg-orange-100 rounded-full p-2 mr-3 w-10 h-10 flex items-center justify-center">
      <img src="/3.png" alt="Icon" className="w-6 h-6" />
    </div>
    <h3 className="text-xl text-black font-semibold">Our Approach</h3>
  </div>
  <p className="text-gray-600">
    Through interactive tools and resources, we guide students in understanding the risks of substance abuse
    and connect them with confidential support services to promote their overall well-being.
  </p>
</div>


          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-full p-2 mr-3">
               <img src="/4.png" alt="Icon" className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-black font-semibold">Get Involved</h3>
            </div>
            <p className="text-gray-600">
              Our program offers a range of opportunities for students to engage, from participating in educational
              workshops to becoming peer mentors and advocates for substance abuse prevention.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <img src="/adc.png" alt="ADC Logo" className="h-16 w-16" />
              <p className="text-sm mt-2">
                ALL RIGHTS RESERVED
                <br />
                ADC 2025
              </p>
            </div>

            <div className="flex flex-col mb-8 md:mb-0">
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <Link to="/about" className="text-gray-400 hover:text-white mb-2">
                About Us
              </Link>
              <Link to="/team" className="text-gray-400 hover:text-white mb-2">
                Our Team
              </Link>
              <Link to="/get-involved" className="text-gray-400 hover:text-white mb-2">
                Get Involved
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect with Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

