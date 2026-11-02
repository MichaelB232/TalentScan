// src/controllers/export.controller.ts
// HTTP handler layer for multi-format export endpoints.

import { Request, Response } from "express";
import { exportService } from "../services/export.service";
import { ExportFormat } from "../types/export.types";

export const exportController = {
  /**
   * export
   * Generates and streams a file download (JSON / XLSX / PDF) for a candidate.
   * GET /api/candidates/:id/export?format=json|csv|pdf
   */
  async export(req: Request, res: Response) {
    const { id } = req.params;
    const format = (req.query.format as ExportFormat) ?? "json";

    const { buffer, contentType, filename } = await exportService.exportCandidate(id, format);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.end(buffer);
  },
};
