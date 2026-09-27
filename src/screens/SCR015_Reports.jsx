import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';

export const SCR015_Reports = () => {
  const { currentUser } = useAuth();

  // Role-tailored report templates
  const getTemplates = () => {
    switch (currentUser?.roleName) {
      case 'Student':
        return [
          { id: 'STU_TRANSCRIPT', title: 'Official Academic Transcript & Semester Grade Report', format: 'PDF' },
          { id: 'STU_ATT', title: 'Personal Cumulative Attendance Audit Record', format: 'CSV' }
        ];
      case 'Mentor':
        return [
          { id: 'MEN_STATUS', title: 'Mentorship Attention & Active Intervention Status Report', format: 'PDF' },
          { id: 'MEN_ATT', title: 'Cohort Attendance Deficit & Exam Detention Advisory', format: 'CSV' }
        ];
      case 'Faculty':
        return [
          { id: 'FAC_MARKS', title: 'Subject-Wise Mark Distribution & Pass Rates Matrix', format: 'XLSX' },
          { id: 'FAC_ATT', title: 'Comprehensive Course Attendance Shortage Audit', format: 'CSV' }
        ];
      case 'Department User':
        return [
          { id: 'DEP_SUMM', title: 'Department Academic Performance & Outcomes Summary', format: 'PDF' },
          { id: 'DEP_BACK', title: 'Curriculum Cross-Subject Backlog Clustering Report', format: 'XLSX' }
        ];
      case 'Academic Administrator':
        return [
          { id: 'ADM_INST', title: 'Institutional Accreditation & Annual Academic Performance Audit', format: 'PDF' },
          { id: 'ADM_ENR', title: 'Global Multi-Program Enrollment & Retention Ledger', format: 'CSV' }
        ];
      case 'Auditor / Viewer':
        return [
          { id: 'AUD_TRAIL', title: 'Immutable System Security & Regulatory Audit Ledger', format: 'CSV' },
          { id: 'AUD_DATA', title: 'Data Ingestion & Controlled Staging Commit Traceability Log', format: 'PDF' }
        ];
      default:
        return [
          { id: 'GEN_REPORT', title: 'Academic Analytics General Summary Report', format: 'PDF' }
        ];
    }
  };

  const templates = getTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id);
  const [selectedFormat, setSelectedFormat] = useState(templates[0]?.format || 'PDF');
  const [includeDeIdentified, setIncludeDeIdentified] = useState(true);
  const [recentJobs, setRecentJobs] = useState(() => dataService.getReportJobs());
  const [generatedNotice, setGeneratedNotice] = useState('');

  const handleTemplateChange = (tmpl) => {
    setSelectedTemplate(tmpl.id);
    setSelectedFormat(tmpl.format);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    const tmpl = templates.find(t => t.id === selectedTemplate) || templates[0];
    const newJob = dataService.addReportJob(tmpl.title, selectedFormat, currentUser?.username || 'user');
    setRecentJobs([newJob, ...dataService.getReportJobs().filter(j => j.jobId !== newJob.jobId)]);

    setGeneratedNotice(`Audited report generation completed: ${newJob.reportTitle}. Dispatched download payload and recorded event in immutable audit log under BR-010.`);
    setTimeout(() => setGeneratedNotice(''), 5000);
  };

  const handleDownload = (job) => {
    alert(`Downloading verified archive for ${job.reportTitle}. File hash and retrieval event verified.`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-015: Report Generation & Export Center</h1>
          <p className="page-subtitle">
            Role-Scoped Institutional Exports, Audited Statistical Extracts & Formal Transcripts
          </p>
        </div>
      </div>

      {generatedNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {generatedNotice}</div>
        </div>
      )}

      {/* REPORT CONFIGURATION (SCR-015 Wireframe) */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Configure Audited Academic Export</h2>
        </div>

        <form onSubmit={handleGenerateReport}>
          <div style={{ marginBottom: '16px' }}>
            <span className="filter-label" style={{ display: 'block', marginBottom: '8px' }}>
              Select Authorized Report Template:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {templates.map((t) => (
                <label
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    padding: '8px 12px',
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--border-radius-sm)',
                    backgroundColor: selectedTemplate === t.id ? 'var(--primary-50)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={selectedTemplate === t.id}
                    onChange={() => handleTemplateChange(t)}
                  />
                  <strong style={{ color: 'var(--slate-900)' }}>{t.title}</strong>
                  <span className="badge badge-info" style={{ marginLeft: 'auto' }}>{t.format}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-strip" style={{ marginBottom: '16px' }}>
            <div className="filter-group">
              <label className="filter-label">Academic Year</label>
              <select className="form-select" defaultValue="2026-27">
                <option value="2026-27">2026-2027</option>
                <option value="2025-26">2025-2026</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Academic Scope</label>
              <select className="form-select" defaultValue="BT-CSE">
                <option value="BT-CSE">B.Tech Computer Science & Engineering</option>
                <option value="ALL">All Enrolled Programs</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Export Format</label>
              <select
                className="form-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="PDF">Adobe PDF (.pdf)</option>
                <option value="CSV">Comma Separated Values (.csv)</option>
                <option value="XLSX">Microsoft Excel (.xlsx)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={includeDeIdentified}
                onChange={(e) => setIncludeDeIdentified(e.target.checked)}
              />
              <span>Include De-Identified Institutional Cohort Benchmark Data (BR-011 Privacy Compliant)</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Generate & Download Audited Report
            </button>
          </div>
        </form>
      </div>

      {/* RECENT EXPORT JOBS & AUDIT RECORD */}
      <div className="saap-card">
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">Recent Export Jobs & Audit Record</h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Maintains an immutable record of all institutional data extractions
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Report Job ID</th>
                <th>Report Artifact Name</th>
                <th>Requested By</th>
                <th>Timestamp</th>
                <th>Format</th>
                <th>Execution Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((j) => (
                <tr key={j.jobId}>
                  <td><code>{j.jobId}</code></td>
                  <td><strong>{j.reportTitle}</strong></td>
                  <td>{j.requestedBy}</td>
                  <td style={{ fontSize: '12px' }}>{j.requestedAt}</td>
                  <td><span className="badge badge-info">{j.format}</span></td>
                  <td><span className="badge badge-success">{j.status}</span></td>
                  <td>
                    <button
                      onClick={() => handleDownload(j)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                    >
                      Get Artifact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '12px', fontStyle: 'italic' }}>
          (i) Notice: In accordance with BR-010, every report generation event is immutably recorded in the system audit trail.
        </div>
      </div>
    </div>
  );
};
