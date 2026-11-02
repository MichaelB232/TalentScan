// src/api/analysisApi.ts
// API calls for running and retrieving analysis results.

import api from "./axiosInstance";
import { AnalysisResult } from "@/types";

/** Run a JD match analysis between a candidate and a job description. */
export async function runAnalysis(
  candidateId: string,
  jobDescriptionId: string
): Promise<AnalysisResult> {
  const res = await api.post<{ success: true; data: AnalysisResult }>("/analysis", {
    candidateId,
    jobDescriptionId,
  });
  return res.data.data;
}

/** Get all analysis results for a specific candidate. */
export async function getAnalysesForCandidate(candidateId: string): Promise<AnalysisResult[]> {
  const res = await api.get<{ success: true; data: AnalysisResult[] }>(
    `/candidates/${candidateId}/analyses`
  );
  return res.data.data;
}
