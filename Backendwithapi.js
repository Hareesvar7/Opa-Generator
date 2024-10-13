const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const OpenAIApi = require("openai"); // Correct import
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 5000;

// Set up OpenAI API key
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle policy evaluation (existing logic)
app.post("/evaluate", upload.fields([{ name: "regoFile" }, { name: "jsonFile" }]), (req, res) => {
    const regoFileContent = req.files.regoFile[0].buffer.toString();
    const jsonFileContent = req.files.jsonFile[0].buffer.toString();
    const policyInput = req.body.policyInput;

    const regoFilePath = path.join(__dirname, "temp_policy.rego");
    const jsonFilePath = path.join(__dirname, "temp_plan.json");

    fs.writeFileSync(regoFilePath, regoFileContent);
    fs.writeFileSync(jsonFilePath, jsonFileContent);

    const opaCommand = `opa eval -i ${jsonFilePath} -d ${regoFilePath} "${policyInput}"`;

    exec(opaCommand, (error, stdout, stderr) => {
        fs.unlinkSync(regoFilePath);
        fs.unlinkSync(jsonFilePath);

        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ error: "Error evaluating the policy." });
        }

        res.json({ output: stdout });
    });
});

// AI Assist logic
app.post("/ai-assist", async (req, res) => {
    const { prompt } = req.body;

    try {
        // Call OpenAI's GPT-3.5 API
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.7,
        });

        const aiOutput = response.choices[0].text.trim();
        res.json({ aiOutput });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ error: "Error generating AI response." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
