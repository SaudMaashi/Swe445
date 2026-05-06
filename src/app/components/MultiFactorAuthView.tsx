import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const DEMO_CODE = '123456';

const s = {
  wrap: { padding: '36px 40px' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 700 as const, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 },
  title: { fontSize: '1.4rem', fontWeight: 800 as const, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 },
  subtitle: { fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 },
  banner: { background: 'var(--accent-light)', border: '1px solid oklch(88% 0.06 35)', borderRadius: 8, padding: '12px 16px', marginBottom: 28, fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 as const },
  fieldLabel: { display: 'block', fontSize: '0.78rem', fontWeight: 700 as const, color: 'var(--ink-2)', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', color: 'var(--ink)', background: 'var(--canvas)', outline: 'none', fontFamily: 'inherit' },
  btn: (on: boolean) => ({ padding: '11px 24px', borderRadius: 8, border: 'none', background: on ? 'var(--ink)' : 'var(--surface)', color: on ? 'var(--canvas)' : 'var(--subtle)', fontSize: '0.9rem', fontWeight: 700 as const, cursor: on ? 'pointer' : 'not-allowed' as const, transition: 'all 0.15s', width: '100%' }),
  sectionLabel: { fontSize: '0.7rem', fontWeight: 700 as const, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 12 },
  methodBtn: (active: boolean) => ({ flex: 1, padding: '14px 10px', background: active ? 'var(--canvas)' : 'transparent', border: `1.5px solid ${active ? 'var(--border-strong)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', textAlign: 'center' as const, transition: 'all 0.15s', position: 'relative' as const }),
  otpInput: { width: 48, height: 56, textAlign: 'center' as const, fontSize: '1.4rem', fontWeight: 700 as const, border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--canvas)', color: 'var(--ink)', outline: 'none', fontFamily: 'inherit' },
};

export function MultiFactorAuthView() {
  const [step, setStep] = useState<'creds' | 'otp' | 'success'>('creds');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) setStep('otp');
  };

  const handleOtpInput = (i: number, val: string) => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const next = [...code]; next[i] = val; setCode(next); setError(false);
      if (val && i < 5) (document.getElementById(`otp-${i+1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) (document.getElementById(`otp-${i-1}`) as HTMLInputElement)?.focus();
  };

  const handleVerify = () => {
    setVerifying(true); setError(false);
    setTimeout(() => {
      setVerifying(false);
      if (code.join('') === DEMO_CODE) { setStep('success'); }
      else { setError(true); setCode(['', '', '', '', '', '']); (document.getElementById('otp-0') as HTMLInputElement)?.focus(); }
    }, 1000);
  };

  const codeComplete = code.every(d => d !== '');

  const methods = [
    { id: 'app' as const, icon: '📱', label: 'Authenticator App', sub: 'Most secure' },
    { id: 'sms' as const, icon: '💬', label: 'SMS Code',          sub: 'Text message' },
    { id: 'email' as const, icon: '✉️', label: 'Email Code',       sub: 'Email verification' },
  ];

  return (
    <div style={s.wrap}>
      <div style={{ marginBottom: 28 }}>
        <div style={s.label}>Feature 2 of 4 · AUTH-02</div>
        <h2 style={s.title}>Multi-Factor Authentication</h2>
        <p style={s.subtitle}>Mitigates MUC-01: Steal Login Credentials</p>
      </div>

      <div style={s.banner}>
        Even if credentials are stolen, attackers cannot access the system without the second factor (AUTH-02).
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['Credentials', 'Verify Identity', 'Access Granted'].map((label, i) => {
          const stepIdx = step === 'creds' ? 0 : step === 'otp' ? 1 : 2;
          const done = i < stepIdx; const active = i === stepIdx;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0, background: done ? 'var(--sage)' : active ? 'var(--accent)' : 'var(--surface)', color: done || active ? 'white' : 'var(--subtle)', border: `1.5px solid ${done ? 'var(--sage)' : active ? 'var(--accent)' : 'var(--border)'}` }}>{done ? '✓' : i + 1}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: active ? 700 : 500, color: active ? 'var(--ink)' : done ? 'var(--sage)' : 'var(--muted)' }}>{label}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: done ? 'var(--sage)' : 'var(--border)' }} />}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 'creds' && (
        <div style={{ maxWidth: 400 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={s.fieldLabel}>Username</label>
              <input style={s.input} type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="doctor@asshifa.com" required />
            </div>
            <div>
              <label style={s.fieldLabel}>Password</label>
              <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <button type="submit" style={{ ...s.btn(true), marginTop: 4 }}>Continue to MFA →</button>
          </form>
          <div style={{ marginTop: 16, background: 'var(--amber-light)', border: '1px solid oklch(84% 0.07 75)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: 'var(--amber)', fontWeight: 600 }}>
            MFA is required for all doctors and administrators (AUTH-02)
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 'otp' && (
        <div style={{ maxWidth: 520 }}>
          <p style={s.sectionLabel}>Select verification method</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {methods.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={s.methodBtn(method === m.id)}>
                {method === m.id && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)', borderRadius: '8px 8px 0 0' }} />}
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{m.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{m.sub}</div>
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '24px', marginBottom: 16 }}>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-2)', marginBottom: 18 }}>
              Enter the 6-digit code from your {method === 'app' ? 'authenticator app' : method === 'sms' ? 'SMS' : 'email'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{ ...s.otpInput, borderColor: error ? 'var(--red)' : digit ? 'var(--border-strong)' : 'var(--border)' }}
                />
              ))}
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--red-light)', border: '1px solid oklch(82% 0.07 25)', borderRadius: 7, padding: '10px 14px', marginBottom: 12, fontSize: '0.82rem', color: 'var(--red)', fontWeight: 600 }}>
                <AlertCircle size={15} /> Invalid verification code. Please try again.
              </div>
            )}
            <button onClick={handleVerify} disabled={!codeComplete || verifying} style={s.btn(codeComplete && !verifying)}>
              {verifying ? 'Verifying…' : 'Verify and Login'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--subtle)', marginTop: 10 }}>Demo hint: correct code is <strong style={{ color: 'var(--ink-2)' }}>123456</strong></p>
          </div>
          <button onClick={() => setStep('creds')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>← Back to login</button>
        </div>
      )}

      {/* Step 3 */}
      {step === 'success' && (
        <div style={{ maxWidth: 440 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 28px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>✓</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>Authentication Successful</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Identity verified with multi-factor authentication</p>
          </div>
          <div style={{ background: 'var(--sage-light)', border: '1px solid oklch(82% 0.07 155)', borderRadius: 8, padding: '16px' }}>
            {[
              'Credentials verified (AUTH-01)',
              'MFA completed (AUTH-02)',
              'Role-based access granted (AUTHZ-01)',
              'Login event logged (AUD-01, AUD-03)',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.83rem', color: 'var(--sage)', fontWeight: 600, marginBottom: i < 3 ? 8 : 0 }}>
                <span>✓</span><span>{item}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setStep('creds'); setUsername(''); setPassword(''); setCode(['','','','','','']); setError(false); }} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Start new authentication →</button>
        </div>
      )}
    </div>
  );
}
