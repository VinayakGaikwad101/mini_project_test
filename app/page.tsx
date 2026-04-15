import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import PrescriptionScanner from "@/components/PrescriptionScanner";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        {session ? (
          <div className="max-w-5xl mx-auto px-6 py-12">
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

            <PrescriptionScanner />

            <p className="mt-10 text-center text-slate-500 text-xs font-mono tracking-widest">
              🔒 END-TO-END ENCRYPTED • HIPAA-INSPIRED SECURITY
            </p>
          </div>
        ) : (
          /* Improved Hero Section */
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <div className="w-px h-4 bg-slate-300"></div>
                  Trusted by medical professional
                </div>
              </div>
            </div>

            {/* Floating visual element */}
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
