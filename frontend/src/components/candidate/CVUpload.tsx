// src/components/candidate/CVUpload.tsx
// Drag-and-drop / click-to-upload area for PDF CVs.

import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { uploadCV } from "@/api/candidateApi";
import { CVExtraction } from "@/types";
import Spinner from "@/components/ui/Spinner";

interface CVUploadProps {
  onUploaded: (candidateId: string, extraction: CVExtraction) => void;
}

export default function CVUpload({ onUploaded }: CVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are accepted.");
        return;
      }
      setLoading(true);
      try {
        const result = await uploadCV(file);
        toast.success("CV uploaded and extracted successfully!");
        onUploaded(result.candidateId, result.extraction);
      } catch {
        toast.error("Failed to extract CV. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
        isDragging ? "border-brand-blue bg-brand-blue-light" : "border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light"
      }`}
      onClick={() => document.getElementById("cv-file-input")?.click()}
    >
      <input
        id="cv-file-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onInputChange}
      />

      {loading ? (
        <>
          <Spinner size={40} />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Analyzing CV with AI…</p>
        </>
      ) : (
        <>
          <UploadCloud className="w-12 h-12 text-brand-blue opacity-70" />
          <div className="text-center">
            <p className="text-gray-700 font-semibold">Drag & drop your CV here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse · PDF only · max 10 MB</p>
          </div>
        </>
      )}
    </div>
  );
}
