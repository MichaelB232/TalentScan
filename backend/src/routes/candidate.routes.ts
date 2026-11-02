// src/routes/candidate.routes.ts
// RESTful routes for Candidate (CV upload & management).

import { Router } from "express";
import { candidateController } from "../controllers/candidate.controller";
import { analysisController } from "../controllers/analysis.controller";
import { exportController } from "../controllers/export.controller";
import { uploadMiddleware } from "../middlewares/multer.middleware";

const router = Router();

// POST   /api/candidates/upload       – Upload & extract a PDF CV
router.post("/upload", uploadMiddleware, candidateController.upload);

// GET    /api/candidates              – List all candidates
router.get("/", candidateController.getAll);

// GET    /api/candidates/:id          – Get single candidate with extraction
router.get("/:id", candidateController.getOne);

// DELETE /api/candidates/:id          – Delete candidate + analyses
router.delete("/:id", candidateController.remove);

// GET    /api/candidates/:id/analyses – All analyses for a candidate
router.get("/:id/analyses", analysisController.getByCandidateId);

// GET    /api/candidates/:id/export?format=json|csv|pdf – Download extraction
router.get("/:id/export", exportController.export);

export default router;
