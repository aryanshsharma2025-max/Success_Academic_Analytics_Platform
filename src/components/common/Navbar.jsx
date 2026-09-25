import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const Navbar = () => {
  const { currentUser, switchRole, logout, allRoles } = useAuth();
  const { navigate } = useRouter();

  const handleRoleChange = (e) => {
    const targetRole = e.target.value;
    const targetRoute = switchRole(targetRole);
    navigate(targetRoute);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-navbar">
      <div className="nav-brand">
        <span className="brand-badge">SAAP</span>
        <span className="brand-title">Success & Academic Analytics Platform</span>
      </div>

      <div className="nav-context">
        <div className="term-tag">
          Academic Year: <strong>2026-27</strong> | <strong>Sem 3</strong>
        </div>

        {currentUser && (
          <div className="role-switcher-banner" title="Semester 3 Prototype Feature: Quickly switch between institutional roles">
            <label htmlFor="role-select" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
              Simulate Role:
            </label>
            <select
              id="role-select"
              className="form-select"
              value={currentUser.roleName}
              onChange={handleRoleChange}
              style={{ padding: '2px 6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary-700)' }}
            >
              {allRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}

        {currentUser ? (
          <div className="user-badge-group">
            <div className="user-identity">
              <span className="user-name">{currentUser.fullName}</span>
              <span className="user-role-label">{currentUser.roleName} ({currentUser.department})</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              title="End prototype session"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
