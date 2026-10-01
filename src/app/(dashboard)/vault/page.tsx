"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  FileText, 
  Database,
  Eye,
  Hash,
  Sparkles
} from "lucide-react";

interface VaultDoc {
  id: string;
  name: string;
  size: string;
  hash: string;
  status: "verified" | "processing" | "extracted";
  extractedMedicines: string[];
  confidence: number;
  uploadedAt: string;
}

export default function PrescriptionVaultDemo() {
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Initial vault files with pre-computed SHA-256 hashes
  const [documents, setDocuments] = useState<VaultDoc[]>([
    {
      id: "DOC-9821",
      name: "prescription_dr_patel_surat.jpg",
      size: "2.4 MB",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      status: "extracted",
      extractedMedicines: ["Dolo 650mg", "Augmentin 625 Duo", "Pan-D"],
      confidence: 98.2,
      uploadedAt: "Today, 10:14 AM"
    },
    {
      id: "DOC-9820",
      name: "hospital_discharge_bill.pdf",
      size: "1.8 MB",
      hash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      status: "extracted",
      extractedMedicines: ["Telma 40mg", "Glycomet-GP 2"],
      confidence: 96.5,
      uploadedAt: "Yesterday, 4:30 PM"
    }
  ]);

  // Handle client-side SHA-256 calculation & duplicate detection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setDuplicateAlert(null);
    setSuccessNotice(null);

    // Read file buffer and calculate real Web Crypto SHA-256 hash
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Simulate 600ms network check against Supabase DB
    setTimeout(() => {
      setIsUploading(false);

      // Check if hash already exists in vault documents
      const existingDoc = documents.find(d => d.hash === computedHash);

      if (existingDoc) {
        setDuplicateAlert(
          `Duplicate Document Blocked! SHA-256 hash (${computedHash.substring(0, 16)}...) matches existing record ${existingDoc.id} (${existingDoc.name}). Pre-upload check prevented duplicate OCR & redundant billing.`
        );
      } else {
        const newDoc: VaultDoc = {
          id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          hash: computedHash,
          status: "extracted",
          extractedMedicines: ["Extracted: Dolo 650mg", "Extracted: Azithral 500mg"],
          confidence: 97.4,
          uploadedAt: "Just now"
        };

        setDocuments([newDoc, ...documents]);
        setSuccessNotice(
          `Unique Document Verified! SHA-256 hash (${computedHash.substring(0, 16)}...) stored in private bucket. Enqueued in Durable OCR Queue with 3-attempt backoff retry.`
        );
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fingertip Vault Engine • Private Storage &amp; Anti-Duplicate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Lock className="w-7 h-7 text-emerald-400" />
              Prescription Vault &amp; OCR Queue
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Zero public URLs, client &amp; server SHA-256 cryptographic deduplication, and durable OCR queue with retries.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 self-start">
            <ShieldCheck className="w-4 h-4" />
            <span>Tested RLS: Vault Isolated</span>
          </div>
        </div>

        {/* Upload & Deduplication Area */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-amber-400" />
            <span>Test Ingestion: Prescription / Bill Upload</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Upload any prescription image or PDF to simulate Meta WhatsApp media webhook ingestion and real-time SHA-256 hashing.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
            <input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={handleFileUpload} 
              className="hidden" 
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-amber-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-sm font-mono">Computing SHA-256 Hash &amp; Checking DB...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <FileText className="w-10 h-10 text-slate-500 group-hover:text-amber-400" />
                <span className="text-sm font-medium text-slate-200">
                  Click to select a Prescription / Bill (JPEG, PNG, PDF)
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Pre-upload check: Computes hash and prevents duplicate storage &amp; OCR processing
                </span>
              </div>
            )}
          </label>

          {/* Duplicate Alert Banner */}
          {duplicateAlert && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-400 mb-1">DUPLICATE PREVENTED BEFORE PROCESSING</div>
                <div>{duplicateAlert}</div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-400 mb-1">FILE INGESTION &amp; ENQUEUE SUCCESS</div>
                <div>{successNotice}</div>
              </div>
            </div>
          )}
        </div>

        {/* Durable OCR Queue & Ingested Files */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Durable OCR Queue &amp; Private Storage Ledger</span>
            </span>
            <span>Signed URL TTL: 15 Minutes</span>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {doc.id}
                    </span>
                    <span className="text-sm font-medium text-white truncate max-w-xs">
                      {doc.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({doc.size})
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
                    <Hash className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-500">SHA-256:</span>
                    <span className="text-slate-300 truncate">{doc.hash}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-mono text-slate-500 mr-1">Extracted Rx:</span>
                    {doc.extractedMedicines.map((med, idx) => (
                      <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OCR Conf: {doc.confidence}%</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
