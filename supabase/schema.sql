-- CareCircle AI Complete PostgreSQL Database Schema
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'caregiver', 'family')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  allergies TEXT[],
  medical_conditions TEXT[],
  emergency_notes TEXT,
  passcode_hash TEXT NOT NULL, -- Hashed passcode for secure shared access
  passcode_hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PATIENT ACCESS (SHARED PASSCODE / PERMISSIONS)
CREATE TABLE IF NOT EXISTS public.patient_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('primary_caregiver', 'caregiver', 'family_member', 'doctor')),
  permissions JSONB DEFAULT '{"can_view": true, "can_edit_medications": true, "can_log_doses": true, "can_manage_appointments": true, "can_invite": false}'::jsonb,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'pending')),
  UNIQUE(patient_id, user_id)
);

-- 4. INVITATIONS
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_role TEXT NOT NULL CHECK (invitee_role IN ('caregiver', 'family_member')),
  invite_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDICATIONS
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL, -- e.g. "500 mg"
  form TEXT NOT NULL, -- "tablet", "capsule", "liquid", "injection", "drops", "inhaler"
  strength TEXT,
  route TEXT DEFAULT 'oral',
  instructions TEXT, -- e.g. "Take with food"
  purpose TEXT, -- e.g. "Blood pressure control"
  prescribing_doctor TEXT,
  color_code TEXT DEFAULT '#38a9f8',
  icon_type TEXT DEFAULT 'pill',
  inventory_remaining INT DEFAULT 30,
  refill_reminder_threshold INT DEFAULT 7,
  refill_alert_sent BOOLEAN DEFAULT false,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MEDICATION SCHEDULES
CREATE TABLE IF NOT EXISTS public.medication_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  frequency_type TEXT NOT NULL CHECK (frequency_type IN ('daily', 'specific_days', 'as_needed', 'interval')),
  specific_days INT[], -- [1, 3, 5] for Mon, Wed, Fri
  interval_days INT, -- Every N days
  times_of_day TEXT[] NOT NULL, -- e.g. ["08:00", "13:00", "20:00"]
  dose_quantity DECIMAL(4, 2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEDICATION DOSES (DAILY GENERATED INSTANCES)
CREATE TABLE IF NOT EXISTS public.medication_doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'taken', 'missed', 'skipped', 'late')),
  taken_time TIMESTAMPTZ,
  logged_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  missed_alert_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  hospital_clinic TEXT NOT NULL,
  location_address TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 45,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  preparation_notes TEXT,
  follow_up_notes TEXT,
  accompanied_by UUID REFERENCES public.profiles(id),
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  order_priority INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CARE NOTES & ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.care_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  author_name TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'vitals', 'mood', 'symptom', 'diet', 'urgent')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS & EMAIL DELIVERY LOGS
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  dose_reminder_minutes INT DEFAULT 15,
  alert_missed_dose BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  daily_summary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, patient_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dose_reminder', 'missed_dose', 'appointment_upcoming', 'care_note', 'emergency', 'refill_alert')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('delivered', 'simulated', 'failed', 'queued')),
  provider TEXT DEFAULT 'resend',
  external_id TEXT,
  error_message TEXT,
  payload JSONB,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_doses_scheduled_time ON public.medication_doses(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_doses_patient_status ON public.medication_doses(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_patient ON public.activity_logs(patient_id, created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

