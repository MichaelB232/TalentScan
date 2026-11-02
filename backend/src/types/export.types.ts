// src/types/export.types.ts
// Types for the multi-format export feature.

export type ExportFormat = "json" | "csv" | "pdf";

export interface ExportRequest {
  candidateId: string;
  format: ExportFormat;
}
