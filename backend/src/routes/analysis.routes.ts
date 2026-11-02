// src/routes/analysis.routes.ts
// RESTful routes for running and retrieving analysis results.

import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller";

const router = Router();

// POST   /api/analysis               – Run a new JD match analysis
router.post("/", analysisController.run);

// GET    /api/analysis/:id           – Get a single analysis result
router.get("/:id", analysisController.getOne);

export default router;
