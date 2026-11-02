// src/utils/geminiParser.ts
// Robustly extracts and parses a JSON object from a Gemini response string.
// Handles: raw JSON, ```json ... ```, ``` ... ```, leading/trailing prose.

import { AIServiceError } from "../errors/AppError";

/**
 * parseGeminiJson<T>
 * Strips any markdown code fences or surrounding prose from a Gemini response
 * and returns the parsed JSON. Logs the raw response on failure to aid debugging.
 */
export function parseGeminiJson<T>(raw: string, context: string): T {
  // Strategy 1: extract the first {...} block (handles leading/trailing prose)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch {
      // fall through to strategy 2
    }
  }

  // Strategy 2: strip markdown fences then parse
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(stripped) as T;
  } catch (err) {
    // Log the raw Gemini output so it's visible in container logs
    console.error(`[Gemini parse error – ${context}] Raw response:\n`, raw);
    throw new AIServiceError(
      `Could not parse ${context} response from Gemini. Check container logs for the raw output.`
    );
  }
}
