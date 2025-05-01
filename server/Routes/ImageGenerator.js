// server/routes/imageRoute.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

router.post("/generate-image", async (req, res) => {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    try {
        const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt,
                n: 1,
                size: "512x512",
                model: "dall-e-2",
            }),
        });

        const data = await openaiRes.json();
        if (!openaiRes.ok) {
            return res.status(openaiRes.status).json(data);
        }

        res.json(data);
    } catch (err) {
        console.error("Image generation failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;