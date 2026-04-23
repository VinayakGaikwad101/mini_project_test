import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import PrescriptionScanner from "@/components/PrescriptionScanner";
import UsageChart from "@/components/UsageChart";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        {session ? (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Secure Session Active
              </div>
              <h1 className="text-4xl font-semibold tracking-tight mb-2">
                Welcome back, {session.user.name?.split(" ")[0]}
              </h1>
              <p className="text-slate-600 max-w-md mx-auto">
                Digitize your handwritten prescriptions instantly with
                TrOCR-powered AI
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <PrescriptionScanner />
              </div>

              <div className="space-y-6">
                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
                      Total Transcribed
                    </p>
                    <h2 className="text-5xl font-black italic">102</h2>
                    <p className="text-blue-200 text-xs mt-4 flex items-center gap-1">
                      <span className="bg-blue-500 px-1.5 py-0.5 rounded text-[10px]">
                        ↑ 12%
                      </span>
                      from last month
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-blue-500/20 scale-150 rotate-12">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z" />
                    </svg>
                  </div>
                </div>

                <UsageChart />
              </div>
            </div>

            <p className="mt-10 text-center text-slate-500 text-xs font-mono tracking-widest">
              🔒 END-TO-END ENCRYPTED • HIPAA-INSPIRED SECURITY
            </p>
          </div>
        ) : (
          <div className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-40"></div>

            <div className="max-w-2xl mx-auto text-center relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 bg-white shadow-sm border border-slate-200 rounded-3xl px-5 py-2 text-sm">
                <span className="text-blue-600">✦</span>
                Powered by TrOCR from Hugging Face
              </div>

              <h1 className="text-6xl font-semibold tracking-tighter leading-tight mb-6">
                Turn Handwritten
                <br />
                Prescriptions into
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Digital Records
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                Secure AI-powered digitization of doctor prescriptions. Accurate
                medicine name, dosage & instruction extraction in seconds.
              </p>

              <div className="flex justify-center items-center gap-12 py-6 px-10 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-100 w-fit mx-auto">
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">
                    102
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Processed
                  </p>
                </div>
                <div className="w-px h-10 bg-slate-100"></div>
                <div className="text-center">
                  <p className="text-3xl font-black text-blue-600 tracking-tighter">
                    94%
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Accuracy
                  </p>
                </div>
                <div className="w-px h-10 bg-slate-100"></div>
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-500 tracking-tighter">
                    2.4s
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Latency
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:block">
              <div className="bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl rounded-3xl p-8 max-w-xs text-left">
                <div className="text-emerald-600 text-xs font-mono mb-2">
                  EXAMPLE OUTPUT
                </div>
                <div className="font-mono text-sm leading-relaxed text-slate-700">
                  Amoxicillin 500mg
                  <br />
                  BD × 7 days
                  <br />
                  After food
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
