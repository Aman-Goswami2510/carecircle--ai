export type UserRole = "patient" | "caregiver" | "family";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  profileId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyNotes: string;
  passcodeHint?: string;
  activeCaregiversCount: number;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dosage: string; // e.g. "500 mg"
  form: "tablet" | "capsule" | "liquid" | "injection" | "drops" | "inhaler";
  route: string;
  instructions: string;
  purpose: string;
  prescribingDoctor?: string;
  colorCode: string;
  iconType: string;
  inventoryRemaining: number;
  refillReminderThreshold: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  timesOfDay: string[]; // e.g. ["08:00", "14:00", "20:00"]
}

export type DoseStatus = "scheduled" | "taken" | "missed" | "skipped" | "late";

export interface MedicationDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  patientId: string;
  scheduledTime: string; // ISO date-time
  timeSlot: string; // "08:00 AM"
  status: DoseStatus;
  takenTime?: string;
  loggedBy?: string;
  loggedByName?: string;
  notes?: string;
  colorCode: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  doctorName: string;
  specialty: string;
  hospitalClinic: string;
  locationAddress: string;
  appointmentDate: string; // ISO date-time
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  preparationNotes?: string;
  followUpNotes?: string;
  accompaniedByName?: string;
}

export interface CareTeamMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: "primary_caregiver" | "caregiver" | "family_member" | "doctor";
  avatarUrl?: string;
  permissions: {
    canView: boolean;
    canEditMedications: boolean;
    canLogDoses: boolean;
    canManageAppointments: boolean;
    canInvite: boolean;
  };
  status: "active" | "pending";
}

export interface CareNote {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  category: "general" | "vitals" | "mood" | "symptom" | "diet" | "urgent";
  title: string;
  content: string;
  isFlagged: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  isPrimary: boolean;
  orderPriority: number;
}

export interface AdherenceStats {
  overallPercentage: number;
  totalScheduled: number;
  totalTaken: number;
  totalMissed: number;
  totalSkipped: number;
  weeklyAdherence: { day: string; percentage: number; taken: number; scheduled: number }[];
  medicationBreakdown: { medicationName: string; percentage: number; total: number }[];
  streakDays: number;
  missedPatterns: string[];
}

export interface EmailDeliveryRecord {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  notificationType: "dose_reminder" | "missed_dose" | "appointment_upcoming" | "care_note" | "invite";
  status: "delivered" | "simulated" | "failed";
  provider: "resend" | "local_engine";
  deliveredAt: string;
  details?: string;
}

export interface ActivityLog {
  id: string;
  patientId: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  createdAt: string;
}

