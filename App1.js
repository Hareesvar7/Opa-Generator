const handleAiAssist = async () => {
  const response = await fetch("http://localhost:5000/ai-assist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ aiPrompt }),
  });

  const data = await response.json();
  setAiOutput(data.aiOutput);
};
