const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// 🔐 Debug
console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY ? "Loaded ✅" : "Missing ❌");

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔥 FINAL PROMPT
const PROMPT = `
You are an AI planning assistant that converts vague user ideas into clear, structured, and actionable plans.

Your task is to analyze the user input and return ONLY valid JSON in the exact format below.

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

INSTRUCTIONS:

1. Goal:
- Extract a clear and specific goal from the input.

2. Method:
- Describe the overall approach to achieve the goal.

3. Steps:
- Provide at least 4–6 clear, logical, and ordered steps.
- If not present, intelligently generate them.

4. Timeline:
- If not mentioned, write "Missing".

5. Missing Elements:
- Goal clarity → "Clear" or explain what is vague
- Execution steps → "Present" or "Missing"
- Resources → "Mentioned" or "Not mentioned"
- Timeline → "Present" or "Missing"

6. Simplified Version:
- Rewrite the idea in one clear sentence.

7. Actionable Steps:
- Provide at least 5 practical next steps that can be executed immediately.

8. Clarity Score (0–100):
- Goal clarity (25)
- Steps present (25)
- Timeline present (25)
- Overall completeness (25)

SCORING RULES:
- Deduct points for missing or vague elements
- Do NOT return 0 unless input is completely unclear

IMPORTANT RULES:
- Output ONLY JSON
- No explanations, no markdown, no extra text
- Ensure valid JSON (no trailing commas)
`;
// 🚀 API Route
app.post("/analyze", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  try {
    // 🔥 OpenRouter API call
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
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.choices[0].message.content;

    // 🧠 Clean JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("JSON Parse Error:", text);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }

    // 💾 Store in Supabase
    const { error: dbError } = await supabase.from("plans").insert([
      {
        user_input: input,
        structured_output: parsed,
        clarity_score: parsed["Clarity Score"],
      },
    ]);

    if (dbError) {
      console.error("Supabase Error:", dbError.message);
    }

    // 📤 Send response
    res.json(parsed);

  }catch (error) {
  console.error("FULL ERROR:", error.response?.data || error.message);
  res.status(500).json({
    error: error.response?.data || error.message
  });
}
});

// 🚀 Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});