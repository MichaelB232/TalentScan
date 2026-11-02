// src/api/jobDescriptionApi.ts
// API calls for Job Description CRUD.

import api from "./axiosInstance";
import { JobDescription } from "@/types";

/** Create a new Job Description. */
export async function createJobDescription(
  title: string,
  description: string
): Promise<JobDescription> {
  const res = await api.post<{ success: true; data: JobDescription }>("/job-descriptions", {
    title,
    description,
  });
  return res.data.data;
}

/** List all Job Descriptions. */
export async function getJobDescriptions(): Promise<JobDescription[]> {
  const res = await api.get<{ success: true; data: JobDescription[] }>("/job-descriptions");
  return res.data.data;
}

/** Delete a Job Description by ID. */
export async function deleteJobDescription(id: string): Promise<void> {
  await api.delete(`/job-descriptions/${id}`);
}
