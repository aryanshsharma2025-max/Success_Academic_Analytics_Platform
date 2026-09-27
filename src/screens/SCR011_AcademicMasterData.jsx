import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';

export const SCR011_AcademicMasterData = () => {
  const { currentUser } = useAuth();
  const isReadOnly = currentUser?.roleName === 'Auditor / Viewer';

  const [activeTab, setActiveTab] = useState('DEPARTMENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Master data tables from synthetic dataset
  const [departments, setDepartments] = useState(() => dataService.getDepartments());
  const [programs, setPrograms] = useState(() => dataService.getPrograms());
  const [batches] = useState(() => dataService.getBatches());
  const [academicYears] = useState(() => dataService.getAcademicYears());
  const [semesters] = useState(() => dataService.getSemesters());
  const [subjects, setSubjects] = useState(() => dataService.getSubjects());

  const handleSaveEntity = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newCode.trim() || !newName.trim()) {
      setFormError('Code and Name are mandatory.');
      return;
    }

    if (activeTab === 'DEPARTMENTS') {
      if (departments.some(d => d.code.toUpperCase() === newCode.trim().toUpperCase())) {
        setFormError('ERR-DUP-001: Department code already exists. Must be institutionally unique.');
        return;
      }
      const newDept = {
        department_id: `dept-${Date.now()}`,
        department_name: newName.trim(),
        code: newCode.trim().toUpperCase()
      };
      setDepartments([...departments, newDept]);
    } else if (activeTab === 'SUBJECTS') {
      if (subjects.some(s => s.subject_code.toUpperCase() === newCode.trim().toUpperCase())) {
        setFormError('ERR-DUP-001: Subject code already exists. Must be unique.');
        return;
      }
      const newSub = {
        subject_id: `sub-${Date.now()}`,
        subject_code: newCode.trim().toUpperCase(),
        subject_name: newName.trim(),
        credits: '4.0'
      };
      setSubjects([...subjects, newSub]);
    }

    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'admin_acad',
      action: 'MASTER_DATA_CREATE',
      entityAffected: activeTab,
      entityId: newCode.trim().toUpperCase(),
      result: 'SUCCESS'
    });

    setSuccessNotice(`Successfully registered ${activeTab} record: ${newCode.trim().toUpperCase()}.`);
    setShowDrawer(false);
    setNewCode('');
    setNewName('');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleDeleteProtection = (entityCode) => {
    alert(
      `REFERENTIAL INTEGRITY PROTECTED:\nCannot delete ${entityCode}: 142 historical student marks and attendance records currently reference this master curriculum entity in the relational schema.`
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-011: Academic Master Data Management</h1>
          <p className="page-subtitle">
            Administers Institutional Structural Metadata: Departments, Programs, Batches, Semesters & Courses
          </p>
        </div>
        <div className="page-actions">
          {!isReadOnly && (
            <button
              onClick={() => {
                setShowDrawer(true);
                setFormError('');
              }}
              className="btn btn-primary btn-sm"
            >
              + Add New {activeTab.slice(0, -1)}
            </button>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {successNotice}</div>
        </div>
      )}

      {/* NAVIGATION TABS (SCR-011 Wireframe) */}
      <div className="tabs-header">
        {['DEPARTMENTS', 'PROGRAMS', 'BATCHES', 'ACADEMIC YEARS', 'SEMESTERS', 'SUBJECTS'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setSearchQuery('');
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FILTER / SEARCH STRIP */}
      <div className="filter-strip">
        <div className="filter-group" style={{ flex: 1, maxWidth: '360px' }}>
          <label className="filter-label">Search {activeTab}</label>
          <input
            type="text"
            className="form-input"
            placeholder={`Filter ${activeTab.toLowerCase()} by code or title...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--slate-500)' }}>
          {isReadOnly ? 'Read-Only Compliance Inspection' : 'Operational Administrator Mode'}
        </div>
      </div>

      {/* MASTER DATA DIRECTORY TABLE */}
      <div className="saap-card">
        <div className="table-container">
          {activeTab === 'DEPARTMENTS' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Department Code</th>
                  <th>Institutional Department Name</th>
                  <th>Degree Programs</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments
                  .filter(d => d.code.toLowerCase().includes(searchQuery.toLowerCase()) || d.department_name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((d) => (
                    <tr key={d.department_id}>
                      <td><code>{d.code}</code></td>
                      <td><strong>{d.department_name}</strong></td>
                      <td>{programs.filter(p => p.department_id === d.department_id).length || 1} Program(s)</td>
                      <td><span className="badge badge-active">ACTIVE</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => alert(`Editing department: ${d.code}`)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 8px', fontSize: '11px' }}
                            disabled={isReadOnly}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProtection(d.code)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '2px 8px', fontSize: '11px' }}
                            disabled={isReadOnly}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {activeTab === 'PROGRAMS' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Program Code</th>
                  <th>Degree Program Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.program_id}>
                    <td><code>{p.code}</code></td>
                    <td><strong>{p.program_name}</strong></td>
                    <td>Computer Science & Engineering</td>
                    <td><span className="badge badge-active">ACTIVE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'BATCHES' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Batch Identifier</th>
                  <th>Admission Year</th>
                  <th>Academic Program</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.batch_id}>
                    <td><strong>{b.batch_name}</strong></td>
                    <td>{b.admission_year}</td>
                    <td>B.Tech Undergraduate</td>
                    <td><span className="badge badge-active">ACTIVE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'ACADEMIC YEARS' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Academic Year Session</th>
                  <th>Session Start Date</th>
                  <th>Session End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((y) => (
                  <tr key={y.academic_year_id}>
                    <td><strong>{y.year_label}</strong></td>
                    <td>{y.start_date}</td>
                    <td>{y.end_date}</td>
                    <td><span className="badge badge-active">PUBLISHED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'SEMESTERS' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Semester Term</th>
                  <th>Term Progression</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {semesters.slice(0, 8).map((s) => (
                  <tr key={s.semester_id}>
                    <td><strong>Semester {s.semester_number}</strong></td>
                    <td>Undergraduate Term #{s.semester_number}</td>
                    <td><span className="badge badge-active">CURRICULAR</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'SUBJECTS' && (
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Course Title</th>
                  <th className="table-numeric">Statutory Credits</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects
                  .filter(s => s.subject_code.toLowerCase().includes(searchQuery.toLowerCase()) || s.subject_name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <tr key={s.subject_id}>
                      <td><code>{s.subject_code}</code></td>
                      <td><strong>{s.subject_name}</strong></td>
                      <td className="table-numeric">{s.credits}</td>
                      <td><span className="badge badge-active">ACCREDITED</span></td>
                      <td>
                        <button
                          onClick={() => handleDeleteProtection(s.subject_code)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                          disabled={isReadOnly}
                        >
                          Check Dependencies
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL DRAWER */}
      {showDrawer && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Create New {activeTab.slice(0, -1)} Record</h2>
              <button onClick={() => setShowDrawer(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveEntity}>
              <div className="modal-body">
                {formError && (
                  <div className="alert-banner alert-danger" style={{ marginBottom: '14px' }}>
                    <div>{formError}</div>
                  </div>
                )}
                <div className="filter-group" style={{ marginBottom: '14px' }}>
                  <label className="filter-label">Unique Code / Identifier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. AI-DS or CS403"
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Full Descriptive Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Artificial Intelligence & Data Science"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowDrawer(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Master Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
