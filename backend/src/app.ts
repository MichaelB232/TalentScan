// src/app.ts
// Express application factory. Does NOT call listen() – imported by server.ts and tests.

import "express-async-errors"; // must be first to patch async error propagation
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import candidateRoutes from "./routes/candidate.routes";
import jobDescriptionRoutes from "./routes/jobDescription.routes";
import analysisRoutes from "./routes/analysis.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// ──────────────────────────────────────────────
// Security & logging middlewares
// ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.allowedOrigins }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────
app.use("/api/candidates", candidateRoutes);
app.use("/api/job-descriptions", jobDescriptionRoutes);
app.use("/api/analysis", analysisRoutes);

// ──────────────────────────────────────────────
// Global error handler (must be last middleware)
// ──────────────────────────────────────────────
app.use(errorHandler);

export default app;
