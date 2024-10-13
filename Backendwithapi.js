const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Make sure dotenv is required to load environment variables

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Handle AI assist
app.post("/ai-assist", async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the request body
    const maxRetries = 5; // Maximum number of retries
    let retries = 0;
    let aiOutput;

    while (retries < maxRetries) {
        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    },
                }
            );

            aiOutput = response.data.choices[0].message.content;
            return res.json({ aiOutput }); // Send response if successful
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error("429 Rate Limit Exceeded:", error.response.data);
                const delay = Math.pow(2, retries) * 1000; // Exponential backoff delay
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
                retries++;
            } else {
                console.error("Error calling OpenAI API:", error);
                return res.status(error.response ? error.response.status : 500).json({ error: "Internal server error." });
            }
        }
    }

    // If we've exhausted all retries, respond with an error
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
