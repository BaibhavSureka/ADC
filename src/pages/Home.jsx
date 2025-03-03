import { useState, useEffect, useRef, useCallback } from 'react'
import { Facebook, Youtube, Twitter, Instagram, Loader, Search, MapPin, Phone, Mail } from 'lucide-react'
import CountUp from 'react-countup'
import MobileMenu from '../components/mobile-menu'
import ChartComponent from '../components/chart-component'

export default function ADCWebsite() {
  // State for Events section
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // State for Resources section
  const [drugStats, setDrugStats] = useState([])
  const [drugTrends, setDrugTrends] = useState([])
  const [treatmentCenters, setTreatmentCenters] = useState([])
  const [search, setSearch] = useState("")
  const [locationSearch, setLocationSearch] = useState("VIT Vellore, Tamil Nadu, 632014")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mapVisible, setMapVisible] = useState(false)
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const markersRef = useRef([])
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [overdoseStats, setOverdoseStats] = useState([])
  const [mentalHealthStats, setMentalHealthStats] = useState([])

  // Default VIT Vellore location
  const DEFAULT_LOCATION = "VIT Vellore, Tamil Nadu, 632014"
  const DEFAULT_COORDS = { lat: 12.9718, lon: 79.1589 } // VIT Vellore coordinates

  // Add major healthcare facilities that might be missed by the API
  const IMPORTANT_FACILITIES = [
    {
      id: "cmc_vellore",
      name: "Christian Medical College (CMC)",
      category: "Hospital",
      address: "Ida Scudder Road, Vellore, Tamil Nadu, 632004",
      lat: 12.9242,
      lon: 79.1359,
      important: true
    }
  ]

  // Events data
  const events = [
    { title: 'Mental Health Awareness Workshop', date: 'June 15, 2023', description: 'Join us for an interactive workshop on mental health awareness.', image: '/adclogo.png', type: 'upcoming' },
    { title: 'Stress Management Seminar', date: 'July 2, 2023', description: 'Learn effective techniques for managing stress in your daily life.', image: '/adclogo.png', type: 'upcoming' },
    { title: 'Mindfulness Retreat', date: 'May 10, 2023', description: 'A day-long retreat focused on mindfulness and meditation practices.', image: '/adclogo.png', type: 'past' },
  ]

  // Team members data
  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', image: '/image.png', bio: 'Sarah has been passionate about mental health awareness for over a decade.' },
    { name: 'Michael Lee', role: 'Head of Programs', image: '/image.png', bio: 'Michael brings years of experience in developing effective mental health programs.' },
    { name: 'Emily Chen', role: 'Community Outreach Coordinator', image: '/image.png', bio: 'Emily is dedicated to building strong connections within the community.' },
  ]

  // Stats data
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

  // Filter events based on search and filter
  const filteredEvents = events.filter(event =>
    (filter === 'all' || event.type === filter) &&
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fetch drug stats
  const fetchDrugStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://api.fda.gov/drug/event.json?count=patient.reaction.reactionmeddrapt.exact&limit=10"
      )

      if (!response.ok) throw new Error("Failed to fetch drug statistics")

      const data = await response.json()
      setDrugStats(data.results || [])
    } catch (error) {
      console.error("Drug Stats Fetch Error:", error)
      // Fallback data if API fails
      setDrugStats([
        { term: "Nausea", count: 245 },
        { term: "Headache", count: 198 },
        { term: "Dizziness", count: 156 },
        { term: "Fatigue", count: 132 },
        { term: "Vomiting", count: 120 }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch overdose statistics
  const fetchOverdoseStats = async () => {
    try {
      // This would normally be an API call, but we'll use mock data
      // Simulating API response
      setTimeout(() => {
        setOverdoseStats([
          { year: "2018", count: 67367 },
          { year: "2019", count: 70630 },
          { year: "2020", count: 91799 },
          { year: "2021", count: 106699 },
          { year: "2022", count: 109680 }
        ])
      }, 500)
    } catch (error) {
      console.error("Overdose Stats Fetch Error:", error)
    }
  }

  // Fetch mental health statistics
  const fetchMentalHealthStats = async () => {
    try {
      // This would normally be an API call, but we'll use mock data
      // Simulating API response
      setTimeout(() => {
        setMentalHealthStats([
          { condition: "Depression", percentage: 8.4 },
          { condition: "Anxiety", percentage: 19.1 },
          { condition: "PTSD", percentage: 3.6 },
          { condition: "Bipolar", percentage: 2.8 },
          { condition: "Schizophrenia", percentage: 0.25 }
        ])
      }, 700)
    } catch (error) {
      console.error("Mental Health Stats Fetch Error:", error)
    }
  }

  // Fetch drug trends
  const fetchDrugTrends = async () => {
    if (!search.trim()) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${search}"&count=receivedate`
      )

      if (!response.ok) throw new Error("Failed to fetch drug trends")

      const data = await response.json()
      setDrugTrends(data.results || [])
    } catch (error) {
      console.error("Drug Trends Fetch Error:", error)
      // Fallback data if API fails
      setDrugTrends([
        { time: "2018-01", count: 45 },
        { time: "2019-01", count: 52 },
        { time: "2020-01", count: 78 },
        { time: "2021-01", count: 63 },
        { time: "2022-01", count: 59 }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch treatment centers
  const fetchTreatmentCenters = async () => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Set timeout to cancel request if it takes too long
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError("Search timed out. Please try a more specific location.")
    }, 20000) // 20 second timeout
    
    setSearchTimeout(timeoutId)
    setLoading(true)
    setError(null)

    try {
      // Step 1: Geocode the location to get coordinates
      const locationQuery = encodeURIComponent(locationSearch)
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=json&limit=1`
      )

      if (!geocodeResponse.ok) throw new Error("Failed to geocode location")

      const locationData = await geocodeResponse.json()
      
      let centerCoords
      if (locationData.length === 0) {
        // If location not found, use default coordinates of VIT Vellore
        centerCoords = DEFAULT_COORDS
        console.warn(`Location '${locationSearch}' not found, using default coordinates.`)
      } else {
        centerCoords = { lat: parseFloat(locationData[0].lat), lon: parseFloat(locationData[0].lon) }
      }
      
      // Step 2: Find healthcare facilities using Overpass API with REDUCED radius and timeout
      const radius = 3000 // Reduced from 5km to 3km radius
      const overpassQuery = `
        [out:json][timeout:10];
        (
          node["amenity"="hospital"](around:${radius},${centerCoords.lat},${centerCoords.lon});
          node["amenity"="clinic"](around:${radius},${centerCoords.lat},${centerCoords.lon});
          node["healthcare"="hospital"](around:${radius},${centerCoords.lat},${centerCoords.lon});
          node["healthcare"="clinic"](around:${radius},${centerCoords.lat},${centerCoords.lon});
          way["amenity"="hospital"](around:${radius},${centerCoords.lat},${centerCoords.lon});
          way["amenity"="clinic"](around:${radius},${centerCoords.lat},${centerCoords.lon});
        );
        out body center;
      `

      const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })

      if (!overpassResponse.ok) throw new Error("Failed to fetch healthcare facilities")

      const overpassData = await overpassResponse.json()
      
      // Process healthcare facilities
      let facilities = processOverpassResults(overpassData, centerCoords)
      
      // Add important facilities (like CMC) that might be missed
      // Calculate distance to determine if they should be included
      IMPORTANT_FACILITIES.forEach(facility => {
        const distance = calculateDistance(
          centerCoords.lat, 
          centerCoords.lon, 
          facility.lat, 
          facility.lon
        )
        
        // Include if within 5km
        if (distance <= 5) {
          // Check if this facility is already in our results
          const exists = facilities.some(f => 
            f.name.toLowerCase().includes(facility.name.toLowerCase().split(' ')[0])
          )
          
          if (!exists) {
            facilities.push(facility)
          }
        }
      })
      
      // Sort by distance from search location and limit to top 10
      facilities = facilities.map(facility => {
        const distance = calculateDistance(
          centerCoords.lat, 
          centerCoords.lon, 
          facility.lat, 
          facility.lon
        )
        return { ...facility, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10) // Limit to 10 nearest facilities
      
      setTreatmentCenters(facilities)
      setMapVisible(true)
      
      // Initialize map after data is loaded
      setTimeout(() => {
        initializeMap(centerCoords.lat, centerCoords.lon, facilities)
      }, 100)
    } catch (err) {
      console.error("Error in treatment center search:", err)
      setError(`Failed to find treatment centers: ${err.message}`)
      
      // Try to initialize map anyway with the location
      try {
        initializeMap(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, [])
        setMapVisible(true)
      } catch (mapErr) {
        console.error("Failed to initialize map:", mapErr)
      }
    } finally {
      setLoading(false)
      // Clear the timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout)
        setSearchTimeout(null)
      }
    }
  }

  // Process Overpass API results
  const processOverpassResults = (data, centerCoords) => {
    const facilities = []
    
    // Process each element (node, way, relation)
    data.elements.forEach(element => {
      // Only process elements with tags
      if (!element.tags) return
      
      // Check if it's a healthcare facility
      const isHealthcare = 
        element.tags.amenity === 'hospital' || 
        element.tags.amenity === 'clinic' ||
        element.tags.healthcare === 'hospital' ||
        element.tags.healthcare === 'clinic'
      
      if (!isHealthcare) return
      
      let facilityName = element.tags.name || 
                        element.tags['name:en'] || 
                        getCategoryName(element.tags)
                        
      let category = getCategoryName(element.tags)
      let address = formatAddress(element.tags)
      let lat, lon
      
      if (element.type === 'node') {
        lat = element.lat
        lon = element.lon
      } else if (element.type === 'way' && element.center) {
        lat = element.center.lat
        lon = element.center.lon
      }
      
      // Only add the facility if we have coordinates
      if (lat && lon) {
        facilities.push({
          id: element.id,
          name: facilityName,
          category: category,
          address: address,
          lat: lat,
          lon: lon,
          tags: element.tags
        })
      }
    })
    
    return facilities
  }

  // Get category name from tags
  const getCategoryName = (tags) => {
    if (tags.amenity === 'hospital') return 'Hospital'
    if (tags.amenity === 'clinic') return 'Clinic'
    if (tags.healthcare === 'hospital') return 'Hospital'
    if (tags.healthcare === 'clinic') return 'Clinic'
    return 'Healthcare Facility'
  }

  // Format address from tags
  const formatAddress = (tags) => {
    const addressParts = []
    
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber'])
    if (tags['addr:street']) addressParts.push(tags['addr:street'])
    if (tags['addr:city']) addressParts.push(tags['addr:city'])
    if (tags['addr:state']) addressParts.push(tags['addr:state'])
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode'])
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available'
  }

  // Calculate distance between two points in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2) 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  // Initialize map
  const initializeMap = (centerLat, centerLon) => {
    // Check if Leaflet is loaded
    if (typeof window !== 'undefined' && !window.L) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
      script.onload = () => createMap(centerLat, centerLon)
      document.head.appendChild(script)
    } else if (typeof window !== 'undefined' && window.L) {
      createMap(centerLat, centerLon)
    }
  }

  // Create map
  const createMap = (centerLat, centerLon) => {
    if (!mapContainerRef.current) return
    
    // Clear previous map instance
    if (mapRef.current) {
      mapRef.current.remove()
    }
    
    // Create map
    const L = window.L
    mapRef.current = L.map(mapContainerRef.current).setView([centerLat, centerLon], 14)
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current)
    
    // Add marker for the searched location
    L.marker([centerLat, centerLon])
      .addTo(mapRef.current)
      .bindPopup(`<b>Your location: ${locationSearch}</b>`)
      .openPopup()
    
    // Clear previous markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (mapRef.current) {
          mapRef.current.removeLayer(marker)
        }
      })
      markersRef.current = []
    }
    
    // Add markers for treatment centers
    if (treatmentCenters && treatmentCenters.length > 0) {
      // Create bounds to fit all markers
      const bounds = L.latLngBounds()
      bounds.extend([centerLat, centerLon]) // Include search location in bounds
      
      treatmentCenters.forEach(center => {
        // Standard marker
        const marker = L.marker([center.lat, center.lon])
          .addTo(mapRef.current)
          .bindPopup(`
            <b>${center.name}</b><br>
            <strong>Type:</strong> ${center.category}<br>
            <strong>Address:</strong> ${center.address}<br>
            <strong>Distance:</strong> ${center.distance ? center.distance.toFixed(1) + ' km' : 'N/A'}<br>
            <a href="https://www.openstreetmap.org/directions?from=${centerLat},${centerLon}&to=${center.lat},${center.lon}" target="_blank">Get Directions</a>
          `)
        
        markersRef.current.push(marker)
        bounds.extend([center.lat, center.lon])
      })
      
      // Fit map to bounds with padding
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  // Scroll to section function
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

   const [startCounters, setStartCounters] = useState(false)
  const sectionRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setStartCounters(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Load data on component mount
  useEffect(() => {
    fetchDrugStats()
    fetchOverdoseStats()
    fetchMentalHealthStats()
    
    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
    document.head.appendChild(link)
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
      
      // Clear timeout if component unmounts
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* Header */}
      <header className="bg-[#f5f5dc] shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/adclogo.png" alt="ADC Logo" className="h-10 w-10 mr-2" />
              <button onClick={() => scrollToSection('home')} className="text-2xl font-bold text-black">
                ADC
              </button>
            </div>
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
            <div className="flex items-center gap-4">
              <button onClick={() => scrollToSection('contact')} className="hidden md:block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                Join us
              </button>
              <MobileMenu scrollToSection={scrollToSection} />
            </div>
          </div>
        </nav>
      </header>

      {/* Home Section */}
      <section id="home" className="min-h-screen bg-[#f5f5dc] pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h2 className="text-green-600 mb-6">Welcome to ADC</h2>
        <h1 className="text-black mb-6 leading-tight flex flex-col items-center">
          <h1 className="text-black mb-6 leading-tight flex flex-col items-center">
          <span className="text-6xl">CHOOSE</span>
          <span className="text-5xl">LIFE</span>
          <span className="text-6xl">OVER</span>
          <span className="text-5xl">HIGHS</span>
        </h1>
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
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-2">Understanding Substance Abuse</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                Empowering Students to Make Healthy Choices
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg">
                Our comprehensive educational resources, personal stories, and confidential support services aim to help
                college students navigate substance abuse prevention and recovery.
              </p>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-green-800 text-white px-8 py-3 rounded-md hover:bg-green-900 transition-colors"
              >
                Get Help
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="./landing.png" 
                alt="Student making healthy choices" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {/* <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl text-black font-bold mb-4">club gallery</h2>
          <p className="text-2xl text-black mb-12">or a video</p>
          <div className="bg-gray-100 h-96 rounded-lg"></div>
        </div> */}

        {/* Stats Section */}
        <div ref={sectionRef} className="bg-gray-800 text-white py-12 mt-20">
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
                {startCounters ? (
                  <CountUp
                    start={0}
                    end={stat.number}
                    duration={2.5}
                    separator=","
                    useEasing={true}
                  />
                ) : (
                  0
                )}
                {stat.suffix}
              </h3>
              <p className="text-gray-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
      </section>

      <section id="about" className="min-h-screen pt-20 bg-[#f5f5dc]">
        <h1 className="text-6xl text-black font-bold text-center mb-2">About Us</h1>
        <div className="container mx-auto px-6 py-12">
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <img src="/3.png" alt="Icon" className="w-6 h-6" />
                </div>
                <h3 className="text-xl text-black font-semibold">Our Impact</h3>
              </div>
              <p className="text-gray-600">
                Through our comprehensive approach, we have supported countless students in navigating the challenges of substance abuse and mental health issues.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <img src="/4.png" alt="Icon" className="w-6 h-6" />
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
                  <img src="/1.png" alt="Icon" className="w-6 h-6" />
                </div>
                <h3 className="text-xl text-black font-semibold">Get Involved</h3>
              </div>
              <p className="text-gray-600">
                Our program offers a range of opportunities for students to engage, from participating in educational
                workshops to becoming peer mentors and advocates for substance abuse prevention.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <img src="/2.png" alt="Icon" className="w-6 h-6" />
                </div>
                <h3 className="text-xl text-black font-semibold">Contact Us</h3>
              </div>
              <p className="text-gray-600">
                For any questions, concerns, or to access our confidential support services, please don't hesitate to reach out to our dedicated team.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-12">
            <h1 className="text-6xl text-black font-bold text-center mb-2">Our Team</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl text-black font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-600 mb-4">{member.role}</p>
                    <p className="text-gray-700">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="min-h-screen pt-20 bg-[#f5f5dc]">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-6xl text-black font-bold text-center mb-2">Events</h1>
          <div className="mb-8 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search events..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">{event.title}</h3>
                  <p className="text-blue-600 mb-4 font-medium">{event.date}</p>
                  <p className="text-gray-600">{event.description}</p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section*/}
      <section id="resources" className="min-h-screen pt-20 bg-[#f5f5dc]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-start gap-6">
            <div className="md:w-1/2 pl-6">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Resources</h1>
              <p className="text-gray-700 text-lg max-w-lg">
                Explore our extensive collection of educational materials, personal stories, and interactive tools 
                designed to help college students understand the impact of substance abuse, access support services, 
                and make informed choices for their well-being.
              </p>
            </div>
            <div className="md:w-1/2 pr-6 flex justify-center">
              <img 
                src="/image.png" 
                alt="Person with resources" 
                className="max-w-full h-auto"
              />
            </div>
          </div>

          {/* Personalized Support Section */}
          <div className="mb-16">
            <h2 className="text-center text-gray-700 text-xl mb-4">Personalized Support</h2>
            
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">Navigating Substance Abuse Challenges</h2>
            
            <div className="flex flex-col md:flex-row justify-center gap-16 mb-16">
              {/* Coping Strategies Card */}
              <div className="flex flex-col items-center max-w-sm">
                <div className="bg-[#f8d7c4] p-4 rounded-full mb-4">
                  <img src="/coping.png" alt="Coping Strategies Icon" className="h-16 w-16" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Coping Strategies</h3>
                <p className="text-gray-700 text-center">
                  Discover practical coping mechanisms and evidence-based approaches to address 
                  substance abuse and promote overall wellbeing
                </p>
                <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                  Explore Now
                </button>
              </div>

              {/* Wellness Resources Card */}
              <div className="flex flex-col items-center max-w-sm">
                <div className="bg-[#b8d8d8] p-4 rounded-full mb-4">
                  <img src="/wellness.png" alt="Wellness Resources Icon" className="h-16 w-16" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Wellness Resources</h3>
                <p className="text-gray-700 text-center">
                  Access a curated collection of educational materials, personal stories, and wellness 
                  resources to support your journey
                </p>
                <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                  Start Exploring
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section - Based on second image */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#f8e3d4] rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <img src="/1st.png" alt="Leaf Icon" className="h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">What is Substance Abuse?</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Substance abuse refers to the harmful or excessive use of drugs, alcohol, or other substances, often 
                    leading to physical, mental, and social consequences. It's a complex issue that can impact college students...
                  </p>
                  <div className="text-center">
                    <button className="bg-[#f8c9a5] text-gray-800 hover:bg-[#f5b78e] font-medium py-2 px-6 rounded-md">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <img src="/2nd.png" alt="Leaf Icon" className="h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">Understanding the Risks</h3>
                  <p className="text-white text-sm mb-6">
                    Substance abuse can have far-reaching effects on a student's academic performance, physical and mental 
                    health, and overall well-being. It's crucial to be aware of the potential risks...
                  </p>
                  <div className="text-center">
                    <button className="bg-white text-green-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-md">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8e3d4] rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <img src="/3rd.png" alt="Leaf Icon" className="h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Accessing Support</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Our organization offers a range of confidential support services, including counseling, support 
                    groups, and referrals to specialized treatment providers...
                  </p>
                  <div className="text-center">
                    <button className="bg-[#f8c9a5] text-gray-800 hover:bg-[#f5b78e] font-medium py-2 px-6 rounded-md">
                      Get Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Integration Section */}
          <div className="container mx-auto px-6 py-8 bg-gradient-to-r from-[#f5f5dc] to-[#b8d8d8] rounded-lg shadow-md mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Healthcare Resources</h2>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2">Search for Drug Information</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter drug name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <button 
                    onClick={fetchDrugTrends} 
                    disabled={loading} 
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    {loading ? <Loader className="animate-spin" size={16} /> : "Search"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Find Nearby Healthcare Facilities</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter location (e.g., city, state)..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <button 
                    onClick={fetchTreatmentCenters} 
                    disabled={loading} 
                    className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    {loading ? <Loader className="animate-spin" size={16} /> : "Find"}
                  </button>
                </div>
              </div>
            </div>

            {/* Statistics Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Drug Overdose Deaths in the US</h3>
                {overdoseStats.length > 0 ? (
                  <ChartComponent 
                    data={overdoseStats} 
                    type="bar" 
                    dataKey="count" 
                    xAxisKey="year" 
                    color="#e11d48"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <Loader className="animate-spin mr-2" /> Loading data...
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mental Health Conditions Prevalence (%)</h3>
                {mentalHealthStats.length > 0 ? (
                  <ChartComponent 
                    data={mentalHealthStats} 
                    type="bar" 
                    dataKey="percentage" 
                    xAxisKey="condition" 
                    color="#4f46e5"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <Loader className="animate-spin mr-2" /> Loading data...
                  </div>
                )}
              </div>
            </div>

            {/* Drug Statistics */}
            {drugStats.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Drug Reactions</h3>
                <ChartComponent 
                  data={drugStats} 
                  type="bar" 
                  dataKey="count" 
                  xAxisKey="term" 
                  color="#22c55e"
                />
              </div>
            )}

            {/* Drug Trends */}
            {drugTrends.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Drug Trend Over Time: {search}</h3>
                <ChartComponent 
                  data={drugTrends} 
                  type="line" 
                  dataKey="count" 
                  xAxisKey="time" 
                  color="#3b82f6"
                />
              </div>
            )}

            {/* Map and Treatment Centers */}
            {mapVisible && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Healthcare Facilities Near {locationSearch}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div ref={mapContainerRef} className="w-full md:w-1/2 h-96 border rounded"></div>
                  
                  <div className="w-full md:w-1/2">
                    {treatmentCenters.length > 0 ? (
                      <div className="h-96 overflow-y-auto pr-2">
                        <h4 className="text-lg font-semibold mb-2">Found {treatmentCenters.length} nearby facilities:</h4>
                        <ul className="space-y-3">
                          {treatmentCenters.map((center) => (
                            <li key={center.id} className="p-3 bg-gray-50 rounded shadow-sm hover:shadow transition border-l-4 border-green-500">
                              <p className="font-medium text-green-600">
                                {center.name}
                                {center.important && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Major</span>}
                              </p>
                              <p className="text-sm font-medium text-gray-700">{center.category}</p>
                              <p className="text-sm text-gray-600">{center.address}</p>
                              <p className="text-sm text-gray-600">
                                <strong>Distance:</strong> {center.distance ? center.distance.toFixed(1) + ' km' : 'N/A'}
                              </p>
                              <a 
                                href={`https://www.openstreetmap.org/directions?from=${DEFAULT_COORDS.lat},${DEFAULT_COORDS.lon}&to=${center.lat},${center.lon}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm text-green-500 hover:text-green-700"
                              >
                                Get Directions
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-center py-10">No healthcare facilities found in this location. Try a different search term or location.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Become Part of the Solution*/}
          <div className="mt-20 mb-12">
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600 mb-2">Join Our Community</p>
              <h2 className="text-4xl font-bold text-green-800">Become a Part of the Solution</h2>
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-700 mb-8">
                By joining our organization, you can contribute to creating a safe, drug-free campus environment. Volunteer, attend events, spread awareness among your peers, support fellow students and make a positive impact.
              </p>
              <p className="text-gray-600 mb-8">Get Involved</p>
              <p className="text-gray-600 mb-8">Learn More</p>
              <button className="bg-green-800 text-white px-8 py-3 rounded-md hover:bg-green-900 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <section id="contact" className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8 md:mb-0">
              <img src="/adc.png" alt="ADC Logo" className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold mb-4">Anti Drug Club</h3>
              <p className="text-sm text-gray-300 mb-4">
                Empowering students to make healthy choices and lead fulfilling lives free from substance abuse.
              </p>
              <p className="text-sm">
                ALL RIGHTS RESERVED
                <br />
                ADC 2025
              </p>
            </div>

            <div className="flex flex-col mb-8 md:mb-0">
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white mb-2 text-left">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white mb-2 text-left">
                About Us
              </button>
              <button onClick={() => scrollToSection('events')} className="text-gray-400 hover:text-white mb-2 text-left">
                Events
              </button>
              <button onClick={() => scrollToSection('resources')} className="text-gray-400 hover:text-white mb-2 text-left">
                Resources
              </button>
            </div>

            <div className="flex flex-col mb-8 md:mb-0">
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 mr-2 text-green-400" />
                <p className="text-gray-300">VIT VELLORE</p>
              </div>
              <div className="flex items-center mb-3">
                <Phone className="h-5 w-5 mr-2 text-green-400" />
                <p className="text-gray-300">(555) 123-4567</p>
              </div>
              <div className="flex items-center mb-3">
                <Mail className="h-5 w-5 mr-2 text-green-400" />
                <p className="text-gray-300">contact@adclub.org</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Connect with Us</h4>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <h4 className="font-semibold mb-4">Subscribe to our newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 bg-gray-700 text-white rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Anti Drug Club. All rights reserved. | 
              <a href="#" className="text-gray-400 hover:text-white ml-2">Privacy Policy</a> | 
              <a href="#" className="text-gray-400 hover:text-white ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}