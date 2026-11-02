// src/services/export.service.ts
// Handles multi-format export (JSON, CSV/Excel, PDF) for a candidate's extraction.

import { candidateRepository } from "../repositories/candidate.repository";
import { toJsonBuffer, toCsvBuffer, toPdfBuffer } from "../utils/exportHelpers";
import { CVExtraction } from "../types/candidate.types";
import { ExportFormat } from "../types/export.types";
import { NotFoundError, ValidationError, AIServiceError } from "../errors/AppError";

export const exportService = {
  /**
   * exportCandidate
   * Retrieves a candidate's extraction, converts it to the requested format,
   * and returns the buffer with appropriate content-type and filename.
   * GET /api/candidates/:id/export?format=json|csv|pdf  →  ExportController.export
   */
  async exportCandidate(
    candidateId: string,
    format: ExportFormat
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const candidate = await candidateRepository.findById(candidateId);
    if (!candidate) throw new NotFoundError("Candidate");
    if (!candidate.extraction) {
      throw new AIServiceError("Candidate has no extraction data to export.");
    }

    const extraction = candidate.extraction as unknown as CVExtraction;
    const baseName = candidate.fileName.replace(/\.pdf$/i, "");

    switch (format) {
      case "json": {
        return {
          buffer: toJsonBuffer(extraction),
          contentType: "application/json",
          filename: `${baseName}_extraction.json`,
        };
      }
      case "csv": {
        const buffer = await toCsvBuffer(extraction);
        return {
          buffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          filename: `${baseName}_extraction.xlsx`,
        };
      }
      case "pdf": {
        const buffer = await toPdfBuffer(extraction);
        return {
          buffer,
          contentType: "application/pdf",
          filename: `${baseName}_resume.pdf`,
        };
      }
      default:
        throw new ValidationError("Invalid export format. Use: json, csv, or pdf.");
    }
  },
};
