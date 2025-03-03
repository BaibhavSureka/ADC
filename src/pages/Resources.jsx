import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader } from 'lucide-react';

// Default VIT Vellore location
const DEFAULT_LOCATION = "VIT Vellore, Tamil Nadu, 632014";
const DEFAULT_COORDS = { lat: 12.9718, lon: 79.1589 }; // VIT Vellore coordinates

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
];

const Resources = () => {
  const [graphData, setGraphData] = useState(null);
  const [drugStats, setDrugStats] = useState([]);
  const [drugTrends, setDrugTrends] = useState([]);
  const [treatmentCenters, setTreatmentCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchGraphData();
    fetchDrugStats();
    
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      
      // Clear timeout if component unmounts
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]); // Added searchTimeout to dependencies

  const fetchGraphData = async () => {
    try {
      // Simulating API response since the actual API URL wasn't provided
      const mockData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        values: [65, 59, 80, 81, 56, 55]
      };
      setGraphData(mockData);
    } catch (err) {
      console.error("Error fetching graph data:", err);
    }
  };

  const fetchDrugStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.fda.gov/drug/event.json?count=patient.reaction.reactionmeddrapt.exact&limit=10"
      );

      if (!response.ok) throw new Error("Failed to fetch drug statistics");

      const data = await response.json();
      setDrugStats(data.results);
    } catch (error) {
      console.error("Drug Stats Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatmentCenters = async () => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set timeout to cancel request if it takes too long
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Search timed out. Please try a more specific location.");
    }, 20000); // 20 second timeout
    
    setSearchTimeout(timeoutId);
    setLoading(true);
    setError(null);

    try {
      // Step 1: Geocode the location to get coordinates
      const locationQuery = encodeURIComponent(locationSearch);
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=json&limit=1`
      );

      if (!geocodeResponse.ok) throw new Error("Failed to geocode location");

      const locationData = await geocodeResponse.json();
      
      let centerCoords;
      if (locationData.length === 0) {
        // If location not found, use default coordinates of VIT Vellore
        centerCoords = DEFAULT_COORDS;
        console.warn(`Location '${locationSearch}' not found, using default coordinates.`);
      } else {
        centerCoords = { lat: parseFloat(locationData[0].lat), lon: parseFloat(locationData[0].lon) };
      }
      
      // Step 2: Find healthcare facilities using Overpass API with REDUCED radius and timeout
      const radius = 3000; // Reduced from 5km to 3km radius
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
      `;

      const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (!overpassResponse.ok) throw new Error("Failed to fetch healthcare facilities");

      const overpassData = await overpassResponse.json();
      
      // Process healthcare facilities
      let facilities = processOverpassResults(overpassData, centerCoords);
      
      // Add important facilities (like CMC) that might be missed
      // Calculate distance to determine if they should be included
      IMPORTANT_FACILITIES.forEach(facility => {
        const distance = calculateDistance(
          centerCoords.lat, 
          centerCoords.lon, 
          facility.lat, 
          facility.lon
        );
        
        // Include if within 5km
        if (distance <= 5) {
          // Check if this facility is already in our results
          const exists = facilities.some(f => 
            f.name.toLowerCase().includes(facility.name.toLowerCase().split(' ')[0])
          );
          
          if (!exists) {
            facilities.push(facility);
          }
        }
      });
      
      // Sort by distance from search location and limit to top 10
      facilities = facilities.map(facility => {
        const distance = calculateDistance(
          centerCoords.lat, 
          centerCoords.lon, 
          facility.lat, 
          facility.lon
        );
        return { ...facility, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Limit to 10 nearest facilities
      
      setTreatmentCenters(facilities);
      setMapVisible(true);
      
      // Initialize map after data is loaded
      setTimeout(() => {
        initializeMap(centerCoords.lat, centerCoords.lon, facilities);
      }, 100);
    } catch (err) {
      console.error("Error in treatment center search:", err);
      setError(`Failed to find treatment centers: ${err.message}`);
      
      // Try to initialize map anyway with the location
      try {
        initializeMap(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, []);
        setMapVisible(true);
      } catch (mapErr) {
        console.error("Failed to initialize map:", mapErr);
      }
    } finally {
      setLoading(false);
      // Clear the timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
    }
  };
  
  // Function to calculate distance between two points in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  // Process Overpass API results
  const processOverpassResults = (data, centerCoords) => {
    const facilities = [];
    
    // Process each element (node, way, relation)
    data.elements.forEach(element => {
      // Only process elements with tags
      if (!element.tags) return;
      
      // Check if it's a healthcare facility
      const isHealthcare = 
        element.tags.amenity === 'hospital' || 
        element.tags.amenity === 'clinic' ||
        element.tags.healthcare === 'hospital' ||
        element.tags.healthcare === 'clinic';
      
      if (!isHealthcare) return;
      
      let facilityName = element.tags.name || 
                        element.tags['name:en'] || 
                        getCategoryName(element.tags);
                        
      let category = getCategoryName(element.tags);
      let address = formatAddress(element.tags);
      let lat, lon;
      
      if (element.type === 'node') {
        lat = element.lat;
        lon = element.lon;
      } else if (element.type === 'way' && element.center) {
        lat = element.center.lat;
        lon = element.center.lon;
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
        });
      }
    });
    
    return facilities;
  };
  
  // Get category name from tags
  const getCategoryName = (tags) => {
    if (tags.amenity === 'hospital') return 'Hospital';
    if (tags.amenity === 'clinic') return 'Clinic';
    if (tags.healthcare === 'hospital') return 'Hospital';
    if (tags.healthcare === 'clinic') return 'Clinic';
    return 'Healthcare Facility';
  };
  
  // Format address from tags
  const formatAddress = (tags) => {
    const addressParts = [];
    
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city']) addressParts.push(tags['addr:city']);
    if (tags['addr:state']) addressParts.push(tags['addr:state']);
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const initializeMap = (centerLat, centerLon) => {
    // Check if Leaflet is loaded
    if (typeof window !== 'undefined' && !window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => createMap(centerLat, centerLon);
      document.head.appendChild(script);
    } else if (typeof window !== 'undefined' && window.L) {
      createMap(centerLat, centerLon);
    }
  };

  const createMap = (centerLat, centerLon) => {
    if (!mapContainerRef.current) return;
    
    // Clear previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
    }
    
    // Create map
    const L = window.L;
    mapRef.current = L.map(mapContainerRef.current).setView([centerLat, centerLon], 14);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);
    
    // Add marker for the searched location
    L.marker([centerLat, centerLon])
      .addTo(mapRef.current)
      .bindPopup(`<b>Your location: ${locationSearch}</b>`)
      .openPopup();
    
    // Clear previous markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (mapRef.current) {
          mapRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    }
    
    // Add markers for treatment centers
    if (treatmentCenters && treatmentCenters.length > 0) {
      // Create bounds to fit all markers
      const bounds = L.latLngBounds();
      bounds.extend([centerLat, centerLon]); // Include search location in bounds
      
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
          `);
        
        markersRef.current.push(marker);
        bounds.extend([center.lat, center.lon]);
      });
      
      // Fit map to bounds with padding
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const fetchDrugTrends = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${search}"&count=receivedate`
      );

      if (!response.ok) throw new Error("Failed to fetch drug trends");

      const data = await response.json();
      setDrugTrends(data.results);
    } catch (error) {
      console.error("Drug Trends Fetch Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5dc' }} className="pt-20">
      {/* Hero Section */}
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
</div>


      {/* Personalized Support Section */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-center text-gray-700 text-xl mb-12">Personalized Support</h2>
        
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-16">Navigating Substance Abuse Challenges</h2>
        
        <div className="flex flex-col md:flex-row justify-center gap-16 mb-16">
          {/* Coping Strategies Card */}
          <div className="flex flex-col items-center max-w-sm">
            <div className="bg-[#f8d7c4]">
              <img src="/coping.png" alt="Coping Strategies Icon" className="h-20 w-20" />
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
            <div className="bg-[#b8d8d8]">
              <img src="/wellness.png" alt="Wellness Resources Icon" className="h-20 w-20" />
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

      

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-16 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FAQ Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-[#b8d8d8]">
                  <img src="/1st.png" alt="Leaf Icon" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">What is Substance Abuse?</h3>
              <p className="text-gray-600 text-sm">
                Substance abuse refers to the harmful or excessive use of drugs, alcohol, or other substances, often 
                leading to physical, mental, and social consequences. It's a complex issue that can impact college students...
              </p>
              <div className="mt-6 text-center">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
                  Find Answers
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Card 2 */}
          <div className="bg-green-600 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-white  ">
                  <img src="/2nd.png" alt="Leaf Icon" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Understanding the Risks</h3>
              <p className="text-white text-sm">
                Substance abuse can have far-reaching effects on a student's academic performance, physical and mental 
                health, and overall well-being. It's crucial to be aware of the potential risks...
              </p>
              <div className="mt-6 text-center">
                <button className="bg-white text-green-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-md">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-[#b8d8d8]">
                  <img src="/3rd.png" alt="Leaf Icon" className="h-16 w-16" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Accessing Support</h3>
              <p className="text-gray-600 text-sm">
                Our organization offers a range of confidential support services, including counseling, support 
                groups, and referrals to specialized treatment providers...
              </p>
              <div className="mt-6 text-center">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md">
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

        {/* Drug Statistics */}
        {drugStats.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Drug Reaction Statistics</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drugStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="term" />
                  <YAxis />
                  <Tooltip />
                  <RechartsBar dataKey="count" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Drug Trends */}
        {drugTrends.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Drug Trend Over Time: {search}</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drugTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <RechartsBar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
    </div>
  );
};

export default Resources;
