"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Users,
  UserPlus,
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  MessageSquarePlus,
  AlertCircle
} from "lucide-react";
import { formatDatePretty } from "@/lib/utils";

export default function CareTeamPage() {
  const { careTeam, careNotes, inviteCareMember, addCareNote, currentProfile } = useCare();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Invite form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<any>("caregiver");

  // Care note form
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<any>("vitals");
  const [isFlagged, setIsFlagged] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    inviteCareMember({ fullName: name, email, phone, role });
    setShowInviteModal(false);
    setInviteSuccess(`Invitation and secure access token sent to ${email}`);
    setName("");
    setEmail("");
    setPhone("");
    setTimeout(() => setInviteSuccess(""), 4500);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    addCareNote({
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      isFlagged,
    });

    setShowNoteModal(false);
    setNoteTitle("");
    setNoteContent("");
    setIsFlagged(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast */}
      {inviteSuccess && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2 text-sm font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-200" />
          <span>{inviteSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Care Team & Family Circle
          </h1>
          <p className="text-slate-600 mt-1">
            Passcode-authorized caregivers, family members, physicians, and daily clinical logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNoteModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-primary-600" />
            <span>Add Care Note</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite to Circle</span>
          </button>
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {careTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-primary-200 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                    {member.fullName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{member.fullName}</h3>
                    <p className="text-xs text-primary-700 font-semibold capitalize">
                      {member.role.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {member.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Permissions list */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] space-y-1">
                <div className="font-bold text-slate-700 mb-1">Access Permissions:</div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>View Eleanor&apos;s healthcare profile</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Log doses & mark intake</span>
                </div>
                {member.permissions.canEditMedications && (
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Edit medications & schedules</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
              <span>Passcode Verified</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Shared Care Notes Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-slate-900">Clinical & Family Care Notes</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {careNotes.length} recorded entries
          </span>
        </div>

        <div className="space-y-4">
          {careNotes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border transition-all ${
                note.isFlagged
                  ? "bg-rose-50/70 border-rose-200"
                  : "bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      note.isFlagged
                        ? "bg-rose-200 text-rose-900"
                        : "bg-primary-100 text-primary-800"
                    }`}
                  >
                    {note.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-900">
                    {note.authorName} ({note.authorRole})
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDatePretty(note.createdAt)}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{note.title}</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Invite Caregiver / Family</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="david@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship / Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="caregiver">Professional / Home Caregiver</option>
                  <option value="family_member">Family Member</option>
                  <option value="doctor">Consulting Physician</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20"
                >
                  Send Passcode Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Care Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Record Care Note</h2>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleNoteSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="vitals">Vitals (BP, Glucose, Pulse)</option>
                  <option value="mood">Mood & Well-being</option>
                  <option value="diet">Diet & Hydration</option>
                  <option value="symptom">Symptoms & Discomfort</option>
                  <option value="general">General Check-in</option>
                  <option value="urgent">Urgent Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Blood Glucose 110 mg/dL"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Observations</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Record patient response, symptoms, or caregiver actions taken..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="flag-check"
                  checked={isFlagged}
                  onChange={(e) => setIsFlagged(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500"
                />
                <label htmlFor="flag-check" className="text-xs font-semibold text-slate-700">
                  Mark as Urgent Alert for Family Circle
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20"
                >
                  Post Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

