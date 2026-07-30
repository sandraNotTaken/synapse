"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PDFUploadButtonProps {
  topicId: string;
}

export default function PDFUploadButton({ topicId }: PDFUploadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Dynamically load PDF.js client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).pdfjsLib) {
        setPdfLibLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
      script.async = true;
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
          setPdfLibLoaded(true);
        }
      };
      script.onerror = () => {
        setError("Failed to load browser PDF parser library. Please reload the page.");
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("PDF size exceeds 8MB limit.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);
    setStatus("Reading PDF content...");

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          throw new Error("PDF parser library is not fully loaded yet.");
        }

        const typedarray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        
        setStatus(`Extracting text from ${pdf.numPages} pages...`);
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          extractedText += pageText + "\n";
        }

        if (extractedText.trim().length < 50) {
          throw new Error("The PDF document does not contain enough extractable text.");
        }

        setStatus("Generating automated flashcards... (takes a few seconds)");

        const res = await fetch("/api/ai/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: extractedText,
            topicId,
            count: 10,
            difficulty: "intermediate",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate flashcards.");
        }

        setSuccess(`Successfully generated ${data.cardCount || 10} flashcards!`);
        setStatus(null);
        router.refresh();
      } catch (err: any) {
        console.error("PDF upload error:", err);
        setError(err.message || "An error occurred while parsing the PDF.");
        setStatus(null);
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    fileReader.onerror = () => {
      setError("Failed to read the PDF file.");
      setLoading(false);
      setStatus(null);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-indigo-500" />
            PDF document to Flashcard Deck
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Drag in textbook pages or slides to automatically generate active recall decks.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || !pdfLibLoaded}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/10 transition shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <UploadCloud className="h-3.5 w-3.5" />
          )}
          <span>{loading ? "Generating..." : "Upload PDF"}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
      </div>

      {status && (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-500 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
