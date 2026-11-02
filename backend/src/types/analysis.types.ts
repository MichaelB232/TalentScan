// src/types/analysis.types.ts
// TypeScript interfaces for Job Description matching and analysis.

export interface CreateJobDescriptionBody {
  title: string;
  description: string;
}

export interface JobDescriptionResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface RunAnalysisBody {
  candidateId: string;
  jobDescriptionId: string;
}

export interface AnalysisResultResponse {
  id: string;
  candidateId: string;
  jobDescriptionId: string;
  matchScore: number;          // 0–100
  executiveSummary: string;
  skillGaps: string[];
  createdAt: string;
}
