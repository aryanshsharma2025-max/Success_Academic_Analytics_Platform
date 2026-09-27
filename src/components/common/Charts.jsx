import React from 'react';

/**
 * LineTrendChart: Accessible SVG line chart with data points, axes, and optional threshold line.
 */
export const LineTrendChart = ({
  points = [], // [{ label: 'Sem 1', value: 8.10 }, ...]
  series2 = null, // optional second line series
  series1Label = 'SGPA',
  series2Label = 'CGPA',
  minY = 0,
  maxY = 10,
  threshold = null,
  thresholdLabel = null,
  height = 180,
  unit = ''
}) => {
  const width = 450;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getY = (val) => chartH - ((val - minY) / (maxY - minY)) * chartH + padding.top;
  const getX = (idx, total) => padding.left + (idx / Math.max(total - 1, 1)) * chartW;

  const path1 = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, points.length)} ${getY(p.value)}`)
    .join(' ');

  const path2 = series2
    ? series2
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx, series2.length)} ${getY(p.value)}`)
        .join(' ')
    : null;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', maxWidth: `${width}px`, height: 'auto', display: 'block' }}
        role="img"
        aria-label="Trend chart visualization"
      >
        {/* Background Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const val = minY + (maxY - minY) * (1 - ratio);
          const y = padding.top + ratio * chartH;
          return (
            <g key={ratio}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                {val.toFixed(maxY > 10 ? 0 : 1)}{unit}
              </text>
            </g>
          );
        })}

        {/* Optional Threshold Line */}
        {threshold !== null && (
          <g>
            <line
              x1={padding.left}
              y1={getY(threshold)}
              x2={width - padding.right}
              y2={getY(threshold)}
              stroke="#dc2626"
              strokeDasharray="4 2"
              strokeWidth="1.5"
            />
            {thresholdLabel && (
              <text x={width - padding.right} y={getY(threshold) - 4} textAnchor="end" fontSize="10" fill="#dc2626" fontWeight="600">
                {thresholdLabel} ({threshold}{unit})
              </text>
            )}
          </g>
        )}

        {/* Series 1 Path & Points */}
        <path d={path1} fill="none" stroke="#1d4ed8" strokeWidth="2.5" />
        {points.map((p, idx) => {
          const cx = getX(idx, points.length);
          const cy = getY(p.value);
          return (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
              <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">
                {p.value}{unit}
              </text>
              <text x={cx} y={height - 10} textAnchor="middle" fontSize="11" fill="#475569">
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Optional Series 2 Path & Points */}
        {path2 && (
          <>
            <path d={path2} fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />
            {series2.map((p, idx) => (
              <circle
                key={`s2-${idx}`}
                cx={getX(idx, series2.length)}
                cy={getY(p.value)}
                r="3.5"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="1"
              />
            ))}
          </>
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '6px', fontSize: '11px', color: '#475569' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: '#1d4ed8', display: 'inline-block' }}></span>
          {series1Label}
        </span>
        {series2 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '2px', backgroundColor: '#059669', borderBottom: '2px dashed #059669', display: 'inline-block' }}></span>
            {series2Label}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * BarChartComponent: Horizontal percentage comparison bars.
 */
export const HorizontalBarChart = ({ items = [] }) => {
  // items: [{ label: 'CS301 Data Structures', value: 88, threshold: 75, tag: 'Above Avg' }, ...]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, idx) => {
        const pct = Math.min(Math.max(item.value, 0), 100);
        const isLow = item.threshold && item.value < item.threshold;
        const barColor = isLow ? 'var(--danger-solid)' : item.value >= 85 ? 'var(--primary-600)' : 'var(--slate-600)';

        return (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
              <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: isLow ? 'var(--danger-solid)' : 'var(--slate-900)' }}>
                {item.value}% {item.tag && <span style={{ fontWeight: 500, color: 'var(--slate-500)' }}>({item.tag})</span>}
              </span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: barColor,
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * DistributionHistogram: Score or attendance frequency distribution columns.
 */
export const DistributionHistogram = ({ buckets = [] }) => {
  // buckets: [{ label: '< 8', count: 5, total: 60 }, { label: '8-12', count: 15, total: 60 }, ...]
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', paddingTop: '20px' }}>
      {buckets.map((b, idx) => {
        const heightPct = (b.count / maxCount) * 100;
        return (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '4px' }}>
              {b.count}
            </span>
            <div
              style={{
                width: '100%',
                maxWidth: '44px',
                height: `${heightPct}%`,
                backgroundColor: 'var(--primary-600)',
                borderRadius: '3px 3px 0 0',
                minHeight: '4px'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--slate-600)', marginTop: '6px', textAlign: 'center' }}>
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * RiskGauge: Decision-support risk probability gauge meter (SCR-014).
 */
export const RiskGauge = ({ score = 0.724 }) => {
  const pct = Math.round(score * 100);
  const isHigh = score >= 0.65;
  const isMod = score >= 0.40 && score < 0.65;
  const gaugeColor = isHigh ? 'var(--danger-solid)' : isMod ? 'var(--warning-solid)' : 'var(--success-solid)';

  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
        <span style={{ color: 'var(--success-solid)' }}>Low (0.00 – 0.39)</span>
        <span style={{ color: 'var(--warning-solid)' }}>Moderate (0.40 – 0.64)</span>
        <span style={{ color: 'var(--danger-solid)' }}>High (0.65 – 1.00)</span>
      </div>
      <div style={{ height: '14px', backgroundColor: 'var(--slate-200)', borderRadius: '7px', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: gaugeColor,
            borderRadius: '7px'
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: 'var(--slate-500)' }}>
        <span>0% Probability</span>
        <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Calculated Risk: {pct}% ({score.toFixed(5)})</span>
        <span>100% Probability</span>
      </div>
    </div>
  );
};
