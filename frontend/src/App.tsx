// src/App.tsx
// Root application component: defines routes and wraps layout.

import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import CandidatesPage from "@/pages/CandidatesPage";
import JobDescriptionsPage from "@/pages/JobDescriptionsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/"     element={<CandidatesPage />} />
          <Route path="/jobs" element={<JobDescriptionsPage />} />
        </Routes>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        TalentScan AI © {new Date().getFullYear()} – Powered by Gemini AI
      </footer>
    </div>
  );
}
