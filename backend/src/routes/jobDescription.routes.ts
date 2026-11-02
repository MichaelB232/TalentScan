// src/routes/jobDescription.routes.ts
// RESTful routes for Job Descriptions.

import { Router } from "express";
import { jobDescriptionController } from "../controllers/jobDescription.controller";

const router = Router();

// POST   /api/job-descriptions        – Create a new JD
router.post("/", jobDescriptionController.create);

// GET    /api/job-descriptions        – List all JDs
router.get("/", jobDescriptionController.getAll);

// GET    /api/job-descriptions/:id    – Get single JD
router.get("/:id", jobDescriptionController.getOne);

// DELETE /api/job-descriptions/:id    – Delete JD
router.delete("/:id", jobDescriptionController.remove);

export default router;
