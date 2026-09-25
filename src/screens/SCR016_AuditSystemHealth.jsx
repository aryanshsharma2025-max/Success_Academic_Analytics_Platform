import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';
import { MetricCard } from '../components/common/MetricCard';

export const SCR016_AuditSystemHealth = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.roleName === 'Auditor / Viewer';

  const [auditLogs, setAuditLogs] = useState(() => dataService.getAuditLogs());
  const [actionFilter, setActionFilter] = useState('ALL');
  const [actorSearch, setActorSearch] = useState('');
  const [refreshNotice, setRefreshNotice] = useState('');

  const handleRefresh = () => {
    setAuditLogs([...dataService.getAuditLogs()]);
    setRefreshNotice('Telemetry health checks and audit logs refreshed from storage.');
    setTimeout(() => setRefreshNotice(''), 3000);
  };

  const handleExportAuditCSV = () => {
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'auditor_user',
      action: 'AUDIT_LOG_EXPORT',
      entityAffected: 'AuditLogs',
      entityId: 'ALL',
      result: 'SUCCESS'
    });
    alert('Immutable audit trail CSV successfully exported. Event appended to audit log.');
    setAuditLogs([...dataService.getAuditLogs()]);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (actorSearch && !log.actorUserId.toLowerCase().includes(actorSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-016: System Health & Security Audit Ledger</h1>
          <p className="page-subtitle">
            Infrastructure Telemetry, API Latency Telemetry & Immutable Regulatory Operation Log
          </p>
        </div>
        <div className="page-actions">
          <button onClick={handleRefresh} className="btn btn-secondary btn-sm">
            Refresh Telemetry
          </button>
          <button onClick={handleExportAuditCSV} className="btn btn-primary btn-sm">
            Export Audit Log (CSV)
          </button>
        </div>
      </div>

      {refreshNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {refreshNotice}</div>
        </div>
      )}

      {/* INFRASTRUCTURE TELEMETRY & SYSTEM HEALTH (SCR-016 Wireframe) */}
      <div className="alert-banner alert-info" style={{ marginBottom: '16px' }}>
        <div>
          <strong>PROTOTYPE TELEMETRY NOTICE:</strong> Real backend infrastructure (FastAPI) and relational persistence (PostgreSQL) belong to Semester 4. Telemetry metrics, database engine states, and API latency values displayed below are <strong>simulated prototype values</strong> designed to demonstrate the operational monitoring layout specified in SRS Section 26 & 27.
        </div>
      </div>

      <div className="grid-4">
        <MetricCard
          title="Relational Engine (Simulated)"
          value="PostgreSQL: UP"
          footnote="Simulated Mock Telemetry (Pool: 18/20)"
        />
        <MetricCard
          title="API Latency (Simulated)"
          value="145 ms (p95)"
          footnote={
            <span style={{ color: 'var(--success-solid)', fontWeight: 600 }}>
              ✓ Target &lt; 3000 ms Benchmark Met
            </span>
          }
        />
        <MetricCard
          title="Active Sessions (Simulated)"
          value="42 Sessions"
          footnote="In-Memory Prototype Contexts"
        />
        <MetricCard
          title="Security Alerts (24h)"
          value="0 Flags"
          footnote="Simulated Baseline"
        />
      </div>

      {/* IMMUTABLE SYSTEM AUDIT TRAIL */}
      <div className="saap-card">
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">Immutable System Operation Audit Trail</h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              {isReadOnly ? 'Read-Only Regulatory Inspection Mode' : 'Privileged Administrator Mode'}
            </span>
          </div>
        </div>

        {/* Audit Filter Toolbar */}
        <div className="filter-strip" style={{ marginBottom: '16px' }}>
          <div className="filter-group">
            <label className="filter-label">Filter Action Type</label>
            <select
              className="form-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="ALL">All Actions (Comprehensive)</option>
              <option value="MARKS_COMMIT">MARKS_COMMIT</option>
              <option value="IMPORT_VALIDATE">IMPORT_VALIDATE</option>
              <option value="IMPORT_COMMIT">IMPORT_COMMIT</option>
              <option value="REPORT_EXPORT">REPORT_EXPORT</option>
              <option value="LOGIN_ATTEMPT">LOGIN_ATTEMPT</option>
              <option value="MASTER_DATA_EDIT">MASTER_DATA_EDIT</option>
              <option value="UNAUTHORIZED_ACCESS_ATTEMPT">UNAUTHORIZED_ACCESS_ATTEMPT</option>
            </select>
          </div>

          <div className="filter-group" style={{ flex: 1, maxWidth: '280px' }}>
            <label className="filter-label">Filter by Actor Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search actor (e.g. dr_rk_sharma)..."
              value={actorSearch}
              onChange={(e) => setActorSearch(e.target.value)}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end', fontSize: '12px', color: 'var(--slate-500)' }}>
            Showing {filteredLogs.length} Logged Entries
          </div>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Actor User ID</th>
                <th>Action Performed</th>
                <th>Entity Affected</th>
                <th>Entity ID</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isFail = log.result === 'FAILED' || log.result === 'DENIED';
                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{log.timestamp}</td>
                    <td><strong>{log.actorUserId}</strong></td>
                    <td><code>{log.action}</code></td>
                    <td>{log.entityAffected}</td>
                    <td><code>{log.entityId}</code></td>
                    <td>
                      <span className={`badge ${isFail ? 'badge-danger' : 'badge-success'}`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
