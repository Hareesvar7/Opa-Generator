const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Load OpenAI API key from .env

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// AI Assist Route using OpenAI API
app.post("/ai-assist", async (req, res) => {
    const { prompt } = req.body; // Get prompt from frontend

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003", // Use OpenAI GPT-3.5 model
                prompt: prompt,
                max_tokens: 150, // Adjust token count as per your need
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use API key from .env
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ aiOutput: response.data.choices[0].text.trim() }); // Send AI response to frontend
    } catch (error) {
        console.error("Error in AI assist:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get AI output." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
