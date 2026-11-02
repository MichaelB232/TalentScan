// src/utils/exportHelpers.ts
// Utility functions for generating JSON, CSV, and PDF export files from CVExtraction.

import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { CVExtraction } from "../types/candidate.types";

/**
 * toJsonBuffer
 * Serializes a CVExtraction object to a JSON Buffer for download.
 * Called by: ExportService.export (format=json)
 */
export function toJsonBuffer(extraction: CVExtraction): Buffer {
  return Buffer.from(JSON.stringify(extraction, null, 2), "utf-8");
}

/**
 * toCsvBuffer
 * Converts a CVExtraction to a flat CSV Buffer (one row per work experience).
 * Called by: ExportService.export (format=csv)
 */
export async function toCsvBuffer(extraction: CVExtraction): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Personal Info
  const infoSheet = workbook.addWorksheet("Personal Info");
  infoSheet.columns = [
    { header: "Field", key: "field", width: 25 },
    { header: "Value", key: "value", width: 50 },
  ];
  infoSheet.addRows([
    { field: "Full Name", value: extraction.fullName },
    { field: "Date of Birth", value: extraction.dateOfBirth ?? "" },
    { field: "Phone", value: extraction.phone ?? "" },
    { field: "Email", value: extraction.email ?? "" },
    { field: "Address", value: extraction.address ?? "" },
    { field: "LinkedIn", value: extraction.linkedIn ?? "" },
    { field: "Total Experience (yrs)", value: extraction.totalExperienceYears },
    { field: "Detected Language", value: extraction.detectedLanguage },
    { field: "Hard Skills", value: extraction.skills.hardSkills.join(", ") },
    { field: "Soft Skills", value: extraction.skills.softSkills.join(", ") },
    { field: "Certifications", value: extraction.certifications.join(", ") },
    { field: "Languages", value: extraction.languages.join(", ") },
  ]);

  // Sheet 2: Work Experience
  const expSheet = workbook.addWorksheet("Work Experience");
  expSheet.columns = [
    { header: "Company", key: "company", width: 30 },
    { header: "Position", key: "position", width: 30 },
    { header: "Start Date", key: "startDate", width: 15 },
    { header: "End Date", key: "endDate", width: 15 },
    { header: "Description", key: "description", width: 60 },
  ];
  extraction.workExperience.forEach((w) => expSheet.addRow(w));

  // Sheet 3: Education
  const eduSheet = workbook.addWorksheet("Education");
  eduSheet.columns = [
    { header: "Institution", key: "institution", width: 30 },
    { header: "Degree", key: "degree", width: 20 },
    { header: "Field", key: "field", width: 25 },
    { header: "Graduation Year", key: "graduationYear", width: 18 },
  ];
  extraction.education.forEach((e) => eduSheet.addRow(e));

  const buf = await workbook.xlsx.writeBuffer();
  return Buffer.from(buf);
}

/**
 * toPdfBuffer
 * Generates a clean PDF resume summary from a CVExtraction.
 * Called by: ExportService.export (format=pdf)
 */
export function toPdfBuffer(extraction: CVExtraction): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // ── Header ──
    doc.fontSize(22).font("Helvetica-Bold").text(extraction.fullName, { align: "center" });
    doc.fontSize(10).font("Helvetica").fillColor("#555");
    const contact = [extraction.email, extraction.phone, extraction.linkedIn]
      .filter(Boolean)
      .join("  |  ");
    doc.text(contact, { align: "center" });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor("#3B82F6").stroke();
    doc.moveDown(0.5);

    // ── Summary ──
    if (extraction.summary) {
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#1f2937").text("Summary");
      doc.fontSize(10).font("Helvetica").fillColor("#374151").text(extraction.summary);
      doc.moveDown();
    }

    // ── Skills ──
    doc.fontSize(13).font("Helvetica-Bold").fillColor("#1f2937").text("Skills");
    doc.fontSize(10).font("Helvetica").fillColor("#374151");
    doc.text(`Hard Skills: ${extraction.skills.hardSkills.join(", ") || "–"}`);
    doc.text(`Soft Skills: ${extraction.skills.softSkills.join(", ") || "–"}`);
    doc.moveDown();

    // ── Work Experience ──
    doc.fontSize(13).font("Helvetica-Bold").fillColor("#1f2937").text("Work Experience");
    extraction.workExperience.forEach((w) => {
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#111827")
        .text(`${w.position} @ ${w.company}`, { continued: false });
      doc.fontSize(9).font("Helvetica").fillColor("#6B7280")
        .text(`${w.startDate} – ${w.endDate}`);
      doc.fontSize(10).font("Helvetica").fillColor("#374151").text(w.description);
      doc.moveDown(0.5);
    });

    // ── Education ──
    doc.fontSize(13).font("Helvetica-Bold").fillColor("#1f2937").text("Education");
    extraction.education.forEach((e) => {
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#111827")
        .text(`${e.degree} in ${e.field}`);
      doc.fontSize(10).font("Helvetica").fillColor("#374151")
        .text(`${e.institution} (${e.graduationYear})`);
      doc.moveDown(0.4);
    });

    doc.end();
  });
}
