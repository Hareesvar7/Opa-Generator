const handleAiAssist = async () => {
    try {
        const response = await fetch("http://localhost:5000/ai-assist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: aiPrompt,  // Ensure prompt is being passed from state
            }),
        });

        if (!response.ok) {
            // If response is not OK, throw an error
            const errorData = await response.json();
            throw new Error(errorData.error || "Unknown error occurred");
        }

        const data = await response.json();

        if (data.aiOutput) {
            setAiOutput(data.aiOutput);  // Set AI output if successful
        } else {
            console.error("Error from backend:", data.error);
            setAiOutput(`Error: ${data.error}`);  // Display error if any
        }
    } catch (error) {
        console.error("Error during AI Assist:", error);
        setAiOutput("An error occurred during AI Assist.");
    }
};
