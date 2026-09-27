import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { dataService } from '../data/dataService';
import { MetricCard } from '../components/common/MetricCard';
import { LineTrendChart, HorizontalBarChart } from '../components/common/Charts';

export const SCR008_DepartmentAnalytics = () => {
  const { navigate } = useRouter();

  const [selectedDept, setSelectedDept] = useState('CSE');
  const deptData = dataService.getDepartmentSummary(selectedDept);

  // Comparative Batch SGPA Trajectory
  const batch2023 = [
    { label: 'Sem 1', value: 7.85 },
    { label: 'Sem 2', value: 8.05 },
    { label: 'Sem 3', value: 8.12 }
  ];
  const batch2024 = [
    { label: 'Sem 1', value: 7.50 },
    { label: 'Sem 2', value: 7.68 },
    { label: 'Sem 3', value: 7.65 }
  ];

  // Department attendance distribution
  const deptAttDistribution = [
    { label: '>= 85% — High Regularity', value: 65, tag: '73 Students' },
    { label: '75% – 84% — Statutorily Compliant', value: 24, tag: '27 Students' },
    { label: '65% – 74% — Warning Advisory', value: 8, threshold: 10, tag: '9 Students' },
    { label: '< 65% — Critical Detention Zone', value: 3, threshold: 5, tag: '4 Students' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-008: Departmental Oversight Analytics</h1>
          <p className="page-subtitle">
            Aggregate Academic Performance, Multi-Cohort Trajectories & Curriculum Bottleneck Detection
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate('/reports')} className="btn btn-primary btn-sm">
            Export Department Performance Report
          </button>
        </div>
      </div>

      {/* FILTERS STRIP (SCR-008 Wireframe) */}
      <div className="filter-strip">
        <div className="filter-group">
          <label className="filter-label">Academic Department</label>
          <select
            className="form-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="CSE">Computer Science & Engineering</option>
            <option value="ECE">Electronics & Communication Engineering</option>
            <option value="MECH">Mechanical Engineering</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Academic Degree Program</label>
          <select className="form-select" defaultValue="BT-CSE">
            <option value="BT-CSE">B.Tech Computer Science & Engineering</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Academic Year</label>
          <select className="form-select" defaultValue="2026-27">
            <option value="2026-27">2026-2027</option>
            <option value="2025-26">2025-2026</option>
          </select>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY STRIP */}
      <div className="grid-4">
        <MetricCard
          title="Total Active Students"
          value={deptData.totalStudents}
          footnote="Across 3 Active Cohorts"
        />
        <MetricCard
          title="Overall Department Pass Rate"
          value={deptData.overallPassRate}
          footnote="Target Institutional: >= 90.0%"
        />
        <MetricCard
          title="Average Department SGPA"
          value={deptData.avgDeptSgpa}
          footnote="▲ vs Prior Year: +0.15"
        />
        <MetricCard
          title="Active Backlog Density"
          value={`${deptData.highRiskBacklogs} Cases`}
          footnote={
            <span style={{ color: 'var(--danger-solid)', fontWeight: 600 }}>
              Concentrated in Discrete Maths
            </span>
          }
        />
      </div>

      {/* BATCH PERFORMANCE & ATTENDANCE DISTRIBUTION */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Comparative Batch SGPA Trajectory</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Batch 2023 vs Batch 2024</span>
          </div>
          <LineTrendChart
            points={batch2023}
            series2={batch2024}
            series1Label="Batch 2023-27"
            series2Label="Batch 2024-28"
            minY={6.0}
            maxY={9.0}
          />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Department Attendance Distribution</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>All Department Cohorts</span>
          </div>
          <HorizontalBarChart items={deptAttDistribution} />
        </div>
      </div>

      {/* CROSS-SUBJECT OUTCOME PATTERNS & BACKLOG CLUSTERS */}
      <div className="saap-card">
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">Cross-Subject Outcome Patterns & Backlog Clusters</h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
              Curriculum Health & Course Failure Density Analysis
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="saap-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Curriculum Subject Title</th>
                <th className="table-numeric">Pass Rate</th>
                <th className="table-numeric">Cohort Avg Marks</th>
                <th className="table-numeric">Backlog Count</th>
                <th>Curriculum Risk Rating</th>
                <th>Intervention Status</th>
              </tr>
            </thead>
            <tbody>
              {deptData.subjectOutcomes.map((row) => {
                const isHighDiff = row.difficultyRating.includes('High');
                return (
                  <tr key={row.subjectCode}>
                    <td><code>{row.subjectCode}</code></td>
                    <td><strong>{row.subjectName}</strong></td>
                    <td className="table-numeric" style={{ fontWeight: 600, color: isHighDiff ? 'var(--danger-solid)' : 'var(--slate-800)' }}>
                      {row.passPercentage}
                    </td>
                    <td className="table-numeric">{row.avgMarks}</td>
                    <td className="table-numeric" style={{ fontWeight: 700, color: isHighDiff ? 'var(--danger-solid)' : 'var(--slate-800)' }}>
                      {row.backlogCount}
                    </td>
                    <td>
                      <span className={`badge ${isHighDiff ? 'badge-risk' : 'badge-normal'}`}>
                        {row.difficultyRating}
                      </span>
                    </td>
                    <td>
                      {isHighDiff ? (
                        <button onClick={() => navigate('/insights')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
                          View Bottleneck Insight
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Baseline Met</span>
                      )}
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
