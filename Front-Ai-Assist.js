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
