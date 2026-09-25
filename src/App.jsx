import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Forbidden403 } from './components/common/Forbidden403';

// 16 SRS Screens
import { SCR001_Login } from './screens/SCR001_Login';
import { SCR002_StudentDashboard } from './screens/SCR002_StudentDashboard';
import { SCR003_AcademicProfile } from './screens/SCR003_AcademicProfile';
import { SCR004_MarksAssessmentView } from './screens/SCR004_MarksAssessmentView';
import { SCR005_AttendanceView } from './screens/SCR005_AttendanceView';
import { SCR006_MentorDashboard } from './screens/SCR006_MentorDashboard';
import { SCR007_FacultyAnalytics } from './screens/SCR007_FacultyAnalytics';
import { SCR008_DepartmentAnalytics } from './screens/SCR008_DepartmentAnalytics';
import { SCR009_DataImportCenter } from './screens/SCR009_DataImportCenter';
import { SCR010_ImportValidationResult } from './screens/SCR010_ImportValidationResult';
import { SCR011_AcademicMasterData } from './screens/SCR011_AcademicMasterData';
import { SCR012_UserManagement } from './screens/SCR012_UserManagement';
import { SCR013_InsightsRecommendations } from './screens/SCR013_InsightsRecommendations';
import { SCR014_PredictionAnalytics } from './screens/SCR014_PredictionAnalytics';
import { SCR015_Reports } from './screens/SCR015_Reports';
import { SCR016_AuditSystemHealth } from './screens/SCR016_AuditSystemHealth';

const AppContent = () => {
  const { currentUser, hasAccessToScreen } = useAuth();
  const { currentPath, matchRoute } = useRouter();

  // Route resolution & parameter extraction
  let screenId = 'SCR-001';
  let screenComponent = null;

  if (currentPath === '/login' || !currentUser) {
    screenId = 'SCR-001';
    screenComponent = <SCR001_Login />;
  } else if (currentPath === '/student/dashboard') {
    screenId = 'SCR-002';
    screenComponent = <SCR002_StudentDashboard />;
  } else if (currentPath === '/student/profile') {
    screenId = 'SCR-003';
    screenComponent = <SCR003_AcademicProfile />;
  } else if (matchRoute('/mentor/student/:id', currentPath)) {
    screenId = 'SCR-003';
    const params = matchRoute('/mentor/student/:id', currentPath);
    screenComponent = <SCR003_AcademicProfile selectedStudentId={params.id} />;
  } else if (currentPath === '/student/marks' || currentPath === '/faculty/marks') {
    screenId = 'SCR-004';
    screenComponent = <SCR004_MarksAssessmentView />;
  } else if (currentPath === '/student/attendance' || currentPath === '/faculty/attendance') {
    screenId = 'SCR-005';
    screenComponent = <SCR005_AttendanceView />;
  } else if (currentPath === '/mentor/dashboard') {
    screenId = 'SCR-006';
    screenComponent = <SCR006_MentorDashboard />;
  } else if (currentPath === '/faculty/analytics') {
    screenId = 'SCR-007';
    screenComponent = <SCR007_FacultyAnalytics />;
  } else if (currentPath === '/department/analytics') {
    screenId = 'SCR-008';
    screenComponent = <SCR008_DepartmentAnalytics />;
  } else if (currentPath === '/admin/import' || currentPath === '/faculty/import') {
    screenId = 'SCR-009';
    screenComponent = <SCR009_DataImportCenter />;
  } else if (matchRoute('/admin/import/validate/:jobId', currentPath)) {
    screenId = 'SCR-010';
    const params = matchRoute('/admin/import/validate/:jobId', currentPath);
    screenComponent = <SCR010_ImportValidationResult jobId={params.jobId} />;
  } else if (currentPath === '/admin/master-data') {
    screenId = 'SCR-011';
    screenComponent = <SCR011_AcademicMasterData />;
  } else if (currentPath === '/admin/users') {
    screenId = 'SCR-012';
    screenComponent = <SCR012_UserManagement />;
  } else if (currentPath === '/insights') {
    screenId = 'SCR-013';
    screenComponent = <SCR013_InsightsRecommendations />;
  } else if (currentPath === '/analytics/predictions') {
    screenId = 'SCR-014';
    screenComponent = <SCR014_PredictionAnalytics />;
  } else if (currentPath === '/reports') {
    screenId = 'SCR-015';
    screenComponent = <SCR015_Reports />;
  } else if (currentPath === '/admin/audit') {
    screenId = 'SCR-016';
    screenComponent = <SCR016_AuditSystemHealth />;
  } else {
    // Default fallback
    screenId = 'SCR-002';
    screenComponent = <SCR002_StudentDashboard />;
  }

  // Enforce Role-Based Access Control Boundaries (Table 4)
  const isAuthorized = hasAccessToScreen(screenId);

  if (screenId === 'SCR-001') {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content" style={{ maxWidth: '100%' }}>
          {screenComponent}
        </main>
        <footer className="app-footer">
          <div>SAAP Prototype v1.0.0 (Semester 3 — Step 7 Prototype)</div>
          <div>IEEE 29148 Standard Compliant | Strict Phase Boundary: Static Prototype</div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content" id="main-content" tabIndex={-1}>
          {isAuthorized ? (
            screenComponent
          ) : (
            <Forbidden403 requestedScreenId={screenId} requestedPath={currentPath} />
          )}
        </main>
      </div>
      <footer className="app-footer">
        <div>
          <strong>SAAP Academic Analytics</strong> | Build: <code>v1.0.0-sem3-prototype</code> | Data Source: Synthetic Cohort (200 Students, 4.2k Marks, 1.4k Attendance)
        </div>
        <div>
          <em>Decision-Support System: Predictive indicators and insights do not replace authorized human evaluation (BR-009).</em>
        </div>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
};
