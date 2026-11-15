"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Patient,
  Medication,
  MedicationDose,
  Appointment,
  CareTeamMember,
  CareNote,
  EmergencyContact,
  EmailDeliveryRecord,
  ActivityLog,
  Profile,
  UserRole
} from "@/types";
import {
  DEMO_PROFILES,
  DEMO_PATIENT,
  DEMO_MEDICATIONS,
  DEMO_DOSES,
  DEMO_APPOINTMENTS,
  DEMO_CARE_TEAM,
  DEMO_CARE_NOTES,
  DEMO_EMERGENCY_CONTACTS,
  DEMO_EMAIL_LOGS,
  DEMO_ACTIVITY_LOGS
} from "@/lib/demo-data";

interface CareContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentProfile: Profile;
  patient: Patient;
  medications: Medication[];
  doses: MedicationDose[];
  appointments: Appointment[];
  careTeam: CareTeamMember[];
  careNotes: CareNote[];
  emergencyContacts: EmergencyContact[];
  emailLogs: EmailDeliveryRecord[];
  activityLogs: ActivityLog[];
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: "normal" | "large" | "xlarge";
  setFontSize: (size: "normal" | "large" | "xlarge") => void;
  // Actions
  logDoseStatus: (doseId: string, status: "taken" | "missed" | "skipped") => void;
  addMedication: (med: Omit<Medication, "id" | "patientId" | "isActive">) => void;
  editMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  addAppointment: (apt: Omit<Appointment, "id" | "patientId" | "status">) => void;
  addCareNote: (note: { category: any; title: string; content: string; isFlagged: boolean }) => void;
  inviteCareMember: (member: { fullName: string; email: string; phone: string; role: any }) => void;
  sendManualReminder: (type: "dose" | "appointment" | "missed", recipientEmail: string) => Promise<boolean>;
  resetDemoData: () => void;
}

const CareContext = createContext<CareContextType | undefined>(undefined);

export function CareProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("patient");
  const [medications, setMedications] = useState<Medication[]>(DEMO_MEDICATIONS);
  const [doses, setDoses] = useState<MedicationDose[]>(DEMO_DOSES);
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(DEMO_CARE_TEAM);
  const [careNotes, setCareNotes] = useState<CareNote[]>(DEMO_CARE_NOTES);
  const [emergencyContacts] = useState<EmergencyContact[]>(DEMO_EMERGENCY_CONTACTS);
  const [emailLogs, setEmailLogs] = useState<EmailDeliveryRecord[]>(DEMO_EMAIL_LOGS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(DEMO_ACTIVITY_LOGS);
  
  // Accessibility state
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("large");

  // Sync high contrast class to html root
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [isHighContrast]);

  const currentProfile = DEMO_PROFILES[currentRole] || DEMO_PROFILES.patient;

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

  const logDoseStatus = (doseId: string, status: "taken" | "missed" | "skipped") => {
    setDoses((prev) =>
      prev.map((d) => {
        if (d.id === doseId) {
          const updated = {
            ...d,
            status,
            takenTime: status === "taken" ? new Date().toISOString() : undefined,
            loggedByName: currentProfile.fullName,
          };
          return updated;
        }
        return d;
      })
    );

    const doseItem = doses.find((d) => d.id === doseId);
    if (doseItem) {
      const newActivity: ActivityLog = {
        id: "act_" + Math.random().toString(36).substr(2, 9),
        patientId: DEMO_PATIENT.id,
        actorName: currentProfile.fullName,
        actorRole: currentRole,
        action: `Marked dose ${doseItem.medicationName} as ${status.toUpperCase()}`,
        details: `Recorded at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        createdAt: new Date().toISOString(),
      };
      setActivityLogs((prev) => [newActivity, ...prev]);

      // If marked missed, simulate instant alert to caregivers
      if (status === "missed") {
        const emailRecord: EmailDeliveryRecord = {
          id: "em_" + Math.random().toString(36).substr(2, 9),
          recipientEmail: "marcus.vance@carecircle.demo",
          recipientName: "Marcus Vance",
          subject: `Care Alert: Eleanor missed ${doseItem.medicationName}`,
          notificationType: "missed_dose",
          status: "delivered",
          provider: "local_engine",
          deliveredAt: new Date().toISOString(),
          details: `Automatic missed-dose alert dispatched to primary caregiver.`,
        };
        setEmailLogs((prev) => [emailRecord, ...prev]);
      }
    }
  };

  const addMedication = (med: Omit<Medication, "id" | "patientId" | "isActive">) => {
    const newMed: Medication = {
      ...med,
      id: "med_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      isActive: true,
    };
    setMedications((prev) => [newMed, ...prev]);

    // Generate dose for today
    med.timesOfDay.forEach((timeSlot) => {
      const [h, m] = timeSlot.split(":");
      const schedTime = new Date();
      schedTime.setHours(parseInt(h), parseInt(m), 0, 0);

      const newDose: MedicationDose = {
        id: "dose_" + Math.random().toString(36).substr(2, 9),
        medicationId: newMed.id,
        medicationName: `${newMed.name} ${newMed.dosage}`,
        dosage: newMed.dosage,
        patientId: DEMO_PATIENT.id,
        scheduledTime: schedTime.toISOString(),
        timeSlot: `${timeSlot}`,
        status: "scheduled",
        colorCode: newMed.colorCode,
      };
      setDoses((prev) => [...prev, newDose]);
    });

    const newActivity: ActivityLog = {
      id: "act_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      actorName: currentProfile.fullName,
      actorRole: currentRole,
      action: `Added New Medication: ${newMed.name} (${newMed.dosage})`,
      details: `Scheduled times: ${newMed.timesOfDay.join(", ")}`,
      createdAt: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newActivity, ...prev]);
  };

  const editMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    setDoses((prev) => prev.filter((d) => d.medicationId !== id));
  };

  const addAppointment = (apt: Omit<Appointment, "id" | "patientId" | "status">) => {
    const newApt: Appointment = {
      ...apt,
      id: "apt_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      status: "scheduled",
    };
    setAppointments((prev) => [newApt, ...prev]);

    const newActivity: ActivityLog = {
      id: "act_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      actorName: currentProfile.fullName,
      actorRole: currentRole,
      action: `Scheduled Appointment: ${newApt.title}`,
      details: `With ${newApt.doctorName} at ${newApt.hospitalClinic}`,
      createdAt: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newActivity, ...prev]);
  };

  const addCareNote = (note: { category: any; title: string; content: string; isFlagged: boolean }) => {
    const newNote: CareNote = {
      id: "note_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      authorId: currentProfile.id,
      authorName: currentProfile.fullName,
      authorRole: currentRole.toUpperCase(),
      category: note.category,
      title: note.title,
      content: note.content,
      isFlagged: note.isFlagged,
      createdAt: new Date().toISOString(),
    };
    setCareNotes((prev) => [newNote, ...prev]);

    const newActivity: ActivityLog = {
      id: "act_" + Math.random().toString(36).substr(2, 9),
      patientId: DEMO_PATIENT.id,
      actorName: currentProfile.fullName,
      actorRole: currentRole,
      action: `Added Care Note: ${note.title}`,
      details: note.content.slice(0, 80) + "...",
      createdAt: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newActivity, ...prev]);
  };

  const inviteCareMember = (member: { fullName: string; email: string; phone: string; role: any }) => {
    const newMember: CareTeamMember = {
      id: "member_" + Math.random().toString(36).substr(2, 9),
      userId: "usr_" + Math.random().toString(36).substr(2, 9),
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      permissions: {
        canView: true,
        canEditMedications: member.role === "caregiver",
        canLogDoses: true,
        canManageAppointments: true,
        canInvite: false,
      },
      status: "active",
    };
    setCareTeam((prev) => [...prev, newMember]);

    const emailRecord: EmailDeliveryRecord = {
      id: "em_" + Math.random().toString(36).substr(2, 9),
      recipientEmail: member.email,
      recipientName: member.fullName,
      subject: `CareCircle Invitation to join Eleanor Vance's Care Circle`,
      notificationType: "invite",
      status: "delivered",
      provider: "local_engine",
      deliveredAt: new Date().toISOString(),
      details: `Secure passcode invitation token delivered to ${member.email}`,
    };
    setEmailLogs((prev) => [emailRecord, ...prev]);
  };

  const sendManualReminder = async (type: "dose" | "appointment" | "missed", recipientEmail: string) => {
    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          recipientName: "Family / Caregiver",
          subject:
            type === "dose"
              ? "Urgent Reminder: Eleanor's Upcoming Evening Medication"
              : type === "missed"
              ? "Care Alert: Eleanor's Unconfirmed Medication Dose"
              : "Upcoming Medical Appointment for Eleanor Vance",
          notificationType: type === "dose" ? "dose_reminder" : type === "missed" ? "missed_dose" : "appointment_upcoming",
          headline: `Healthcare Reminder for Eleanor Vance`,
          messageBody: `Please check Eleanor's care portal to confirm safe administration of scheduled therapies.`,
          patientName: "Eleanor Vance",
        }),
      });
      const data = await res.json();
      if (data.delivery) {
        setEmailLogs((prev) => [data.delivery, ...prev]);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const resetDemoData = () => {
    setMedications(DEMO_MEDICATIONS);
    setDoses(DEMO_DOSES);
    setAppointments(DEMO_APPOINTMENTS);
    setCareTeam(DEMO_CARE_TEAM);
    setCareNotes(DEMO_CARE_NOTES);
    setEmailLogs(DEMO_EMAIL_LOGS);
    setActivityLogs(DEMO_ACTIVITY_LOGS);
  };

  return (
    <CareContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentProfile,
        patient: DEMO_PATIENT,
        medications,
        doses,
        appointments,
        careTeam,
        careNotes,
        emergencyContacts,
        emailLogs,
        activityLogs,
        isHighContrast,
        toggleHighContrast,
        fontSize,
        setFontSize,
        logDoseStatus,
        addMedication,
        editMedication,
        deleteMedication,
        addAppointment,
        addCareNote,
        inviteCareMember,
        sendManualReminder,
        resetDemoData,
      }}
    >
      {children}
    </CareContext.Provider>
  );
}

export function useCare() {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error("useCare must be used within a CareProvider");
  }
  return context;
}

