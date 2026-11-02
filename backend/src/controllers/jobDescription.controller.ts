// src/controllers/jobDescription.controller.ts
// HTTP handler layer for Job Description endpoints.

import { Request, Response } from "express";
import { jobDescriptionService } from "../services/jobDescription.service";

export const jobDescriptionController = {
  /**
   * create
   * Creates a new Job Description from JSON body { title, description }.
   * POST /api/job-descriptions
   */
  async create(req: Request, res: Response) {
    const { title, description } = req.body;
    const jd = await jobDescriptionService.createJobDescription(title, description);
    res.status(201).json({ success: true, data: jd });
  },

  /**
   * getAll
   * Lists all Job Descriptions.
   * GET /api/job-descriptions
   */
  async getAll(_req: Request, res: Response) {
    const list = await jobDescriptionService.getAllJobDescriptions();
    res.json({ success: true, data: list });
  },

  /**
   * getOne
   * Returns a single Job Description by ID.
   * GET /api/job-descriptions/:id
   */
  async getOne(req: Request, res: Response) {
    const jd = await jobDescriptionService.getJobDescription(req.params.id);
    res.json({ success: true, data: jd });
  },

  /**
   * remove
   * Deletes a Job Description.
   * DELETE /api/job-descriptions/:id
   */
  async remove(req: Request, res: Response) {
    await jobDescriptionService.deleteJobDescription(req.params.id);
    res.json({ success: true, message: "Job description deleted." });
  },
};
