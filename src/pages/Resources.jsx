import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Loader } from "lucide-react";

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

const Dashboard = () => {
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
  }, []);

  const fetchGraphData = async () => {
    try {
      const response = await fetch("YOUR_GRAPH_API_URL");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.labels || !data.values) {
        throw new Error("Invalid graph data format");
      }

      setGraphData(data);
    } catch (err) {
      // console.error("Error fetching graph data:", err);
      // setError("Failed to load graph data. Check API response.");
    }
  };

  const fetchDrugStats = async () => {
    try {
      const response = await fetch(
        "https://api.fda.gov/drug/event.json?count=patient.reaction.reactionmeddrapt.exact&limit=10"
      );

      if (!response.ok) throw new Error("Failed to fetch drug statistics");

      const data = await response.json();
      setDrugStats(data.results);
    } catch (error) {
      console.error("Drug Stats Fetch Error:", error);
      setError(error.message);
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
        // Create custom icon based on facility type
        let iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
        let iconSize = [25, 41];
        
        // Create special icon for important facilities
        if (center.important) {
          const markerHtml = `
            <div style="background-color: #FF4500; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>
          `;
          
          const icon = L.divIcon({
            html: markerHtml,
            className: 'important-marker',
            iconSize: [16, 16]
          });
          
          const marker = L.marker([center.lat, center.lon], {icon: icon})
            .addTo(mapRef.current)
            .bindPopup(`
              <b>${center.name}</b><br>
              <strong>Type:</strong> ${center.category}<br>
              <strong>Address:</strong> ${center.address}<br>
              <strong>Distance:</strong> ${center.distance ? center.distance.toFixed(1) + ' km' : 'N/A'}<br>
              <a href="https://www.openstreetmap.org/directions?from=${centerLat},${centerLon}&to=${center.lat},${center.lon}" target="_blank">Get Directions</a>
            `);
          
          markersRef.current.push(marker);
        } else {
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
        }
        
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Healthcare Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Input
            type="text"
            placeholder="Enter drug name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <Button 
            onClick={fetchDrugTrends} 
            disabled={loading} 
            className="mt-2 w-full"
          >
            {loading ? <Loader className="animate-spin mr-2" size={16} /> : null}
            Search Drug Trends
          </Button>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter location (e.g., city, state)..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <Button 
            onClick={fetchTreatmentCenters} 
            disabled={loading} 
            className="mt-2 w-full"
          >
            {loading ? <Loader className="animate-spin mr-2" size={16} /> : null}
            Find Nearby Facilities (Top 10)
          </Button>
        </div>
      </div>

      {graphData && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Drug Data Analysis</h2>
          <div className="w-full h-64">
            <Bar
              data={{
                labels: graphData.labels,
                datasets: [
                  {
                    label: "Data",
                    data: graphData.values,
                    backgroundColor: "#4CAF50",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Drug Reaction Statistics</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={drugStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" />
              <YAxis />
              <Tooltip />
              <RechartsBar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {drugTrends.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Drug Trend Over Time</h2>
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

      {mapVisible && (
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Top 10 Healthcare Facilities Near {locationSearch}</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div ref={mapContainerRef} className="w-full md:w-1/2 h-96 border rounded"></div>
            
            <div className="w-full md:w-1/2">
              {treatmentCenters.length > 0 ? (
                <div className="h-96 overflow-y-auto pr-2">
                  <h3 className="text-lg font-semibold mb-2">Found {treatmentCenters.length} nearby facilities:</h3>
                  <ul className="space-y-3">
                    {treatmentCenters.map((center) => (
                      <li key={center.id} className="p-3 bg-gray-50 rounded shadow-sm hover:shadow transition border-l-4 border-blue-500">
                        <p className="font-medium text-blue-600">
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
                          className="mt-2 inline-block text-sm text-blue-500 hover:text-blue-700"
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
  );
};

export default Dashboard;