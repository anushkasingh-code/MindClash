import {
  GoogleGenerativeAI,
  type Content,
} from "@google/generative-ai";

/** Current Gemini API — 1.5 models are retired; use a supported flash model */
const DEBATE_MODEL = "gemini-2.5-flash-lite";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function asSystemInstruction(text: string): Content {
  return {
    role: "user",
    parts: [{ text }],
  };
}

export const getDebateModel = () =>
  genAI.getGenerativeModel({
    model: DEBATE_MODEL,
    generationConfig: { temperature: 0.9, maxOutputTokens: 350 },
  });

export const getRefereeModel = () =>
  genAI.getGenerativeModel({
    model: DEBATE_MODEL,
    generationConfig: { temperature: 0.2, maxOutputTokens: 250 },
  });
