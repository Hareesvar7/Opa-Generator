const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Handle AI Assist
app.post("/ai-assist", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const aiOutput = response.data.choices[0].message.content;
        res.json({ aiOutput });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        if (error.response) {
            if (error.response.status === 429) {
                return res.status(429).json({ error: "Quota exceeded. Please try again later." });
            } else {
                return res.status(error.response.status).json({ error: error.response.data.error.message });
            }
        } else {
            return res.status(500).json({ error: "Internal server error." });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
