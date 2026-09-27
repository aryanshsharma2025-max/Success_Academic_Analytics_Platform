import React, { createContext, useContext, useState } from 'react';
import { PROTOTYPE_USERS, dataService } from '../data/dataService';

const AuthContext = createContext(null);

// Role-to-screen authorization mapping (traceable to Table 4 of docs/ui/ui-wireframes.md)
export const ROLE_SCREEN_PERMISSIONS = {
  Student: [
    'SCR-001', 'SCR-002', 'SCR-003', 'SCR-004', 'SCR-005', 'SCR-013', 'SCR-015'
  ],
  Mentor: [
    'SCR-001', 'SCR-006', 'SCR-003', 'SCR-004', 'SCR-005', 'SCR-013', 'SCR-014', 'SCR-015'
  ],
  Faculty: [
    'SCR-001', 'SCR-007', 'SCR-004', 'SCR-005', 'SCR-009', 'SCR-010', 'SCR-003', 'SCR-013', 'SCR-014', 'SCR-015'
  ],
  'Department User': [
    'SCR-001', 'SCR-008', 'SCR-004', 'SCR-005', 'SCR-013', 'SCR-014', 'SCR-015'
  ],
  'Academic Administrator': [
    'SCR-001', 'SCR-011', 'SCR-009', 'SCR-010', 'SCR-003', 'SCR-004', 'SCR-005', 'SCR-002', 'SCR-006', 'SCR-007', 'SCR-008', 'SCR-013', 'SCR-014', 'SCR-015'
  ],
  'Data Analyst': [
    'SCR-001', 'SCR-008', 'SCR-013', 'SCR-014', 'SCR-015'
  ],
  'ML Engineer': [
    'SCR-001', 'SCR-014', 'SCR-013', 'SCR-015'
  ],
  'System Administrator': [
    'SCR-001', 'SCR-012', 'SCR-016', 'SCR-015'
  ],
  'Auditor / Viewer': [
    'SCR-001', 'SCR-016', 'SCR-015', 'SCR-011', 'SCR-012', 'SCR-003', 'SCR-004', 'SCR-005', 'SCR-008', 'SCR-010', 'SCR-013', 'SCR-014'
  ]
};

// Primary post-login landing screen per role
export const ROLE_DEFAULT_ROUTES = {
  Student: '/student/dashboard',
  Mentor: '/mentor/dashboard',
  Faculty: '/faculty/analytics',
  'Department User': '/department/analytics',
  'Academic Administrator': '/admin/master-data',
  'Data Analyst': '/department/analytics',
  'ML Engineer': '/analytics/predictions',
  'System Administrator': '/admin/users',
  'Auditor / Viewer': '/admin/audit'
};

export const AuthProvider = ({ children }) => {
  // Initialize with Student user for immediate exploration, or null for login
  const [currentUser, setCurrentUser] = useState(PROTOTYPE_USERS[0]); // Aryansh Sharma (Student)

  const loginWithUsername = (username, password) => {
    const user = PROTOTYPE_USERS.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      dataService.addAuditLog({
        actorUserId: username || 'unknown',
        action: 'LOGIN_ATTEMPT',
        entityAffected: 'Users',
        entityId: username || 'unknown',
        result: 'DENIED'
      });
      return { success: false, error: 'ERR-AUTH-001: Invalid username or password.' };
    }
    if (!user.isActive) {
      return { success: false, error: 'ERR-AUTH-002: Account is inactive. Contact Administrator.' };
    }

    setCurrentUser(user);
    dataService.addAuditLog({
      actorUserId: user.username,
      action: 'LOGIN_SUCCESS',
      entityAffected: 'Users',
      entityId: user.userId,
      result: 'SUCCESS'
    });
    return { success: true, defaultRoute: ROLE_DEFAULT_ROUTES[user.roleName] };
  };

  const switchRole = (roleName) => {
    const user = PROTOTYPE_USERS.find(u => u.roleName === roleName);
    if (user) {
      setCurrentUser(user);
      dataService.addAuditLog({
        actorUserId: user.username,
        action: 'PROTOTYPE_ROLE_SWITCH',
        entityAffected: 'Session',
        entityId: roleName,
        result: 'SUCCESS'
      });
      return ROLE_DEFAULT_ROUTES[roleName];
    }
    return '/login';
  };

  const logout = () => {
    if (currentUser) {
      dataService.addAuditLog({
        actorUserId: currentUser.username,
        action: 'LOGOUT',
        entityAffected: 'Session',
        entityId: currentUser.userId,
        result: 'SUCCESS'
      });
    }
    setCurrentUser(null);
  };

  const hasAccessToScreen = (screenId) => {
    if (!currentUser) return screenId === 'SCR-001';
    const allowed = ROLE_SCREEN_PERMISSIONS[currentUser.roleName] || [];
    return allowed.includes(screenId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithUsername,
        switchRole,
        logout,
        hasAccessToScreen,
        allRoles: Object.keys(ROLE_SCREEN_PERMISSIONS),
        prototypeUsers: PROTOTYPE_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
