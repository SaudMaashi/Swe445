import { useState } from 'react';
import { Shield, Smartphone, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react';

export function MultiFactorAuthView() {
  const [step, setStep] = useState<'credentials' | 'mfa' | 'success'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | 'app'>('app');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setStep('mfa');
    }
  };

  const handleMfaInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...mfaCode];
      newCode[index] = value;
      setMfaCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`mfa-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyMfa = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
    }, 1500);
  };

  const isCodeComplete = mfaCode.every(digit => digit !== '');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Shield className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h2>
          <p className="text-gray-600">Implements AUTH-02: MFA for Doctors & Administrators</p>
        </div>
      </div>

      {/* Mitigation Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 mb-1">Mitigation Strategy</p>
            <p className="text-sm text-indigo-700">
              This control mitigates <strong>MUC-01: Steal Login Credentials</strong> by requiring an 
              additional verification factor. Even if credentials are stolen, attackers cannot access the 
              system without the second factor.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Credentials */}
      {step === 'credentials' && (
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <span className="font-semibold">Enter Credentials</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="doctor@asshifa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue to MFA
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Security Requirement:</strong> MFA is required for doctors and administrators 
                accessing sensitive medical records (AUTH-02).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: MFA Verification */}
      {step === 'mfa' && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <span className="font-semibold">Verify Identity</span>
            </div>
          </div>

          {/* MFA Method Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedMethod('app')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'app'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <Smartphone className={`w-8 h-8 mx-auto mb-2 ${selectedMethod === 'app' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="font-semibold text-sm">Authenticator App</p>
              <p className="text-xs text-gray-600 mt-1">Most Secure</p>
            </button>

            <button
              onClick={() => setSelectedMethod('sms')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'sms'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <Mail className={`w-8 h-8 mx-auto mb-2 ${selectedMethod === 'sms' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="font-semibold text-sm">SMS Code</p>
              <p className="text-xs text-gray-600 mt-1">Text Message</p>
            </button>

            <button
              onClick={() => setSelectedMethod('email')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedMethod === 'email'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <Key className={`w-8 h-8 mx-auto mb-2 ${selectedMethod === 'email' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="font-semibold text-sm">Email Code</p>
              <p className="text-xs text-gray-600 mt-1">Email Verification</p>
            </button>
          </div>

          {/* MFA Code Input */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-center text-gray-700 mb-4">
              Enter the 6-digit code from your {selectedMethod === 'app' ? 'authenticator app' : selectedMethod === 'sms' ? 'SMS message' : 'email'}
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {mfaCode.map((digit, index) => (
                <input
                  key={index}
                  id={`mfa-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleMfaInput(index, e.target.value)}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyMfa}
              disabled={!isCodeComplete || isVerifying}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify and Login'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('credentials')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Authentication Successful!</h3>
            <p className="text-gray-600">Your identity has been verified using multi-factor authentication.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800 space-y-2">
              <p>✓ Credentials verified (AUTH-01)</p>
              <p>✓ Multi-factor authentication completed (AUTH-02)</p>
              <p>✓ Access granted based on role (AUTHZ-01)</p>
              <p>✓ Login event logged (AUD-01, AUD-03)</p>
            </div>
          </div>

          <button
            onClick={() => {
              setStep('credentials');
              setUsername('');
              setPassword('');
              setMfaCode(['', '', '', '', '', '']);
            }}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Start New Authentication
          </button>
        </div>
      )}
    </div>
  );
}
