const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
