"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Activity, LogOut, LogIn, Loader2, User } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn.social({ provider: "google" });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-2xl tracking-tight text-slate-900">
              MedScript
            </span>
            <span className="text-blue-600 font-medium">AI</span>
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-10 w-28 bg-slate-100 animate-pulse rounded-full"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-slate-500">Verified User</p>
                </div>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-9 h-9 rounded-2xl border-2 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 bg-slate-200 rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all border border-transparent hover:border-red-100 disabled:opacity-70"
              >
                {isSigningOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-[0.985] disabled:opacity-70"
            >
              {isSigningIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isSigningIn ? "Connecting..." : "Sign in with Google"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
