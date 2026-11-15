import { describe, it, expect } from "vitest";
import { calculateAdherenceStats } from "./adherence";
import { MedicationDose } from "@/types";

describe("CareCircle AI Adherence Calculation Engine", () => {
  it("calculates 100% adherence when all doses are taken", () => {
    const mockDoses: MedicationDose[] = [
      {
        id: "d1",
        medicationId: "m1",
        medicationName: "Amlodipine 5mg",
        dosage: "5mg",
        patientId: "p1",
        scheduledTime: new Date().toISOString(),
        timeSlot: "08:00 AM",
        status: "taken",
        colorCode: "#0284c7",
      },
      {
        id: "d2",
        medicationId: "m2",
        medicationName: "Metformin 500mg",
        dosage: "500mg",
        patientId: "p1",
        scheduledTime: new Date().toISOString(),
        timeSlot: "08:00 AM",
        status: "taken",
        colorCode: "#0d9488",
      },
    ];

    const stats = calculateAdherenceStats(mockDoses);
    expect(stats.overallPercentage).toBe(100);
    expect(stats.totalTaken).toBe(2);
    expect(stats.totalMissed).toBe(0);
  });

  it("calculates correct ratio when doses are missed", () => {
    const mockDoses: MedicationDose[] = [
      {
        id: "d1",
        medicationId: "m1",
        medicationName: "Amlodipine 5mg",
        dosage: "5mg",
        patientId: "p1",
        scheduledTime: new Date().toISOString(),
        timeSlot: "08:00 AM",
        status: "taken",
        colorCode: "#0284c7",
      },
      {
        id: "d2",
        medicationId: "m2",
        medicationName: "Metformin 500mg",
        dosage: "500mg",
        patientId: "p1",
        scheduledTime: new Date().toISOString(),
        timeSlot: "08:00 AM",
        status: "missed",
        colorCode: "#0d9488",
      },
    ];

    const stats = calculateAdherenceStats(mockDoses);
    expect(stats.overallPercentage).toBe(50);
    expect(stats.totalTaken).toBe(1);
    expect(stats.totalMissed).toBe(1);
    expect(stats.riskPatterns.length).toBeGreaterThan(0);
  });
});

