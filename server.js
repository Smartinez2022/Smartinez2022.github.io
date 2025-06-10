const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'API Key'; 

app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userQuestion }]
            })
        });
        const data = await response.json();
        console.log("OpenAI API response:", data); // <-- Add this line
        if (!data.choices || !data.choices[0]) {
            throw new Error(data.error ? data.error.message : "No choices returned from OpenAI");
        }
        res.json({ answer: data.choices[0].message.content.trim() });
    } catch (err) {
        console.log("ERROR in /ask:", err);
        res.status(500).json({ answer: "Go find out using Google." });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
