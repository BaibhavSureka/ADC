import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// FDA API endpoint for drug reaction statistics
app.get("/api/fda/stats", async (req, res) => {
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

// FDA API endpoint for drug search trends over time
app.get("/api/fda/drug-trends", async (req, res) => {
  const { drug } = req.query;
  if (!drug) return res.status(400).json({ error: "Drug name is required" });

  try {
    // Fixed the URL template by enclosing it with backticks
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

// Treatment centers (example using findtreatment.gov API)
app.get("/api/treatment-centers", async (req, res) => {
  const { lat, lon, limitType = 2, limitValue = 20000 } = req.query; // Default: 20km radius

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

// Drug details from DrugBank (placeholder)
// app.get("/api/drug-details", async (req, res) => {
//   const { drug } = req.query;
//   if (!drug) return res.status(400).json({ error: "Drug name is required" });

//   try {
//     // Replace with actual DrugBank API call and include API key as needed.
//     const response = await fetch(
//       `https://api.drugbank.com/discovery/v1/drugs.json?search=${drug}`,
//       { headers: { Authorization: "Bearer YOUR_API_KEY_HERE" } }
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching drug details:", error);
//     res.status(500).json({ error: "Failed to fetch drug details" });
//   }
// });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
