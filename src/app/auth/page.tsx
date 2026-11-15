"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  ShieldCheck,
  KeyRound,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight
} from "lucide-react";
import { useCare } from "@/context/CareContext";

export default function PasscodeAuthPage() {
  const router = useRouter();
  const { setCurrentRole } = useCare();
  const [passcode, setPasscode] = useState("");
  const [selectedRole, setSelectedRole] = useState<"patient" | "caregiver" | "family">("patient");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect passcode. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success: set context role and redirect to dashboard
      setCurrentRole(selectedRole);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Network or server error during authentication.");
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = (role: "patient" | "caregiver" | "family") => {
    setSelectedRole(role);
    setPasscode("2468");
    setError("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary-600 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25 mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Secure Passcode Access
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the shared healthcare passcode for <strong>Eleanor Vance</strong>
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "patient", label: "Elderly", icon: HeartHandshake },
              { id: "caregiver", label: "Caregiver", icon: ShieldCheck },
              { id: "family", label: "Family", icon: Users },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id as any)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                    selectedRole === r.id
                      ? "bg-primary-50 border-primary-500 text-primary-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passcode Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="passcode-input" className="block text-sm font-semibold text-slate-700 mb-2">
              4-Digit Healthcare Passcode
            </label>
            <div className="relative">
              <input
                id="passcode-input"
                type="password"
                maxLength={6}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="• • • •"
                required
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-slate-50 text-slate-900 transition-all font-bold placeholder:tracking-normal"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full py-3.5 px-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 font-bold transition-all shadow-md shadow-primary-500/20 flex items-center justify-center space-x-2 text-base"
          >
            <span>{isLoading ? "Authenticating..." : "Unlock Care Profile"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Pre-fill helpers for hackathon judges */}
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-teal-900">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Hackathon Judge Quick-Access (Demo PIN: 2468)
          </div>
          <p className="text-teal-800 text-[11px] leading-relaxed">
            Click below to auto-fill credentials for each persona:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleQuickDemoFill("patient")}
              className="bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-1 rounded-lg font-medium"
            >
              Log in as Eleanor (Patient)
            </button>
            <button
              onClick={() => handleQuickDemoFill("caregiver")}
              className="bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-1 rounded-lg font-medium"
            >
              Log in as Marcus (Caregiver)
            </button>
            <button
              onClick={() => handleQuickDemoFill("family")}
              className="bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-1 rounded-lg font-medium"
            >
              Log in as Dr. Sarah (Family)
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 underline">
            ← Return to CareCircle Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

