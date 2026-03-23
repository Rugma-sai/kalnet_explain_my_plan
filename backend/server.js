const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// 🔐 Debug API key
console.log(
  "OPENROUTER KEY:",
  process.env.OPENROUTER_API_KEY ? "Loaded ✅" : "Missing ❌"
);

// ✅ Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔥 PROMPT
const PROMPT = `
You are an AI planning assistant that converts vague user ideas into clear, structured, and actionable plans.

Return ONLY valid JSON in this format:

{
  "Goal": "",
  "Method": "",
  "Steps": [],
  "Timeline": "",
  "Missing Elements": {
    "Goal clarity": "",
    "Execution steps": "",
    "Resources": "",
    "Timeline": ""
  },
  "Simplified Version": "",
  "Actionable Steps": [],
  "Clarity Score": 0
}

Rules:
- Output ONLY JSON
- No markdown, no explanation
- Ensure valid JSON
`;

// 🚀 API ROUTE
app.post("/analyze", async (req, res) => {
  const { input } = req.body;

  console.log("📥 Input:", input);

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    console.log("🚀 Calling OpenRouter...");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: PROMPT + "\nUser Input:\n" + input,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000, // ✅ prevent hanging
      }
    );

    console.log("✅ AI response received");

    let text = response.data.choices[0].message.content;

    // 🧠 Clean response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON Parse Error:", text);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }

    console.log("💾 Saving to Supabase...");

    // 💾 Save data (optional but useful)
    const { error: dbError } = await supabase.from("plans").insert([
      {
        user_input: input,
        structured_output: parsed,
        clarity_score: parsed["Clarity Score"],
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase Error:", dbError.message);
    }

    console.log("📤 Sending response");

    res.json(parsed);

  } catch (error) {
    console.error(
      "🔥 FULL ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

// 🚀 Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});