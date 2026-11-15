"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCare } from "@/context/CareContext";
import {
  Heart,
  Pill,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { formatTime12h, formatDatePretty } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function PatientDashboard() {
  const {
    currentRole,
    patient,
    doses,
    appointments,
    emergencyContacts,
    logDoseStatus,
    fontSize,
    sendManualReminder
  } = useCare();

  const [notificationMsg, setNotificationMsg] = useState("");

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDoseClick = (doseId: string, status: "taken" | "missed") => {
    logDoseStatus(doseId, status);
    if (status === "taken") {
      triggerCelebration();
      setNotificationMsg("Wonderful! Medication logged as taken on time.");
    } else {
      setNotificationMsg("Dose flagged as missed. Caregiver alert dispatched.");
    }
    setTimeout(() => setNotificationMsg(""), 4500);
  };

  const nextUpcomingDose = doses.find((d) => d.status === "scheduled");
  const completedDoses = doses.filter((d) => d.status === "taken").length;
  const totalDosesToday = doses.length;
  const todayAdherence = totalDosesToday > 0 ? Math.round((completedDoses / totalDosesToday) * 100) : 100;

  const upcomingAppt = appointments[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div className="bg-teal-600 text-white px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle className="w-5 h-5 text-teal-200" />
            <span>{notificationMsg}</span>
          </div>
          <button
            onClick={() => setNotificationMsg("")}
            className="text-xs bg-teal-700 hover:bg-teal-800 px-3 py-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Welcome & Patient Vitals Summary */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/60 border border-primary-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Shared Circle Active • Passcode Protected
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Good day, {patient.fullName}
            </h1>
            <p className="mt-2 text-primary-100 text-base max-w-xl">
              {patient.gender} • Blood Group: <span className="font-bold text-white">{patient.bloodGroup}</span> • 3 Caregivers connected.
            </p>
          </div>

          {/* Quick Adherence Progress Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center space-x-5">
            <div className="text-center">
              <div className="text-3xl font-black text-teal-300">{todayAdherence}%</div>
              <div className="text-xs text-primary-100 uppercase tracking-wider mt-0.5 font-medium">Today&apos;s Adherence</div>
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">{completedDoses}/{totalDosesToday}</div>
              <div className="text-xs text-primary-100 uppercase tracking-wider mt-0.5 font-medium">Doses Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Health Routine & Next Action Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-primary-500/10 to-indigo-500/10 border border-teal-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              CareCircle AI Routine Insights
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {nextUpcomingDose
                ? `Next scheduled dose is ${nextUpcomingDose.medicationName} at ${nextUpcomingDose.timeSlot}. Marcus & Dr. Sarah are synced.`
                : "All scheduled doses for today have been completed. Outstanding compliance!"}
            </p>
          </div>
        </div>
        <Link
          href="/adherence"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-semibold text-xs shadow-xs shrink-0"
        >
          <span>View Weekly Analytics</span>
          <ArrowUpRight className="w-4 h-4 text-primary-600" />
        </Link>
      </div>

      {/* Grid: Medications of Today & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Medication Schedule (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">Today&apos;s Medication Schedule</h2>
            </div>
            <Link
              href="/medications"
              className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              <span>Manage All ({totalDosesToday})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {doses.map((dose) => {
              const isTaken = dose.status === "taken";
              const isMissed = dose.status === "missed";
              const isScheduled = dose.status === "scheduled";

              return (
                <div
                  key={dose.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isTaken
                      ? "bg-emerald-50/60 border-emerald-200"
                      : isMissed
                      ? "bg-rose-50/60 border-rose-200"
                      : "bg-white border-slate-200 shadow-sm hover:border-primary-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${dose.colorCode}20`, color: dose.colorCode }}
                      >
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-lg">
                            {dose.medicationName}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isTaken
                                ? "bg-emerald-100 text-emerald-800"
                                : isMissed
                                ? "bg-rose-100 text-rose-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {dose.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 font-medium">
                          Dose: {dose.dosage} • Scheduled:{" "}
                          <span className="text-slate-900 font-semibold">{dose.timeSlot}</span>
                        </p>
                        {dose.notes && (
                          <p className="text-xs text-slate-500 mt-1 italic">
                            &quot;{dose.notes}&quot;
                          </p>
                        )}
                        {dose.loggedByName && (
                          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Confirmed by {dose.loggedByName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons (Big friendly buttons for elderly touch) */}
                    <div className="flex items-center space-x-2 sm:self-center shrink-0">
                      {isScheduled && (
                        <>
                          <button
                            onClick={() => handleDoseClick(dose.id, "taken")}
                            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark Taken</span>
                          </button>
                          <button
                            onClick={() => handleDoseClick(dose.id, "missed")}
                            className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-medium text-xs border border-slate-200 transition-all"
                            title="Flag as missed dose"
                          >
                            Missed
                          </button>
                        </>
                      )}
                      {isTaken && (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                          <CheckCircle className="w-4 h-4" />
                          <span>Dose Completed</span>
                        </div>
                      )}
                      {isMissed && (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 px-3 py-1.5 rounded-xl">
                          <AlertCircle className="w-4 h-4" />
                          <span>Caregiver Alerted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Appointments & Emergency Contacts */}
        <div className="space-y-6">
          {/* Next Appointment Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Next Doctor Appointment</h3>
              </div>
              <Link href="/appointments" className="text-xs text-primary-600 font-semibold hover:underline">
                All
              </Link>
            </div>

            {upcomingAppt ? (
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900 bg-teal-200/80 px-2.5 py-0.5 rounded-full uppercase">
                    In 2 Days
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDatePretty(upcomingAppt.appointmentDate)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{upcomingAppt.title}</h4>
                  <p className="text-xs text-slate-700 mt-0.5 font-medium">{upcomingAppt.doctorName}</p>
                  <p className="text-xs text-slate-500 mt-1">{upcomingAppt.hospitalClinic}</p>
                </div>
                {upcomingAppt.preparationNotes && (
                  <div className="text-xs bg-white p-2.5 rounded-xl border border-teal-100 text-slate-600">
                    <span className="font-semibold text-teal-900">Prep Note: </span>
                    {upcomingAppt.preparationNotes}
                  </div>
                )}
                <div className="pt-1">
                  <button
                    onClick={() => sendManualReminder("appointment", "marcus.vance@carecircle.demo")}
                    className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Send Reminder Email to Marcus</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No appointments scheduled.</p>
            )}
          </div>

          {/* Emergency SOS Contacts Card */}
          <div id="emergency" className="bg-rose-50/80 rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-rose-600 animate-pulse" />
              <h3 className="font-bold text-rose-950 text-base">Emergency SOS Contacts</h3>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Tap any contact below to immediately connect with Eleanor&apos;s designated care circle.
            </p>

            <div className="space-y-2.5">
              {emergencyContacts.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-100/50 transition-all shadow-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{contact.name}</div>
                    <div className="text-xs text-slate-500">{contact.relationship}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                      {contact.phone}
                    </span>
                    <div className="p-2 rounded-lg bg-rose-600 text-white">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

