"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import { calculateAdherenceStats } from "@/lib/adherence";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AdherencePage() {
  const { doses, patient } = useCare();
  const stats = calculateAdherenceStats(doses);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Medication Adherence Analytics
        </h1>
        <p className="text-slate-600 mt-1">
          Real-time compliance tracking, daily trends, and caregiver AI insights for {patient.fullName}.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overall Compliance
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900">{stats.overallPercentage}%</span>
            <span className="text-xs font-semibold text-emerald-600">Target: &gt;90%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Calculated from verified dose intake records
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Consecutive Streak
            </span>
            <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900">{stats.streakDays}</span>
            <span className="text-xs font-semibold text-primary-600">Days</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Consistent morning medication adherence</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doses Taken
            </span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900">{stats.totalTaken}</span>
            <span className="text-xs text-slate-400">/ {stats.totalScheduled} total</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Confirmed by patient or caregiver</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Missed Doses
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900">{stats.totalMissed}</span>
            <span className="text-xs font-semibold text-rose-600">Requires Alert</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Automated caregiver email notifications</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Weekly Adherence Velocity (%)</h2>
            <p className="text-xs text-slate-500">Intake consistency across past 7 days</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded bg-primary-600 inline-block" />
            <span>Adherence %</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={stats.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="percentage" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Behavioral Insights Box */}
      <div className="bg-gradient-to-r from-teal-50 to-primary-50 rounded-3xl p-6 border border-teal-200 space-y-4">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">
            CareCircle AI Behavioral Pattern Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-1.5">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Intake Time Accuracy
            </span>
            <p className="text-sm text-slate-700">
              Morning medications (Amlodipine & Metformin) are consistently taken within 15 minutes of the 08:00 AM window.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-teal-100 space-y-1.5">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Caregiver Supervision Impact
            </span>
            <p className="text-sm text-slate-700">
              Zero missed doses recorded when Marcus or visiting nurse Elena checks in via the shared portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

