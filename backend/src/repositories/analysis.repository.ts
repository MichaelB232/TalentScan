// src/repositories/analysis.repository.ts
// All database operations for the AnalysisResult model.

import prisma from "../config/prisma";

export const analysisRepository = {
  /**
   * create
   * Persists a new analysis result linking a candidate to a JD.
   * POST /api/analysis (called from AnalysisService)
   */
  async create(data: {
    candidateId: string;
    jobDescriptionId: string;
    matchScore: number;
    executiveSummary: string;
    skillGaps: string[];
  }) {
    return prisma.analysisResult.create({
      data: {
        ...data,
        skillGaps: data.skillGaps as object[],
      },
      include: { candidate: true, jobDescription: true },
    });
  },

  /**
   * findById
   * Retrieves a single analysis result with its candidate and JD relations.
   * GET /api/analysis/:id
   */
  async findById(id: string) {
    return prisma.analysisResult.findUnique({
      where: { id },
      include: { candidate: true, jobDescription: true },
    });
  },

  /**
   * findByCandidateId
   * Lists all analyses for a specific candidate.
   * GET /api/candidates/:id/analyses
   */
  async findByCandidateId(candidateId: string) {
    return prisma.analysisResult.findMany({
      where: { candidateId },
      orderBy: { createdAt: "desc" },
      include: { jobDescription: { select: { id: true, title: true } } },
    });
  },
};
