// src/services/jobDescription.service.ts
// Business logic for managing Job Descriptions.

import { jobDescriptionRepository } from "../repositories/jobDescription.repository";
import { NotFoundError, ValidationError } from "../errors/AppError";

export const jobDescriptionService = {
  /**
   * createJobDescription
   * Validates and creates a new JD record in the database.
   * POST /api/job-descriptions  →  JobDescriptionController.create
   */
  async createJobDescription(title: string, description: string) {
    if (!title?.trim()) throw new ValidationError("Job title is required.");
    if (!description?.trim()) throw new ValidationError("Job description is required.");
    return jobDescriptionRepository.create({ title: title.trim(), description: description.trim() });
  },

  /**
   * getJobDescription
   * Fetches a single JD or throws 404.
   * GET /api/job-descriptions/:id  →  JobDescriptionController.getOne
   */
  async getJobDescription(id: string) {
    const jd = await jobDescriptionRepository.findById(id);
    if (!jd) throw new NotFoundError("JobDescription");
    return jd;
  },

  /**
   * getAllJobDescriptions
   * Lists all JDs.
   * GET /api/job-descriptions  →  JobDescriptionController.getAll
   */
  async getAllJobDescriptions() {
    return jobDescriptionRepository.findAll();
  },

  /**
   * deleteJobDescription
   * Deletes a JD by ID.
   * DELETE /api/job-descriptions/:id  →  JobDescriptionController.delete
   */
  async deleteJobDescription(id: string) {
    const jd = await jobDescriptionRepository.findById(id);
    if (!jd) throw new NotFoundError("JobDescription");
    return jobDescriptionRepository.deleteById(id);
  },
};
