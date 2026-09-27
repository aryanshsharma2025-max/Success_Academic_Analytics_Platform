import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';
import { MetricCard } from '../components/common/MetricCard';
import { LineTrendChart, HorizontalBarChart } from '../components/common/Charts';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SCR002_StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  const studentId = currentUser?.studentId || 'e0e96a43-ded5-5312-9090-65e653459b27';
  const student = dataService.getStudentById(studentId);
  const results = dataService.getStudentResults(studentId);
  const attendanceList = dataService.getStudentAttendance(studentId);
  const backlogs = dataService.getStudentBacklogs(studentId);
  const insights = dataService.getInsights('Student', studentId);

  // Compute latest metrics from synthetic dataset
  const latestResult = results.length > 0 ? results[results.length - 1] : { sgpa: '8.42', cgpa: '8.15' };
  const currentSgpa = parseFloat(latestResult.sgpa || '8.42').toFixed(2);
  const currentCgpa = parseFloat(latestResult.cgpa || '8.15').toFixed(2);

  const avgAttendance = attendanceList.length > 0
    ? (attendanceList.reduce((acc, a) => acc + parseFloat(a.attendance_percentage), 0) / attendanceList.length).toFixed(1)
    : '81.5';

  const activeBacklogCount = backlogs.filter(b => b.status === 'ACTIVE').length;

  // Trend data points
  const sgpaTrend = results.map(r => ({
    label: `Sem ${r.semesterNumber}`,
    value: parseFloat(r.sgpa)
  }));
  const cgpaTrend = results.map(r => ({
    label: `Sem ${r.semesterNumber}`,
    value: parseFloat(r.cgpa)
  }));

  // Subject Performance vs Average
  const subjectBars = [
    { label: 'CS301 Data Structures', value: 88, threshold: 75, tag: 'High' },
    { label: 'CS302 Discrete Mathematics', value: 74, threshold: 75, tag: 'Near Min' },
    { label: 'CS303 Computer Organization', value: 78, threshold: 75, tag: 'Stable' },
    { label: 'CS304 Digital Electronics', value: 91, threshold: 75, tag: 'High' }
  ];

  // Monthly Attendance
  const monthlyAttPoints = [
    { label: 'Jul', value: 86.5 },
    { label: 'Aug', value: 84.0 },
    { label: 'Sep', value: parseFloat(avgAttendance) }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-002: Student Dashboard</h1>
          <p className="page-subtitle">
            Academic Performance, Attendance Trajectory, and Early Decision-Support Overview
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate('/student/profile')} className="btn btn-secondary btn-sm">
            View Official Profile
          </button>
          <button onClick={() => navigate('/reports')} className="btn btn-primary btn-sm">
            Download Transcript
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* OVERVIEW KPI METRICS (SCR-002 Wireframe) */}
      <div className="grid-4">
        <MetricCard
          title="Current SGPA"
          value={currentSgpa}
          footnote={
            <span style={{ color: 'var(--success-solid)', fontWeight: 600 }}>
              ▲ Trend: +0.25 (Good standing)
            </span>
          }
          onClick={() => navigate('/student/marks')}
        />
        <MetricCard
          title="Cumulative CGPA"
          value={currentCgpa}
          footnote="Cohort Rank: Top 15% (Percentile: 88th)"
          onClick={() => navigate('/student/profile')}
        />
        <MetricCard
          title="Overall Attendance"
          value={`${avgAttendance}%`}
          footnote={
            parseFloat(avgAttendance) >= 75.0 ? (
              <span style={{ color: 'var(--success-solid)' }}>✓ Baseline Threshold (75.0%) Met</span>
            ) : (
              <span style={{ color: 'var(--danger-solid)', fontWeight: 600 }}>⚠ Below 75% Baseline Threshold</span>
            )
          }
          onClick={() => navigate('/student/attendance')}
        />
        <MetricCard
          title="Active Backlogs"
          value={activeBacklogCount}
          footnote={
            activeBacklogCount === 0 ? (
              <span style={{ color: 'var(--success-solid)' }}>Status: Regular / Clear</span>
            ) : (
              <span style={{ color: 'var(--danger-solid)' }}>Attention Required</span>
            )
          }
          onClick={() => navigate('/student/profile')}
        />
      </div>

      {/* PERFORMANCE TRENDS & SUBJECT BREAKDOWN */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Semester SGPA / CGPA Progression Trend</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Sem 1 to Sem 3</span>
          </div>
          <LineTrendChart
            points={sgpaTrend.length > 0 ? sgpaTrend : [{ label: 'Sem 1', value: 8.1 }, { label: 'Sem 2', value: 8.35 }]}
            series2={cgpaTrend.length > 0 ? cgpaTrend : [{ label: 'Sem 1', value: 8.1 }, { label: 'Sem 2', value: 8.22 }]}
            minY={4.0}
            maxY={10.0}
            series1Label="SGPA"
            series2Label="CGPA"
          />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Current Subject Performance vs Average</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Continuous Internal Marks</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <HorizontalBarChart items={subjectBars} />
          </div>
        </div>
      </div>

      {/* ATTENDANCE TREND & ACTIONABLE DECISION-SUPPORT */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Monthly Attendance Trend vs Threshold</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Baseline: 75.0% (Configurable Assumption)</span>
          </div>
          <LineTrendChart
            points={monthlyAttPoints}
            minY={50}
            maxY={100}
            unit="%"
            threshold={75.0}
            thresholdLabel="Baseline Threshold"
            series1Label="Attendance"
          />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Academic Insights & Recommendations</h2>
            <button onClick={() => navigate('/insights')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.slice(0, 2).map((ins) => (
              <div
                key={ins.id}
                style={{
                  border: '1px solid var(--slate-200)',
                  borderLeft: `4px solid ${ins.severity === 'danger' ? 'var(--danger-solid)' : ins.severity === 'warning' ? 'var(--warning-solid)' : 'var(--primary-600)'}`,
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '10px 14px',
                  backgroundColor: 'var(--slate-50)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className={`badge badge-${ins.severity === 'danger' ? 'risk' : ins.severity === 'warning' ? 'attention' : 'info'}`}>
                    {ins.typeBadge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>{ins.academicPeriod}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--slate-900)', marginBottom: '4px' }}>
                  {ins.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--slate-600)', marginBottom: '6px' }}>
                  <strong>Action:</strong> {ins.recommendationText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
