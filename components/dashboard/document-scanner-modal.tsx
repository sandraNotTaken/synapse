"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, FileImage, Sparkles, Loader2, CheckCircle2, X, Trash2, Paperclip, AlertCircle } from "lucide-react";

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtractedText: (text: string) => void;
}

export default function DocumentScannerModal({
  isOpen,
  onClose,
  onExtractedText,
}: DocumentScannerModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamically load PDF.js client-side if a PDF is queued
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
        console.error("Failed to load PDF.js script");
      };
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      // Skip if file already added
      if (files.some((f) => f.name === file.name && f.size === file.size)) continue;
      newFiles.push(file);
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const startExtraction = async () => {
    if (files.length === 0) return;
    setExtracting(true);
    setError(null);
    let fullExtractedText = "";

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        setStatusText(`Processing ${i + 1}/${files.length}: ${file.name}...`);

        if (ext === "pdf") {
          // Check if PDF.js is ready
          const pdfjsLib = (window as any).pdfjsLib;
          if (!pdfjsLib) {
            throw new Error("PDF parser library is still loading. Please try again in a few seconds.");
          }
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let pdfText = "";
          for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p);
            const textContent = await page.getTextContent();
            pdfText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
          }
          fullExtractedText += `\n\n### Extracted Notes: ${file.name.replace(/\.[^/.]+$/, "")}\n${pdfText}`;
        } else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
          const base64 = await fileToBase64(file);
          const res = await fetch("/api/ai/ocr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64 }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || `Failed to extract text from ${file.name}`);
          }
          fullExtractedText += `\n\n### Extracted Notes: ${file.name.replace(/\.[^/.]+$/, "")}\n${data.text}`;
        } else if (["txt", "md"].includes(ext)) {
          const text = await readTextFile(file);
          fullExtractedText += `\n\n### Extracted Notes: ${file.name.replace(/\.[^/.]+$/, "")}\n${text}`;
        } else {
          throw new Error(`Unsupported file type: ${ext}`);
        }
      }

      onExtractedText(fullExtractedText);
      setExtracted(true);
      setFiles([]);
      setTimeout(() => {
        onClose();
        setExtracted(false);
      }, 1500);
    } catch (err: any) {
      console.error("Text extraction failed:", err);
      setError(err.message || "Failed to extract text from documents.");
    } finally {
      setExtracting(false);
      setStatusText("");
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="h-5 w-5 text-red-500 shrink-0" />;
    if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext || "")) {
      return <FileImage className="h-5 w-5 text-indigo-500 shrink-0" />;
    }
    return <Paperclip className="h-5 w-5 text-muted-foreground shrink-0" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-foreground">Document Note Extractor</h3>
          </div>
          <button
            onClick={onClose}
            disabled={extracting}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 no-scrollbar">
          {!extracted ? (
            <div className="space-y-4">
              {/* File Dropzone / Selector */}
              <div className="rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 p-6 text-center space-y-3">
                <Upload className="mx-auto h-7 w-7 text-indigo-500 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-foreground">Upload PDFs, Images or Text files</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Extract notes dynamically using client parsing and AI-OCR.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition">
                  Select Files
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    disabled={extracting}
                  />
                </label>
              </div>

              {/* Error Box */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-500 animate-fade-in shrink-0">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selected Files list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Selected Documents ({files.length})
                  </h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2.5 hover:border-indigo-500/20 transition group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-4">
                          {getFileIcon(file.name)}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate max-w-[240px]">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          disabled={extracting}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition cursor-pointer disabled:opacity-50"
                          title="Remove file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status display when extracting */}
              {extracting && (
                <div className="flex items-center gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-500 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>{statusText}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 animate-fade-in text-emerald-500">
              <CheckCircle2 className="h-10 w-10 mx-auto" />
              <h4 className="text-sm font-bold">Extraction Complete!</h4>
              <p className="text-xs text-muted-foreground">Extracted notes appended to workspace.</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!extracted && files.length > 0 && (
          <div className="border-t border-border pt-4 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setFiles([])}
              disabled={extracting}
              className="rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold px-4 py-2.5 transition cursor-pointer disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={startExtraction}
              disabled={extracting}
              className="rounded-xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 transition disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
            >
              {extracting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{extracting ? "Extracting..." : "Start Extraction"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
