import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export const SCR001_Login = () => {
  const { loginWithUsername, switchRole, prototypeUsers } = useAuth();
  const { navigate } = useRouter();

  const [username, setUsername] = useState('aryansh');
  const [password, setPassword] = useState('Student@123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username/Email and Password are required.');
      return;
    }

    const res = loginWithUsername(username, password);
    if (res.success) {
      navigate(res.defaultRoute);
    } else {
      setErrorMessage(res.error);
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setErrorMessage('');
  };

  const handleQuickRole = (user) => {
    setUsername(user.username);
    setPassword('Demo@123');
    const targetRoute = switchRole(user.roleName);
    navigate(targetRoute);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '0.5px' }}>
          SUCCESS & ACADEMIC ANALYTICS PLATFORM
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '4px' }}>
          Institutional Decision-Support & Performance Monitoring System (IEEE 29148 Standard)
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '960px', width: '100%' }}>
        {/* Main Sign-In Card (SCR-001 Wireframe) */}
        <div className="saap-card" style={{ flex: '1 1 360px', maxWidth: '420px', padding: '28px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--slate-900)', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '8px' }}>
            Account Sign In
          </h2>

          {errorMessage && (
            <div className="alert-banner alert-danger" style={{ padding: '8px 12px', fontSize: '12px', marginBottom: '16px' }}>
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="filter-group" style={{ marginBottom: '14px' }}>
              <label htmlFor="login-username" className="filter-label">Username or Email</label>
              <input
                id="login-username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. aryansh or dr_rk_sharma"
                autoComplete="username"
              />
            </div>

            <div className="filter-group" style={{ marginBottom: '18px' }}>
              <label htmlFor="login-password" className="filter-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                LOG IN
              </button>
              <button type="button" onClick={handleClear} className="btn btn-secondary">
                CLEAR
              </button>
            </div>
          </form>

          <div style={{ fontSize: '11px', color: 'var(--slate-500)', borderTop: '1px solid var(--slate-200)', paddingTop: '10px', lineHeight: 1.4 }}>
            <em>(i) Prototype Simulation Notice: Production authentication (JWT tokens, password hashing, and session management) belongs to Semester 4. This prototype uses client-side state simulation to demonstrate authorized role screens. Unauthorized navigation is simulated and audited.</em>
          </div>
        </div>

        {/* Prototype Role Simulator Card */}
        <div className="saap-card" style={{ flex: '1 1 420px', maxWidth: '480px', padding: '24px', backgroundColor: 'var(--slate-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-attention">Prototype Simulator</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)' }}>
              1-Click Role Exploration
            </span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--slate-600)', marginBottom: '12px', lineHeight: 1.4 }}>
            In accordance with Semester 3 Step 7 guidelines, production JWT authentication and database credentials
            belong to Semester 4. Click any authorized user below to explore their role-scoped interface:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {prototypeUsers.map((u) => (
              <div
                key={u.userId}
                onClick={() => handleQuickRole(u)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--border-radius-sm)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                role="button"
                tabIndex={0}
              >
                <div>
                  <strong>{u.fullName}</strong> <span style={{ color: 'var(--slate-500)' }}>({u.username})</span>
                  <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>{u.department}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-info">{u.roleName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
