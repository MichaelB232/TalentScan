// src/types/candidate.types.ts
// All TypeScript interfaces related to CV extraction and candidates.

// ──────────────────────────────────────────────
// Raw Structured Extraction from Gemini AI
// ──────────────────────────────────────────────

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;  // YYYY-MM or YYYY-MM-DD
  endDate: string | "Present";
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
  // Personal info
  fullName: string;
  dateOfBirth: string | null;    // normalized to YYYY-MM-DD
  phone: string | null;          // normalized to +62... format
  email: string | null;
  address: string | null;
  linkedIn: string | null;

  // Professional profile
  summary: string | null;
  totalExperienceYears: number;
  workExperience: WorkExperience[];
  education: Education[];
  skills: CategorizedSkills;
  certifications: string[];
  languages: string[];

  // Meta
  detectedLanguage: "id" | "en" | "other";
}

// ──────────────────────────────────────────────
// API Request / Response shapes
// ──────────────────────────────────────────────

export interface UploadCVResponse {
  candidateId: string;
  extraction: CVExtraction;
  message: string;
}

export interface GetCandidateResponse {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  extraction: CVExtraction | null;
}
