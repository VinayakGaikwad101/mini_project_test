import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import PrescriptionScanner from "@/components/PrescriptionScanner";

export default async function Home() {
  // Secure server-side session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-12 px-4">
        {session ? (
          <>
            <PrescriptionScanner />
            <p className="mt-8 text-slate-500 text-xs font-mono">
              Secured by End-to-End Encryption
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center max-w-lg">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Welcome to Saarza MedScanner
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Please sign in with your Google account to securely process and
                digitize medical prescriptions.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
