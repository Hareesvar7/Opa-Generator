import React, { useState } from "react";
import axios from "axios";

function App() {
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiOutput, setAiOutput] = useState("");
    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleAiAssist = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post("http://localhost:5000/ai-assist", {
                prompt: aiPrompt,
            });

            setAiOutput(response.data.aiOutput);
        } catch (error) {
            console.error("Error during AI assist:", error);
            if (error.response) {
                if (error.response.status === 429) {
                    setAiOutput("Rate limit exceeded. Please try again later.");
                } else {
                    setAiOutput(error.response.data.error || "An error occurred while fetching AI response.");
                }
            } else {
                setAiOutput("An error occurred while fetching AI response.");
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div style={styles.appContainer}>
            <h1 style={styles.heading}>AI Assistant</h1>
            <label htmlFor="aiPrompt" style={styles.label}>Enter your prompt:</label>
            <textarea
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows="2"
                style={styles.smallTextArea}
            />
            <button onClick={handleAiAssist} style={styles.button} disabled={loading}>
                {loading ? "Loading..." : "Generate AI Output"}
            </button>
            <div style={styles.aiOutputContainer}>
                <label htmlFor="aiOutputText" style={styles.labelCenter}>AI Output:</label>
                <textarea
                    id="aiOutputText"
                    value={aiOutput}
                    readOnly
                    rows="6"
                    style={styles.textArea}
                />
            </div>
        </div>
    );
}

const styles = {
    // Your existing styles here...
};

export default App;
