import { useState } from 'react';
import { EncryptPasswordsView } from './components/EncryptPasswordsView';
import { MultiFactorAuthView } from './components/MultiFactorAuthView';
import { AccessControlView } from './components/AccessControlView';
import { AuditLogsView } from './components/AuditLogsView';

type View = 'encrypt' | 'mfa' | 'access' | 'audit';

const nav: { id: View; label: string; sub: string; icon: string }[] = [
  { id: 'encrypt', label: 'Password Encryption', sub: 'AUTH-05', icon: '🔒' },
  { id: 'mfa',     label: 'Multi-Factor Auth',   sub: 'AUTH-02', icon: '🛡️' },
  { id: 'access',  label: 'Access Control',       sub: 'AUTHZ-01–04', icon: '👥' },
  { id: 'audit',   label: 'Audit Logs',           sub: 'AUD-01–05', icon: '📄' },
];

export default function App() {
  const [active, setActive] = useState<View>('encrypt');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)' }}>As-Shifa</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', borderLeft: '1px solid var(--border)', paddingLeft: 10 }}>Security Controls</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--subtle)', fontWeight: 500 }}>SWE445 · Group 04</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* Threat banner */}
        <div style={{ marginBottom: 28, padding: '14px 20px', background: 'var(--accent-light)', borderRadius: 10, border: '1px solid oklch(88% 0.06 35)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, margin: 0 }}>
            Healthcare Management Platform — 4 security controls mitigating credential theft, illegal record access &amp; insurance fraud
          </p>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
          {nav.map(n => {
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                style={{
                  padding: '16px',
                  background: isActive ? 'var(--canvas)' : 'transparent',
                  border: isActive ? '1.5px solid var(--border-strong)' : '1.5px solid var(--border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  position: 'relative',
                  boxShadow: isActive ? '0 2px 12px oklch(20% 0.022 42 / 0.06)' : 'none',
                }}
              >
                {isActive && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: 'var(--accent)', borderRadius: '10px 10px 0 0' }} />
                )}
                <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{n.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? 'var(--ink)' : 'var(--ink-2)', marginBottom: 3 }}>{n.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--subtle)', background: isActive ? 'var(--accent-light)' : 'transparent', padding: isActive ? '2px 7px' : 0, borderRadius: 4, display: 'inline-block' }}>{n.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px oklch(20% 0.022 42 / 0.05)' }}>
          {active === 'encrypt' && <EncryptPasswordsView />}
          {active === 'mfa'     && <MultiFactorAuthView />}
          {active === 'access'  && <AccessControlView />}
          {active === 'audit'   && <AuditLogsView />}
        </div>
      </div>
    </div>
  );
}
