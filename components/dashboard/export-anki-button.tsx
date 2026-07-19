"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { exportDeckToAnki } from "@/app/dashboard/decks/export-actions";

interface ExportAnkiButtonProps {
  deckId: string;
}

export default function ExportAnkiButton({ deckId }: ExportAnkiButtonProps) {
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const res = await exportDeckToAnki(deckId);
      if (res.success && res.content) {
        // Trigger browser file download of TSV file for Anki
        const blob = new Blob([res.content], { type: "text/tab-separated-values" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${res.deckTitle.replace(/\s+/g, "_")}_Anki.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      }
    } catch (err) {
      console.error("Anki export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      title="Export to Anki (.txt)"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : downloaded ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      <span>{downloaded ? "Anki Exported" : "Anki Export"}</span>
    </button>
  );
}
