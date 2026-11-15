"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Bell,
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Server
} from "lucide-react";
import { formatDatePretty } from "@/lib/utils";

export default function NotificationsPage() {
  const { emailLogs, sendManualReminder, currentProfile } = useCare();
  const [recipient, setRecipient] = useState("marcus.vance@carecircle.demo");
  const [alertType, setAlertType] = useState<"dose" | "appointment" | "missed">("dose");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return;
    setIsSending(true);
    setStatusMsg("Connecting to notification engine...");

    const success = await sendManualReminder(alertType, recipient);
    setIsSending(false);
    if (success) {
      setStatusMsg(`Successfully delivered healthcare alert to ${recipient}`);
    } else {
      setStatusMsg("Engine error delivering notification.");
    }

    setTimeout(() => setStatusMsg(""), 4500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Proactive Email Notification Engine
        </h1>
        <p className="text-slate-600 mt-1">
          Scheduled dose reminders, automated missed-medication alerts, and delivery audit logs.
        </p>
      </div>

      {/* Manual Dispatch & Engine Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-slate-900 text-lg">Dispatch Test Email</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Test real-time transactional delivery to caregivers or family members.
          </p>

          <form onSubmit={handleTrigger} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Email</label>
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notification Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 text-xs"
              >
                <option value="dose">Upcoming Dose Reminder (15 min warning)</option>
                <option value="missed">Urgent Missed Dose Alert to Caregiver</option>
                <option value="appointment">Upcoming Medical Appointment Reminder</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Dispatching..." : "Send Real-Time Alert"}</span>
            </button>

            {statusMsg && (
              <p className="text-emerald-700 font-semibold text-center pt-1 animate-pulse">
                {statusMsg}
              </p>
            )}
          </form>

          {/* Scheduled Cron Info */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-teal-600" /> Scheduled Background Worker
            </div>
            <p>Runs every 15 minutes checking active time slots and unconfirmed doses.</p>
            <div className="font-mono text-teal-800 text-[10px] pt-1">
              Endpoint: /api/cron/reminders
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Email Delivery Audit Trail */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900">Email Delivery Audit Trail</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {emailLogs.length} verified dispatches
            </span>
          </div>

          <div className="space-y-3.5">
            {emailLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-teal-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {log.notificationType.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDatePretty(log.deliveredAt)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{log.subject}</h4>
                  <p className="text-xs text-slate-500">
                    To: <strong className="text-slate-700">{log.recipientEmail}</strong> ({log.recipientName})
                  </p>
                </div>
                {log.details && (
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                    {log.details}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Engine: {log.provider.toUpperCase()}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

