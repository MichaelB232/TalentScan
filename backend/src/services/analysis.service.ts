// src/services/analysis.service.ts
// Business logic for JD matching, executive summary, and skill gap analysis.

import { analysisRepository } from "../repositories/analysis.repository";
import { candidateRepository } from "../repositories/candidate.repository";
import { jobDescriptionRepository } from "../repositories/jobDescription.repository";
import { geminiModel } from "../config/gemini";
import { parseGeminiJson } from "../utils/geminiParser";
import { CVExtraction } from "../types/candidate.types";
import { AIServiceError, NotFoundError } from "../errors/AppError";

// ──────────────────────────────────────────────
// Gemini prompt for JD matching analysis
// ──────────────────────────────────────────────
function buildAnalysisPrompt(extraction: CVExtraction, jdTitle: string, jdText: string): string {
  return `
You are a senior technical recruiter AI. Given the structured candidate profile and a job description, perform a complete analysis.

Return ONLY a valid JSON object with NO markdown and NO explanation using this exact schema:
{
  "matchScore": number (0-100, integer),
  "executiveSummary": string (2-3 sentences about the candidate's fit),
  "skillGaps": string[] (list of skills/qualifications missing compared to the JD)
}

CANDIDATE PROFILE:
${JSON.stringify(extraction, null, 2)}

JOB TITLE: ${jdTitle}
JOB DESCRIPTION:
"""
${jdText}
"""
`.trim();
}

export const analysisService = {
  /**
   * runAnalysis
   * Fetches candidate + JD from DB, sends both to Gemini for scoring,
   * persists and returns the AnalysisResult.
   * POST /api/analysis  →  AnalysisController.run
   */
  async runAnalysis(candidateId: string, jobDescriptionId: string) {
    // Fetch candidate
    const candidate = await candidateRepository.findById(candidateId);
    if (!candidate) throw new NotFoundError("Candidate");
    if (!candidate.extraction) {
      throw new AIServiceError("Candidate has no extraction data yet.");
    }

    // Fetch JD
    const jd = await jobDescriptionRepository.findById(jobDescriptionId);
    if (!jd) throw new NotFoundError("JobDescription");

    const extraction = candidate.extraction as unknown as CVExtraction;

    // Ask Gemini AI
    const prompt = buildAnalysisPrompt(extraction, jd.title, jd.description);
    let matchScore: number;
    let executiveSummary: string;
    let skillGaps: string[];

    try {
      const result = await geminiModel.generateContent(prompt);
      const raw = result.response.text();
      const parsed = parseGeminiJson<{
        matchScore: number;
        executiveSummary: string;
        skillGaps: string[];
      }>(raw, "JD analysis");
      matchScore = parsed.matchScore;
      executiveSummary = parsed.executiveSummary;
      skillGaps = parsed.skillGaps;
    } catch (err) {
      if (err instanceof AIServiceError) throw err;
      throw new AIServiceError(`Gemini request failed: ${(err as Error).message}`);
    }

    // Persist result
    const analysis = await analysisRepository.create({
      candidateId,
      jobDescriptionId,
      matchScore,
      executiveSummary,
      skillGaps,
    });

    return analysis;
  },

  /**
   * getAnalysis
   * Retrieves a single analysis result by ID.
   * GET /api/analysis/:id  →  AnalysisController.getOne
   */
  async getAnalysis(id: string) {
    const result = await analysisRepository.findById(id);
    if (!result) throw new NotFoundError("AnalysisResult");
    return result;
  },

  /**
   * getAnalysesForCandidate
   * Returns all analyses run for a given candidate.
   * GET /api/candidates/:id/analyses  →  AnalysisController.getByCandidateId
   */
  async getAnalysesForCandidate(candidateId: string) {
    const candidate = await candidateRepository.findById(candidateId);
    if (!candidate) throw new NotFoundError("Candidate");
    return analysisRepository.findByCandidateId(candidateId);
  },
};
