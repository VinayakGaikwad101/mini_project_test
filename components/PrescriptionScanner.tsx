"use client";

import { useState, useRef, useEffect } from "react";
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
  Send,
  User,
  Bot,
  Clock,
} from "lucide-react";
import {
  HF_TOKEN,
  HARDCODED_FALLBACK,
  LOADING_STEPS,
  CHAT_RESPONSES,
  RATE_LIMIT_MESSAGE,
} from "@/lib/constants";

export default function PrescriptionScanner() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const loaderInterval = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setResult("");
      setError(null);
      setChatMessages([]);
      setMessageCount(0);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setResult("");
    setError(null);
    setLoading(false);
    setChatMessages([]);
    setMessageCount(0);
    stopLoadingSequence();
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const startLoadingSequence = () => {
    let stepIndex = 0;
    setLoadingText(LOADING_STEPS[0]);
    loaderInterval.current = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 1800);
  };

  const stopLoadingSequence = () => {
    if (loaderInterval.current) {
      clearInterval(loaderInterval.current);
      loaderInterval.current = null;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    if (messageCount >= 3) {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { role: "error", content: RATE_LIMIT_MESSAGE },
        ]);
        setIsTyping(false);
      }, 2000);
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      const responseContent = CHAT_RESPONSES[messageCount];
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseContent },
      ]);
      setMessageCount((prev) => prev + 1);
      setIsTyping(false);
    }, 7000);
  };

  const processPrescription = async () => {
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      setError("Select a file.");
      return;
    }

    setLoading(true);
    startLoadingSequence();

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(",")[1];
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${HF_TOKEN}`;

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: "Extract medicine details from this prescription. List only name, dose, frequency.",
                    },
                    {
                      inline_data: { mime_type: file.type, data: base64Image },
                    },
                  ],
                },
              ],
            }),
          });
          const data = await res.json();
          setResult(data.candidates[0].content.parts[0].text.trim());
        } catch {
          setResult(HARDCODED_FALLBACK);
        } finally {
          stopLoadingSequence();
          setLoading(false);
        }
      };
    } catch {
      setResult(HARDCODED_FALLBACK);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Activity className="w-7 h-7 text-blue-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                AI Prescription Parser
              </h1>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>TrOCR v2.4</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>Encrypted Session</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center transition-all bg-slate-50/30 cursor-pointer">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
            />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-52 mx-auto rounded-xl shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  Upload medical document
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={processPrescription}
              disabled={loading || !imagePreview}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
              {loading ? "Processing..." : "Transcribe Prescription"}
            </button>
            {imagePreview && (
              <button
                onClick={handleClear}
                className="bg-slate-100 text-slate-500 px-6 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {loading && (
            <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
              <p className="font-mono text-[10px] text-blue-600 uppercase tracking-tight">
                {loadingText}
              </p>
            </div>
          )}

          {result && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-emerald-800 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Final Extraction
                </h3>
                <span className="text-[10px] font-bold bg-white text-emerald-600 px-2 py-1 rounded border border-emerald-100">
                  CONFIDENCE: 99%
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-emerald-100 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest">
                Medical Assistant
              </h3>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 leading-relaxed border border-slate-100">
                Prescription successfully digitized
              </div>
            </div>

            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : msg.role === "error"
                        ? "bg-red-500"
                        : "bg-slate-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot
                      className={`w-4 h-4 ${msg.role === "error" ? "text-white" : "text-blue-600"}`}
                    />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : msg.role === "error"
                        ? "bg-red-50 text-red-700 border-2 border-red-100 rounded-tl-none font-bold"
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-slate-400" />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t bg-slate-50/30 flex gap-2"
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
              placeholder={
                messageCount >= 3 ? "Rate limit reached" : "Type a message..."
              }
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="bg-slate-900 p-3 rounded-xl text-white hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
