// src/services/candidate.service.ts
// Business logic for uploading and extracting information from CVs.

import { candidateRepository } from "../repositories/candidate.repository";
import { parsePdf } from "../utils/pdfParser";
import { geminiModel } from "../config/gemini";
import { CVExtraction } from "../types/candidate.types";
import { AIServiceError, NotFoundError, UnsupportedFileError } from "../errors/AppError";

// ──────────────────────────────────────────────
// Gemini prompt for structured CV extraction
// ──────────────────────────────────────────────
function buildExtractionPrompt(rawText: string): string {
  return `
You are an expert HR data extraction AI. Extract structured information from the following CV text.
Automatically detect whether the CV is in Bahasa Indonesia or English (set detectedLanguage accordingly).

NORMALIZATION RULES:
- dateOfBirth: convert any format to YYYY-MM-DD (e.g. "12 Maret 1995" → "1995-03-12")
- phone: normalize to international +62 format for Indonesian numbers
- Work experience dates (startDate/endDate): use YYYY-MM format
- If a field is missing, use null for strings and [] for arrays

Return ONLY a valid JSON object with NO markdown, NO explanation. Use this exact schema:
{
  "fullName": string,
  "dateOfBirth": string | null,
  "phone": string | null,
  "email": string | null,
  "address": string | null,
  "linkedIn": string | null,
  "summary": string | null,
  "totalExperienceYears": number,
  "workExperience": [
    {
      "company": string,
      "position": string,
      "startDate": string,
      "endDate": string,
      "description": string
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "field": string,
      "graduationYear": string
    }
  ],
  "skills": {
    "hardSkills": string[],
    "softSkills": string[]
  },
  "certifications": string[],
  "languages": string[],
  "detectedLanguage": "id" | "en" | "other"
}

CV TEXT:
"""
${rawText}
"""
`.trim();
}

export const candidateService = {
  /**
   * uploadAndExtract
   * Accepts a PDF buffer, extracts raw text, sends to Gemini for structured extraction,
   * and persists both raw text + extraction to the database.
   * POST /api/candidates/upload  →  CandidateController.upload
   */
  async uploadAndExtract(file: Express.Multer.File) {
    // Validate mime type
    if (file.mimetype !== "application/pdf") {
      throw new UnsupportedFileError();
    }

    // 1. Parse PDF → raw text
    const rawText = await parsePdf(file.buffer);

    // 2. Create candidate record (no extraction yet)
    const candidate = await candidateRepository.create({
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      rawText,
    });

    // 3. Ask Gemini AI to extract structured data
    const prompt = buildExtractionPrompt(rawText);
    let extraction: CVExtraction;
    try {
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text().trim();
      // Strip potential markdown code fences Gemini sometimes adds
      const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
      extraction = JSON.parse(clean) as CVExtraction;
    } catch (err) {
      throw new AIServiceError("Failed to parse extraction response from Gemini.");
    }

    // 4. Save extraction result
    const updated = await candidateRepository.updateExtraction(candidate.id, extraction);

    return { candidateId: candidate.id, extraction, message: "CV extracted successfully." };
  },

  /**
   * getCandidate
   * Fetches a single candidate by ID.
   * GET /api/candidates/:id  →  CandidateController.getOne
   */
  async getCandidate(id: string) {
    const candidate = await candidateRepository.findById(id);
    if (!candidate) throw new NotFoundError("Candidate");
    return candidate;
  },

  /**
   * getAllCandidates
   * Returns a list of all candidates (without raw text for performance).
   * GET /api/candidates  →  CandidateController.getAll
   */
  async getAllCandidates() {
    return candidateRepository.findAll();
  },

  /**
   * deleteCandidate
   * Deletes a candidate and all their analyses.
   * DELETE /api/candidates/:id  →  CandidateController.delete
   */
  async deleteCandidate(id: string) {
    const candidate = await candidateRepository.findById(id);
    if (!candidate) throw new NotFoundError("Candidate");
    await candidateRepository.deleteById(id);
  },
};
