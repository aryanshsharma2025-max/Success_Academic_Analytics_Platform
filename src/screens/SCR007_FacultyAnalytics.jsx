import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { MetricCard } from '../components/common/MetricCard';
import { LineTrendChart, HorizontalBarChart, DistributionHistogram } from '../components/common/Charts';

export const SCR007_FacultyAnalytics = () => {
  const { navigate } = useRouter();

  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [selectedAssessment, setSelectedAssessment] = useState('Class Test 1');

  // Score distribution buckets for CS301 Class Test 1
  const scoreBuckets = [
    { label: '< 8 Marks', count: 5 },
    { label: '8 – 12 Marks', count: 12 },
    { label: '13 – 16 Marks', count: 26 },
    { label: '17 – 20 Marks', count: 17 }
  ];

  // Performance Bands Classification
  const performanceBands = [
    { label: 'Band A (>= 80% — Distinction)', value: 45, tag: '27 Students' },
    { label: 'Band B (60% – 79% — First Class)', value: 33, tag: '20 Students' },
    { label: 'Band C (40% – 59% — Second Class)', value: 13, tag: '8 Students' },
    { label: 'Band F (< 40% — Remedial Needed)', value: 9, threshold: 10, tag: '5 Students' }
  ];

  // Multi-assessment Average Trend Line
  const assessmentTrends = [
    { label: 'CT 1 (20)', value: 74.0 },
    { label: 'Mid-Sem (30)', value: 71.3 },
    { label: 'Lab Exam (25)', value: 82.5 }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-007: Faculty Course Analytics</h1>
          <p className="page-subtitle">
            Subject-Level Evaluative Metrics, Score Distributions, and Pedagogical Insights
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => navigate('/faculty/marks')} className="btn btn-primary btn-sm">
            Enter Marks
          </button>
          <button onClick={() => navigate('/faculty/attendance')} className="btn btn-secondary btn-sm">
            Check Attendance
          </button>
        </div>
      </div>

      {/* CURRICULUM FILTERS (SCR-007 Wireframe) */}
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
          <label className="filter-label">Course Subject</label>
          <select
            className="form-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="CS301">CS301 — Database Management Systems</option>
            <option value="CS202">CS202 — Data Structures & Algorithms</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cohort Batch</label>
          <select className="form-select" defaultValue="2024-28">
            <option value="2024-28">BT-CSE Batch 2024-2028</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Assessment Type</label>
          <select
            className="form-select"
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(e.target.value)}
          >
            <option value="Class Test 1">Class Test 1 (Max: 20.00)</option>
            <option value="Mid-Sem Exam">Mid-Sem Exam (Max: 30.00)</option>
            <option value="End-Sem Exam">End-Sem Exam (Max: 50.00)</option>
          </select>
        </div>
      </div>

      {/* KEY METRICS STRIP */}
      <div className="grid-4">
        <MetricCard
          title="Total Enrolled"
          value="62"
          footnote="Section A & Section B"
        />
        <MetricCard
          title="Students Appeared"
          value="60"
          footnote="2 Students Absent"
        />
        <MetricCard
          title="Component Pass Rate"
          value="88.3%"
          footnote="Target Institutional: >= 85.0%"
        />
        <MetricCard
          title="Class Average Marks"
          value="14.8 / 20"
          footnote="Percentage: 74.0%"
        />
      </div>

      {/* SCORE DISTRIBUTION & PERFORMANCE BANDS */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Score Distribution Histogram</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Frequency by Score Range</span>
          </div>
          <DistributionHistogram buckets={scoreBuckets} />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Performance Bands Classification</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Grade Distribution</span>
          </div>
          <HorizontalBarChart items={performanceBands} />
        </div>
      </div>

      {/* MULTI-ASSESSMENT TREND & STRUGGLING TOPICS */}
      <div className="grid-2">
        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Historical Average Trend Across Assessments</h2>
            <span style={{ fontSize: '11px', color: 'var(--slate-500)' }}>Normalized % Score</span>
          </div>
          <LineTrendChart
            points={assessmentTrends}
            minY={40}
            maxY={100}
            unit="%"
            threshold={70}
            thresholdLabel="Target Mastery"
            series1Label="Class Avg %"
          />
        </div>

        <div className="saap-card">
          <div className="saap-card-header">
            <h2 className="saap-card-title">Top Struggling Topics & Observations</h2>
            <button onClick={() => navigate('/insights')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
              View Insights
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', borderLeft: '4px solid var(--danger-solid)', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--border-radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '12px' }}>
                [!] Topic Bottleneck: Relational Normalization (BCNF / 4NF)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-600)', marginTop: '2px' }}>
                Average score 42.0% in Question 3 of Class Test 1. Lowest answering accuracy in cohort.
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderLeft: '4px solid var(--primary-600)', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--border-radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '12px' }}>
                [i] Section Cohort Comparison
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-600)', marginTop: '2px' }}>
                Section A outperforms Section B by 6.8% on continuous assessment questions.
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderLeft: '4px solid var(--warning-solid)', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--border-radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: '12px' }}>
                [&gt;] Recommended Action
              </div>
              <div style={{ fontSize: '11px', color: 'var(--slate-600)', marginTop: '2px' }}>
                Conduct a targeted tutorial on Normalization decompositions prior to Mid-Semester Exam.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
