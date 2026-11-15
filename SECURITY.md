# Security & Compliance Specification

## Security Measures Implemented
1. **Passcode Protection:** Elderly healthcare profiles are secured with hashed passcodes.
2. **Role-Based Access Control (RBAC):** Strict boundaries separating Patient self-care actions from Caregiver medication updates.
3. **No Credential Exposure:** Frontend bundle contains zero database service role keys or private secrets.
4. **Row Level Security (RLS):** Supabase PostgreSQL policies enforce tenant separation by patient profile.
5. **Audit Logging:** Every intake log, note addition, and alert dispatch is recorded in `activity_logs` and `email_delivery_logs`.

