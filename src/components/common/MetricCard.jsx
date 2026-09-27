import React from 'react';

export const MetricCard = ({ title, value, footnote, onClick }) => {
  return (
    <div
      className="metric-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {footnote && <div className="metric-footnote">{footnote}</div>}
    </div>
  );
};
