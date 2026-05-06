# As-Shifa Security Mitigation System

**Course:** SWE445 — Software Security · Section 01 · Group 04 · T252  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS  
**Design:** Warm sand/terracotta palette, Hanken Grotesk font (matches research-collab-platform design system)

---

## What this is

A frontend security demonstration system for a healthcare management platform called **As-Shifa**. It implements 4 security controls (mitigation use cases) from the SRS, covering Phase 3 (implementation) and Phase 4 (testing) of the SWE445 project.

---

## How to run

```bash
npm install
npm run dev
# opens at http://localhost:5173
```

Open `presentation.html` in a browser for the 10-slide demo presentation (arrow keys to navigate).

---

## Features

### 1. Password Encryption — `EncryptPasswordsView.tsx`
- **Mitigates:** MUC-01 (Steal Login Credentials)
- **Requirements:** AUTH-03, AUTH-05, CONF-01
- Real-time password strength checker with 5 requirements (8+ chars, uppercase, lowercase, number, special char)
- Password confirmation match validation
- Simulates bcrypt hashing with salt on submit
- Shows encrypted hash output on success

### 2. Multi-Factor Authentication — `MultiFactorAuthView.tsx`
- **Mitigates:** MUC-01 (Steal Login Credentials)
- **Requirements:** AUTH-01, AUTH-02, AUTHZ-01, AUD-01
- 3-step flow: Credentials → 6-digit OTP → Success
- 3 methods: Authenticator App, SMS, Email
- **Demo code: `123456`** — any other code shows "Invalid verification code" error
- Wrong code clears fields and refocuses first input
- No real email/SMS sent — frontend simulation only

### 3. Access Control (RBAC) — `AccessControlView.tsx`
- **Mitigates:** MUC-02 (Access Medical Records Illegally)
- **Requirements:** AUTHZ-01, AUTHZ-02, AUTHZ-03, AUTHZ-04, CONF-03
- Role-based access control logic:
  - **Patient** — own records only (AUTHZ-03)
  - **Doctor** — assigned patients only (AUTHZ-02)
  - **Administrator** — full access (AUTHZ-04)
  - **Others** — denied, alert logged (AUD-05)
- Access attempts logged to browser console with timestamp

### 4. Audit Logs — `AuditLogsView.tsx`
- **Mitigates:** MUC-03 (Modify Medical Records), MUC-04 (Fake Insurance Claim)
- **Requirements:** AUD-01, AUD-02, AUD-03, AUD-04, AUD-05, INT-02
- 7 pre-loaded log entries (success, denied, suspicious)
- Live search by user name, action, or resource ID
- Filter by status: All / Success / Denied / Suspicious
- Suspicious activity alert banner
- "Details" panel per log entry

---

## Database Design (Phase 3)

### Users
| Column | Type | Key |
|---|---|---|
| user_id | VARCHAR | PK |
| name | VARCHAR NOT NULL | |
| email | VARCHAR UNIQUE | AK |
| role | ENUM(patient, doctor, admin, insurance) | |
| password_hash | VARCHAR | — bcrypt, never plaintext |
| created_at | TIMESTAMP | |

### Medical Records
| Column | Type | Key |
|---|---|---|
| record_id | VARCHAR | PK |
| patient_id | VARCHAR | FK → Users |
| assigned_doctor_id | VARCHAR | FK → Users |
| content | TEXT | |
| last_updated | TIMESTAMP | |
| version | INT DEFAULT 1 | |

### Audit Logs
| Column | Type | Key |
|---|---|---|
| log_id | VARCHAR | PK |
| user_id | VARCHAR | FK → Users |
| action | VARCHAR | AUD-01 |
| resource_type | VARCHAR | |
| resource_id | VARCHAR | |
| result | ENUM(success, denied, suspicious) | |
| ip_address | VARCHAR | AUD-02 |
| timestamp | TIMESTAMP | AK — AUD-03 |

---

## Phase 4 Test Cases

| # | Feature | Type | Input | Expected | Status |
|---|---|---|---|---|---|
| TC-01 | Password | Normal | `Admin@1234` + matching confirm | All 5 requirements green, button enabled | PASS |
| TC-02 | Password | Invalid | `abc` | 4 requirements red, button disabled | PASS |
| TC-03 | Password | Boundary | `Admin@12` (exactly 8 chars, all types) | All requirements met | PASS |
| TC-04 | Password | Edge | Strong password, confirm empty | Button stays disabled | PASS |
| TC-05 | MFA | Normal | Credentials → code `123456` | Success screen | PASS |
| TC-06 | MFA | Invalid | Code `000000` | "Invalid verification code" error | PASS |
| TC-07 | MFA | Boundary | 5 digits only | Verify button disabled | PASS |
| TC-08 | MFA | Edge | Empty username/password, submit | Form validation blocks at step 1 | PASS |
| TC-09 | Access Control | Normal | Dr. Sarah + R001 (assigned) | ACCESS GRANTED | PASS |
| TC-10 | Access Control | Invalid | Dr. Mohammed + R001 (not his patient) | ACCESS DENIED + alert | PASS |
| TC-11 | Access Control | Normal | Patient Ahmad + R001 (own record) | ACCESS GRANTED | PASS |
| TC-12 | Access Control | Edge | Click request with nothing selected | Button disabled | PASS |
| TC-13 | Audit Logs | Normal | Filter "Suspicious Only" | 2 entries shown | PASS |
| TC-14 | Audit Logs | Normal | Search "Dr. Sarah" | Filtered to her entries | PASS |
| TC-15 | Audit Logs | Invalid | Search "xyz123" | Empty table | PASS |
| TC-16 | Audit Logs | Edge | View Details on LOG-005 | Full event + admin warning | PASS |

---

## File Structure

```
src/
  app/
    App.tsx                          — main layout, nav tabs
    components/
      EncryptPasswordsView.tsx       — Feature 1
      MultiFactorAuthView.tsx        — Feature 2
      AccessControlView.tsx          — Feature 3
      AuditLogsView.tsx              — Feature 4
  styles/
    globals.css   — CSS variables (terracotta design tokens)
    fonts.css     — Hanken Grotesk import
    index.css     — entry (imports fonts + tailwind + theme)
    tailwind.css  — Tailwind v4 config
    theme.css     — shadcn CSS variable overrides
  main.tsx        — React entry point
presentation.html — 10-slide standalone demo presentation
```

---

## Design System

Pulled from the research-collab-platform project:

```css
--paper:    oklch(97.5% 0.008 42)   /* warm cream background */
--ink:      oklch(20% 0.022 42)     /* near-black text */
--accent:   oklch(52% 0.155 35)     /* terracotta/rust */
--sage:     oklch(58% 0.13 155)     /* green (success) */
--red:      oklch(55% 0.18 25)      /* error/denied */
--amber:    oklch(62% 0.14 75)      /* warning/suspicious */
```

Font: **Hanken Grotesk** (weights 300–800) via Google Fonts.

---

## Threat Model

| Threat | Mitigation | Feature |
|---|---|---|
| MUC-01: Steal Login Credentials | bcrypt hashing + MFA | Password Encryption + MFA |
| MUC-02: Access Medical Records Illegally | RBAC enforcement | Access Control |
| MUC-03: Modify Medical Records | Comprehensive audit trail | Audit Logs |
| MUC-04: Submit Fake Insurance Claim | Activity monitoring + alerts | Audit Logs |
