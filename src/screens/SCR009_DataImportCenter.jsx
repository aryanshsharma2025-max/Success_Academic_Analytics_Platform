import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';

export const SCR009_DataImportCenter = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  const isFaculty = currentUser?.roleName === 'Faculty';
  const [dataDomain, setDataDomain] = useState(isFaculty ? 'MARKS' : 'STUDENTS');
  const [selectedProgram, setSelectedProgram] = useState('BT-CSE');
  const [selectedBatch, setSelectedBatch] = useState('2024-2028');
  const [selectedSemester, setSelectedSemester] = useState('3');
  const [selectedFile, setSelectedFile] = useState({
    name: 'marks_sem3_cs301_internal.csv',
    size: '142 KB',
    hasErrors: true
  });
  const [validationError, setValidationError] = useState('');

  const importJobs = dataService.getImportJobs();

  const handleRunValidation = () => {
    if (!selectedFile) {
      setValidationError('Please select or upload a valid academic CSV/XLSX file first.');
      return;
    }

    // Route to SCR-010 with either the failing demo job IMP-104 or a successful job
    const targetJobId = selectedFile.hasErrors ? 'IMP-104' : 'IMP-103';
    navigate(`/admin/import/validate/${targetJobId}`);
  };

  const handleDownloadTemplate = () => {
    alert(`Downloading standardized CSV template for domain: ${dataDomain}. Required headers match data/import_templates/import_template_${dataDomain.toLowerCase()}.csv`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-009: Data Ingestion & Staging Center</h1>
          <p className="page-subtitle">
            Controlled Two-Stage Bulk Academic Data Staging, Schema Parsing & Pre-Commit Audit
          </p>
        </div>
      </div>

      <div className="alert-banner alert-info">
        <div style={{ fontWeight: 700 }}>[i]</div>
        <div>
          <strong>Controlled Action Gating (BR-005, BR-006):</strong> All bulk spreadsheet uploads must undergo automated
          integrity diagnostics in staging before any row can be committed to the active institutional database.
        </div>
      </div>

      {/* STEP 1: CONFIGURE IMPORT CONTEXT (SCR-009 Wireframe) */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Step 1: Configure Import Target Context</h2>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <span className="filter-label" style={{ display: 'block', marginBottom: '8px' }}>
            Data Domain Category:
          </span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {!isFaculty && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="domain"
                  checked={dataDomain === 'STUDENTS'}
                  onChange={() => setDataDomain('STUDENTS')}
                />
                Student Admission Profiles
              </label>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="domain"
                checked={dataDomain === 'MARKS'}
                onChange={() => setDataDomain('MARKS')}
              />
              Assessment Marks (CIE)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="domain"
                checked={dataDomain === 'ATTENDANCE'}
                onChange={() => setDataDomain('ATTENDANCE')}
              />
              Attendance Rosters
            </label>
            {!isFaculty && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="domain"
                  checked={dataDomain === 'RESULTS'}
                  onChange={() => setDataDomain('RESULTS')}
                />
                Semester End Results
              </label>
            )}
          </div>
        </div>

        <div className="filter-strip" style={{ marginBottom: 0, padding: '10px 12px' }}>
          <div className="filter-group">
            <label className="filter-label">Degree Program</label>
            <select
              className="form-select"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <option value="BT-CSE">B.Tech Computer Science & Engineering</option>
              <option value="BT-ECE">B.Tech Electronics & Communication</option>
              <option value="BT-MECH">B.Tech Mechanical Engineering</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Cohort Batch</label>
            <select
              className="form-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="2024-2028">Batch 2024-2028</option>
              <option value="2023-2027">Batch 2023-2027</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Semester</label>
            <select
              className="form-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="3">Semester 3</option>
              <option value="2">Semester 2</option>
              <option value="1">Semester 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* STEP 2: SELECT & UPLOAD FILE */}
      <div className="saap-card">
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">Step 2: Select & Stage Academic File</h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Supported formats: .CSV, .XLSX (Max file size: 15 MB)
            </span>
          </div>
          <button onClick={handleDownloadTemplate} className="btn btn-secondary btn-sm">
            Download Standard CSV Template
          </button>
        </div>

        {validationError && (
          <div className="alert-banner alert-danger" style={{ marginBottom: '14px' }}>
            <div>{validationError}</div>
          </div>
        )}

        <div
          style={{
            border: '2px dashed var(--slate-300)',
            borderRadius: 'var(--border-radius-md)',
            padding: '32px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--slate-50)',
            marginBottom: '16px'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '8px' }}>
            DRAG AND DROP ACADEMIC DATA FILE HERE
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '16px' }}>
            or select an existing prototype test file below:
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              onClick={() => {
                setSelectedFile({ name: 'marks_sem3_cs301_internal.csv', size: '142 KB', hasErrors: true });
                setValidationError('');
              }}
              className={`btn btn-sm ${selectedFile?.hasErrors ? 'btn-primary' : 'btn-secondary'}`}
            >
              Select: marks_sem3_cs301_internal.csv (Contains 2 Errors for Diagnostics)
            </button>
            <button
              onClick={() => {
                setSelectedFile({ name: 'attendance_sem3_cs301_aug.csv', size: '98 KB', hasErrors: false });
                setValidationError('');
              }}
              className={`btn btn-sm ${!selectedFile?.hasErrors ? 'btn-primary' : 'btn-secondary'}`}
            >
              Select: attendance_sem3_cs301_aug.csv (100% Valid File)
            </button>
          </div>

          {selectedFile && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: '#ffffff', border: '1px solid var(--slate-300)', borderRadius: 'var(--border-radius-sm)', fontSize: '12px' }}>
              <strong>Staged File:</strong> {selectedFile.name} ({selectedFile.size})
              {selectedFile.hasErrors && <span className="badge badge-risk">Diagnostics Test</span>}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setSelectedFile(null)} className="btn btn-secondary">
            Clear File
          </button>
          <button onClick={handleRunValidation} className="btn btn-primary">
            Run Pre-Import Validation
          </button>
        </div>
      </div>

      {/* RECENT IMPORT JOB HISTORY */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Recent Import Job History & Diagnostics Ledger</h2>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Data Domain</th>
                <th>Uploaded By</th>
                <th>Date & Time</th>
                <th className="table-numeric">Total Rows</th>
                <th className="table-numeric">Valid</th>
                <th className="table-numeric">Errors</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {importJobs.map((j) => (
                <tr key={j.jobId}>
                  <td><code>{j.jobId}</code></td>
                  <td><strong>{j.dataType}</strong></td>
                  <td>{j.uploadedBy}</td>
                  <td style={{ fontSize: '12px' }}>{j.uploadedAt}</td>
                  <td className="table-numeric">{j.totalRows}</td>
                  <td className="table-numeric" style={{ color: 'var(--success-solid)', fontWeight: 600 }}>{j.validRows}</td>
                  <td className="table-numeric" style={{ color: j.invalidRows > 0 ? 'var(--danger-solid)' : 'var(--slate-500)', fontWeight: j.invalidRows > 0 ? 700 : 400 }}>
                    {j.invalidRows}
                  </td>
                  <td>
                    <span className={`badge ${j.status === 'COMMITTED' ? 'badge-committed' : 'badge-failed'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/import/validate/${j.jobId}`)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                    >
                      {j.status === 'COMMITTED' ? 'View Log' : 'Review Diagnostics'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
