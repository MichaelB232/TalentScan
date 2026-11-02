// src/controllers/candidate.controller.ts
// HTTP handler layer for candidate endpoints. Delegates all logic to CandidateService.

import { Request, Response } from "express";
import { candidateService } from "../services/candidate.service";

export const candidateController = {
  /**
   * upload
   * Handles multipart/form-data PDF upload, triggers AI extraction.
   * POST /api/candidates/upload
   */
  async upload(req: Request, res: Response) {
    const file = req.file!;
    const result = await candidateService.uploadAndExtract(file);
    res.status(201).json({ success: true, data: result });
  },

  /**
   * getAll
   * Returns a paginated-ready list of all candidates.
   * GET /api/candidates
   */
  async getAll(_req: Request, res: Response) {
    const candidates = await candidateService.getAllCandidates();
    res.json({ success: true, data: candidates });
  },

  /**
   * getOne
   * Returns a single candidate with full extraction data.
   * GET /api/candidates/:id
   */
  async getOne(req: Request, res: Response) {
    const candidate = await candidateService.getCandidate(req.params.id);
    res.json({ success: true, data: candidate });
  },

  /**
   * remove
   * Deletes a candidate and all associated analyses.
   * DELETE /api/candidates/:id
   */
  async remove(req: Request, res: Response) {
    await candidateService.deleteCandidate(req.params.id);
    res.json({ success: true, message: "Candidate deleted." });
  },
};
