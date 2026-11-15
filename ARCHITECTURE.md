# CareCircle AI Architecture Documentation

## System Architecture Diagram

```
+-------------------------------------------------------------+
|                      CareCircle AI Client                   |
| (Next.js 14 App Router, React 18, Tailwind CSS, Lucide)     |
+------------------------------+------------------------------+
                               |
            HTTP / REST / JSON | Dynamic Server-Side APIs
                               v
+-------------------------------------------------------------+
|                     Next.js Route Handlers                  |
| - /api/auth/passcode         (Passcode verification)        |
| - /api/notifications/send    (Real-time email dispatch)     |
| - /api/cron/reminders        (Automated cron background job)|
+---------------+------------------------------+--------------+
                |                              |
                v                              v
+-------------------------------+ +---------------------------+
|    Supabase PostgreSQL (RLS)  | |  Resend Notification API  |
| - profiles      - patients    | | - Transactional HTML Mail |
| - medications   - doses       | | - Missed-dose alerts      |
| - appointments  - care_notes  | | - Delivery audit trails   |
+-------------------------------+ +---------------------------+
```

## Security & Access Control
- Passcode access ensures seniors do not struggle with password reset links or complex OAuth tokens while maintaining secure boundary controls.
- Role-based permissions allow primary caregivers full management rights while restricting family or observer accounts appropriately.

