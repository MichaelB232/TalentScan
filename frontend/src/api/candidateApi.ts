// src/api/candidateApi.ts
// All API calls related to Candidates.

import api from "./axiosInstance";
import { Candidate, CVExtraction, ExportFormat } from "@/types";

/** Upload a PDF CV and get the extraction result. */
export async function uploadCV(file: File): Promise<{ candidateId: string; extraction: CVExtraction }> {
  const form = new FormData();
  form.append("cv", file);
  const res = await api.post<{ success: true; data: { candidateId: string; extraction: CVExtraction } }>(
    "/candidates/upload",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data;
}

/** Fetch all candidates (list view). */
export async function getCandidates(): Promise<Candidate[]> {
  const res = await api.get<{ success: true; data: Candidate[] }>("/candidates");
  return res.data.data;
}

/** Fetch a single candidate with full extraction. */
export async function getCandidate(id: string): Promise<Candidate> {
  const res = await api.get<{ success: true; data: Candidate }>(`/candidates/${id}`);
  return res.data.data;
}

/** Delete a candidate. */
export async function deleteCandidate(id: string): Promise<void> {
  await api.delete(`/candidates/${id}`);
}

/** Trigger a file download for a given export format. */
export function downloadExport(candidateId: string, format: ExportFormat): void {
  // Open as a browser download via window.location
  window.open(`/api/candidates/${candidateId}/export?format=${format}`, "_blank");
}
