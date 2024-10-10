const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to handle file uploads and policy evaluation
app.post("/upload", upload.fields([{ name: "regoFile" }, { name: "jsonFile" }]), async (req, res) => {
    const regoFile = req.files.regoFile[0].buffer.toString(); // Get the Rego file content
    const jsonFile = JSON.parse(req.files.jsonFile[0].buffer.toString()); // Get the JSON file content
    const policy = req.body.policy;

    try {
        // Define OPA endpoint (make sure OPA is running on this endpoint)
        const opaUrl = "http://localhost:8181/v1/data/my_policy"; // Adjust the endpoint as needed

        // Send the policy evaluation request to OPA
        const response = await axios.post(opaUrl, {
            input: {
                rego: regoFile,
                json: jsonFile,
                policy,
            },
        });

        // Send back the evaluation result
        res.json({ result: response.data });
    } catch (error) {
        console.error("Error evaluating policy:", error);
        res.status(500).json({ error: "Error evaluating policy." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
