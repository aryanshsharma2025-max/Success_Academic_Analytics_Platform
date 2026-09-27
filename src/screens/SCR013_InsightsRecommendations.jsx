import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../data/dataService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const SCR013_InsightsRecommendations = () => {
  const { currentUser } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [insights, setInsights] = useState(() => {
    return dataService.getInsights(currentUser?.roleName, currentUser?.studentId);
  });
  const [actionNotice, setActionNotice] = useState('');

  const handleUpdateStatus = (id, newStatus, actionName) => {
    dataService.updateInsightStatus(id, newStatus);
    setInsights(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));

    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'unknown',
      action: 'INSIGHT_STATUS_UPDATE',
      entityAffected: 'Insights',
      entityId: id,
      result: 'SUCCESS'
    });

    setActionNotice(`Recommendation ${actionName || 'updated'}. Status set to ${newStatus}.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredInsights = insights.filter(i => {
    if (categoryFilter !== 'ALL' && i.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-013: Academic Insights & Recommendations</h1>
          <p className="page-subtitle">
            Explainable Evidence-Backed Observations, Early Advising Signals & Actionable Recommendations
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {actionNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {actionNotice}</div>
        </div>
      )}

      {/* FILTERS STRIP (SCR-013 Wireframe) */}
      <div className="filter-strip">
        <div className="filter-group">
          <label className="filter-label">Academic Period</label>
          <select className="form-select" defaultValue="2026-27-3">
            <option value="2026-27-3">2026-2027 Semester 3 (Active)</option>
            <option value="2025-26-2">2025-2026 Semester 2</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Insight Category</label>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="ATTENDANCE_DEFICIT">Attendance Shortage Alerts</option>
            <option value="ACADEMIC_MASTERY">Performance Excellence</option>
            <option value="DEPARTMENT_CURRICULUM">Curriculum Bottlenecks</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Advising Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New (Unreviewed)</option>
            <option value="VIEWED">Viewed / Acknowledged</option>
            <option value="ACTIONED">Actioned / Completed</option>
          </select>
        </div>
      </div>

      {/* CHRONOLOGICAL INSIGHT CARDS FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredInsights.length > 0 ? (
          filteredInsights.map((ins) => {
            const isDanger = ins.severity === 'danger';
            const isWarning = ins.severity === 'warning';
            const borderColor = isDanger ? 'var(--danger-solid)' : isWarning ? 'var(--warning-solid)' : 'var(--primary-600)';

            return (
              <div
                key={ins.id}
                className="saap-card"
                style={{ borderLeft: `5px solid ${borderColor}`, padding: '20px', marginBottom: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <span className={`badge ${isDanger ? 'badge-risk' : isWarning ? 'badge-attention' : 'badge-info'}`} style={{ marginRight: '8px' }}>
                      {ins.typeBadge}
                    </span>
                    {ins.studentName && (
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-800)' }}>
                        Target: {ins.studentName} ({ins.studentRoll})
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--slate-500)', fontWeight: 500 }}>
                    Period: {ins.academicPeriod}
                  </span>
                </div>

                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '8px' }}>
                  {ins.title}
                </h2>

                <div style={{ backgroundColor: 'var(--slate-50)', padding: '10px 14px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--slate-200)', marginBottom: '14px', fontSize: '12px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Evidence Metric:</strong> <span style={{ color: isDanger ? 'var(--danger-solid)' : 'var(--slate-900)', fontWeight: 600 }}>{ins.evidenceMetric}</span>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Supporting Factor:</strong> {ins.supportingFactor}
                  </div>
                  <div>
                    <strong>Confidence / Heuristic Strength:</strong> {ins.confidence}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: '1 1 400px' }}>
                    <div className="filter-label" style={{ marginBottom: '2px' }}>Actionable Recommendation:</div>
                    <div style={{ fontSize: '13px', color: 'var(--slate-800)', fontStyle: 'italic' }}>
                      "{ins.recommendationText}"
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${ins.status === 'ACTIONED' ? 'badge-success' : ins.status === 'VIEWED' ? 'badge-info' : 'badge-attention'}`}>
                      STATUS: {ins.status}
                    </span>

                    {ins.status !== 'ACTIONED' && (
                      <button
                        onClick={() => handleUpdateStatus(ins.id, 'ACTIONED', 'Marked as Actioned')}
                        className="btn btn-primary btn-sm"
                      >
                        Mark as Actioned
                      </button>
                    )}

                    {ins.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateStatus(ins.id, 'VIEWED', 'Acknowledged')}
                        className="btn btn-secondary btn-sm"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="saap-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
            No active academic insights matching the selected category and status filters.
          </div>
        )}
      </div>
    </div>
  );
};
