// src/pages/CandidatesPage.tsx
// Main recruiter dashboard: upload a CV, see extracted data, and run JD matching.

import { useState } from "react";
import CVUpload from "@/components/candidate/CVUpload";
import ExtractionResult from "@/components/candidate/ExtractionResult";
import JDMatchPanel from "@/components/analysis/JDMatchPanel";
import { CVExtraction } from "@/types";

export default function CandidatesPage() {
  const [candidateId, setCandidateId]   = useState<string | null>(null);
  const [extraction, setExtraction]     = useState<CVExtraction | null>(null);
  const [activeTab, setActiveTab]       = useState<"extraction" | "matching">("extraction");

  const handleUploaded = (id: string, ext: CVExtraction) => {
    setCandidateId(id);
    setExtraction(ext);
    setActiveTab("extraction");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">CV Screening</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a candidate's CV to extract structured data, match against job descriptions, and identify skill gaps.
        </p>
      </div>

      {/* Upload area */}
      <CVUpload onUploaded={handleUploaded} />

      {/* Result tabs – only shown after a successful upload */}
      {candidateId && extraction && (
        <div>
          {/* Tab switcher */}
          <div className="flex gap-2 border-b border-gray-200 mb-5">
            {(["extraction", "matching"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "extraction" ? "📋 Extraction Result" : "🎯 JD Matching"}
              </button>
            ))}
          </div>

          {activeTab === "extraction" && (
            <ExtractionResult candidateId={candidateId} extraction={extraction} />
          )}
          {activeTab === "matching" && (
            <JDMatchPanel candidateId={candidateId} />
          )}
        </div>
      )}
    </div>
  );
}
