"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  CheckCircle,
  FileText,
  Mail,
  Send
} from "lucide-react";
import { formatDatePretty } from "@/lib/utils";

export default function AppointmentsPage() {
  const { appointments, addAppointment, sendManualReminder } = useCare();
  const [showModal, setShowModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospitalClinic, setHospitalClinic] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [preparationNotes, setPreparationNotes] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !doctorName || !appointmentDate) return;

    addAppointment({
      title,
      doctorName,
      specialty: specialty || "General Practice",
      hospitalClinic: hospitalClinic || "Main Medical Center",
      locationAddress: "CareCircle Medical Pavilion",
      appointmentDate: new Date(appointmentDate).toISOString(),
      durationMinutes: 45,
      preparationNotes: preparationNotes || undefined,
    });

    setShowModal(false);
    setTitle("");
    setDoctorName("");
    setSpecialty("");
    setHospitalClinic("");
    setAppointmentDate("");
    setPreparationNotes("");
  };

  const handleSendReminder = async (aptTitle: string) => {
    setEmailStatus(`Dispatching reminder email for "${aptTitle}"...`);
    await sendManualReminder("appointment", "marcus.vance@carecircle.demo");
    setEmailStatus(`Reminder delivered successfully to Eleanor's care circle.`);
    setTimeout(() => setEmailStatus(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast */}
      {emailStatus && (
        <div className="bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center space-x-2 text-sm font-semibold">
          <Mail className="w-4 h-4" />
          <span>{emailStatus}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medical Appointments
          </h1>
          <p className="text-slate-600 mt-1">
            Doctor visits, hospital clinics, preparation instructions, and family reminders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-300 transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                    {apt.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Duration: {apt.durationMinutes} mins
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{apt.title}</h3>
                <p className="text-sm text-slate-700 font-medium flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" />
                  {apt.doctorName} • <span className="text-slate-500">{apt.specialty}</span>
                </p>
              </div>

              {/* Date Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center md:text-right shrink-0">
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Appointment Date
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {formatDatePretty(apt.appointmentDate)}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{apt.hospitalClinic}</span>
              </div>
              {apt.accompaniedByName && (
                <div className="flex items-center space-x-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Accompanied by: {apt.accompaniedByName}</span>
                </div>
              )}
            </div>

            {apt.preparationNotes && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Preparation Checklist: </span>
                  {apt.preparationNotes}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleSendReminder(apt.title)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email Alert to Circle</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Schedule Appointment</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology Checkup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Robert Sterling"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude Heart Institute"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preparation Instructions</label>
                <textarea
                  placeholder="e.g. Fasting 6 hours prior, bring blood pressure logs"
                  value={preparationNotes}
                  onChange={(e) => setPreparationNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

