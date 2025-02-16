import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_PREFIX = "/api";

// ✅ FDA API: Drug Reaction Statistics
app.get(`${API_PREFIX}/fda/stats`, async (req, res) => {
  try {
    const response = await fetch(
      "https://api.fda.gov/drug/event.json?count=patient.reaction.reactionmeddrapt.exact&limit=10"
    );
    const data = await response.json();
    if (!data.results) throw new Error("No data found");
    res.json(data.results);
  } catch (error) {
    console.error("Error fetching FDA stats:", error);
    res.status(500).json({ error: "Failed to fetch FDA statistics" });
  }
});

// ✅ FDA API: Drug Trends Over Time
app.get(`${API_PREFIX}/fda/drug-trends`, async (req, res) => {
  const { drug } = req.query;
  if (!drug) return res.status(400).json({ error: "Drug name is required" });

  try {
    const response = await fetch(
      `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${drug}"&count=receivedate`
    );
    const data = await response.json();
    if (!data.results) throw new Error("No data found for this drug");
    res.json(data.results);
  } catch (error) {
    console.error("Error fetching drug trends:", error);
    res.status(500).json({ error: "Failed to fetch drug trends" });
  }
});

// ✅ Treatment Centers API (Example Using findtreatment.gov)
app.get(`${API_PREFIX}/treatment-centers`, async (req, res) => {
  const { lat, lon, limitType = 2, limitValue = 20000 } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  try {
    const response = await fetch(
      `https://findtreatment.gov/locator/exportsAsJson/v2?sAddr=${lat},${lon}&limitType=${limitType}&limitValue=${limitValue}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch treatment centers");
    }

    const data = await response.json();
    res.json(data.rows || []);
  } catch (error) {
    console.error("Error fetching treatment centers:", error);
    res.status(500).json({ error: "Failed to fetch treatment centers" });
  }
});

// ✅ Vercel Export (Required for Serverless Deployment)
export default app;
