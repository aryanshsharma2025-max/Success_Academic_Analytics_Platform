import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService, ML_MODEL_METADATA } from '../data/dataService';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { RiskGauge } from '../components/common/Charts';

export const SCR014_PredictionAnalytics = () => {
  const { currentUser } = useAuth();

  // Test cases: At-Risk Mentee (Aryan Verma) vs Normal Mentee (Aryansh Sharma)
  const [selectedCaseId, setSelectedCaseId] = useState('0ebe59cd-25d5-595a-974f-e02daeb7bb92');
  const [loggedNotice, setLoggedNotice] = useState('');

  const prediction = dataService.getPrediction(selectedCaseId);

  const handleLogIntervention = () => {
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'v_sharma',
      action: 'PREDICTION_INTERVENTION_LOG',
      entityAffected: 'Predictions',
      entityId: prediction.rollNumber,
      result: 'SUCCESS'
    });

    setLoggedNotice(`Intervention logged for ${prediction.studentName} based on model prediction (Risk Score: ${prediction.riskScore}).`);
    setTimeout(() => setLoggedNotice(''), 4000);
  };

  const handleExportAudit = () => {
    dataService.addAuditLog({
      actorUserId: currentUser?.username || 'v_sharma',
      action: 'PREDICTION_AUDIT_EXPORT',
      entityAffected: 'Predictions',
      entityId: prediction.rollNumber,
      result: 'SUCCESS'
    });
    alert(`Predictive explanation extract and model telemetry exported for ${prediction.studentName}. Event logged in Audit Ledger.`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SCR-014: Academic Risk & Predictive Modeling</h1>
          <p className="page-subtitle">
            Early Backlog Vulnerability Estimators, Explainable Feature Attributions & Model Governance
          </p>
        </div>
        <div className="page-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="case-select" style={{ fontSize: '12px', fontWeight: 600 }}>Inspect Persona:</label>
            <select
              id="case-select"
              className="form-select"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
            >
              <option value="0ebe59cd-25d5-595a-974f-e02daeb7bb92">Aryan Verma (High Risk Backlog Persona)</option>
              <option value="e0e96a43-ded5-5312-9090-65e653459b27">Aryansh Sharma (Low Risk Regular Persona)</option>
            </select>
          </div>
        </div>
      </div>

      {/* MANDATORY INSTITUTIONAL NOTICE (BR-009) */}
      <DisclaimerBanner text="MANDATORY DECISION-SUPPORT NOTICE (BR-009): Predictions are decision-support indicators based on statistical machine learning models. They are NOT guaranteed academic outcomes. Formal evaluations and academic determinations remain strictly under authorized human control." />

      {loggedNotice && (
        <div className="alert-banner alert-success">
          <div>✓ {loggedNotice}</div>
        </div>
      )}

      {/* MODEL GOVERNANCE METADATA (SCR-014 Wireframe) */}
      <div className="saap-card" style={{ padding: '16px 20px', backgroundColor: 'var(--slate-50)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong>Simulated Model Metadata (Semester 6 Design Mock):</strong> <code>{ML_MODEL_METADATA.modelName}</code> ({ML_MODEL_METADATA.version}) | <strong>Algorithm Design:</strong> {ML_MODEL_METADATA.algorithm}
          </div>
          <span className="badge badge-attention">{ML_MODEL_METADATA.status}</span>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--slate-700)' }}>
          <span><strong>Training Horizon:</strong> {ML_MODEL_METADATA.trainingHorizon}</span>
          <span><strong>Precision Target:</strong> {ML_MODEL_METADATA.metrics.precision}</span>
          <span><strong>Recall Target:</strong> {ML_MODEL_METADATA.metrics.recall}</span>
          <span><strong>F1 Target:</strong> {ML_MODEL_METADATA.metrics.f1Score}</span>
          <span><strong>Latency Benchmark:</strong> {ML_MODEL_METADATA.metrics.latencyP95}</span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--slate-500)', fontStyle: 'italic', borderTop: '1px solid var(--slate-200)', paddingTop: '6px' }}>
          Notice: In accordance with SRS Section 21, real ML models require authorized institutional historical data and belong to Semester 6. Zero trained models or ML dependencies exist in this Step 7 prototype.
        </div>
      </div>

      {/* PREDICTIVE RISK SCORECARD */}
      <div className="saap-card" style={{ borderLeft: `5px solid ${prediction.riskScore >= 0.65 ? 'var(--danger-solid)' : 'var(--success-solid)'}` }}>
        <div className="saap-card-header">
          <div>
            <h2 className="saap-card-title">
              Predictive Risk Scorecard — {prediction.studentName} ({prediction.rollNumber})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{prediction.batch}</span>
          </div>
          <span className={`badge ${prediction.riskScore >= 0.65 ? 'badge-risk' : 'badge-normal'}`}>
            {prediction.riskBand}
          </span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div className="filter-label">Target Evaluation Objective:</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-900)' }}>
            {prediction.targetIndicator}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
            Evaluation Term: {prediction.applicablePeriod}
          </div>
        </div>

        {/* Risk Probability Meter */}
        <div style={{ backgroundColor: 'var(--slate-50)', padding: '14px 18px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--slate-200)', marginBottom: '18px' }}>
          <div className="filter-label" style={{ marginBottom: '4px' }}>Quantitative Calibrated Risk Score:</div>
          <RiskGauge score={prediction.riskScore} />
        </div>

        {/* Explainable Feature Attribution (Conceptual - Future SHAP Option) */}
        <div style={{ marginBottom: '18px' }}>
          <div className="filter-label" style={{ marginBottom: '4px' }}>
            Understandable Supporting Factors (Conceptual Feature Attribution / Future SHAP Option):
          </div>
          <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginBottom: '8px' }}>
            SRS FR-014 requires understandable supporting factors where feasible, but does not mandate SHAP. Feature attribution techniques such as SHAP represent a future Semester 6 implementation candidate, illustrated here conceptually without ML runtime dependencies.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {prediction.supportingFactors.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: 'var(--slate-800)' }}>
                  <strong>{i + 1}.</strong> {f.factor}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: f.weight.startsWith('+') ? 'var(--danger-solid)' : 'var(--success-solid)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {f.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Intervention */}
        <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '14px' }}>
          <div className="filter-label" style={{ marginBottom: '4px' }}>Recommended Preventive Intervention:</div>
          <div style={{ fontSize: '13px', color: 'var(--slate-800)', fontStyle: 'italic', marginBottom: '14px' }}>
            "{prediction.recommendedIntervention}"
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={handleExportAudit} className="btn btn-secondary btn-sm">
              Export Audit Trail
            </button>
            <button onClick={handleLogIntervention} className="btn btn-primary btn-sm">
              Log Mentoring Intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
