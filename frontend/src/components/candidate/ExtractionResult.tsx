// src/components/candidate/ExtractionResult.tsx
// Displays the full structured extraction result from Gemini AI.

import { CVExtraction, ExportFormat } from "@/types";
import Badge from "@/components/ui/Badge";
import { downloadExport } from "@/api/candidateApi";
import { Download, Globe, Briefcase, GraduationCap, Star } from "lucide-react";

interface ExtractionResultProps {
  candidateId: string;
  extraction: CVExtraction;
}

const exportFormats: { format: ExportFormat; label: string }[] = [
  { format: "json", label: "JSON" },
  { format: "csv",  label: "Excel" },
  { format: "pdf",  label: "PDF" },
];

export default function ExtractionResult({ candidateId, extraction }: ExtractionResultProps) {
  const e = extraction;

  return (
    <div className="animate-slide-up space-y-5">
      {/* ── Personal Info ────────────────────── */}
      <section className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{e.fullName}</h2>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
              {e.email    && <span>✉ {e.email}</span>}
              {e.phone    && <span>📞 {e.phone}</span>}
              {e.address  && <span>📍 {e.address}</span>}
              {e.linkedIn && <a href={e.linkedIn} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline">LinkedIn</a>}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {e.dateOfBirth && <Badge label={`DOB: ${e.dateOfBirth}`} variant="gray" />}
              <Badge label={`${e.totalExperienceYears} yrs exp`} variant="blue" />
              <Badge label={e.detectedLanguage === "id" ? "🇮🇩 Indonesia" : "🇺🇸 English"} variant="orange" />
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 flex-wrap">
            {exportFormats.map(({ format, label }) => (
              <button
                key={format}
                onClick={() => downloadExport(candidateId, format)}
                className="flex items-center gap-1.5 text-xs btn-outline"
              >
                <Download className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {e.summary && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed border-l-4 border-brand-blue pl-3 italic">
            {e.summary}
          </p>
        )}
      </section>

      {/* ── Skills ───────────────────────────── */}
      <section className="card">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-brand-orange" /> Skills
        </h3>
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">Hard Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {e.skills.hardSkills.map((s) => <Badge key={s} label={s} variant="blue" />)}
            {e.skills.hardSkills.length === 0 && <span className="text-xs text-gray-400">–</span>}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5 mt-3">Soft Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {e.skills.softSkills.map((s) => <Badge key={s} label={s} variant="orange" />)}
            {e.skills.softSkills.length === 0 && <span className="text-xs text-gray-400">–</span>}
          </div>
        </div>
        {e.certifications.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5 mt-3">Certifications</p>
            <div className="flex flex-wrap gap-1.5">
              {e.certifications.map((c) => <Badge key={c} label={c} variant="green" />)}
            </div>
          </div>
        )}
      </section>

      {/* ── Work Experience ──────────────────── */}
      {e.workExperience.length > 0 && (
        <section className="card">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-brand-blue" /> Work Experience
          </h3>
          <ol className="relative border-l border-gray-200 space-y-5 ml-2">
            {e.workExperience.map((w, i) => (
              <li key={i} className="ml-4">
                <div className="absolute w-2.5 h-2.5 bg-brand-blue rounded-full -left-1.5 mt-1.5 border-2 border-white" />
                <p className="font-semibold text-gray-800">{w.position}</p>
                <p className="text-sm text-brand-blue">{w.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">{w.startDate} – {w.endDate}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{w.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Education ───────────────────────── */}
      {e.education.length > 0 && (
        <section className="card">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-brand-blue" /> Education
          </h3>
          <div className="space-y-3">
            {e.education.map((ed, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{ed.degree} in {ed.field}</p>
                  <p className="text-sm text-gray-500">{ed.institution}</p>
                </div>
                <Badge label={ed.graduationYear} variant="gray" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Languages ───────────────────────── */}
      {e.languages.length > 0 && (
        <section className="card">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-brand-blue" /> Languages
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {e.languages.map((l) => <Badge key={l} label={l} variant="gray" />)}
          </div>
        </section>
      )}
    </div>
  );
}
