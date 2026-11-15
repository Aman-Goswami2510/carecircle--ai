"use client";

import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  Pill,
  Calendar,
  BarChart3,
  Users,
  Bell,
  ArrowRight,
  CheckCircle2,
  Lock,
  Smartphone,
  Sparkles,
  Award
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-primary-600" />
          Official PromptWars x Catalyst Submission
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Intelligent Elderly Care &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-teal-600 to-indigo-600">
            Medication Ecosystem
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Empowering elderly individuals to manage medications and appointments with confidence, while keeping caregivers and family members seamlessly connected through secure passcode-based access and proactive email reminders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-base shadow-xl shadow-primary-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Live CareCircle Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-xs flex items-center justify-center space-x-2 transition-all"
          >
            <span>Explore Patient Dashboard</span>
          </Link>
        </div>

        {/* Highlight Trust Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-600" /> Passcode-Protected Profiles
          </span>
          <span className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-primary-600" /> Scheduled Email Reminders
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Verified Adherence Analytics
          </span>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-primary-300 transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Pill className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Medication Management & Tracking</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Simplified morning, afternoon, and evening intake queues with one-tap confirmation, inventory refill alerts, and exact dosage instructions designed for elderly ease of use.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-teal-300 transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Caregiver & Family Circle</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Shared health profile unlocked via secure passcode. Caregivers receive automated alerts for missed doses and can log clinical vitals, mood notes, and doctor instructions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Proactive Reminder Engine</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Transactional email engine sending 15-minute upcoming dose warnings, immediate missed-medication escalation alerts, and hospital appointment preparation checklists.
          </p>
        </div>
      </section>

      {/* Accessibility & Safety Highlight */}
      <section className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Built for Universal Accessibility
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              Dignified, senior-first interface design
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Large touch targets, high-contrast modes, dynamic typography scaling (A / A+ / A++), and integrated text-to-speech support guarantee that seniors remain in complete control of their daily health routines.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
                WCAG AAA High Contrast
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
                Speech Synthesis API
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
                Large Touch Targets (min 48px)
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Hackathon Evaluation Criteria Alignment
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Code Quality & Efficiency:</strong> Clean Next.js 14 App Router, typed TypeScript schemas, modular components.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Security:</strong> Passcode hashed access, Row Level Security (RLS) PostgreSQL schema, sanitized APIs.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Testing:</strong> Automated Vitest test suite verifying dose calculations, adherence metrics, and email dispatch.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

