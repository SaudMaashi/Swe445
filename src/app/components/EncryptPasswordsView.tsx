import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const s = {
  wrap: { padding: '36px 40px' },
  header: { marginBottom: 28 },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 },
  title: { fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 },
  subtitle: { fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 },
  banner: { background: 'var(--accent-light)', border: '1px solid oklch(88% 0.06 35)', borderRadius: 8, padding: '12px 16px', marginBottom: 28, fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 },
  fieldLabel: { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 },
  inputWrap: { position: 'relative' as const },
  input: {
    width: '100%', padding: '10px 40px 10px 12px',
    border: '1.5px solid var(--border)', borderRadius: 8,
    fontSize: '0.9rem', color: 'var(--ink)', background: 'var(--canvas)',
    outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
    fontFamily: 'inherit',
  },
  eyeBtn: { position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--subtle)', cursor: 'pointer', padding: 2, display: 'flex' },
  divider: { height: 1, background: 'var(--border)', margin: '24px 0' },
  reqRow: (met: boolean) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 7,
    background: met ? 'var(--sage-light)' : 'var(--surface)',
    border: `1px solid ${met ? 'oklch(82% 0.07 155)' : 'var(--border)'}`,
    marginBottom: 6, transition: 'all 0.2s',
  }),
  dot: (met: boolean) => ({
    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: met ? 'var(--sage)' : 'var(--border)',
    fontSize: '0.65rem', color: 'white', fontWeight: 800,
  }),
  reqText: (met: boolean) => ({ fontSize: '0.83rem', color: met ? 'var(--sage)' : 'var(--muted)', fontWeight: met ? 600 : 400 }),
  btn: (enabled: boolean) => ({
    width: '100%', padding: '11px', borderRadius: 8, border: 'none',
    background: enabled ? 'var(--ink)' : 'var(--surface)',
    color: enabled ? 'var(--canvas)' : 'var(--subtle)',
    fontSize: '0.9rem', fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.15s', marginTop: 20,
  }),
  infoCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px', marginTop: 20 },
  infoRow: { display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--ink-2)', marginBottom: 6, lineHeight: 1.4 },
  sectionLabel: { fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 12 },
};

export function EncryptPasswordsView() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const reqs = [
    { text: 'At least 8 characters',        met: password.length >= 8 },
    { text: 'Contains uppercase letter',     met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter',     met: /[a-z]/.test(password) },
    { text: 'Contains number',               met: /[0-9]/.test(password) },
    { text: 'Contains special character',    met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const allMet = reqs.every(r => r.met);
  const matches = password === confirm && password.length > 0;
  const canSubmit = allMet && matches && !processing;

  const handleEncrypt = () => {
    if (!canSubmit) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1400);
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.label}>Feature 1 of 4 · AUTH-05</div>
        <h2 style={s.title}>Password Encryption</h2>
        <p style={s.subtitle}>Mitigates MUC-01: Steal Login Credentials</p>
      </div>

      <div style={s.banner}>
        Passwords are stored as bcrypt hashes with a per-user salt — even if the database is compromised, plaintext passwords cannot be retrieved.
      </div>

      {done ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>✓</div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)', marginBottom: 6 }}>Password Encrypted &amp; Stored</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 24 }}>Stored as bcrypt hash with random salt (AUTH-05)</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 20px', display: 'inline-block', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--ink-2)', letterSpacing: '0.02em' }}>
            $2b$12$eW8XnAR…[hash truncated]
          </div>
          <br />
          <button onClick={() => { setDone(false); setPassword(''); setConfirm(''); }} style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>← Try another password</button>
        </div>
      ) : (
        <div style={s.grid}>
          <div>
            <p style={s.sectionLabel}>Create password</p>
            <div style={{ marginBottom: 16 }}>
              <label style={s.fieldLabel}>Password</label>
              <div style={s.inputWrap}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={s.input}
                  onFocus={e => { e.target.style.borderColor = 'var(--ink)'; e.target.style.boxShadow = '0 0 0 3px oklch(20% 0.022 42 / 0.07)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button style={s.eyeBtn} onClick={() => setShowPw(!showPw)} type="button">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={s.fieldLabel}>Confirm Password</label>
              <div style={s.inputWrap}>
                <input
                  type={showCf ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  style={{ ...s.input, borderColor: confirm && !matches ? 'var(--red)' : matches ? 'var(--sage)' : 'var(--border)' }}
                  onFocus={e => { e.target.style.boxShadow = '0 0 0 3px oklch(20% 0.022 42 / 0.07)'; }}
                  onBlur={e => { e.target.style.boxShadow = 'none'; }}
                />
                <button style={s.eyeBtn} onClick={() => setShowCf(!showCf)} type="button">
                  {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && !matches && <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 5 }}>Passwords do not match</p>}
              {matches && <p style={{ fontSize: '0.75rem', color: 'var(--sage)', marginTop: 5 }}>✓ Passwords match</p>}
            </div>
            <button onClick={handleEncrypt} disabled={!canSubmit} style={s.btn(canSubmit)}>
              {processing ? 'Encrypting…' : 'Encrypt &amp; Store Password'}
            </button>
          </div>

          <div>
            <p style={s.sectionLabel}>Requirements (AUTH-03)</p>
            {reqs.map((r, i) => (
              <div key={i} style={s.reqRow(r.met)}>
                <div style={s.dot(r.met)}>{r.met ? '✓' : '✗'}</div>
                <span style={s.reqText(r.met)}>{r.text}</span>
              </div>
            ))}
            <div style={s.infoCard}>
              <p style={{ ...s.sectionLabel, marginBottom: 10 }}>Encryption method</p>
              <div style={s.infoRow}><span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Algorithm:</span> bcrypt with random salt</div>
              <div style={s.infoRow}><span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Requirement:</span> AUTH-05</div>
              <div style={s.infoRow}><span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>Protection:</span> Rainbow table &amp; brute-force resistant</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
