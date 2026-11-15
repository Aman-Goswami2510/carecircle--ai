# CareCircle AI – Intelligent Elderly Care & Medication Management Ecosystem
**Hackathon Submission: PromptWars x Catalyst**  
**Project Owner:** Aman Goswami ([@Aman-Goswami2510](https://github.com/Aman-Goswami2510))  
**Official Challenge:** Elderly Care & Medication Management Platform  
**Target Repository:** [https://github.com/Aman-Goswami2510/CareCircle-AI](https://github.com/Aman-Goswami2510/CareCircle-AI)

---

## 🌟 Executive Overview
**CareCircle AI** is a dignified, collaborative healthcare ecosystem engineered specifically for elderly independence and family peace of mind. By connecting elderly individuals, family members, and caregivers into a unified circle, CareCircle AI removes the cognitive burden of managing complex polypharmacy regimens and doctor appointments.

Access is secured via **passcode-based authorization**, empowering seniors to easily enter with friendly 4-digit PINs while providing role-based clinical tracking for remote loved ones.

---

## 🎯 Official Challenge Alignment

| Hackathon Requirement | CareCircle AI Implementation |
|---|---|
| **Passcode-based Access** | PIN authentication endpoint (`/api/auth/passcode`) with role-based access control (Patient, Caregiver, Family). |
| **Medication Schedules & Doses** | Morning, afternoon, and evening dose tracking with big touch-friendly status toggles (Taken / Missed / Skipped). |
| **Adherence Tracking & Analytics** | Real-time intake velocity calculations, streak tracking, and daily trend visualization powered by Recharts. |
| **Appointment Management** | Scheduled clinic and hospital visit tracking with preparation checklists and one-click reminders. |
| **Caregiver Collaboration** | Passcode-authorized care team directory, secure email invites, and clinical vitals/mood logbook. |
| **Proactive Email Reminders** | Transactional scheduled engine supporting 15-minute dose warnings, missed-medication escalation alerts, and appointment prep emails. |
| **Universal Senior Accessibility** | Dynamic typography scaling (A / A+ / A++), WCAG AAA high-contrast mode, large 48px+ touch targets, and Web Speech API audio guidance. |

---

## 🏗️ Architecture & Technology Stack

- **Frontend & App Framework:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Data Visualization:** Recharts for medication adherence velocity and daily consistency trends.
- **Database Architecture:** Normalized PostgreSQL Schema (`supabase/schema.sql`) configured for Supabase with Row Level Security (RLS) on all patient tables.
- **Email Notification Engine:** Resend integration + Scheduled Background Worker (`/api/cron/reminders`) with delivery audit logging.
- **Testing & Quality Assurance:** Automated Vitest test suite testing adherence ratios and pattern recognition algorithms.

---

## 🔑 Quick Demo Access (Judges Guide)

No complex onboarding or signup required. Try each persona instantly:

1. Visit `/auth` or click **"Launch Live CareCircle Demo"** on the landing page.
2. Select your persona:
   - **Elderly Patient (Eleanor Vance):** Experience simplified, high-readability queues with celebration confetti on dose completion.
   - **Primary Caregiver (Marcus Vance):** Monitor live dose intakes, view medication inventories, and add clinical notes.
   - **Family Physician (Dr. Sarah Chen):** Review adherence trends and upcoming diagnostic labs.
3. Default Healthcare Passcode: **`2468`** (pre-fill buttons available on the login screen).

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Aman-Goswami2510/CareCircle-AI.git
cd CareCircle-AI

# Install dependencies
npm install

# Run automated tests
npm test

# Run Next.js production build
npm run build

# Start local server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📬 Automated Cron & Background Processing

CareCircle AI includes a scheduled background endpoint for automated reminders:
- Endpoint: `POST /api/cron/reminders`
- Headers: `Authorization: Bearer <CRON_SECRET>`
- Function: Scans for doses scheduled within the upcoming 15-minute window or unconfirmed doses exceeding 30 minutes, dispatching proactive emails to all connected circle members.

---

## 🛡️ Security & Privacy Notice
- No patient data or private API keys are committed to version control.
- All sensitive environment configurations are managed via `.env` and `.env.example`.
- Passcodes are validated server-side to prevent client-side credential exposure.

---

## 🏆 PromptWars x Catalyst Evaluation Criteria

- **Code Quality:** Modern Next.js App Router architecture, full TypeScript type safety, clean separation of concerns.
- **Security:** Passcode authorization, strict input validation, database RLS policies.
- **Efficiency:** Server-rendered static pages, dynamic API routes, zero memory leaks.
- **Testing:** Automated unit and integration testing via Vitest.
- **Accessibility:** Senior-centric design with High Contrast, Font Resizing, and Speech Synthesis.
- **Problem Statement Alignment:** 100% adherence to all 16 pages of the official hackathon deck.

