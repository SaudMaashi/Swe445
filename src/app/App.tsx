import { useState } from 'react';
import { EncryptPasswordsView } from './components/EncryptPasswordsView';
import { MultiFactorAuthView } from './components/MultiFactorAuthView';
import { AccessControlView } from './components/AccessControlView';
import { AuditLogsView } from './components/AuditLogsView';
import { Shield, Lock, Users, FileText } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'encrypt' | 'mfa' | 'access' | 'audit'>('encrypt');

  const mitigationControls = [
    { id: 'encrypt' as const, name: 'Encrypt Passwords', icon: Lock, mitigates: 'Steal Login Credentials' },
    { id: 'mfa' as const, name: 'Multi-Factor Authentication', icon: Shield, mitigates: 'Steal Login Credentials' },
    { id: 'access' as const, name: 'Access Control', icon: Users, mitigates: 'Access Medical Records Illegally' },
    { id: 'audit' as const, name: 'Audit Logs', icon: FileText, mitigates: 'Modify Medical Records & Submit Fake Insurance Claim' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">As-Shifa Security Mitigation System</h1>
              <p className="text-sm text-gray-600">Healthcare Management Security Controls</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mitigation Controls Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mitigationControls.map((control) => {
            const Icon = control.icon;
            const isActive = activeView === control.id;
            return (
              <button
                key={control.id}
                onClick={() => setActiveView(control.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                <h3 className="font-semibold mb-2">{control.name}</h3>
                <p className={`text-sm ${isActive ? 'text-indigo-100' : 'text-gray-600'}`}>
                  Mitigates: {control.mitigates}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active View Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {activeView === 'encrypt' && <EncryptPasswordsView />}
          {activeView === 'mfa' && <MultiFactorAuthView />}
          {activeView === 'access' && <AccessControlView />}
          {activeView === 'audit' && <AuditLogsView />}
        </div>
      </div>
    </div>
  );
}
