// src/repositories/jobDescription.repository.ts
// All database operations for the JobDescription model.

import prisma from "../config/prisma";

export const jobDescriptionRepository = {
  /**
   * create
   * Inserts a new Job Description record.
   * POST /api/job-descriptions
   */
  async create(data: { title: string; description: string }) {
    return prisma.jobDescription.create({ data });
  },

  /**
   * findById
   * Fetches a Job Description by its primary key.
   * GET /api/job-descriptions/:id
   */
  async findById(id: string) {
    return prisma.jobDescription.findUnique({ where: { id } });
  },

  /**
   * findAll
   * Lists all Job Descriptions newest-first.
   * GET /api/job-descriptions
   */
  async findAll() {
    return prisma.jobDescription.findMany({ orderBy: { createdAt: "desc" } });
  },

  /**
   * deleteById
   * Removes a Job Description (cascades to AnalysisResult).
   * DELETE /api/job-descriptions/:id
   */
  async deleteById(id: string) {
    return prisma.jobDescription.delete({ where: { id } });
  },
};
