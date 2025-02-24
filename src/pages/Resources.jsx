import React, { useState, useEffect } from "react";
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

const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
const LOCATION = "Vellore, Tamil Nadu 632014";

const Dashboard = () => {
  const [graphData, setGraphData] = useState(null);
  const [drugStats, setDrugStats] = useState([]);
  const [drugTrends, setDrugTrends] = useState([]);
  const [treatmentCenters, setTreatmentCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    fetchGraphData();
    fetchDrugStats();
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
      console.error("Error fetching graph data:", err);
      setError("Failed to load graph data. Check API response.");
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
    if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
      setError("Invalid API Key. Please update your API Key.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=treatment+centers+in+${LOCATION}&key=${API_KEY}`
      );

      const data = await response.json();
      setTreatmentCenters(data.results || []);
      setMapVisible(true);
    } catch (err) {
      console.error("Error fetching treatment centers:", err);
      setError("Failed to fetch treatment centers. Please try again.");
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Enter drug name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <Button onClick={fetchDrugTrends} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Search Drug Trends"}
        </Button>
        <Button onClick={fetchTreatmentCenters} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Find Treatment Centers"}
        </Button>
      </div>

      {graphData && (
        <div className="w-full max-w-4xl mx-auto">
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
      )}

      <h2 className="mt-6 text-xl font-bold">Drug Reaction Statistics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={drugStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="term" />
          <YAxis />
          <Tooltip />
          <RechartsBar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      {drugTrends.length > 0 && (
        <div>
          <h2 className="mt-6 text-xl font-bold">Drug Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={drugTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <RechartsBar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {mapVisible && (
        <div className="mt-6 w-full h-96">
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/search?key=${API_KEY}&q=treatment+centers+in+${LOCATION}`}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
