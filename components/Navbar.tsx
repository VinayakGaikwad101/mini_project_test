"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Activity, LogOut, LogIn, Loader2 } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();

  // Track loading states for our buttons
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // Better Auth handles the redirect natively
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
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
          <Activity className="w-6 h-6 text-blue-600" />
          <span>MedScript AI</span>
        </div>

        {/* Auth State */}
        <div>
          {isPending ? (
            <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">
                {session.user.name}
              </span>
              <img
                src={session.user.image || ""}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-slate-200"
              />
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
