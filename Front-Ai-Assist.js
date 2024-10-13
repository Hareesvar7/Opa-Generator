const handleAiAssist = async () => {
    try {
        const response = await axios.post("http://localhost:5000/ai-assist", {
            prompt: aiPrompt,
        });

        setAiOutput(response.data.aiOutput);
    } catch (error) {
        console.error("Error during AI assist:", error);
        setAiOutput("An error occurred while fetching AI response.");
    }
};
