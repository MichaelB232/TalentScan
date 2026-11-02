// tests/analysis.test.ts
// Tests for the analysis (JD matching) endpoints.

import request from "supertest";
import app from "../src/app";

const mockExtraction = {
  fullName: "Budi",
  skills: { hardSkills: ["React"], softSkills: [] },
  workExperience: [],
  education: [],
};

jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    candidate: { findUnique: jest.fn() },
    jobDescription: { findUnique: jest.fn() },
    analysisResult: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
  },
}));

jest.mock("../src/config/gemini", () => ({
  geminiModel: {
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            matchScore: 80,
            executiveSummary: "Great candidate for the role.",
            skillGaps: ["Docker", "Kubernetes"],
          }),
      },
    }),
  },
}));

import prisma from "../src/config/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("POST /api/analysis", () => {
  it("runs analysis and returns 201", async () => {
    (mockPrisma.candidate.findUnique as jest.Mock).mockResolvedValue({
      id: "cand-1",
      extraction: mockExtraction,
    });
    (mockPrisma.jobDescription.findUnique as jest.Mock).mockResolvedValue({
      id: "jd-1",
      title: "Backend Engineer",
      description: "Requires Docker, Kubernetes, React.",
    });
    (mockPrisma.analysisResult.create as jest.Mock).mockResolvedValue({
      id: "analysis-1",
      candidateId: "cand-1",
      jobDescriptionId: "jd-1",
      matchScore: 80,
      executiveSummary: "Great candidate for the role.",
      skillGaps: ["Docker", "Kubernetes"],
      createdAt: new Date(),
    });

    const res = await request(app)
      .post("/api/analysis")
      .send({ candidateId: "cand-1", jobDescriptionId: "jd-1" });

    expect(res.status).toBe(201);
    expect(res.body.data.matchScore).toBe(80);
    expect(res.body.data.skillGaps).toContain("Docker");
  });

  it("returns 404 when candidate does not exist", async () => {
    (mockPrisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/analysis")
      .send({ candidateId: "unknown", jobDescriptionId: "jd-1" });

    expect(res.status).toBe(404);
  });
});
