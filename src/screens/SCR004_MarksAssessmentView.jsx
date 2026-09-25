import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';

export const SCR004_MarksAssessmentView = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  const isStudent = currentUser?.roleName === 'Student';
  const isFaculty = currentUser?.roleName === 'Faculty' || currentUser?.roleName === 'Academic Administrator';

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [selectedAssessment, setSelectedAssessment] = useState('Class Test 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  // Initial Marks Roster
  const [roster, setRoster] = useState(() => {
    return dataService.getFacultySubjectMarksRoster(selectedSubject, selectedAssessment);
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Student specific data
  const studentMarks = isStudent && currentUser?.studentId
    ? dataService.getStudentMarks(currentUser.studentId)
    : [];

  const handleSubjectChange = (newSub) => {
    setSelectedSubject(newSub);
    setRoster(dataService.getFacultySubjectMarksRoster(newSub, selectedAssessment));
    setValidationErrors({});
    setSaveSuccessNotice('');
  };

  const handleAssessmentChange = (newAss) => {
    setSelectedAssessment(newAss);
    setRoster(dataService.getFacultySubjectMarksRoster(selectedSubject, newAss));
    setValidationErrors({});
    setSaveSuccessNotice('');
  };

  const handleMarkChange = (markId, value, maxVal) => {
    const num = parseFloat(value);
    const newErrors = { ...validationErrors };

    if (isNaN(num)) {
      newErrors[markId] = 'Must be a valid number.';
    } else if (num < 0) {
      newErrors[markId] = 'ERR-MRK-001: Marks value cannot be negative.';
    } else if (num > maxVal) {
      newErrors[markId] = `ERR-MRK-001: Marks (${num}) exceed maximum allowed (${maxVal}).`;
    } else {
      delete newErrors[markId];
    }

    setValidationErrors(newErrors);
    setRoster(prev => prev.map(item => item.studentMarkId === markId ? { ...item, marksObtained: value } : item));
  };

  const handleSaveMarks = () => {
    if (Object.keys(validationErrors).length > 0) {
      alert('Cannot submit marks: Please resolve all highlighted validation errors first.');
      return;
    }

    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'dr_rk_sharma',
      action: 'MARKS_COMMIT',
      entityAffected: 'StudentMarks',
      entityId: `${selectedSubject}-${selectedAssessment.replace(/\s+/g, '')}`,
      result: 'SUCCESS'
    });

    setSaveSuccessNotice(`Successfully saved and audited ${roster.length} assessment records for ${selectedSubject}.`);
    setTimeout(() => setSaveSuccessNotice(''), 5000);
  };

  const filteredRoster = roster.filter(r =>
    r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-004: Marks & Assessment View</h1>
          <p className="page-subtitle">
            {isStudent
              ? 'Personal Continuous Internal Evaluation & Examination Marks Ledger'
              : 'Subject Evaluation, Continuous Internal Marks Entry & Submission Portal'}
          </p>
        </div>
        <div className="page-actions">
          {isFaculty && (
            <>
              <button onClick={() => navigate('/faculty/import')} className="btn btn-secondary btn-sm">
                Batch Marks Upload (CSV)
              </button>
              <button onClick={() => alert('Marks CSV exported successfully.')} className="btn btn-secondary btn-sm">
                Export Roster CSV
              </button>
            </>
          )}
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {saveSuccessNotice}</div>
        </div>
      )}

      {/* FILTER BAR (SCR-004 Wireframe) */}
      <div className="filter-strip">
        <div className="filter-group">
          <label className="filter-label">Academic Year</label>
          <select className="form-select" defaultValue="2026-27">
            <option value="2026-27">2026-2027</option>
            <option value="2025-26">2025-2026</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Semester</label>
          <select className="form-select" defaultValue="3">
            <option value="3">Semester 3</option>
            <option value="2">Semester 2</option>
            <option value="1">Semester 1</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Subject</label>
          <select
            className="form-select"
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
          >
            <option value="CS301">CS301 — Database Management Systems</option>
            <option value="CS302">CS302 — Discrete Mathematics</option>
            <option value="CS202">CS202 — Data Structures & Algorithms</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Assessment Component</label>
          <select
            className="form-select"
            value={selectedAssessment}
            onChange={(e) => handleAssessmentChange(e.target.value)}
          >
            <option value="Class Test 1">Class Test 1 (Max: 20.00)</option>
            <option value="Mid-Sem Exam">Mid-Sem Exam (Max: 30.00)</option>
            <option value="End-Sem Exam">End-Sem Exam (Max: 50.00)</option>
          </select>
        </div>

        <div className="filter-group" style={{ marginLeft: 'auto' }}>
          <label className="filter-label">Search Student</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search Roll or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* STUDENT SELF-SCOPE VIEW */}
      {isStudent ? (
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">My Registered Course Marks (Semester 3)</h2>
            <span className="badge badge-info">Verified Academic Record</span>
          </div>

          <div className="table-container">
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Assessment Component</th>
                  <th className="table-numeric">Max Marks</th>
                  <th className="table-numeric">Marks Obtained</th>
                  <th>Evaluation Status</th>
                </tr>
              </thead>
              <tbody>
                {studentMarks.length > 0 ? (
                  studentMarks.map((m) => (
                    <tr key={m.student_mark_id}>
                      <td><code>{m.subjectCode}</code></td>
                      <td><strong>{m.subjectName}</strong></td>
                      <td>{m.assessmentType}</td>
                      <td className="table-numeric">{parseFloat(m.maxMarks).toFixed(2)}</td>
                      <td className="table-numeric" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                        {parseFloat(m.marks_obtained).toFixed(2)}
                      </td>
                      <td><span className="badge badge-success">RECORDED</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                      No evaluation records available for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FACULTY ASSESSMENT ROSTER VIEW */
        <div className="saap-card">
          <div className="saap-card-header">
            <div>
              <h2 className="saap-card-title">
                {selectedSubject} — {selectedAssessment} Marks Roster
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                Taught by Dr. R. K. Sharma | Max Marks: {selectedAssessment.includes('Test') ? '20.00' : '30.00'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setRoster(dataService.getFacultySubjectMarksRoster(selectedSubject, selectedAssessment))} className="btn btn-secondary btn-sm">
                Cancel / Reset
              </button>
              <button onClick={handleSaveMarks} className="btn btn-primary btn-sm">
                Save & Submit Marks
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Roll / PRN Number</th>
                  <th>Student Full Name</th>
                  <th style={{ width: '180px' }}>Marks Obtained</th>
                  <th className="table-numeric">Max Marks</th>
                  <th>Grade Band</th>
                  <th>Validation Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((row) => {
                  const maxVal = parseFloat(row.maxMarks);
                  const hasError = validationErrors[row.studentMarkId];

                  return (
                    <tr key={row.studentMarkId}>
                      <td><code>{row.rollNumber}</code></td>
                      <td><strong>{row.studentName}</strong></td>
                      <td>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={maxVal}
                          className={`form-input ${hasError ? 'error' : ''}`}
                          value={row.marksObtained}
                          onChange={(e) => handleMarkChange(row.studentMarkId, e.target.value, maxVal)}
                          style={{ width: '100px', fontWeight: 600 }}
                        />
                        {hasError && (
                          <div style={{ fontSize: '11px', color: 'var(--danger-solid)', marginTop: '2px', fontWeight: 600 }}>
                            {hasError}
                          </div>
                        )}
                      </td>
                      <td className="table-numeric">{row.maxMarks}</td>
                      <td>
                        <span className={`badge ${row.grade === 'A' ? 'badge-success' : row.grade === 'B' ? 'badge-info' : 'badge-attention'}`}>
                          Band {row.grade}
                        </span>
                      </td>
                      <td>
                        {hasError ? (
                          <span className="badge badge-danger">INVALID</span>
                        ) : (
                          <span className="badge badge-normal">VALID</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
