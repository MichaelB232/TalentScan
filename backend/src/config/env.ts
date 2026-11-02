// src/config/env.ts
// Loads and validates required environment variables at startup.

import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "5000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim()),
};
