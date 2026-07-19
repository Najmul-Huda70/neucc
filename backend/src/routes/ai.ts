import { Router } from "express";
import { streamText, pipeUIMessageStreamToResponse, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { requireAuth } from "../middleware/requireAuth.js";

export const aiRouter = Router();

const geminiApiKey =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey,
});

// POST /api/ai/chat — uses the UI Message Stream protocol required by @ai-sdk/react v4 useChat
aiRouter.post("/chat", requireAuth, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: "Messages array is required." });
    }

    const result = streamText({
      model: google("gemini-3.5-flash"),
      system:
        "You are a helpful and professional AI assistant for the NEUCC (North East University Computer Club). " +
        "You help students with tech questions, event info, club activities, programming problems, and general guidance. " +
        "Keep responses concise, friendly, and relevant to university life and computer science.",
      messages: await convertToModelMessages(messages),
    });

    // Use pipeUIMessageStreamToResponse for AI SDK v4 compatibility with useChat hook
    pipeUIMessageStreamToResponse({
      response: res,
      stream: result.toUIMessageStream(),
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: "Failed to generate AI response." });
    }
  }
});

// POST /api/ai/generate — uses plain text streaming for useCompletion hook
aiRouter.post("/generate", requireAuth, async (req, res) => {
  try {
    const { topic, tone, length, contentType } = req.body;

    if (!topic || !contentType) {
      return res.status(400).json({ ok: false, error: "Topic and Content Type are required." });
    }

    const prompt = `You are a professional content writer for the NEUCC (North East University Computer Club).

Write a ${length || "medium length (around 300 words)"} ${contentType} with the following specifications:
- Topic/Subject: ${topic}
- Tone: ${tone || "Professional"}
- Audience: University students interested in technology and computer science
- Context: This content is for a university computer club (NEUCC)

Requirements:
- Make it engaging, well-structured, and relevant
- Use appropriate formatting (headings, bullet points) where it enhances readability
- Be informative and authentic

Now write the ${contentType}:`;

    const result = streamText({
      model: google("gemini-3.5-flash"),
      prompt,
    });

    // 💡 এখানে চ্যাটের মতো লেটেস্ট UIMessageStream প্রোটোকল ব্যবহার করা হলো
    pipeUIMessageStreamToResponse({
      response: res,
      stream: result.toUIMessageStream(),
    });
  } catch (error) {
    console.error("AI Generate Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: "Failed to generate content." });
    }
  }
});