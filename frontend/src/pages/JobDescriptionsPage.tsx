// src/pages/JobDescriptionsPage.tsx
// CRUD page for managing Job Descriptions used in JD matching.

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getJobDescriptions,
  createJobDescription,
  deleteJobDescription,
} from "@/api/jobDescriptionApi";
import { JobDescription } from "@/types";
import { Trash2, Plus, FileText } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

export default function JobDescriptionsPage() {
  const [jobs, setJobs]       = useState<JobDescription[]>([]);
  const [title, setTitle]     = useState("");
  const [desc, setDesc]       = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getJobDescriptions()
      .then(setJobs)
      .catch(() => toast.error("Failed to load job descriptions."))
      .finally(() => setFetching(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const created = await createJobDescription(title.trim(), desc.trim());
      setJobs((prev) => [created, ...prev]);
      setTitle("");
      setDesc("");
      toast.success("Job description created!");
    } catch {
      toast.error("Failed to create job description.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job description?")) return;
    try {
      await deleteJobDescription(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Job Descriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage JDs used for AI-powered candidate matching.</p>
      </div>

      {/* Create form */}
      <section className="card">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-blue" /> New Job Description
        </h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            placeholder="Job Title (e.g. Senior Backend Engineer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <textarea
            placeholder="Paste the full job description here…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-y"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Spinner size={16} /> : <Plus className="w-4 h-4" />}
              Create
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      {fetching ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <FileText className="w-14 h-14 mx-auto mb-3" />
          <p className="text-sm font-medium">No job descriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="card flex justify-between items-start gap-4 animate-slide-up">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{j.title}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{j.description}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(j.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(j.id)}
                className="text-gray-300 hover:text-red-500 transition-colors mt-1"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
