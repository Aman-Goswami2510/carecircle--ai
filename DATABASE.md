# Database Specification

The database is built on PostgreSQL with Row Level Security (RLS) policies.

## Tables
1. `profiles`: User accounts (patient, caregiver, family member).
2. `patients`: Medical profile, conditions, allergies, and hashed passcode.
3. `patient_access`: Shared circle permissions matrix.
4. `invitations`: Secure email invitation tokens for new caregivers.
5. `medications`: Medication name, dose, form, instructions, inventory count.
6. `medication_schedules`: Frequency, times of day, days of week.
7. `medication_doses`: Scheduled, taken, missed, or skipped dose records.
8. `appointments`: Doctor visits, location, time, and preparation notes.
9. `emergency_contacts`: Priority ordered emergency phone lines.
10. `care_notes`: Daily clinical logs, vitals observations, and diet notes.
11. `notifications`: In-app notification queue.
12. `email_delivery_logs`: Transactional email delivery and audit trail records.
13. `activity_logs`: Audit trail of all actions performed across the patient profile.

Full DDL available in `supabase/schema.sql`.

