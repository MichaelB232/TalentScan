// src/types/index.ts
// Shared TypeScript types mirroring the backend shapes.

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface CategorizedSkills {
  hardSkills: string[];
  softSkills: string[];
}

export interface CVExtraction {
  fullName: string;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  linkedIn: string | null;
  summary: string | null;
  totalExperienceYears: number;
  workExperience: WorkExperience[];
  education: Education[];
  skills: CategorizedSkills;
  certifications: string[];
  languages: string[];
  detectedLanguage: "id" | "en" | "other";
}

export interface Candidate {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  extraction: CVExtraction | null;
}

export interface JobDescription {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  candidateId: string;
  jobDescriptionId: string;
  matchScore: number;
  executiveSummary: string;
  skillGaps: string[];
  createdAt: string;
  jobDescription?: { id: string; title: string };
}

export type ExportFormat = "json" | "csv" | "pdf";
