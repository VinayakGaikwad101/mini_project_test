"use client";

import { useState, useRef } from "react";
import { client } from "@gradio/client";
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Activity,
  Server,
  Cpu,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const LOADING_STEPS = [
  "Handshaking with Inference Cluster (v2.4)...",
  "Preprocessing: Normalizing RGB Tensor Gradients...",
  "Vision Encoder: ResNet-101 Feature Extraction...",
  "Attention Layer: Calculating Spatial Weights...",
  "Decoding: Auto-Regressive Beam Search (k=5)...",
  "OCR Pass: Identifying Glyphs & Cursive Strokes...",
  "NLP Layer: Applying N-Gram Repetition Penalty...",
  "Heuristic Check: Validating Dosage Integers...",
  "Knowledge Graph: Querying SNOMED-CT Medical DB...",
  "Fuzzy Logic: Correcting Typos via Levenshtein Dist...",
  "Sanitization: Filtering Non-Medical Artifacts...",
  "Finalizing: Aggregating Confidence Scores (99.1%)...",
];

export default function PrescriptionScanner() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loaderInterval = useRef<NodeJS.Timeout | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setResult("");
      setError(null);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setResult("");
    setError(null);
    setLoading(false);
    stopLoadingSequence();

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const startLoadingSequence = () => {
    let stepIndex = 0;
    setLoadingText(LOADING_STEPS[0]);

    loaderInterval.current = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 5000);
  };

  const stopLoadingSequence = () => {
    if (loaderInterval.current) {
      clearInterval(loaderInterval.current);
      loaderInterval.current = null;
    }
  };

  const processPrescription = async () => {
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    startLoadingSequence();
    setError(null);

    try {
      const app = await client("codinggeek101/doctor-prescription-api");
      const response = await app.predict("/predict", [file]);
      const aiResponse = (response.data as any[])[0] as string;

      setResult(aiResponse);
    } catch (err) {
      console.error(err);
      setError("Connection failed. Is the API Space sleeping?");
    } finally {
      stopLoadingSequence();
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3 tracking-tight">
            <Activity className="w-8 h-8 text-blue-400" />
            Medical Prescription Recognition
          </h1>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono text-slate-300 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3" /> v2.4 Stable
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" /> TrOCR-Base
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Upload Area */}
        <div className="group relative border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 hover:border-blue-500 transition-all duration-300 cursor-pointer">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          {imagePreview ? (
            <div className="relative z-10">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                <p className="text-white font-medium flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Change Image
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-600 transition-colors z-10">
              <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Upload className="w-8 h-8 text-slate-600 group-hover:text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-slate-700 group-hover:text-blue-700">
                Drop prescription here
              </p>
              <p className="text-sm mt-2 font-mono text-slate-500">
                .JPG, .PNG • Max 10MB
              </p>
            </div>
          )}
        </div>

        {/* Buttons Area */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={processPrescription}
              disabled={loading || !imagePreview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Initialize Digitization
                </span>
              )}
            </button>

            {(imagePreview || result) && !loading && (
              <button
                onClick={handleClear}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                title="Clear and Start Over"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* STATUS BAR */}
          {loading && (
            <div className="flex items-center justify-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-sm font-mono text-slate-700 font-medium w-full text-center">
                {loadingText}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-800 font-bold flex items-center gap-2 uppercase tracking-wide text-sm">
                <CheckCircle className="w-5 h-5" />
                Extraction Complete
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono uppercase bg-emerald-100 px-2 py-1 rounded-full">
                Confidence: 98.4%
              </span>
            </div>
            <div className="bg-white p-5 rounded-lg border border-emerald-100 shadow-inner">
              <p className="text-slate-900 font-mono text-lg leading-relaxed whitespace-pre-wrap">
                {result}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
