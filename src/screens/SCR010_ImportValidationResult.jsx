import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';
import { MetricCard } from '../components/common/MetricCard';

export const SCR010_ImportValidationResult = ({ jobId = 'IMP-104' }) => {
  const { navigate } = useRouter();

  const [job, setJob] = useState(() => {
    return dataService.getImportJobById(jobId) || dataService.getImportJobs()[0];
  });
  const [commitMessage, setCommitMessage] = useState('');

  const handleCommitValid = () => {
    if (job.validRows === 0) {
      alert('Cannot commit: Staging job contains zero valid records.');
      return;
    }

    const confirmCommit = window.confirm(
      `CONFIRMATION REQUIRED (BR-005 / BR-006):\nAre you sure you want to commit ${job.validRows} verified valid records into the active database and discard ${job.invalidRows} invalid rows?\n\nThis transaction will be immutably recorded in the system audit log.`
    );

    if (confirmCommit) {
      dataService.commitImportJob(job.jobId, job.validRows);
      setJob(prev => ({ ...prev, status: 'COMMITTED', invalidRows: 0 }));
      setCommitMessage(`Transaction committed successfully: ${job.validRows} records ingested into active registry. Discarded invalid rows were archived in staging log.`);
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Discard this staging job? All staged data will be purged.')) {
      navigate('/admin/import');
    }
  };

  const isCommitted = job.status === 'COMMITTED';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-010: Pre-Commit Validation Diagnostics</h1>
          <p className="page-subtitle">
            Pre-Ingestion Schema Diagnostics, Integrity Checking & Gated Commit Controls
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate('/admin/import')} className="btn btn-secondary btn-sm">
            ← Return to Import Center
          </button>
        </div>
      </div>

      {commitMessage && (
        <div className="alert-banner alert-success">
          <div>✓ {commitMessage}</div>
        </div>
      )}

      {/* JOB SUMMARY BANNER */}
      <div className="saap-card" style={{ padding: '14px 18px', backgroundColor: 'var(--slate-50)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong>Staging Job ID:</strong> <code>{job.jobId}</code> | <strong>File:</strong> {job.fileName} | <strong>Domain:</strong> {job.dataType}
          </div>
          <div>
            <span className={`badge ${isCommitted ? 'badge-committed' : 'badge-failed'}`}>
              STATUS: {job.status}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--slate-600)', marginTop: '4px' }}>
          Target Scope: {job.program} / {job.semester} / {job.subject} ({job.assessment})
        </div>
      </div>

      {/* VALIDATION SCORECARD */}
      <div className="grid-3">
        <MetricCard
          title="Total Rows Parsed"
          value={job.totalRows}
          footnote="100% Schema Structured"
        />
        <MetricCard
          title="Valid Records"
          value={job.validRows}
          footnote={
            <span style={{ color: 'var(--success-solid)', fontWeight: 600 }}>
              Ready to Commit into Database
            </span>
          }
        />
        <MetricCard
          title="Rejected Records"
          value={job.invalidRows}
          footnote={
            job.invalidRows > 0 ? (
              <span style={{ color: 'var(--danger-solid)', fontWeight: 600 }}>
                ACTION REQUIRED (!)
              </span>
            ) : (
              <span style={{ color: 'var(--success-solid)' }}>Zero Integrity Errors</span>
            )
          }
        />
      </div>

      {/* DIAGNOSTIC ERROR SUMMARY TABLE */}
      {job.errors && job.errors.length > 0 && !isCommitted ? (
        <div className="saap-card" style={{ borderTop: '4px solid var(--danger-solid)' }}>
          <div className="saap-card-header">
            <div>
              <h2 className="saap-card-title">Diagnostic Error Summary</h2>
              <span style={{ fontSize: '12px', color: 'var(--danger-solid)', fontWeight: 600 }}>
                Database mutation blocked until resolved or partially committed under audit.
              </span>
            </div>
          </div>

          <div className="table-container">
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Row #</th>
                  <th>Student Roll</th>
                  <th>Offending Field</th>
                  <th>Value Entered</th>
                  <th>Error Code</th>
                  <th>Diagnostic Reason</th>
                </tr>
              </thead>
              <tbody>
                {job.errors.map((err, idx) => (
                  <tr key={idx}>
                    <td><strong>{err.rowNumber}</strong></td>
                    <td><code>{err.studentRoll}</code></td>
                    <td><code>{err.offendingField}</code></td>
                    <td style={{ color: 'var(--danger-solid)', fontWeight: 600 }}>{err.valueEntered}</td>
                    <td><span className="badge badge-risk">{err.errorCode}</span></td>
                    <td style={{ color: 'var(--slate-800)' }}>{err.diagnosticReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="saap-card" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '16px' }}>
          <div style={{ color: 'var(--success-text)', fontWeight: 600 }}>
            ✓ Staging diagnostics verified: Zero integrity violations present in current committed batch.
          </div>
        </div>
      )}

      {/* COMMIT CONTROLS (BR-006 Enforced) */}
      <div className="saap-card" style={{ backgroundColor: 'var(--slate-50)' }}>
        <div style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--slate-700)' }}>
          <strong>Business Rule BR-006 Enforced:</strong> Invalid rows cannot silently become valid data. Staging
          commits require explicit administrative acknowledgement and are logged with actor identity in the immutable audit trail.
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin/import')} className="btn btn-secondary">
            Re-Upload Corrected File
          </button>
          {!isCommitted && (
            <>
              <button onClick={handleDiscard} className="btn btn-danger">
                Discard Staging Job
              </button>
              <button
                onClick={handleCommitValid}
                className="btn btn-primary"
                disabled={job.validRows === 0}
              >
                Commit Only Valid {job.validRows} Rows (Audited)
              </button>
            </>
          )}
          {isCommitted && (
            <button onClick={() => navigate('/admin/audit')} className="btn btn-primary">
              View Audit Log Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
