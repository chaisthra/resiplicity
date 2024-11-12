const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Route to handle image generation
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log('Generating image with prompt:', prompt);

    const output = await replicate.run(
      "fofr/flux-bad-70s-food:bca7e1eae47786328b0745fc0a1188b26e979197c980087485f099543fd9f85b",
      {
        input: {
          model: "dev",
          prompt: prompt,
          lora_scale: 1,
          num_outputs: 1,
          aspect_ratio: "3:2",
          output_format: "webp",
          guidance_scale: 3.5,
          output_quality: 80,
          prompt_strength: 0.8,
          extra_lora_scale: 1,
          num_inference_steps: 28
        }
      }
    );

    console.log('Generated output:', output);
    res.json({ url: output[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});