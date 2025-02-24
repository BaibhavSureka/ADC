import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Resources = () => {
  const [drugStats, setDrugStats] = useState([]);
  const [drugTrends, setDrugTrends] = useState([]);
  const [treatmentCenters, setTreatmentCenters] = useState([]);
  const [drugDetails, setDrugDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fda/stats");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setDrugStats(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const trendsResponse = await fetch(
        `http://localhost:5000/api/fda/drug-trends?drug=${searchQuery}`
      );
      if (!trendsResponse.ok) throw new Error("Failed to fetch drug trends");
      const trendsData = await trendsResponse.json();
      setDrugTrends(trendsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        Drug Reaction Statistics
      </h2>

      {/* Bar Chart for Drug Reaction Statistics */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={drugStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="term" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

      {/* Search Input & Button */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter drug name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: loading ? "#ccc" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
            width: "100%",
          }}
        >
          {loading ? "Searching..." : "Search Drug Trends"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            padding: "10px",
            border: "1px solid #f87171",
            borderRadius: "5px",
            marginTop: "10px",
            color: "#b91c1c",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Bar Chart for Drug Trends */}
      {drugTrends.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
            Drug Trend Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={drugTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Drug Details */}
      {drugDetails && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
            Drug Details
          </h2>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <p><strong>Name:</strong> {drugDetails.name}</p>
            <p><strong>Description:</strong> {drugDetails.description}</p>
          </div>
        </div>
      )}      
    </div>
  );
};

export default Resources;
