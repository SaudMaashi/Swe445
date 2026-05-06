import { useState } from 'react';
import { FileText, Shield, Search, Filter, AlertTriangle, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  result: 'success' | 'denied' | 'suspicious';
  ipAddress: string;
  details: string;
}

export function AuditLogsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'denied' | 'suspicious'>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      timestamp: '2026-04-04 14:23:15',
      userId: 'U001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'doctor',
      action: 'VIEW_MEDICAL_RECORD',
      resourceType: 'Medical Record',
      resourceId: 'R001',
      result: 'success',
      ipAddress: '192.168.1.100',
      details: 'Accessed assigned patient record (AUTHZ-02)',
    },
    {
      id: 'LOG-002',
      timestamp: '2026-04-04 14:20:45',
      userId: 'U002',
      userName: 'Ahmad Al-Rashid',
      userRole: 'patient',
      action: 'LOGIN',
      resourceType: 'Authentication',
      resourceId: 'N/A',
      result: 'success',
      ipAddress: '192.168.1.105',
      details: 'Successful login with valid credentials (AUTH-01)',
    },
    {
      id: 'LOG-003',
      timestamp: '2026-04-04 14:18:30',
      userId: 'U004',
      userName: 'Dr. Mohammed Ali',
      userRole: 'doctor',
      action: 'VIEW_MEDICAL_RECORD',
      resourceType: 'Medical Record',
      resourceId: 'R001',
      result: 'denied',
      ipAddress: '192.168.1.102',
      details: 'Attempted to access non-assigned patient record (AUTHZ-02 violation)',
    },
    {
      id: 'LOG-004',
      timestamp: '2026-04-04 14:15:22',
      userId: 'U001',
      userName: 'Dr. Sarah Johnson',
      userRole: 'doctor',
      action: 'UPDATE_MEDICAL_RECORD',
      resourceType: 'Medical Record',
      resourceId: 'R003',
      result: 'success',
      ipAddress: '192.168.1.100',
      details: 'Updated patient medical information (INT-01, INT-02)',
    },
    {
      id: 'LOG-005',
      timestamp: '2026-04-04 14:12:10',
      userId: 'UNKNOWN',
      userName: 'Unknown User',
      userRole: 'unknown',
      action: 'LOGIN_FAILED',
      resourceType: 'Authentication',
      resourceId: 'N/A',
      result: 'suspicious',
      ipAddress: '203.45.67.89',
      details: 'Multiple failed login attempts detected - potential brute force attack (AUTH-04)',
    },
    {
      id: 'LOG-006',
      timestamp: '2026-04-04 14:10:05',
      userId: 'U003',
      userName: 'Admin Team',
      userRole: 'administrator',
      action: 'SUBMIT_INSURANCE_CLAIM',
      resourceType: 'Insurance Claim',
      resourceId: 'IC-045',
      result: 'success',
      ipAddress: '192.168.1.200',
      details: 'Insurance claim submitted successfully (AUD-01)',
    },
    {
      id: 'LOG-007',
      timestamp: '2026-04-04 14:05:30',
      userId: 'U005',
      userName: 'Malicious Insider',
      userRole: 'staff',
      action: 'UPDATE_MEDICAL_RECORD',
      resourceType: 'Medical Record',
      resourceId: 'R002',
      result: 'suspicious',
      ipAddress: '192.168.1.150',
      details: 'Abnormal record modification detected - data integrity alert (INT-04)',
    },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || log.result === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'denied':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('VIEW')) return <Eye className="w-4 h-4" />;
    if (action.includes('UPDATE')) return <Edit className="w-4 h-4" />;
    if (action.includes('DELETE')) return <Trash2 className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const suspiciousCount = auditLogs.filter(log => log.result === 'suspicious').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs & Activity Monitoring</h2>
          <p className="text-gray-600">Implements AUD-01, AUD-02, AUD-03, AUD-04, AUD-05</p>
        </div>
      </div>

      {/* Mitigation Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 mb-1">Mitigation Strategy</p>
            <p className="text-sm text-indigo-700">
              This control mitigates <strong>MUC-03: Modify Medical Records</strong> and{' '}
              <strong>MUC-04: Submit Fake Insurance Claim</strong> by maintaining comprehensive audit logs 
              of all system activities. Administrators can review logs for suspicious activity and detect 
              unauthorized modifications.
            </p>
          </div>
        </div>
      </div>

      {/* Suspicious Activity Alert */}
      {suspiciousCount > 0 && (
        <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">Security Alert (AUD-05)</p>
              <p className="text-sm text-amber-800">
                {suspiciousCount} suspicious {suspiciousCount === 1 ? 'activity' : 'activities'} detected. 
                Administrator review required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, or resource..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="success">Success Only</option>
            <option value="denied">Denied Only</option>
            <option value="suspicious">Suspicious Only</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`hover:bg-gray-50 ${
                    log.result === 'suspicious' ? 'bg-amber-50' :
                    log.result === 'denied' ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{log.userName}</p>
                      <p className="text-xs text-gray-600 capitalize">{log.userRole}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-gray-900">{log.action.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="text-gray-900">{log.resourceType}</p>
                      <p className="text-xs text-gray-600">{log.resourceId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.result)}
                      <span className={`text-sm font-medium capitalize ${
                        log.result === 'success' ? 'text-green-700' :
                        log.result === 'denied' ? 'text-red-700' :
                        'text-amber-700'
                      }`}>
                        {log.result}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{log.ipAddress}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Log Details */}
      {selectedLog && (
        <div className="bg-gray-50 border-2 border-indigo-500 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Log Details - {selectedLog.id}</h3>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Event Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp (AUD-03):</span>
                  <span className="font-medium text-gray-900">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID (AUD-02):</span>
                  <span className="font-medium text-gray-900">{selectedLog.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Name:</span>
                  <span className="font-medium text-gray-900">{selectedLog.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium text-gray-900 capitalize">{selectedLog.userRole}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Action Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Action (AUD-01):</span>
                  <span className="font-medium text-gray-900">{selectedLog.action.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resource Type:</span>
                  <span className="font-medium text-gray-900">{selectedLog.resourceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resource ID:</span>
                  <span className="font-medium text-gray-900">{selectedLog.resourceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IP Address:</span>
                  <span className="font-medium text-gray-900 font-mono">{selectedLog.ipAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Details</h4>
            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
              {selectedLog.details}
            </p>
          </div>

          {selectedLog.result === 'suspicious' && (
            <div className="mt-4 bg-amber-100 border border-amber-300 rounded-lg p-3">
              <p className="text-sm font-semibold text-amber-900 mb-1">⚠️ Administrative Action Required</p>
              <p className="text-sm text-amber-800">
                This suspicious activity requires review. Administrator should investigate and take appropriate action (AUD-04, AUD-05).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Audit Requirements */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Audit & Accountability Requirements</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p>• <strong>AUD-01:</strong> Log all user activities (login, access, updates)</p>
            <p>• <strong>AUD-02:</strong> Record user identity accessing patient records</p>
            <p>• <strong>AUD-03:</strong> Timestamp all system transactions</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>AUD-04:</strong> Administrators can review logs for suspicious activity</p>
            <p>• <strong>AUD-05:</strong> Alert administrators of suspicious behavior</p>
            <p>• <strong>INT-02:</strong> Maintain version history of record changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
