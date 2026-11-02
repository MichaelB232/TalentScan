// src/config/gemini.ts
// Initializes and exports the Google Gemini generative model client.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

// We use gemini-1.5-flash for fast, cost-effective extraction tasks.
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
