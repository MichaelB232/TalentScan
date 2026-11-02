// src/utils/pdfParser.ts
// Extracts plain text from a PDF Buffer using pdf-parse.

import pdfParse from "pdf-parse";

/**
 * parsePdf
 * Converts a raw PDF Buffer into plain text string.
 * Called by: CandidateService.uploadAndExtract
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}
