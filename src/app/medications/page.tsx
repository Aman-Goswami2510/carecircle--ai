"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Pill,
  Plus,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle,
  Trash2,
  Edit2,
  PackageOpen
} from "lucide-react";
import { Medication } from "@/types";

export default function MedicationsPage() {
  const { medications, addMedication, editMedication, deleteMedication } = useCare();
  const [showAddModal, setShowAddModal] = useState(false);

  // New medication form state
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState<any>("tablet");
  const [instructions, setInstructions] = useState("");
  const [purpose, setPurpose] = useState("");
  const [doctor, setDoctor] = useState("");
  const [timesOfDay, setTimesOfDay] = useState("08:00");
  const [inventory, setInventory] = useState(30);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    addMedication({
      name,
      genericName: genericName || undefined,
      dosage,
      form,
      route: "Oral",
      instructions: instructions || "Take as directed by physician",
      purpose: purpose || "Therapeutic support",
      prescribingDoctor: doctor || "Primary Physician",
      colorCode: "#0284c7",
      iconType: "pill",
      inventoryRemaining: Number(inventory) || 30,
      refillReminderThreshold: 7,
      startDate: new Date().toISOString().split("T")[0],
      timesOfDay: timesOfDay.split(",").map((s) => s.trim()),
    });

    setShowAddModal(false);
    setName("");
    setDosage("");
    setInstructions("");
    setPurpose("");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medication Management
          </h1>
          <p className="text-slate-600 mt-1">
            Active prescriptions, dosage schedules, refill levels, and instructions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Grid of Medications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medications.map((med) => {
          const isLowInventory = med.inventoryRemaining <= med.refillReminderThreshold;

          return (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-primary-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${med.colorCode}20`, color: med.colorCode }}
                    >
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{med.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {med.dosage} • {med.form.toUpperCase()}
                        {med.genericName && ` (Generic: ${med.genericName})`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isLowInventory
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isLowInventory ? "Refill Soon" : "Active"}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Purpose: </span>
                    <span className="text-slate-600">{med.purpose}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Instructions: </span>
                    <span className="text-slate-600">{med.instructions}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Doctor: {med.prescribingDoctor}</span>
                    <span>Daily Schedule: {med.timesOfDay.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Bottom inventory status & actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <PackageOpen className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-600">
                    Remaining:{" "}
                    <strong className={isLowInventory ? "text-amber-600 font-bold" : "text-slate-900"}>
                      {med.inventoryRemaining} pills
                    </strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add New Medication</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lisinopril"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Form</label>
                  <select
                    value={form}
                    onChange={(e) => setForm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="liquid">Liquid</option>
                    <option value="injection">Injection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Blood Pressure control"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take once daily after breakfast"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Times of Day (HH:MM)</label>
                  <input
                    type="text"
                    placeholder="08:00, 20:00"
                    value={timesOfDay}
                    onChange={(e) => setTimesOfDay(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inventory Count</label>
                  <input
                    type="number"
                    value={inventory}
                    onChange={(e) => setInventory(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-500/20"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

