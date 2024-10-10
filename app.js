import React, { useState } from "react";

function App() {
  const [regoFile, setRegoFile] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);
  const [policy, setPolicy] = useState(""); // New state for policy input
  const [output, setOutput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const handleRegoFileChange = (event) => {
    setRegoFile(event.target.files[0]);
  };

  const handleJsonFileChange = (event) => {
    setJsonFile(event.target.files[0]);
  };

  const handleEvaluate = async () => {
    const formData = new FormData();
    formData.append("regoFile", regoFile);
    formData.append("jsonFile", jsonFile);
    formData.append("policyInput", policy);

    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error("Error during evaluation:", error);
      setOutput("An error occurred during evaluation.");
    }
  };

  const handleAiAssist = () => {
    // Placeholder logic for AI Assist
    setAiOutput(`AI output for the prompt: "${aiPrompt}"`);
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.heading}>Opa Policy Validator</h1>

      <div style={styles.inputContainer}>
        <div style={styles.fileInput}>
          <label htmlFor="regoFile" style={styles.label}>Upload Rego File:</label>
          <input type="file" id="regoFile" onChange={handleRegoFileChange} style={styles.input} />
        </div>

        <div style={styles.fileInput}>
          <label htmlFor="jsonFile" style={styles.label}>Upload JSON File:</label>
          <input type="file" id="jsonFile" onChange={handleJsonFileChange} style={styles.input} />
        </div>

        <div style={styles.textInput}>
          <label htmlFor="policyInput" style={styles.label}>Policy:</label>
          <input
            type="text"
            id="policyInput"
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            style={styles.textInputField}
            placeholder="Enter policy here"
          />
        </div>

        <button onClick={handleEvaluate} style={styles.button}>
          Evaluate
        </button>
      </div>

      <div style={styles.outputContainer}>
        <label htmlFor="outputText" style={styles.labelCenter}>Output:</label>
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
          rows="2"
          style={styles.smallTextArea}
        />

        <button onClick={handleAiAssist} style={styles.button}>
          Generate AI Output
        </button>

        <div style={styles.aiOutputContainer}>
          <label htmlFor="aiOutputText" style={styles.labelCenter}>AI Output:</label>
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
    width: "80%",
    margin: "0 auto",
  },
  inputContainer: {
    margin: "20px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fileInput: {
    marginBottom: "10px",
    width: "100%",
  },
  textInput: {
    marginBottom: "10px",
    width: "100%",
  },
  textInputField: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
  },
  button: {
    margin: "10px 0",
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    width: "50%",
  },
  outputContainer: {
    margin: "20px 0",
    width: "100%",
  },
  labelCenter: {
    fontWeight: "bold",
    textAlign: "center",
    display: "block",
    width: "100%",
  },
  textArea: {
    width: "100%",
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
  smallTextArea: {
    width: "50%",
    margin: "10px auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  aiAssistContainer: {
    marginTop: "30px",
  },
  aiOutputContainer: {
    marginTop: "20px",
    width: "100%",
  },
};

export default App;
