// src/controllers/analysis.controller.ts
// HTTP handler layer for analysis (JD matching) endpoints.

import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service";

export const analysisController = {
  /**
   * run
   * Triggers AI matching between a candidate and a job description.
   * POST /api/analysis  →  body: { candidateId, jobDescriptionId }
   */
  async run(req: Request, res: Response) {
    const { candidateId, jobDescriptionId } = req.body;
    const result = await analysisService.runAnalysis(candidateId, jobDescriptionId);
    res.status(201).json({ success: true, data: result });
  },

  /**
   * getOne
   * Returns a single analysis result by ID.
   * GET /api/analysis/:id
   */
  async getOne(req: Request, res: Response) {
    const result = await analysisService.getAnalysis(req.params.id);
    res.json({ success: true, data: result });
  },

  /**
   * getByCandidateId
   * Returns all analysis results for a given candidate.
   * GET /api/candidates/:id/analyses
   */
  async getByCandidateId(req: Request, res: Response) {
    const results = await analysisService.getAnalysesForCandidate(req.params.id);
    res.json({ success: true, data: results });
  },
};
