// tests/jobDescription.test.ts
// Unit tests for the Job Description endpoints.

import request from "supertest";
import app from "../src/app";

jest.mock("../src/config/prisma", () => ({
  __esModule: true,
  default: {
    jobDescription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "../src/config/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const sampleJD = {
  id: "jd-1",
  title: "Backend Engineer",
  description: "Node.js, TypeScript, PostgreSQL required.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("POST /api/job-descriptions", () => {
  it("creates a JD and returns 201", async () => {
    (mockPrisma.jobDescription.create as jest.Mock).mockResolvedValue(sampleJD);

    const res = await request(app).post("/api/job-descriptions").send({
      title: sampleJD.title,
      description: sampleJD.description,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Backend Engineer");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/job-descriptions")
      .send({ description: "Some description" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/job-descriptions", () => {
  it("returns an array", async () => {
    (mockPrisma.jobDescription.findMany as jest.Mock).mockResolvedValue([sampleJD]);

    const res = await request(app).get("/api/job-descriptions");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("DELETE /api/job-descriptions/:id", () => {
  it("deletes and returns success", async () => {
    (mockPrisma.jobDescription.findUnique as jest.Mock).mockResolvedValue(sampleJD);
    (mockPrisma.jobDescription.delete as jest.Mock).mockResolvedValue(sampleJD);

    const res = await request(app).delete("/api/job-descriptions/jd-1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
