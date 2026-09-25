import React from 'react';

export const DisclaimerBanner = ({ text }) => {
  const defaultText =
    "MANDATORY INSTITUTIONAL NOTICE (BR-009): System-generated predictions and recommendations are decision-support indicators based on statistical modeling and rule engines. They are NOT guaranteed academic outcomes. Final evaluations and academic actions remain strictly under authorized human control.";

  return (
    <div className="alert-banner alert-warning" role="note">
      <div style={{ fontWeight: 700, minWidth: '20px' }}>[!]</div>
      <div>{text || defaultText}</div>
    </div>
  );
};
