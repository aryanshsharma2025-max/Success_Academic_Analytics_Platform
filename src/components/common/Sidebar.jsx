import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const { currentPath, navigate } = useRouter();

  if (!currentUser) return null;

  // Build role-tailored navigation menu items matching Table 4 access matrix
  const getNavSections = () => {
    switch (currentUser.roleName) {
      case 'Student':
        return [
          {
            section: 'My Academics',
            items: [
              { label: 'Dashboard', path: '/student/dashboard' },
              { label: 'Academic Profile', path: '/student/profile' },
              { label: 'Marks & Assessments', path: '/student/marks' },
              { label: 'Attendance Tracking', path: '/student/attendance' }
            ]
          },
          {
            section: 'Advising & Records',
            items: [
              { label: 'Insights & Recommendations', path: '/insights' },
              { label: 'Official Reports', path: '/reports' }
            ]
          }
        ];

      case 'Mentor':
        return [
          {
            section: 'Advising & Cohorts',
            items: [
              { label: 'Mentor Dashboard', path: '/mentor/dashboard' },
              { label: 'Mentee Profiles', path: '/student/profile' },
              { label: 'Marks Inspection', path: '/student/marks' },
              { label: 'Attendance Roster', path: '/student/attendance' }
            ]
          },
          {
            section: 'Early Intervention',
            items: [
              { label: 'Cohort Insights', path: '/insights' },
              { label: 'Predictive Risk Models', path: '/analytics/predictions' },
              { label: 'Mentorship Reports', path: '/reports' }
            ]
          }
        ];

      case 'Faculty':
        return [
          {
            section: 'Instruction & Grades',
            items: [
              { label: 'Course Analytics', path: '/faculty/analytics' },
              { label: 'Marks Entry & Review', path: '/faculty/marks' },
              { label: 'Attendance Tracking', path: '/faculty/attendance' },
              { label: 'Data Import Center', path: '/faculty/import' }
            ]
          },
          {
            section: 'Course Health',
            items: [
              { label: 'Pedagogical Insights', path: '/insights' },
              { label: 'Backlog Predictions', path: '/analytics/predictions' },
              { label: 'Course Reports', path: '/reports' }
            ]
          }
        ];

      case 'Department User':
        return [
          {
            section: 'Department Oversight',
            items: [
              { label: 'Department Analytics', path: '/department/analytics' },
              { label: 'Curriculum Marks Summary', path: '/faculty/marks' },
              { label: 'Attendance Breakdown', path: '/faculty/attendance' }
            ]
          },
          {
            section: 'Outcomes & Reporting',
            items: [
              { label: 'Curriculum Bottlenecks', path: '/insights' },
              { label: 'Cohort Risk Analytics', path: '/analytics/predictions' },
              { label: 'Department Reports', path: '/reports' }
            ]
          }
        ];

      case 'Academic Administrator':
        return [
          {
            section: 'Institutional Operations',
            items: [
              { label: 'Academic Master Data', path: '/admin/master-data' },
              { label: 'Data Import Center', path: '/admin/import' },
              { label: 'Student Directory', path: '/student/profile' }
            ]
          },
          {
            section: 'Evaluations & Audits',
            items: [
              { label: 'Institutional Marks', path: '/faculty/marks' },
              { label: 'Institutional Attendance', path: '/faculty/attendance' },
              { label: 'Institutional Insights', path: '/insights' },
              { label: 'Official Reports & Ledgers', path: '/reports' }
            ]
          }
        ];

      case 'Data Analyst':
        return [
          {
            section: 'Analytics Engine',
            items: [
              { label: 'Departmental Analytics', path: '/department/analytics' },
              { label: 'Insights & Heuristics', path: '/insights' },
              { label: 'Statistical Evaluations', path: '/analytics/predictions' },
              { label: 'De-identified Reports', path: '/reports' }
            ]
          }
        ];

      case 'ML Engineer':
        return [
          {
            section: 'Predictive Modeling',
            items: [
              { label: 'Model Governance & Risk', path: '/analytics/predictions' },
              { label: 'Model Explainability', path: '/insights' },
              { label: 'Model Metrics Reports', path: '/reports' }
            ]
          }
        ];

      case 'System Administrator':
        return [
          {
            section: 'Security & Operations',
            items: [
              { label: 'User Management', path: '/admin/users' },
              { label: 'Audit & System Health', path: '/admin/audit' },
              { label: 'System Access Reports', path: '/reports' }
            ]
          }
        ];

      case 'Auditor / Viewer':
        return [
          {
            section: 'Compliance & Audit',
            items: [
              { label: 'Audit Ledger & Health', path: '/admin/audit' },
              { label: 'Academic Structure Audit', path: '/admin/master-data' },
              { label: 'User Permissions Audit', path: '/admin/users' },
              { label: 'Audited Reports', path: '/reports' }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getNavSections();

  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      <nav className="sidebar-nav">
        {sections.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '12px' }}>
            <div className="nav-section-title">{sec.section}</div>
            {sec.items.map(item => {
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{ width: '100%', textAlign: 'left', background: 'none' }}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
