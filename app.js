import React, { useState } from "react";

function App() {
  const [regoFile, setRegoFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [output, setOutput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const handleRegoFileChange = (event) => {
    setRegoFile(event.target.files[0]);
  };

  const handleJsonFileChange = (event) => {
    setJsonFile(event.target.files[0]);
  };

  const handleEvaluate = () => {
    // Add logic to evaluate rego and json files
    setOutput("Output from evaluating rego and json files...");
  };

  const handleAiAssist = () => {
    // Add logic for AI Assist
    setAiOutput(`AI output for the prompt: "${aiPrompt}"`);
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.heading}>Opa Policy Validator</h1>

      <div style={styles.inputContainer}>
        <div style={styles.fileInput}>
          <label htmlFor="regoFile" style={styles.label}>Upload Rego File:</label>
          <input type="file" id="regoFile" onChange={handleRegoFileChange} />
        </div>

        <div style={styles.fileInput}>
          <label htmlFor="jsonFile" style={styles.label}>Upload JSON File:</label>
          <input type="file" id="jsonFile" onChange={handleJsonFileChange} />
        </div>

        <button onClick={handleEvaluate} style={styles.button}>
          Evaluate
        </button>
      </div>

      <div style={styles.outputContainer}>
        <label htmlFor="outputText" style={styles.label}>Output:</label>
        <textarea
          id="outputText"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          rows="10"
          style={styles.textArea}
        />
      </div>

      <div style={styles.aiAssistContainer}>
        <h2 style={styles.subHeading}>AI Assist</h2>
        <label htmlFor="aiPrompt" style={styles.label}>Enter your prompt:</label>
        <textarea
          id="aiPrompt"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows="4"
          style={styles.textArea}
        />

        <button onClick={handleAiAssist} style={styles.button}>
          Generate AI Output
        </button>

        <div style={styles.aiOutputContainer}>
          <label htmlFor="aiOutputText" style={styles.label}>AI Output:</label>
          <textarea
            id="aiOutputText"
            value={aiOutput}
            onChange={(e) => setAiOutput(e.target.value)}
            rows="6"
            style={styles.textArea}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  inputContainer: {
    margin: "20px 0",
  },
  fileInput: {
    marginBottom: "10px",
  },
  button: {
    margin: "10px 0",
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  outputContainer: {
    margin: "20px 0",
  },
  textArea: {
    width: "80%",
    margin: "10px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  heading: {
    color: "#333",
  },
  subHeading: {
    color: "#333",
  },
  label: {
    fontWeight: "bold",
  },
  aiAssistContainer: {
    marginTop: "30px",
  },
  aiOutputContainer: {
    marginTop: "20px",
  },
};

export default App;
