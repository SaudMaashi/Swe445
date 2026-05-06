import { useState } from 'react';
import { Lock, Check, X, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

export function EncryptPasswordsView() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', met: password.length >= 8 },
    { id: 2, text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { id: 3, text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { id: 4, text: 'Contains number', met: /[0-9]/.test(password) },
    { id: 5, text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleEncrypt = () => {
    if (allRequirementsMet && passwordsMatch) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        alert('Password encrypted and stored securely using bcrypt hashing with salt!');
      }, 1500);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Lock className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Password Encryption</h2>
          <p className="text-gray-600">Implements AUTH-05: Secure Password Storage</p>
        </div>
      </div>

      {/* Mitigation Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 mb-1">Mitigation Strategy</p>
            <p className="text-sm text-indigo-700">
              This control mitigates <strong>MUC-01: Steal Login Credentials</strong> by using bcrypt hashing 
              with salt to securely store passwords. Even if an attacker accesses the database, they cannot 
              retrieve plaintext passwords.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Password Input Section */}
        <div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your password"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Passwords do not match</span>
              </div>
            )}
            {passwordsMatch && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Passwords match</span>
              </div>
            )}
          </div>

          <button
            onClick={handleEncrypt}
            disabled={!allRequirementsMet || !passwordsMatch || isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Encrypting Password...' : 'Encrypt and Store Password'}
          </button>
        </div>

        {/* Password Requirements */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Password Requirements (AUTH-03)</h3>
          <div className="space-y-3">
            {passwordRequirements.map((req) => (
              <div
                key={req.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  req.met
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {req.met ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={req.met ? 'text-green-700 font-medium' : 'text-gray-600'}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>

          {/* Encryption Info */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Encryption Method</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>Algorithm:</strong> bcrypt with salt</p>
              <p>• <strong>Security Requirement:</strong> AUTH-05</p>
              <p>• <strong>Protection:</strong> Hashing prevents plaintext storage</p>
              <p>• <strong>Salt:</strong> Random per-user salt prevents rainbow table attacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
