// src/repositories/candidate.repository.ts
// All database operations for the Candidate model via Prisma.

import prisma from "../config/prisma";
import { CVExtraction } from "../types/candidate.types";

export const candidateRepository = {
  /**
   * createCandidate
   * Persists a new candidate record with raw text; extraction is null initially.
   * POST /api/candidates (called from CandidateService)
   */
  async create(data: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    rawText: string;
  }) {
    return prisma.candidate.create({ data });
  },

  /**
   * updateExtraction
   * Saves the structured extraction JSON result back to the candidate record.
   * Called after Gemini processes the raw text.
   */
  async updateExtraction(id: string, extraction: CVExtraction) {
    return prisma.candidate.update({
      where: { id },
      data: { extraction: extraction as object },
    });
  },

  /**
   * findById
   * Retrieves a single candidate by primary key.
   * GET /api/candidates/:id
   */
  async findById(id: string) {
    return prisma.candidate.findUnique({ where: { id } });
  },

  /**
   * findAll
   * Retrieves all candidates ordered by newest first.
   * GET /api/candidates
   */
  async findAll() {
    return prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        extraction: true,
      },
    });
  },

  /**
   * deleteById
   * Hard-deletes a candidate and its associated analyses (cascade).
   * DELETE /api/candidates/:id
   */
  async deleteById(id: string) {
    return prisma.candidate.delete({ where: { id } });
  },
};
