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
        const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            body: JSON.stringify({
    text_prompts: [{ text: prompt }],
    cfg_scale: 7,
    height: 768,
    width: 1344,
    samples: 1,
    steps: 30,
}),

        });
        

        const result = await response.json();
        console.log("Stability AI Response:", result);

        if (response.ok && result.artifacts && result.artifacts[0]?.base64) {
            const imageBase64 = result.artifacts[0].base64;
            const imageUrl = `data:image/png;base64,${imageBase64}`;
            res.json({ data: [{ url: imageUrl }] });
        } else {
            res.status(400).json({ error: result.message || "Image generation failed" });
        }

    } catch (err) {
        console.error("Image generation failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
