"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Download, ArrowLeft } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";

type ExportFormat = "csv" | "excel";

interface ExportField {
  id: string;
  label: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const EXPORT_FIELDS: ExportField[] = [
  { id: "full_name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "company", label: "Company" },
  { id: "status", label: "Registration status" },
  { id: "registered_at", label: "Registration date" },
];

export default function AdminEventExportPage({ params }: Props) {
  const { id } = use(params);
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(EXPORT_FIELDS.map((f) => f.id)));
  const [exporting, setExporting] = useState(false);

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const fields = Array.from(selectedFields).join(",");
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/export/${id}?format=${format}&fields=${fields}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `registrations-${id}.${format === "csv" ? "csv" : "xlsx"}`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("Failed to export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/analytics" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-8">
          <ArrowLeft size={15} /> Back to platform analytics
        </Link>

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">Export registrations</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">Export attendee data for this event</p>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-6 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Export format</p>
            <div className="flex flex-col gap-3">
              {(["csv", "excel"] as ExportFormat[]).map((f) => (
                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="export-format" value={f} checked={format === f} onChange={() => setFormat(f)}
                    className="w-4 h-4 rounded-full border-2 border-[var(--color-border)] accent-[var(--color-primary-blue)] cursor-pointer" />
                  <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                    {f === "csv" ? "CSV (.csv)" : "Excel (.xlsx)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="px-6 py-6 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Fields to include</p>
            <div className="flex flex-col gap-3">
              {EXPORT_FIELDS.map((field) => (
                <label key={field.id} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={selectedFields.has(field.id)} onChange={() => toggleField(field.id)}
                    className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-primary-blue)] cursor-pointer" />
                  <span className="text-sm text-[var(--color-text-primary)] transition-colors">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            <button type="button" onClick={handleExport} disabled={selectedFields.size === 0 || exporting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-primary-blue)] hover:opacity-90 transition duration-150 shadow-lg shadow-[rgba(0,102,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
              <Download size={16} />
              {exporting ? "Exporting..." : "Export"}
            </button>
            {selectedFields.size === 0 && <p className="mt-2 text-xs text-[var(--color-text-secondary)]">Select at least one field to export.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
