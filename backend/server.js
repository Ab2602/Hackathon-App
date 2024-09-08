require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const cors = require("cors");

// Initializing express app
const app = express();

// Middleware which allows frontend to interact with backend [cors]
app.use(cors({
  origin: 'https://hackathon-app-5y89.vercel.app/'
}
  
));
app.use(express.json());

// Set up PostgreSQL pool with Vercel connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your Vercel PostgreSQL connection string
  ssl: {
    rejectUnauthorized: false, // For production, you might want to enforce this.
  },
});

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store images in memory as Buffer
const upload = multer({ storage: storage });

// API route to handle form submission
app.post("/api/challenges", upload.single("image"), async (req, res) => {
  const { challengeName, startDate, endDate, desc, level } = req.body;
  const imageFile = req.file; // Access the uploaded image

  if (!imageFile) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    // Insert form data and image into the database
    const result = await pool.query(
      "INSERT INTO challenges (challenge_name, start_date, end_date, description, level, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [challengeName, startDate, endDate, desc, level, imageFile.buffer] // imageFile.buffer stores the image as a binary blob
    );

    res.status(201).json(result.rows[0]); // Send back the inserted data
  } catch (error) {
    console.error("Error saving challenge:", error);
    res.status(500).json({ error: "Failed to save challenge" });
  }
});

// API route to get all challenges
app.get("/api/challenges", async (req, res) => {
  try {
    // Query to get all challenges
    const result = await pool.query("SELECT * FROM challenges");

    // If no challenges are found, return an empty array
    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }

    // Map through the results and convert the binary image buffer to a base64-encoded string for the frontend
    const challenges = result.rows.map((challenge) => {
      return {
        id: challenge.id,
        challengeName: challenge.challenge_name,
        startDate: challenge.start_date,
        endDate: challenge.end_date,
        description: challenge.description,
        level: challenge.level,
        image: challenge.image ? `data:image/png;base64,${challenge.image.toString('base64')}` : null, // Convert binary to base64
      };
    });

    // Send challenges as JSON response
    res.status(200).json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// API route to get a specific challenge by ID
app.get("/api/challenges/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Query to get a specific challenge by ID
    const result = await pool.query("SELECT * FROM challenges WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const challenge = result.rows[0];
    res.status(200).json({
      id: challenge.id,
      challengeName: challenge.challenge_name,
      startDate: challenge.start_date,
      endDate: challenge.end_date,
      description: challenge.description,
      level: challenge.level,
      image: challenge.image ? `data:image/png;base64,${challenge.image.toString('base64')}` : null, // Convert binary to base64
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});


// API route to update a specific challenge by ID
app.put("/api/challenges/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { challengeName, startDate, endDate, desc, level } = req.body;
  const imageFile = req.file;

  try {
    // Update challenge in the database
    const result = await pool.query(
      `UPDATE challenges
       SET challenge_name = $1, start_date = $2, end_date = $3, description = $4, level = $5, image = $6
       WHERE id = $7
       RETURNING *`,
      [
        challengeName,
        startDate,
        endDate,
        desc,
        level,
        imageFile ? imageFile.buffer : null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating challenge:", error);
    res.status(500).json({ error: "Failed to update challenge" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
