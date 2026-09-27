import React, { useEffect } from 'react';
import { useAuth, ROLE_DEFAULT_ROUTES } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { dataService } from '../../data/dataService';

export const Forbidden403 = ({ requestedScreenId, requestedPath }) => {
  const { currentUser } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (currentUser) {
      dataService.addAuditLog({
        actorUserId: currentUser.username,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        entityAffected: 'Screen',
        entityId: requestedScreenId || requestedPath,
        result: 'DENIED'
      });
    }
  }, [currentUser, requestedScreenId, requestedPath]);

  const defaultRoute = currentUser ? ROLE_DEFAULT_ROUTES[currentUser.roleName] : '/login';

  return (
    <div style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center' }}>
      <div className="saap-card" style={{ padding: '36px 24px', borderTop: '4px solid var(--danger-solid)' }}>
        <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--danger-solid)', marginBottom: '8px' }}>
          403
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '12px' }}>
          ERR-AUTHZ-001: Access Denied
        </h2>
        <div className="alert-banner alert-danger" style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div>
            <strong>RBAC Boundary Violation:</strong> Your authenticated prototype role (
            <strong>{currentUser ? currentUser.roleName : 'Unauthenticated'}</strong>) is not authorized to access screen{' '}
            <code>{requestedScreenId}</code> (<code>{requestedPath}</code>) under the approved Access Matrix (
            <em>SAAP-REQ-RAM-001</em>).
          </div>
        </div>
        <p style={{ color: 'var(--slate-600)', fontSize: '13px', marginBottom: '16px' }}>
          Access to this interface is restricted to designated personnel under the Role-Permission Matrix.
        </p>
        <div style={{ fontSize: '11px', color: 'var(--slate-500)', backgroundColor: 'var(--slate-50)', padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--slate-200)', marginBottom: '20px', lineHeight: 1.4, textAlign: 'left' }}>
          <strong>Prototype Architecture Notice:</strong> This boundary check demonstrates client-side navigation gating for UI prototype evaluation. It is NOT production security enforcement. Production RBAC authorization and server-side token enforcement are implemented in Semester 4.
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate(defaultRoute)} className="btn btn-primary">
            Return to Authorized Dashboard
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-secondary">
            Switch User Account
          </button>
        </div>
      </div>
    </div>
  );
};
