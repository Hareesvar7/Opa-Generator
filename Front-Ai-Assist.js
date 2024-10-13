const handleAiAssist = async () => {
  try {
    const response = await fetch("http://localhost:5000/ai-assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: aiPrompt }),
    });

    const data = await response.json();
    setAiOutput(data.aiOutput);
  } catch (error) {
    console.error("Error with AI Assist:", error);
    setAiOutput("An error occurred while generating AI response.");
  }
};
