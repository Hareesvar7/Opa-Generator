// Import required packages
import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";  // Import dotenv

// Load environment variables from .env file
dotenv.config();  // Configure dotenv to use .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle policy evaluation
app.post("/evaluate", upload.fields([{ name: "regoFile" }, { name: "jsonFile" }]), (req, res) => {
    const regoFileContent = req.files.regoFile[0].buffer.toString(); // Rego file content
    const jsonFileContent = req.files.jsonFile[0].buffer.toString(); // JSON file content
    const policyInput = req.body.policyInput; // Policy input from user

    // Save Rego and JSON files temporarily to disk
    const regoFilePath = path.join(__dirname, "temp_policy.rego");
    const jsonFilePath = path.join(__dirname, "temp_plan.json");

    fs.writeFileSync(regoFilePath, regoFileContent);
    fs.writeFileSync(jsonFilePath, jsonFileContent);

    // OPA eval command based on user input
    const opaCommand = `opa eval -i ${jsonFilePath} -d ${regoFilePath} "${policyInput}"`;

    // Execute the OPA command
    exec(opaCommand, (error, stdout, stderr) => {
        // Clean up temporary files
        fs.unlinkSync(regoFilePath);
        fs.unlinkSync(jsonFilePath);

        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ error: "Error evaluating the policy." });
        }

        // Send the result back to the frontend
        res.json({ output: stdout });
    });
});

// AI Assist Endpoint
app.post("/ai-assist", async (req, res) => {
    const { aiPrompt } = req.body;

    try {
        // Call generator function to get GPT-3 output
        const generator = generateAiResponse(aiPrompt);

        // Iterate through generator and respond with the AI output
        let result = "";
        for await (const value of generator) {
            result += value;
        }

        // Send the GPT-3 response back to the frontend
        res.json({ aiOutput: result });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ error: "Error processing AI prompt." });
    }
});

// Generator function to handle GPT-3 API calls
async function* generateAiResponse(prompt) {
    const apiKey = process.env.OPENAI_API_KEY; // Ensure your API key is set in the environment variable

    // Send the API request using fetch
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,  // Use the API key here
        },
        body: JSON.stringify({
            model: "text-davinci-003",  // Using the GPT-3 model
            prompt: prompt,
            max_tokens: 150,  // Adjust the token limit as needed
        }),
    });

    // Check if the response is valid
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    // Parse the response
    const data = await response.json();

    // Check if data.choices exists
    if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices returned from OpenAI API.");
    }

    const output = data.choices[0].text.trim();

    // Yield the output in chunks (you can modify chunk size)
    for (let i = 0; i < output.length; i += 50) {
        yield output.slice(i, i + 50);  // Yield 50 characters at a time
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
