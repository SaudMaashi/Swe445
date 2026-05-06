import { useState } from 'react';
import { Search } from 'lucide-react';

interface Log {
  id: string; ts: string; userId: string; userName: string; role: string;
  action: string; resourceType: string; resourceId: string;
  result: 'success' | 'denied' | 'suspicious'; ip: string; details: string;
}

const logs: Log[] = [
  { id:'LOG-001', ts:'2026-04-04 14:23:15', userId:'U001', userName:'Dr. Sarah Johnson',  role:'doctor',        action:'VIEW_MEDICAL_RECORD',    resourceType:'Medical Record',   resourceId:'R001', result:'success',    ip:'192.168.1.100', details:'Accessed assigned patient record (AUTHZ-02)' },
  { id:'LOG-002', ts:'2026-04-04 14:20:45', userId:'U002', userName:'Ahmad Al-Rashid',    role:'patient',       action:'LOGIN',                  resourceType:'Authentication',   resourceId:'N/A',  result:'success',    ip:'192.168.1.105', details:'Successful login with valid credentials (AUTH-01)' },
  { id:'LOG-003', ts:'2026-04-04 14:18:30', userId:'U004', userName:'Dr. Mohammed Ali',   role:'doctor',        action:'VIEW_MEDICAL_RECORD',    resourceType:'Medical Record',   resourceId:'R001', result:'denied',     ip:'192.168.1.102', details:'Attempted to access non-assigned patient record (AUTHZ-02 violation)' },
  { id:'LOG-004', ts:'2026-04-04 14:15:22', userId:'U001', userName:'Dr. Sarah Johnson',  role:'doctor',        action:'UPDATE_MEDICAL_RECORD',  resourceType:'Medical Record',   resourceId:'R003', result:'success',    ip:'192.168.1.100', details:'Updated patient medical information (INT-01, INT-02)' },
  { id:'LOG-005', ts:'2026-04-04 14:12:10', userId:'UNKN', userName:'Unknown User',       role:'unknown',       action:'LOGIN_FAILED',           resourceType:'Authentication',   resourceId:'N/A',  result:'suspicious', ip:'203.45.67.89',  details:'Multiple failed login attempts detected — potential brute force (AUTH-04)' },
  { id:'LOG-006', ts:'2026-04-04 14:10:05', userId:'U003', userName:'Admin Team',         role:'administrator', action:'SUBMIT_INSURANCE_CLAIM', resourceType:'Insurance Claim',  resourceId:'IC-045',result:'success',   ip:'192.168.1.200', details:'Insurance claim submitted successfully (AUD-01)' },
  { id:'LOG-007', ts:'2026-04-04 14:05:30', userId:'U005', userName:'Malicious Insider',  role:'staff',         action:'UPDATE_MEDICAL_RECORD',  resourceType:'Medical Record',   resourceId:'R002', result:'suspicious', ip:'192.168.1.150', details:'Abnormal record modification detected — data integrity alert (INT-04)' },
];

const resultStyle = (r: string) => {
  if (r === 'success')    return { bg: 'var(--sage-light)',   color: 'var(--sage)',   label: 'Success' };
  if (r === 'denied')     return { bg: 'var(--red-light)',    color: 'var(--red)',    label: 'Denied' };
  return                         { bg: 'var(--amber-light)',  color: 'var(--amber)',  label: 'Suspicious' };
};

export function AuditLogsView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'denied' | 'suspicious'>('all');
  const [selected, setSelected] = useState<Log | null>(null);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.userName.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.resourceId.toLowerCase().includes(q);
    return matchSearch && (filter === 'all' || l.result === filter);
  });

  const suspCount = logs.filter(l => l.result === 'suspicious').length;

  return (
    <div style={{ padding: '36px 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 6 }}>Feature 4 of 4 · AUD-01–05</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Audit Logs &amp; Activity Monitoring</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>Mitigates MUC-03 &amp; MUC-04: Record Tampering &amp; Fake Insurance Claims</p>
      </div>

      {/* Suspicious alert */}
      {suspCount > 0 && (
        <div style={{ background: 'var(--amber-light)', border: '1.5px solid oklch(82% 0.08 75)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1rem' }}>⚠️</span>
          <p style={{ fontSize: '0.82rem', color: 'var(--amber)', fontWeight: 700, margin: 0 }}>
            {suspCount} suspicious {suspCount === 1 ? 'activity' : 'activities'} detected — administrator review required (AUD-05)
          </p>
        </div>
      )}

      {/* Search + filter */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--subtle)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, action, or resource…"
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--ink)', background: 'var(--canvas)', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'success', 'denied', 'suspicious'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ padding: '8px 12px', borderRadius: 7, border: `1.5px solid ${filter === f ? 'var(--border-strong)' : 'var(--border)'}`, background: filter === f ? 'var(--canvas)' : 'transparent', fontSize: '0.75rem', fontWeight: 600, color: filter === f ? 'var(--ink)' : 'var(--muted)', cursor: 'pointer', textTransform: 'capitalize' as const }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {['Timestamp', 'User', 'Action', 'Resource', 'Status', 'IP Address', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center' as const, fontSize: '0.85rem', color: 'var(--subtle)' }}>No results found</td></tr>
            ) : filtered.map(l => {
              const rs = resultStyle(l.result);
              return (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', background: l.result === 'suspicious' ? 'oklch(97.5% 0.015 75)' : l.result === 'denied' ? 'oklch(98.5% 0.01 25)' : 'transparent' }}>
                  <td style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--ink-2)', whiteSpace: 'nowrap' as const, fontFamily: 'monospace' }}>{l.ts}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>{l.userName}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'capitalize' as const }}>{l.role}</p>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--ink-2)', whiteSpace: 'nowrap' as const }}>{l.action.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--ink-2)' }}>{l.resourceType}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{l.resourceId}</p>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: rs.bg, color: rs.color, padding: '3px 8px', borderRadius: 5, textTransform: 'capitalize' as const }}>{rs.label}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{l.ip}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => setSelected(selected?.id === l.id ? null : l)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                      {selected?.id === l.id ? 'Close' : 'Details'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: 'var(--canvas)', border: '1.5px solid var(--border-strong)', borderRadius: 10, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ fontWeight: 800, color: 'var(--ink)', margin: 0, fontSize: '0.95rem' }}>Log Details — {selected.id}</p>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>Event</p>
              {[['Timestamp (AUD-03)', selected.ts], ['User ID (AUD-02)', selected.userId], ['User Name', selected.userName], ['Role', selected.role]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 7, gap: 16 }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600, textAlign: 'right' as const, fontFamily: k.includes('ID') || k.includes('Timestamp') ? 'monospace' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>Action</p>
              {[['Action (AUD-01)', selected.action.replace(/_/g,' ')], ['Resource', selected.resourceType], ['Resource ID', selected.resourceId], ['IP Address', selected.ip]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 7, gap: 16 }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600, textAlign: 'right' as const, fontFamily: k.includes('IP') || k.includes('ID') ? 'monospace' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 8 }}>Details</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', margin: 0 }}>{selected.details}</p>
          </div>
          {selected.result === 'suspicious' && (
            <div style={{ marginTop: 12, background: 'var(--amber-light)', border: '1px solid oklch(82% 0.08 75)', borderRadius: 7, padding: '12px 14px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--amber)', margin: 0 }}>⚠ Administrative action required (AUD-04, AUD-05) — investigate and take appropriate action.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
