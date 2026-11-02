// tests/candidate.test.ts
// Integration tests for the Candidate endpoints using supertest.
// Prisma and Gemini are mocked to keep tests fast and isolated.

import request from "supertest";
import app from "../src/app";

// ── Mock Prisma ──────────────────────────────────────────────────────────────
jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    candidate: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// ── Mock Gemini model ────────────────────────────────────────────────────────
jest.mock("../src/config/gemini", () => ({
  geminiModel: {
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            fullName: "Budi Santoso",
            dateOfBirth: "1995-03-12",
            phone: "+628123456789",
            email: "budi@example.com",
            address: "Jakarta",
            linkedIn: null,
            summary: "Experienced software engineer",
            totalExperienceYears: 3,
            workExperience: [],
            education: [],
            skills: { hardSkills: ["React", "Node.js"], softSkills: ["Leadership"] },
            certifications: [],
            languages: ["Indonesian"],
            detectedLanguage: "id",
          }),
      },
    }),
  },
}));

// ── Mock pdf-parse ───────────────────────────────────────────────────────────
jest.mock("pdf-parse", () =>
  jest.fn().mockResolvedValue({ text: "Budi Santoso – Software Engineer" })
);

import prisma from "../src/config/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("GET /health", () => {
  it("returns status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/candidates/upload", () => {
  beforeEach(() => {
    (mockPrisma.candidate.create as jest.Mock).mockResolvedValue({
      id: "cand-1",
      fileName: "cv.pdf",
      fileSize: 1024,
      mimeType: "application/pdf",
      rawText: "Budi Santoso",
      extraction: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    (mockPrisma.candidate.update as jest.Mock).mockResolvedValue({});
  });

  it("returns 201 with extraction on valid PDF", async () => {
    const res = await request(app)
      .post("/api/candidates/upload")
      .attach("cv", Buffer.from("%PDF-1.4 fake content"), {
        filename: "cv.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.candidateId).toBe("cand-1");
  });

  it("returns 415 when uploading a non-PDF file", async () => {
    const res = await request(app)
      .post("/api/candidates/upload")
      .attach("cv", Buffer.from("hello"), {
        filename: "cv.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(415);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/candidates", () => {
  it("returns a list of candidates", async () => {
    (mockPrisma.candidate.findMany as jest.Mock).mockResolvedValue([
      { id: "cand-1", fileName: "cv.pdf", fileSize: 1024, createdAt: new Date(), extraction: null },
    ]);

    const res = await request(app).get("/api/candidates");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/candidates/:id", () => {
  it("returns 404 for unknown id", async () => {
    (mockPrisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get("/api/candidates/nonexistent");
    expect(res.status).toBe(404);
  });
});
