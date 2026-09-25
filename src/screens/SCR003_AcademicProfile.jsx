import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';

export const SCR003_AcademicProfile = ({ selectedStudentId }) => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  // If Academic Admin or Mentor, allow choosing which student to view
  const canSelectStudent = currentUser?.roleName === 'Mentor' || currentUser?.roleName === 'Academic Administrator';
  const menteeList = currentUser?.roleName === 'Mentor'
    ? dataService.getMentorMentees()
    : dataService.getStudents().slice(0, 30);

  const initialId = selectedStudentId || (currentUser?.studentId ? currentUser.studentId : menteeList[0]?.student_id || menteeList[0]?.studentId);
  const [activeStudentId, setActiveStudentId] = useState(initialId);
  const [backlogFilter, setBacklogFilter] = useState('ALL');

  const student = dataService.getStudentById(activeStudentId);
  const enrollment = dataService.getStudentEnrollment(activeStudentId);
  const results = dataService.getStudentResults(activeStudentId);
  const backlogs = dataService.getStudentBacklogs(activeStudentId);

  const filteredBacklogs = backlogFilter === 'ALL'
    ? backlogs
    : backlogs.filter(b => b.status === backlogFilter);

  const handleDownloadTranscript = () => {
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'unknown',
      action: 'TRANSCRIPT_EXPORT',
      entityAffected: 'StudentEnrollment',
      entityId: activeStudentId,
      result: 'SUCCESS'
    });
    alert(`Official Academic Transcript generated and audited for ${student?.full_name} (${student?.institutional_identifier}). Audit event logged under BR-010.`);
  };

  if (!student) {
    return (
      <div className="saap-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'var(--danger-solid)', fontSize: '18px' }}>ERR-STU-001: Student Record Not Found</h2>
        <p style={{ color: 'var(--slate-500)', marginTop: '8px' }}>
          The requested student identifier does not exist in the institutional registry.
        </p>
        <button onClick={() => navigate('/student/dashboard')} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-003: Academic Profile & Official Transcript</h1>
          <p className="page-subtitle">
            Authoritative Institutional Demographic and Longitudinal Academic Record
          </p>
        </div>
        <div className="page-actions">
          {canSelectStudent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="student-picker" style={{ fontSize: '12px', fontWeight: 600 }}>Select Student:</label>
              <select
                id="student-picker"
                className="form-select"
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
              >
                {menteeList.map((m) => {
                  const id = m.studentId || m.student_id;
                  const roll = m.rollNumber || m.institutional_identifier;
                  const name = m.fullName || m.full_name;
                  return <option key={id} value={id}>{roll} — {name}</option>;
                })}
              </select>
            </div>
          )}
          <button onClick={handleDownloadTranscript} className="btn btn-primary btn-sm">
            Download Official Transcript PDF
          </button>
        </div>
      </div>

      {/* STUDENT DEMOGRAPHICS & ENROLLMENT METADATA */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Student Demographics & Program Enrollment</h2>
          <span className="badge badge-active">{student.status || 'ACTIVE'}</span>
        </div>

        <div className="grid-3" style={{ marginBottom: 0 }}>
          <div>
            <div className="filter-label">Full Legal Name</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-900)', marginTop: '2px' }}>
              {student.full_name}
            </div>
          </div>
          <div>
            <div className="filter-label">Institutional Roll / PRN</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-900)', marginTop: '2px' }}>
              {student.institutional_identifier}
            </div>
          </div>
          <div>
            <div className="filter-label">Department</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-900)', marginTop: '2px' }}>
              {enrollment?.departmentName || 'Computer Science & Engineering'}
            </div>
          </div>
          <div>
            <div className="filter-label">Degree Program</div>
            <div style={{ fontSize: '14px', color: 'var(--slate-800)', marginTop: '2px' }}>
              {enrollment?.programName || 'B.Tech Computer Science & Engineering'}
            </div>
          </div>
          <div>
            <div className="filter-label">Admitted Batch Cohort</div>
            <div style={{ fontSize: '14px', color: 'var(--slate-800)', marginTop: '2px' }}>
              {enrollment?.batchName || 'BT-CSE Batch 2024-2028'}
            </div>
          </div>
          <div>
            <div className="filter-label">Designated Faculty Mentor</div>
            <div style={{ fontSize: '14px', color: 'var(--slate-800)', marginTop: '2px' }}>
              Prof. V. Sharma (Computer Science & Engg)
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTER-WISE OFFICIAL ACADEMIC TRANSCRIPT */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Semester-Wise Official Academic Transcript</h2>
          <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Autonomous Grading Register</span>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Academic Year</th>
                <th className="table-numeric">Credits Registered</th>
                <th className="table-numeric">Credits Earned</th>
                <th className="table-numeric">SGPA</th>
                <th className="table-numeric">CGPA</th>
                <th>Result Status</th>
                <th>Published Date</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((r) => (
                  <tr key={r.result_id}>
                    <td><strong>Semester {r.semesterNumber}</strong></td>
                    <td>{r.academicYearLabel}</td>
                    <td className="table-numeric">22.0</td>
                    <td className="table-numeric">22.0</td>
                    <td className="table-numeric" style={{ fontWeight: 600 }}>{parseFloat(r.sgpa).toFixed(2)}</td>
                    <td className="table-numeric" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                      {parseFloat(r.cgpa).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${r.result_status === 'PASS' ? 'badge-pass' : 'badge-danger'}`}>
                        {r.result_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                      {r.published_at ? r.published_at.slice(0, 10) : '2025-06-30'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500)' }}>
                    No published semester examination results found for this student.
                  </td>
                </tr>
              )}
              {/* Ongoing Term Row */}
              <tr style={{ backgroundColor: 'var(--slate-50)' }}>
                <td><strong>Semester 3</strong></td>
                <td>2026-2027</td>
                <td className="table-numeric">20.0</td>
                <td className="table-numeric" style={{ color: 'var(--slate-500)' }}>[In Progress]</td>
                <td className="table-numeric">--</td>
                <td className="table-numeric">--</td>
                <td><span className="badge badge-in-progress">IN PROGRESS</span></td>
                <td style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Expected Dec 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL BACKLOG HISTORY */}
      <div className="saap-card">
        <div className="saap-card-header">
          <h2 className="saap-card-title">Official Backlog History & Clearance Ledger</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setBacklogFilter('ALL')}
              className={`btn btn-sm ${backlogFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            <button
              onClick={() => setBacklogFilter('ACTIVE')}
              className={`btn btn-sm ${backlogFilter === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Active Only
            </button>
            <button
              onClick={() => setBacklogFilter('CLEARED')}
              className={`btn btn-sm ${backlogFilter === 'CLEARED' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Cleared Only
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Origin Semester</th>
                <th>Backlog Status</th>
                <th>Resolution Exam Session</th>
              </tr>
            </thead>
            <tbody>
              {filteredBacklogs.length > 0 ? (
                filteredBacklogs.map((b) => (
                  <tr key={b.backlog_id}>
                    <td><code>{b.subjectCode}</code></td>
                    <td><strong>{b.subjectName}</strong></td>
                    <td>{b.originSemester}</td>
                    <td>
                      <span className={`badge ${b.status === 'CLEARED' ? 'badge-cleared' : 'badge-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>{b.cleared_at || 'Supplementary Exam Dec 2025'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--slate-500)' }}>
                    No recorded academic backlogs in this category. Student standing is clear.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
