import { useState } from 'react';
import { Users, Shield, Lock, Check, X, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'administrator' | 'insurance';
  email: string;
}

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  assignedDoctor: string;
  lastUpdated: string;
}

export function AccessControlView() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [accessAttempt, setAccessAttempt] = useState<'granted' | 'denied' | null>(null);

  const users: User[] = [
    { id: '1', name: 'Dr. Sarah Johnson', role: 'doctor', email: 'sarah.johnson@asshifa.com' },
    { id: '2', name: 'Ahmad Al-Rashid', role: 'patient', email: 'ahmad.rashid@email.com' },
    { id: '3', name: 'Admin Team', role: 'administrator', email: 'admin@asshifa.com' },
    { id: '4', name: 'Dr. Mohammed Ali', role: 'doctor', email: 'mohammed.ali@asshifa.com' },
  ];

  const medicalRecords: MedicalRecord[] = [
    { id: 'R001', patientName: 'Ahmad Al-Rashid', patientId: '2', assignedDoctor: 'Dr. Sarah Johnson', lastUpdated: '2026-04-03' },
    { id: 'R002', patientName: 'Fatima Hassan', patientId: '5', assignedDoctor: 'Dr. Mohammed Ali', lastUpdated: '2026-04-02' },
    { id: 'R003', patientName: 'Omar Khalid', patientId: '6', assignedDoctor: 'Dr. Sarah Johnson', lastUpdated: '2026-04-01' },
  ];

  const checkAccess = (user: User, record: MedicalRecord) => {
    // AUTHZ-01: Role-based access control
    if (user.role === 'administrator') {
      return { granted: true, reason: 'Administrator has full access (AUTHZ-04)' };
    }

    // AUTHZ-03: Patients can only view their own records
    if (user.role === 'patient') {
      if (user.id === record.patientId) {
        return { granted: true, reason: 'Patient viewing own record (AUTHZ-03)' };
      } else {
        return { granted: false, reason: 'Patient can only view their own records (CONF-03)' };
      }
    }

    // AUTHZ-02: Doctors can only access records of assigned patients
    if (user.role === 'doctor') {
      if (record.assignedDoctor === user.name) {
        return { granted: true, reason: 'Doctor accessing assigned patient record (AUTHZ-02)' };
      } else {
        return { granted: false, reason: 'Doctor can only access assigned patient records (AUTHZ-02)' };
      }
    }

    return { granted: false, reason: 'Unauthorized access attempt (CONF-03)' };
  };

  const handleAccessRequest = () => {
    if (selectedUser && selectedRecord) {
      const result = checkAccess(selectedUser, selectedRecord);
      setAccessAttempt(result.granted ? 'granted' : 'denied');
      
      // Log the access attempt (AUD-02, AUD-03)
      console.log({
        timestamp: new Date().toISOString(),
        user: selectedUser.name,
        userId: selectedUser.id,
        action: 'VIEW_MEDICAL_RECORD',
        recordId: selectedRecord.id,
        result: result.granted ? 'GRANTED' : 'DENIED',
        reason: result.reason,
      });
    }
  };

  const getAccessResult = () => {
    if (selectedUser && selectedRecord) {
      return checkAccess(selectedUser, selectedRecord);
    }
    return null;
  };

  const accessResult = getAccessResult();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Access Control System</h2>
          <p className="text-gray-600">Implements AUTHZ-01, AUTHZ-02, AUTHZ-03: Role-Based Access Control</p>
        </div>
      </div>

      {/* Mitigation Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 mb-1">Mitigation Strategy</p>
            <p className="text-sm text-indigo-700">
              This control mitigates <strong>MUC-02: Access Medical Records Illegally</strong> by implementing 
              strict role-based access control (RBAC). Users can only access records they are authorized to view 
              based on their role and assignment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* User Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">1. Select User</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setAccessAttempt(null);
                }}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedUser?.id === user.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.role === 'doctor' ? 'bg-blue-100' :
                    user.role === 'patient' ? 'bg-green-100' :
                    user.role === 'administrator' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Users className={`w-5 h-5 ${
                      user.role === 'doctor' ? 'text-blue-600' :
                      user.role === 'patient' ? 'text-green-600' :
                      user.role === 'administrator' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <Check className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Record Selection */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">2. Select Medical Record</h3>
          <div className="space-y-2">
            {medicalRecords.map((record) => (
              <button
                key={record.id}
                onClick={() => {
                  setSelectedRecord(record);
                  setAccessAttempt(null);
                }}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRecord?.id === record.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{record.id} - {record.patientName}</p>
                    <p className="text-sm text-gray-600">Assigned: {record.assignedDoctor}</p>
                    <p className="text-xs text-gray-500">Updated: {record.lastUpdated}</p>
                  </div>
                  {selectedRecord?.id === record.id && (
                    <Check className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Access Request Button */}
      <div className="mb-6">
        <button
          onClick={handleAccessRequest}
          disabled={!selectedUser || !selectedRecord}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Request Access to Medical Record
        </button>
      </div>

      {/* Access Result */}
      {accessResult && (
        <div className={`border-2 rounded-lg p-6 ${
          accessResult.granted
            ? 'bg-green-50 border-green-500'
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              accessResult.granted ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {accessResult.granted ? (
                <Check className="w-7 h-7 text-white" />
              ) : (
                <X className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                accessResult.granted ? 'text-green-900' : 'text-red-900'
              }`}>
                {accessResult.granted ? 'Access Granted' : 'Access Denied'}
              </h3>
              <p className={`mb-4 ${
                accessResult.granted ? 'text-green-800' : 'text-red-800'
              }`}>
                {accessResult.reason}
              </p>
              
              {accessResult.granted ? (
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Access Logged:</strong>
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• User: {selectedUser?.name} ({selectedUser?.role})</p>
                    <p>• Record: {selectedRecord?.id} - {selectedRecord?.patientName}</p>
                    <p>• Timestamp: {new Date().toLocaleString()} (AUD-03)</p>
                    <p>• Action: VIEW_MEDICAL_RECORD (AUD-02)</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Security Alert (AUD-05)</p>
                      <p>This unauthorized access attempt has been logged and will be reviewed by administrators.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RBAC Rules */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Role-Based Access Control Rules</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• <strong>Patients (AUTHZ-03):</strong> Can only view their own medical records</p>
          <p>• <strong>Doctors (AUTHZ-02):</strong> Can access records of patients assigned to them</p>
          <p>• <strong>Administrators (AUTHZ-04):</strong> Have full access to all records</p>
          <p>• <strong>Data Privacy (CONF-03):</strong> Unauthorized users cannot view patient records</p>
        </div>
      </div>
    </div>
  );
}
