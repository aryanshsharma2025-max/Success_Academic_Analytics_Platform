import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';
import { MetricCard } from '../components/common/MetricCard';
import { HorizontalBarChart } from '../components/common/Charts';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SCR006_MentorDashboard = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState('');

  const mentees = dataService.getMentorMentees();

  // Set initial selected student
  const activeMentee = selectedStudent || mentees.find(m => m.riskFlag !== 'NORMAL') || mentees[0];
  const notes = activeMentee ? dataService.getMentoringNotes(activeMentee.studentId) : [];

  // Metrics
  const totalMentees = mentees.length;
  const attentionCount = mentees.filter(m => m.riskFlag !== 'NORMAL').length;
  const criticalAttCount = mentees.filter(m => m.attendanceNum < 75.0).length;
  const avgSgpa = (mentees.reduce((acc, m) => acc + parseFloat(m.sgpa), 0) / (totalMentees || 1)).toFixed(2);

  // Filter roster
  const filteredMentees = mentees.filter(m => {
    const matchesSearch = m.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'ATTENTION') return m.riskFlag !== 'NORMAL';
    if (activeFilter === 'LOW_ATT') return m.attendanceNum < 75.0;
    if (activeFilter === 'LOW_MARKS') return parseFloat(m.sgpa) < 7.0;
    return true;
  });

  // Distributions
  const sgpaBands = [
    { label: '[9.0 – 10.0] High Distinction', value: 18, tag: '5 Students' },
    { label: '[8.0 – 8.9] First Class with Distinction', value: 43, tag: '12 Students' },
    { label: '[7.0 – 7.9] First Class', value: 21, tag: '6 Students' },
    { label: '[< 7.0] Attention Required', value: 18, threshold: 20, tag: '5 Students' }
  ];

  const attBands = [
    { label: '[>= 85%] Regular Attendance', value: 64, tag: '18 Students' },
    { label: '[75 – 84%] Above Baseline Assumption', value: 25, tag: '7 Students' },
    { label: '[65 – 74%] Warning Level', value: 7, threshold: 10, tag: '2 Students' },
    { label: '[< 65%] Critical Shortage Risk', value: 4, threshold: 5, tag: '1 Student' }
  ];

  const handleSaveNote = () => {
    if (!newNoteText.trim()) {
      alert('Note text cannot be empty.');
      return;
    }

    dataService.saveMentoringNote(activeMentee.studentId, currentUser?.fullName || 'Prof. V. Sharma', newNoteText.trim());
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'v_sharma',
      action: 'MENTOR_NOTE_SAVE',
      entityAffected: 'MenteeNotes',
      entityId: activeMentee.rollNumber,
      result: 'SUCCESS'
    });

    setNewNoteText('');
    setNoteSuccess(`Intervention note logged and audited for ${activeMentee.fullName}.`);
    setTimeout(() => setNoteSuccess(''), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-006: Mentor Advising Center</h1>
          <p className="page-subtitle">
            Assigned Mentee Cohort Monitoring, Risk Prioritization & Formal Intervention Register
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate('/analytics/predictions')} className="btn btn-secondary btn-sm">
            View Predictive Risk Indicators
          </button>
          <button onClick={() => navigate('/reports')} className="btn btn-primary btn-sm">
            Export Mentee Cohort Report
          </button>
        </div>
      </div>

      <DisclaimerBanner text="MENTOR ADVISING NOTICE: Attention indicators and risk flags are decision-support heuristics designed to prioritize early advising. They do not replace faculty evaluation or institutional policies." />

      {/* COHORT OVERVIEW KPI CARDS (SCR-006 Wireframe) */}
      <div className="grid-4">
        <MetricCard
          title="Assigned Students"
          value={totalMentees}
          footnote="Cohort: BT-CSE Batch 2024"
        />
        <MetricCard
          title="Attention Alerts"
          value={attentionCount}
          footnote={
            <span style={{ color: 'var(--danger-solid)', fontWeight: 600 }}>
              Action Required ({attentionCount} Mentees)
            </span>
          }
          onClick={() => setActiveFilter('ATTENTION')}
        />
        <MetricCard
          title="Avg Mentee SGPA"
          value={avgSgpa}
          footnote="Dept Baseline: 7.40 (+0.42)"
        />
        <MetricCard
          title="Critical Attendance (<75%)"
          value={criticalAttCount}
          footnote={
            <span style={{ color: 'var(--danger-solid)' }}>
              Below Baseline (Advisory)
            </span>
          }
          onClick={() => setActiveFilter('LOW_ATT')}
        />
      </div>

      {/* COHORT DISTRIBUTION ANALYTICS */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Academic Performance Distribution (SGPA Bands)</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Latest Exam Session</span>
          </div>
          <HorizontalBarChart items={sgpaBands} />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Attendance Distribution Across Mentees</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Baseline Assumption: 75.0%</span>
          </div>
          <HorizontalBarChart items={attBands} />
        </div>
      </div>

      {/* SEARCHABLE ASSIGNED STUDENT ROSTER */}
      <div className="saap-card">
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">Assigned Mentee Student Roster</h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Showing {filteredMentees.length} of {totalMentees} Assigned Students
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`btn btn-sm ${activeFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All ({totalMentees})
            </button>
            <button
              onClick={() => setActiveFilter('ATTENTION')}
              className={`btn btn-sm ${activeFilter === 'ATTENTION' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Attention Needed* ({attentionCount})
            </button>
            <button
              onClick={() => setActiveFilter('LOW_ATT')}
              className={`btn btn-sm ${activeFilter === 'LOW_ATT' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Low Attendance ({criticalAttCount})
            </button>
            <button
              onClick={() => setActiveFilter('LOW_MARKS')}
              className={`btn btn-sm ${activeFilter === 'LOW_MARKS' ? 'btn-primary' : 'btn-secondary'}`}
            >
              SGPA &lt; 7.0
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search mentee by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th className="table-numeric">SGPA</th>
                <th className="table-numeric">CGPA</th>
                <th className="table-numeric">Attendance</th>
                <th>Risk Flag</th>
                <th>Mentoring Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentees.map((m) => {
                const isSelected = activeMentee?.studentId === m.studentId;
                const isRisk = m.riskFlag !== 'NORMAL';

                return (
                  <tr
                    key={m.studentId}
                    style={{ backgroundColor: isSelected ? 'var(--primary-50)' : undefined }}
                  >
                    <td><code>{m.rollNumber}</code></td>
                    <td><strong>{m.fullName}</strong></td>
                    <td className="table-numeric" style={{ fontWeight: 600 }}>{m.sgpa}</td>
                    <td className="table-numeric">{m.cgpa}</td>
                    <td className="table-numeric" style={{ fontWeight: 700, color: m.attendanceNum < 75.0 ? 'var(--danger-solid)' : 'var(--slate-900)' }}>
                      {m.attendance}
                    </td>
                    <td>
                      <span className={`badge ${isRisk ? 'badge-risk' : 'badge-normal'}`}>
                        {m.riskFlag}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedStudent(m)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                        >
                          Select Notes
                        </button>
                        <button
                          onClick={() => navigate('/student/profile')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                        >
                          Open Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVE INTERVENTION & MENTORING NOTES */}
      {activeMentee && (
        <div className="saap-card" style={{ borderLeft: '4px solid var(--primary-700)' }}>
          <div className="saap-card-header">
            <div>
              <h2 className="saap-card-title">
                Mentoring Consultation Register — {activeMentee.fullName} ({activeMentee.rollNumber})
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                SGPA: {activeMentee.sgpa} | Attendance: {activeMentee.attendance} | Risk Flag: {activeMentee.riskFlag}
              </span>
            </div>
          </div>

          {noteSuccess && (
            <div className="alert-banner alert-success" style={{ padding: '8px 12px', fontSize: '12px', marginBottom: '12px' }}>
              <div>✓ {noteSuccess}</div>
            </div>
          )}

          {/* Historical Notes */}
          <div style={{ marginBottom: '16px' }}>
            <span className="filter-label">Chronological Consultation History:</span>
            {notes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {notes.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--slate-700)', marginBottom: '3px' }}>
                      {n.date} — {n.mentor}
                    </div>
                    <div style={{ color: 'var(--slate-800)' }}>{n.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px', fontStyle: 'italic' }}>
                No prior mentoring consultation notes recorded for this student.
              </div>
            )}
          </div>

          {/* Enter New Note */}
          <div>
            <label htmlFor="new-note" className="filter-label">Enter New Mentoring Consultation Note:</label>
            <textarea
              id="new-note"
              className="form-textarea"
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record advising observations, student responses, remedial commitments, or tutoring referrals..."
              style={{ width: '100%', marginTop: '4px', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveNote} className="btn btn-primary btn-sm">
                Save Mentoring Intervention Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
