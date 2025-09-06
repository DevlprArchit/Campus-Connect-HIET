// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [] } = req.body;

    // Choose the model you have access to; gpt-4o-mini is fast+cheap; if you have GPT-5, swap the model
    // Using the Responses API is the current recommended path.
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        // If you have access: model: "gpt-5-mini",
        input: [
          { role: "system", content: "You are HIET campus assistant. Keep answers short and helpful. Be polite." },
          ...messages
        ],
        temperature: 0.3
      })
    });

    if(!resp.ok){
      const t = await resp.text();
      console.error("OpenAI error:", t);
      return res.status(500).json({ error: "OpenAI API error", detail: t });
    }

    const json = await resp.json();
    // Responses API: text is typically at json.output_text
    const reply = json.output_text ?? json.choices?.[0]?.message?.content ?? "I couldn't generate a reply.";
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
OPENAI_API_KEY=YOUR_REAL_KEY_HERE
PORT=3000
