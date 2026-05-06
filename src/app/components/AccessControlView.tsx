import { useState } from 'react';

interface User { id: string; name: string; role: 'patient' | 'doctor' | 'administrator' | 'insurance'; email: string; }
interface Record { id: string; patientName: string; patientId: string; assignedDoctor: string; updated: string; }

const users: User[] = [
  { id: '1', name: 'Dr. Sarah Johnson',  role: 'doctor',        email: 'sarah.johnson@asshifa.com' },
  { id: '2', name: 'Ahmad Al-Rashid',    role: 'patient',       email: 'ahmad.rashid@email.com' },
  { id: '3', name: 'Admin Team',         role: 'administrator', email: 'admin@asshifa.com' },
  { id: '4', name: 'Dr. Mohammed Ali',   role: 'doctor',        email: 'mohammed.ali@asshifa.com' },
];

const records: Record[] = [
  { id: 'R001', patientName: 'Ahmad Al-Rashid', patientId: '2', assignedDoctor: 'Dr. Sarah Johnson',  updated: '2026-04-03' },
  { id: 'R002', patientName: 'Fatima Hassan',   patientId: '5', assignedDoctor: 'Dr. Mohammed Ali',   updated: '2026-04-02' },
  { id: 'R003', patientName: 'Omar Khalid',     patientId: '6', assignedDoctor: 'Dr. Sarah Johnson',  updated: '2026-04-01' },
];

function checkAccess(user: User, rec: Record): { granted: boolean; reason: string } {
  if (user.role === 'administrator') return { granted: true, reason: 'Administrator has full access (AUTHZ-04)' };
  if (user.role === 'patient') {
    return user.id === rec.patientId
      ? { granted: true, reason: 'Patient viewing own medical record (AUTHZ-03)' }
      : { granted: false, reason: 'Patients can only view their own records (CONF-03)' };
  }
  if (user.role === 'doctor') {
    return rec.assignedDoctor === user.name
      ? { granted: true, reason: 'Doctor accessing assigned patient record (AUTHZ-02)' }
      : { granted: false, reason: 'Doctors can only access their assigned patients (AUTHZ-02)' };
  }
  return { granted: false, reason: 'Unauthorized access attempt (CONF-03)' };
}

const roleColor = (role: string) => {
  if (role === 'doctor') return { bg: 'oklch(93% 0.02 230)', color: 'oklch(40% 0.12 230)' };
  if (role === 'patient') return { bg: 'var(--sage-light)', color: 'var(--sage)' };
  if (role === 'administrator') return { bg: 'var(--accent-light)', color: 'var(--accent)' };
  return { bg: 'var(--surface)', color: 'var(--muted)' };
};

const s = {
  wrap: { padding: '36px 40px' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 700 as const, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 },
  title: { fontSize: '1.4rem', fontWeight: 800 as const, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 },
  subtitle: { fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 },
  banner: { background: 'var(--accent-light)', border: '1px solid oklch(88% 0.06 35)', borderRadius: 8, padding: '12px 16px', marginBottom: 28, fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 as const },
  sectionLabel: { fontSize: '0.7rem', fontWeight: 700 as const, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 12 },
  selBtn: (active: boolean) => ({
    width: '100%', padding: '12px 14px', textAlign: 'left' as const,
    background: active ? 'var(--canvas)' : 'transparent',
    border: `1.5px solid ${active ? 'var(--border-strong)' : 'var(--border)'}`,
    borderRadius: 8, cursor: 'pointer', marginBottom: 8,
    transition: 'all 0.15s',
    boxShadow: active ? '0 1px 6px oklch(20% 0.022 42 / 0.05)' : 'none',
    position: 'relative' as const,
  }),
};

export function AccessControlView() {
  const [selUser, setSelUser] = useState<User | null>(null);
  const [selRecord, setSelRecord] = useState<Record | null>(null);
  const [result, setResult] = useState<{ granted: boolean; reason: string } | null>(null);

  const handleRequest = () => {
    if (selUser && selRecord) {
      const r = checkAccess(selUser, selRecord);
      setResult(r);
      console.log({ timestamp: new Date().toISOString(), user: selUser.name, role: selUser.role, record: selRecord.id, result: r.granted ? 'GRANTED' : 'DENIED', reason: r.reason });
    }
  };

  return (
    <div style={s.wrap}>
      <div style={{ marginBottom: 28 }}>
        <div style={s.label}>Feature 3 of 4 · AUTHZ-01–04</div>
        <h2 style={s.title}>Access Control (RBAC)</h2>
        <p style={s.subtitle}>Mitigates MUC-02: Access Medical Records Illegally</p>
      </div>

      <div style={s.banner}>
        Role-based access control ensures users can only access records they are authorized for — doctors see only their assigned patients, patients see only their own records.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 20 }}>
        {/* User selection */}
        <div>
          <p style={s.sectionLabel}>1. Select user</p>
          {users.map(u => {
            const rc = roleColor(u.role);
            const active = selUser?.id === u.id;
            return (
              <button key={u.id} style={s.selBtn(active)} onClick={() => { setSelUser(u); setResult(null); }}>
                {active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', borderRadius: '8px 0 0 8px' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: rc.color, flexShrink: 0 }}>
                    {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 2 }}>{u.name}</p>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, background: rc.bg, color: rc.color, padding: '1px 7px', borderRadius: 4, textTransform: 'capitalize' as const }}>{u.role}</span>
                  </div>
                  {active && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Record selection */}
        <div>
          <p style={s.sectionLabel}>2. Select medical record</p>
          {records.map(r => {
            const active = selRecord?.id === r.id;
            return (
              <button key={r.id} style={s.selBtn(active)} onClick={() => { setSelRecord(r); setResult(null); }}>
                {active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)', borderRadius: '8px 0 0 8px' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: 'var(--muted)', flexShrink: 0 }}>{r.id}</div>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', margin: 0, marginBottom: 2 }}>{r.patientName}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', margin: 0 }}>Dr: {r.assignedDoctor} · {r.updated}</p>
                  </div>
                  {active && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, marginLeft: 'auto' }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleRequest}
        disabled={!selUser || !selRecord}
        style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: selUser && selRecord ? 'var(--ink)' : 'var(--surface)', color: selUser && selRecord ? 'var(--canvas)' : 'var(--subtle)', fontSize: '0.9rem', fontWeight: 700, cursor: selUser && selRecord ? 'pointer' : 'not-allowed', marginBottom: 20 }}
      >
        Request Access to Medical Record
      </button>

      {result && (
        <div style={{ background: result.granted ? 'var(--sage-light)' : 'var(--red-light)', border: `1.5px solid ${result.granted ? 'oklch(82% 0.07 155)' : 'oklch(82% 0.07 25)'}`, borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: result.granted ? 'var(--sage)' : 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem', flexShrink: 0 }}>
              {result.granted ? '✓' : '✗'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: result.granted ? 'var(--sage)' : 'var(--red)', margin: 0, marginBottom: 4 }}>
                Access {result.granted ? 'Granted' : 'Denied'}
              </p>
              <p style={{ fontSize: '0.83rem', color: 'var(--ink-2)', margin: 0, marginBottom: 14 }}>{result.reason}</p>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 7, padding: '12px 14px' }}>
                {result.granted ? (
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Access logged (AUD-02, AUD-03)</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.7 }}>User: {selUser?.name} ({selUser?.role})<br />Record: {selRecord?.id} — {selRecord?.patientName}<br />Time: {new Date().toLocaleString()}<br />Action: VIEW_MEDICAL_RECORD</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>⚠ Security Alert (AUD-05)</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ink-2)', margin: 0 }}>This unauthorized access attempt has been logged and flagged for administrator review.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RBAC rules summary */}
      <div style={{ marginTop: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>RBAC Rules</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
          {[
            ['AUTHZ-03', 'Patients — own records only'],
            ['AUTHZ-02', 'Doctors — assigned patients only'],
            ['AUTHZ-04', 'Administrators — full access'],
            ['CONF-03', 'Others — denied &amp; logged'],
          ].map(([id, text]) => (
            <div key={id} style={{ display: 'flex', gap: 8, fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{id}</span>
              <span style={{ color: 'var(--ink-2)' }} dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
