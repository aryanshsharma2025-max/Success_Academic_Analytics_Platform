import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';

export const SCR005_AttendanceView = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  const isStudent = currentUser?.roleName === 'Student';
  const isFaculty = currentUser?.roleName === 'Faculty' || currentUser?.roleName === 'Academic Administrator';

  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [selectedSection, setSelectedSection] = useState('A');
  const [showLogModal, setShowLogModal] = useState(false);
  const [sessionHeldDate, setSessionHeldDate] = useState('2026-09-25');
  const [successNotice, setSuccessNotice] = useState('');

  const [roster, setRoster] = useState(() => {
    return dataService.getFacultyAttendanceRoster(selectedSubject);
  });

  // Student specific records
  const studentAttendance = isStudent && currentUser?.studentId
    ? dataService.getStudentAttendance(currentUser.studentId)
    : [];

  const handleSubjectChange = (newSub) => {
    setSelectedSubject(newSub);
    setRoster(dataService.getFacultyAttendanceRoster(newSub));
  };

  // Quick Session Logger simulation
  const handleLogSession = () => {
    setRoster(prev => prev.map(item => ({
      ...item,
      classesHeld: item.classesHeld + 1,
      classesAttended: item.classesAttended + 1,
      attendancePercentage: `${(((item.classesAttended + 1) / (item.classesHeld + 1)) * 100).toFixed(1)}%`
    })));

    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'dr_rk_sharma',
      action: 'ATTENDANCE_SESSION_LOG',
      entityAffected: 'AttendanceRecords',
      entityId: `${selectedSubject}-${sessionHeldDate}`,
      result: 'SUCCESS'
    });

    setShowLogModal(false);
    setSuccessNotice(`Session attendance for ${sessionHeldDate} logged and audited successfully.`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const totalHeld = roster[0]?.classesHeld || 42;
  const belowThresholdCount = roster.filter(r => parseFloat(r.attendancePercentage) < 75.0).length;
  const belowThresholdPct = roster.length > 0 ? ((belowThresholdCount / roster.length) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-005: Attendance View & Tracking</h1>
          <p className="page-subtitle">
            {isStudent
              ? 'Personal Subject-Wise Attendance Ledger & Threshold Monitoring'
              : 'Course Attendance Roster, Session Logger & Minimum Threshold Compliance'}
          </p>
        </div>
        <div className="page-actions">
          {isFaculty && (
            <>
              <button onClick={() => setShowLogModal(true)} className="btn btn-primary btn-sm">
                + Log Today's Session
              </button>
              <button onClick={() => navigate('/faculty/import')} className="btn btn-secondary btn-sm">
                Import Spreadsheet
              </button>
              <button onClick={() => alert('Attendance CSV downloaded.')} className="btn btn-secondary btn-sm">
                Export Attendance CSV
              </button>
            </>
          )}
        </div>
      </div>

      {successNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {successNotice}</div>
        </div>
      )}

      {/* FILTERS & SUMMARY STRIP (SCR-005 Wireframe) */}
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
          <label className="filter-label">Section</label>
          <select
            className="form-select"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* METRIC HIGHLIGHT STRIP */}
      {!isStudent && (
        <div className="grid-3" style={{ marginBottom: '20px' }}>
          <div className="saap-card" style={{ padding: '12px 16px', marginBottom: 0 }}>
            <span className="filter-label">Total Sessions Held</span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--slate-900)' }}>
              {totalHeld} Sessions
            </div>
          </div>
          <div className="saap-card" style={{ padding: '12px 16px', marginBottom: 0 }}>
            <span className="filter-label">Configurable Baseline Threshold</span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-700)' }}>
              75.0% (Design Assumption)
            </div>
          </div>
          <div className="saap-card" style={{ padding: '12px 16px', marginBottom: 0 }}>
            <span className="filter-label">Students Under Threshold</span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--danger-solid)' }}>
              {belowThresholdCount} Students ({belowThresholdPct}%)
            </div>
          </div>
        </div>
      )}

      {/* STUDENT SELF-SCOPE VIEW */}
      {isStudent ? (
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">My Subject Attendance Status (Semester 3)</h2>
            <span className="badge badge-info">Baseline Threshold: 75.0% (Configurable Assumption)</span>
          </div>

          <div className="table-container">
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th className="table-numeric">Classes Held</th>
                  <th className="table-numeric">Classes Attended</th>
                  <th className="table-numeric">Attendance %</th>
                  <th>Advisory Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.length > 0 ? (
                  studentAttendance.map((a) => {
                    const pct = parseFloat(a.attendance_percentage);
                    const isBelow = pct < 75.0;
                    return (
                      <tr key={a.attendance_id}>
                        <td><code>{a.subjectCode}</code></td>
                        <td><strong>{a.subjectName}</strong></td>
                        <td className="table-numeric">{a.classes_held}</td>
                        <td className="table-numeric">{a.classes_attended}</td>
                        <td className="table-numeric" style={{ fontWeight: 700, color: isBelow ? 'var(--danger-solid)' : 'var(--slate-900)' }}>
                          {pct.toFixed(1)}%
                        </td>
                        <td>
                          <span className={`badge ${isBelow ? 'badge-risk' : 'badge-normal'}`}>
                            {isBelow ? 'BELOW BASELINE (<75%)' : 'REGULAR'}
                          </span>
                        </td>
                        <td>
                          {isBelow ? (
                            <button onClick={() => navigate('/insights')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
                              View Advisory
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>--</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                      No attendance records found for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FACULTY ROSTER TABLE */
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">
              {selectedSubject} (Section {selectedSection}) Attendance Roster
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Showing {roster.length} Enrolled Students
            </span>
          </div>

          <div className="table-container">
            <table className="saap-table">
              <thead>
                <tr>
                  <th>Roll / PRN Number</th>
                  <th>Student Full Name</th>
                  <th className="table-numeric">Held</th>
                  <th className="table-numeric">Attended</th>
                  <th className="table-numeric">Attendance %</th>
                  <th>Risk Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((row) => {
                  const isRisk = row.riskStatus.includes('RISK');
                  return (
                    <tr key={row.attendanceId}>
                      <td><code>{row.rollNumber}</code></td>
                      <td><strong>{row.studentName}</strong></td>
                      <td className="table-numeric">{row.classesHeld}</td>
                      <td className="table-numeric">{row.classesAttended}</td>
                      <td className="table-numeric" style={{ fontWeight: 700, color: isRisk ? 'var(--danger-solid)' : 'var(--slate-900)' }}>
                        {row.attendancePercentage}
                      </td>
                      <td>
                        <span className={`badge ${isRisk ? 'badge-risk' : 'badge-normal'}`}>
                          {row.riskStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate('/student/profile')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK LOG SESSION MODAL */}
      {showLogModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">Log Today's Lecture Session</h2>
              <button onClick={() => setShowLogModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-600)', marginBottom: '14px' }}>
                Quick Session Logger for <strong>{selectedSubject}</strong> (Section {selectedSection}).
                Submitting will increment total classes held and mark attendance for present students.
              </p>
              <div className="filter-group" style={{ marginBottom: '14px' }}>
                <label className="filter-label">Session Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={sessionHeldDate}
                  onChange={(e) => setSessionHeldDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label className="filter-label">Topic / Unit Covered</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Unit 3: Relational Algebra & SQL Joins"
                  defaultValue="Unit 3: Relational Algebra & SQL Joins"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowLogModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleLogSession} className="btn btn-primary">
                Confirm & Log Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
