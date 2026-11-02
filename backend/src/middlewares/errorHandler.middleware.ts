// src/middlewares/errorHandler.middleware.ts
// Global Express error handler. Catches all errors thrown in controllers/services.

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known operational error (safe to expose message to client)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Unknown / unexpected errors (don't leak details in production)
  console.error("[Unhandled Error]", err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Internal server error." : err.message,
  });
}
