// src/components/analysis/JDMatchPanel.tsx
// Allows recruiter to select a JD and run AI analysis against a candidate.

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getJobDescriptions } from "@/api/jobDescriptionApi";
import { runAnalysis, getAnalysesForCandidate } from "@/api/analysisApi";
import { AnalysisResult, JobDescription } from "@/types";
import ScoreRing from "@/components/ui/ScoreRing";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { Zap, AlertTriangle } from "lucide-react";

interface JDMatchPanelProps {
  candidateId: string;
}

export default function JDMatchPanel({ candidateId }: JDMatchPanelProps) {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available JDs and past analyses on mount
  useEffect(() => {
    getJobDescriptions().then(setJobs).catch(() => {});
    getAnalysesForCandidate(candidateId).then(setAnalyses).catch(() => {});
  }, [candidateId]);

  const handleRun = async () => {
    if (!selectedJobId) {
      toast.error("Please select a job description first.");
      return;
    }
    setLoading(true);
    try {
      const result = await runAnalysis(candidateId, selectedJobId);
      toast.success("Analysis complete!");
      setAnalyses((prev) => [result, ...prev]);
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Run new analysis */}
      <section className="card">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-orange" /> Match Against a Job Description
        </h3>
        <div className="flex gap-3 flex-col sm:flex-row">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">— Select a Job Description —</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
          <button
            onClick={handleRun}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <Spinner size={16} /> : <Zap className="w-4 h-4" />}
            Run Analysis
          </button>
        </div>
        {jobs.length === 0 && (
          <p className="text-xs text-gray-400 mt-2">No job descriptions yet. Create one from the "Job Descriptions" menu.</p>
        )}
      </section>

      {/* Past analysis results */}
      {analyses.map((a) => (
        <AnalysisCard key={a.id} analysis={a} />
      ))}
    </div>
  );
}

function AnalysisCard({ analysis: a }: { analysis: AnalysisResult }) {
  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Score ring */}
        <ScoreRing score={Math.round(a.matchScore)} size={90} />

        {/* Summary */}
        <div className="flex-1">
          {a.jobDescription && (
            <p className="text-xs font-semibold text-brand-blue uppercase mb-1">{a.jobDescription.title}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed italic">{a.executiveSummary}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Skill Gaps */}
      {a.skillGaps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Skill Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            {a.skillGaps.map((g) => <Badge key={g} label={g} variant="yellow" />)}
          </div>
        </div>
      )}
    </div>
  );
}
