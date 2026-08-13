const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
    try {
        const userText = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: userText
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log("Gemini response:", data);
        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            reply: "Error connecting to Gemini."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Cove is running at http://localhost:${PORT}`);
});