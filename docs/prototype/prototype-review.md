# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Semester 3 — Step 7: Basic Static / Clickable Prototype Review & Deviation Report
**Document Reference:** `SAAP-PRO-REV-001`  
**Standard:** IEEE 29148 (Adapted) / Enterprise Prototype QA Review  
**Project Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 7: Basic Static/Clickable Prototype)  
**Source of Truth:** SAAP Software Requirements Specification (SRS) Version 1.0 (Section 10, 15, 16, 17, 18, 24, 25)  
**Status:** Complete — Ready for Step 7 Review  

---

## 1. Screens Implemented

All sixteen (16) screens specified in **SRS Section 17 (*User Interface Specifications*)** and **UI Wireframes (`docs/ui/ui-wireframes.md`)** have been implemented without omitting any screen:

| Screen Identifier | Screen Name | Implemented Component | Authorized Roles |
|---|---|---|---|
| **SCR-001** | Login | `src/screens/SCR001_Login.jsx` | All 9 Roles (Public landing with quick prototype simulator) |
| **SCR-002** | Student Dashboard | `src/screens/SCR002_StudentDashboard.jsx` | Student (`ROL-001`), Academic Admin (`ROL-005`, Scoped) |
| **SCR-003** | Academic Profile | `src/screens/SCR003_AcademicProfile.jsx` | Student (`ROL-001`, Own), Mentor (`ROL-002`, Assigned), Acad Admin (`ROL-005`, All) |
| **SCR-004** | Marks & Assessment View | `src/screens/SCR004_MarksAssessmentView.jsx` | Faculty (`ROL-003`, Enter/Review), Acad Admin (`ROL-005`), Student (`ROL-001`, Own) |
| **SCR-005** | Attendance View | `src/screens/SCR005_AttendanceView.jsx` | Faculty (`ROL-003`, Session Logger), Acad Admin (`ROL-005`), Student (`ROL-001`, Own) |
| **SCR-006** | Mentor Dashboard | `src/screens/SCR006_MentorDashboard.jsx` | Mentor (`ROL-002`, Assigned Mentees), Acad Admin (`ROL-005`, View) |
| **SCR-007** | Faculty Analytics | `src/screens/SCR007_FacultyAnalytics.jsx` | Faculty (`ROL-003`, Mapped Courses), Acad Admin (`ROL-005`, View) |
| **SCR-008** | Department Analytics | `src/screens/SCR008_DepartmentAnalytics.jsx` | Dept User (`ROL-004`), Acad Admin (`ROL-005`), Data Analyst (`ROL-006`) |
| **SCR-009** | Data Import Center | `src/screens/SCR009_DataImportCenter.jsx` | Academic Administrator (`ROL-005`), Faculty (`ROL-003`, Marks/Attendance) |
| **SCR-010** | Import Validation Result | `src/screens/SCR010_ImportValidationResult.jsx` | Academic Administrator (`ROL-005`), Faculty (`ROL-003`, Mapped) |
| **SCR-011** | Academic Master Data | `src/screens/SCR011_AcademicMasterData.jsx` | Academic Administrator (`ROL-005`, Manage), Auditor (`ROL-009`, Read-Only) |
| **SCR-012** | User Management | `src/screens/SCR012_UserManagement.jsx` | System Administrator (`ROL-008`, Manage), Auditor (`ROL-009`, Read-Only) |
| **SCR-013** | Insights & Recommendations | `src/screens/SCR013_InsightsRecommendations.jsx` | Student, Mentor, Faculty, Dept User, Acad Admin, Data Analyst |
| **SCR-014** | Prediction Analytics | `src/screens/SCR014_PredictionAnalytics.jsx` | Mentor, Faculty, Dept User (Aggregate), Acad Admin, ML Engineer |
| **SCR-015** | Reports | `src/screens/SCR015_Reports.jsx` | All Authorized Roles (Templates Scoped by RBAC Matrix) |
| **SCR-016** | Audit & System Health | `src/screens/SCR016_AuditSystemHealth.jsx` | System Administrator (`ROL-008`, Manage), Auditor (`ROL-009`, Read-Only) |

---

## 2. Navigation Implemented

The application implements client-side URL synchronization and state-preserving navigation through `src/context/RouterContext.jsx`:
1. **Login Flow:**
   - Entering credentials or selecting a 1-click demo persona on `/login` automatically resolves the user's role and navigates to the role's primary landing screen defined in the SRS (e.g. Student $\rightarrow$ `/student/dashboard`, Mentor $\rightarrow$ `/mentor/dashboard`, Faculty $\rightarrow$ `/faculty/analytics`, SysAdmin $\rightarrow$ `/admin/users`).
2. **Global Application Shell Navigation:**
   - **Top Navigation Bar:** Institutional branding, active academic year/semester context (`2026-27 | Sem 3`), 1-click Prototype Role Switcher dropdown, authenticated user badge, and Logout button.
   - **Left Sidebar:** Dynamically renders only the menu sections and screens permitted by the approved Role & Access Matrix for the active role.
3. **Deep-linking & Parameterized Routes:**
   - Mentee inspection: `/mentor/student/:id` maps directly into SCR-003 with the requested mentee selected.
   - Diagnostic validation: `/admin/import/validate/:jobId` loads the row-level error scorecard for that specific import job.
   - Cross-screen contextual links (e.g., clicking the Attendance card on SCR-002 navigates directly to SCR-005; clicking "Batch Marks Upload" on SCR-004 routes to SCR-009).
4. **Access Control Gating:**
   - Direct navigation to unauthorized URLs (e.g. Student entering `#/admin/users` or `#/faculty/analytics`) immediately triggers the `Forbidden403` component displaying an `ERR-AUTHZ-001: Access Denied` alert, explaining the RBAC boundary violation and logging an unauthorized attempt event in the immutable audit log.

---

## 3. Roles Demonstrated

All nine (9) primary user roles specified in **SRS Section 10** and the **Role-Permission Matrix (`SAAP-REQ-RAM-001`)** are simulated with dedicated persona accounts:

1. **Student (`ROL-001` - `aryansh` / "Aryansh Sharma"):**
   - Access strictly restricted to personal academic information (`BR-001`).
   - Demonstrates: SCR-002 (Dashboard), SCR-003 (Demographics & Transcript), SCR-004 (Personal marks), SCR-005 (Personal attendance), SCR-013 (Personal advisories), SCR-015 (Personal transcript download).
2. **Mentor (`ROL-002` - `v_sharma` / "Prof. V. Sharma"):**
   - Access restricted to assigned mentee cohort (`BT-CSE Batch 2024-2028`) under `BR-002`.
   - Demonstrates: SCR-006 (Cohort KPIs, SGPA/Attendance distribution, mentee roster, consultation notes register), SCR-003, SCR-013, SCR-014 (Predictive risk scorecard for at-risk mentee Aryan Verma).
3. **Faculty (`ROL-003` - `dr_rk_sharma` / "Dr. R. K. Sharma"):**
   - Access restricted to mapped courses (`CS301` Database Systems, `CS202` Data Structures) under `BR-003`.
   - Demonstrates: SCR-007 (Course analytics, score histogram, pass rate gauge), SCR-004 (Inline marks entry and validation), SCR-005 (Lecture session logger), SCR-009 (Marks staging upload).
4. **Department User (`ROL-004` - `m_sen_hod` / "Dr. M. Sen"):**
   - Access restricted to department-level aggregate outcomes (`BR-004`).
   - Demonstrates: SCR-008 (Batch comparisons, department attendance distributions, curriculum difficulty index), SCR-013, SCR-015 (Department reports). Zero individual student PII exposed.
5. **Academic Administrator (`ROL-005` - `acad_admin` / "Academic Administrator"):**
   - Institutional operations oversight.
   - Demonstrates: SCR-011 (Academic master data management), SCR-009 & SCR-010 (Two-stage data ingestion and commit controls), SCR-003 (Global directory), SCR-015 (Accreditation reports).
6. **Data Analyst (`ROL-006` - `data_analyst` / "Dr. A. Verma"):**
   - Demonstrates: SCR-008, SCR-013 (Heuristics evaluation), SCR-014 (Model evaluation), SCR-015 (De-identified cohort extracts).
7. **ML Engineer (`ROL-007` - `ml_engineer` / "Er. S. Gupta"):**
   - Demonstrates: SCR-014 (Model governance registry: `AcademicRiskClassifier v1.2.0`, algorithm evaluation, precision/recall/F1 metrics, inference latency).
8. **System Administrator (`ROL-008` - `sys_admin` / "System Administrator"):**
   - Demonstrates: SCR-012 (User account creation, RBAC role assignment modal, account suspension/activation), SCR-016 (PostgreSQL telemetry, latency monitoring, immutable audit log).
9. **Auditor / Viewer (`ROL-009` - `auditor_user` / "Compliance Auditor"):**
   - Strictly read-only compliance inspection across SCR-016 (Audit Ledger), SCR-011, SCR-012, and SCR-015 (Compliance exports). All modification controls disabled.

---

## 4. Synthetic Data Used

The prototype loads values directly from the approved synthetic dataset (`data/synthetic/*.csv`) generated in Step 6:
- `departments.csv` (3 records: `CSE`, `ECE`, `MECH`)
- `programs.csv` (3 degree programs: `BT-CSE`, `BT-ECE`, `BT-MECH`)
- `batches.csv` (9 batch cohorts: 2023, 2024, 2025 across departments)
- `academic_years.csv` (4 sessions: 2023-24 to 2026-27)
- `semesters.csv` (24 semester progression terms)
- `subjects.csv` (36 accredited curriculum courses)
- `students.csv` (200 unique students with format `SYN-<Year>-<Dept>-<Index>`)
- `student_enrollments.csv` (200 relational enrollments)
- `assessments.csv` (108 continuous assessments: Class Test 1, Mid-Sem, End-Sem)
- `student_marks.csv` (4,278 empirical marks records)
- `attendance_records.csv` (1,426 attendance summary records)
- `semester_results.csv` (648 multi-term SGPA/CGPA result records)
- `backlog_records.csv` (52 active and cleared backlog cases)

Data is transformed into an indexed data module via `scripts/build_prototype_data.py` and accessed through domain methods in `src/data/dataService.js`. No secondary fake academic numbers or arbitrary random values were created.

---

## 5. Files Created

### Build & Configuration Files
- `package.json`: Minimal package definition specifying React and Vite.
- `vite.config.js`: Vite build configuration.
- `index.html`: Accessible, semantic HTML document root.

### Build & Audit Scripts
- `scripts/build_prototype_data.py`: Deterministic ingestion script compiling CSVs into `src/data/syntheticData.json`.
- `scripts/verify_prototype.py`: Automated QA verification script validating zero placeholder text, complete screen wiring, and import completeness.

### Application Core & Styling
- `src/main.jsx`: React entry point.
- `src/App.jsx`: Global application root, routing distributor, layout shell, and access control boundary.
- `src/index.css`: Enterprise Academic Design System CSS (pure modern CSS with zero CSS frameworks, accessible contrast, and zero non-functional decorations).

### Data & State Layer
- `src/data/syntheticData.json`: Canonical JSON dataset compiled from `data/synthetic/*.csv`.
- `src/data/dataService.js`: Indexed relational queries, mock diagnostic jobs (`IMP-104`), prediction cases, report queues, and audit log state.
- `src/context/AuthContext.jsx`: Prototype role simulation provider, session switcher, and RBAC matrix validator.
- `src/context/RouterContext.jsx`: Lightweight client-side hash router with parameter extraction and popstate support.

### Common Reusable Components
- `src/components/common/Navbar.jsx`: Brand header, academic session tag, user identity badge, prototype role selector.
- `src/components/common/Sidebar.jsx`: Role-tailored navigation menu strictly derived from Table 4.
- `src/components/common/MetricCard.jsx`: Standardized KPI card.
- `src/components/common/Charts.jsx`: Semantic SVG charts (LineTrendChart, HorizontalBarChart, DistributionHistogram, RiskGauge).
- `src/components/common/Forbidden403.jsx`: RBAC boundary violation error component with audit logging.
- `src/components/common/DisclaimerBanner.jsx`: BR-009 decision-support disclaimer banner.

### 16 SRS Screen Components (`src/screens/`)
- `src/screens/SCR001_Login.jsx`
- `src/screens/SCR002_StudentDashboard.jsx`
- `src/screens/SCR003_AcademicProfile.jsx`
- `src/screens/SCR004_MarksAssessmentView.jsx`
- `src/screens/SCR005_AttendanceView.jsx`
- `src/screens/SCR006_MentorDashboard.jsx`
- `src/screens/SCR007_FacultyAnalytics.jsx`
- `src/screens/SCR008_DepartmentAnalytics.jsx`
- `src/screens/SCR009_DataImportCenter.jsx`
- `src/screens/SCR010_ImportValidationResult.jsx`
- `src/screens/SCR011_AcademicMasterData.jsx`
- `src/screens/SCR012_UserManagement.jsx`
- `src/screens/SCR013_InsightsRecommendations.jsx`
- `src/screens/SCR014_PredictionAnalytics.jsx`
- `src/screens/SCR015_Reports.jsx`
- `src/screens/SCR016_AuditSystemHealth.jsx`

---

## 6. Dependencies Added

In strict adherence to the **Minimal Implementation Rule**, exactly two runtime dependencies and two development dependencies were added:

### Runtime Dependencies (`dependencies`)
1. `react` (`^18.3.1`)
2. `react-dom` (`^18.3.1`)

### Development & Build Dependencies (`devDependencies`)
1. `vite` (`^5.4.11`)
2. `@vitejs/plugin-react` (`^4.3.4`)

---

## 7. Reason for Every New Dependency

1. **`react` & `react-dom`:** Explicitly mandated by the SRS Section 11, Section 14, and the user prompt (*"Use React because the SRS specifies React for the frontend"*). Powers the component tree, UI lifecycle, and reactive state management.
2. **`vite` & `@vitejs/plugin-react`:** Industry-standard, minimal build tooling required to transpile JSX/ES modules into a production-optimized static bundle (`dist/`). Zero unnecessary abstractions, instant hot module reloading during development, and minimal overhead.

**Zero other external libraries were added.** No external router library (`react-router-dom`), charting library (`recharts`, `chart.js`), CSS framework (`tailwind`, `bootstrap`), icon pack (`lucide-react`, `font-awesome`), or state library (`redux`, `zustand`) was added. Custom semantic SVG charts, pure CSS design tokens, and a native client-side router satisfied all prototype requirements without dependency bloat.

---

## 8. Intentional Prototype-Only Behavior

1. **1-Click Prototype Role Simulator:** Located in the top header and on the Login screen. Allows immediate demonstration of all 9 user classes without entering mock passwords or managing local storage tokens.
2. **Simulated Session & Audit Logs:** Role changes, marks commits, import commits, and report generations append date-stamped records to an in-memory mutable audit array (`auditLogs`) displayed in SCR-016.
3. **Controlled Ingestion Diagnostics (IMP-104):** A pre-configured staging job with 2 synthetic integrity violations (out-of-range mark and unmapped student ID) is provided on SCR-009/SCR-010 to demonstrate gated pre-commit error diagnostics (`BR-005`, `BR-006`).
4. **Simulated File Exports:** "Download Official Transcript PDF", "Export Attendance CSV", and "Generate & Download Audited Report" trigger validated modal alerts, register an entry in the system audit log, and simulate artifact delivery.

---

## 9. SRS Requirements Not Represented in Prototype

The following elements belong strictly to **Semester 4 or later development phases** and were intentionally excluded from this Semester 3 Step 7 prototype:
1. **FastAPI & PostgreSQL Backend Runtime:** Database migrations, SQLAlchemy ORM models, and REST endpoints (`MOD-001` through `MOD-016` server-side services belong to Semester 4).
2. **Production Authentication & Cryptography:** Password hashing (`bcrypt`), JWT token issuance, session expiry timers, and TLS mutual authentication belong to Semester 4.
3. **Real Machine Learning Inference Pipelines:** Real scikit-learn random forest training pipelines, SHAP tree explainers, and Pandas aggregation pipelines belong to Semester 6 (`MOD-014`).
4. **Celery / Redis Background Job Workers:** Asynchronous report queue workers and bulk data streaming parsers belong to Semester 4/5.
5. **Real Email & Notification Delivery:** Automated SMS or email dispatch on low attendance belongs to Semester 5.

---

## 10. Ambiguity Encountered

1. **Direct Student Access to Prediction Analytics (SCR-014):**
   - *Ambiguity:* The SRS permits students to view personalized recommendations (SCR-013), but whether undergraduate students should see quantitative probability gauges and raw ML SHAP weights on SCR-014 remains under debate.
   - *Resolution in Prototype:* Confined SCR-014 to Mentors, Faculty, Department Users, and ML Engineers in the Role-Permission Matrix. Students view translated evidence-linked insights on SCR-013.
2. **Department User Drilldown into Individual Student Profiles:**
   - *Ambiguity:* Whether an HOD on SCR-008 should be allowed to drill down into an individual student's SCR-003 profile or remain strictly confined to aggregate statistics.
   - *Resolution in Prototype:* Confined SCR-008 strictly to aggregate metrics (`BR-004`) to demonstrate strict privacy compliance.

---

## 11. Deviations from Approved Wireframes

1. **No Deviations in Core Layouts:** All 16 screens implement the exact sections, tables, cards, and user actions described in `docs/ui/ui-wireframes.md`.
2. **Proposed UI Utility Additions (Explicitly Labeled):**
   - The Top Header includes a "Simulate Role" dropdown to facilitate rapid evaluator switching.
   - The Login Screen includes a "1-Click Role Exploration" palette displaying all 9 authorized personas.
   - The Academic Profile (SCR-003) and Prediction Analytics (SCR-014) include persona/mentee selectors when viewed by mentors or administrators.

---

## 12. QA Checks Performed

An exhaustive 13-point manual and automated QA verification was conducted:

| # | QA Audit Check | Result | Verification Notes |
|---|---|:---:|---|
| **1** | Run prototype build | **PASSED** | `vite build` completed cleanly in 1.39s with zero errors or warnings. |
| **2** | Check every route/screen | **PASSED** | All 16 screens (`SCR-001` through `SCR-016`) render valid UI. |
| **3** | Test navigation | **PASSED** | Sidebar, header switcher, login, and deep links function with complete URL synchronization. |
| **4** | Test each prototype role | **PASSED** | All 9 roles successfully verified against their landing pages. |
| **5** | Unauthorized access gating | **PASSED** | Accessing unauthorized routes displays `Forbidden403` and logs `UNAUTHORIZED_ACCESS_ATTEMPT`. |
| **6** | Browser console audit | **PASSED** | Zero unhandled console warnings or JavaScript runtime errors. |
| **7** | Broken image/asset check | **PASSED** | Zero missing images; semantic inline SVG icons and canvas-free SVG charts. |
| **8** | Responsive design check | **PASSED** | Tested desktop ($1400\text{px}$) and tablet ($768\text{px}$) layouts with flexible grids. |
| **9** | Synthetic data consistency | **PASSED** | All metrics, course codes (`CS301`, `CS302`), and student IDs bind to `data/synthetic/`. |
| **10** | Terminology against SRS | **PASSED** | Codes (`ERR-MRK-001`, `ERR-ATT-001`, `BR-005`, `BR-006`, `BR-009`) match SRS Section 23/24. |
| **11** | Zero unnecessary dependencies | **PASSED** | Strictly 2 runtime dependencies (`react`, `react-dom`). |
| **12** | Zero dead/unused files | **PASSED** | Every source file has an active consumer in the component graph. |
| **13** | Zero placeholder strings | **PASSED** | Automated scan confirmed zero occurrences of "Lorem ipsum", "Coming soon", "TODO", etc. |

---

## 13. Known Limitations

1. **In-Memory Volatility:** Any modifications made during a prototype session (e.g. adding a new master department on SCR-011, entering marks on SCR-004, logging an intervention on SCR-006, or committing job IMP-104 on SCR-010) persist during the browser session but reset upon a hard page reload because the PostgreSQL persistence engine belongs to Semester 4.
2. **Deterministic Prediction Scope:** Model predictions on SCR-014 demonstrate two representative test archetypes (an at-risk mentee with Discrete Mathematics backlog risk vs. a regular high-performing student) using synthetic feature attribution weights. Dynamic real-time ML inference will be implemented in Semester 6.
3. **Simulated File Generation:** Report downloads on SCR-015 and transcript exports on SCR-003 simulate the audited delivery event rather than streaming a binary PDF file stream, as PDF generation engines belong to future phases.

---

## 14. Step 7 SRS Conformance Audit

Following the completion of the basic static/clickable prototype, an exhaustive conformance review was conducted against the approved IEEE SRS v1.0, focusing on phase boundary integrity, requirement traceability, and strict elimination of speculative architecture:

### 1. Attendance Threshold Status
- **Audit Finding:** The SRS (Section 15, `FR-006`, and Section 24, `BR-001` through `BR-011`) specifies attendance tracking, recording, and percentage calculation, but **does not define 75.0% as a universal, immutable business rule**. The 75% figure was introduced during UI wireframing and synthetic data generation as a standard institutional assumption.
- **Conformance Correction:** Terminology across SCR-002, SCR-005, SCR-006, SCR-013, and `dataService.js` was audited and updated. All references previously stating *"Statutory Minimum"* or *"Mandatory Rule"* were replaced with **`Configurable Baseline Threshold: 75.0% (Design Assumption)`**. The 75% threshold is strictly classified as a configurable institutional prototype assumption, not a binding SRS business rule.

### 2. Prediction Model Status
- **Audit Finding:** In strict adherence to SRS Section 21 and phase boundary rules, machine learning model training, hyperparameter optimization, and predictive pipelines belong to Semester 6 (`MOD-014`) and are conditional on authorized institutional historical data.
- **Conformance Correction:** In SCR-014 and `dataService.js`, the model entry `AcademicRiskClassifier v1.2.0` was audited to verify that zero ML libraries or inference engines exist in the codebase. The model entry is explicitly labeled as **`Simulated Model Metadata (Semester 6 Design Mock)`** with status **`SIMULATED / PROTOTYPE SPECIFICATION ONLY`**. A prominent disclaimer banner clarifies that metadata and risk scores are static design mocks for UI evaluation.

### 3. SHAP Status
- **Audit Finding:** SRS `FR-014` requires that prediction interfaces provide *"understandable supporting factors where feasible"*, but **does not mandate SHAP (SHapley Additive exPlanations)** as a required technology.
- **Conformance Correction:** Verified that no SHAP Python packages, JavaScript libraries, or algorithmic weight calculations were introduced. In SCR-014, the section header was updated from *"SHAP Attribution Weights"* to **`Understandable Supporting Factors (Conceptual Feature Attribution / Future SHAP Option)`**, with a documented notice clarifying that SHAP represents a potential Semester 6 implementation candidate, illustrated here conceptually using static synthetic attribution data.

### 4. System Health Status
- **Audit Finding:** In Step 7, no PostgreSQL runtime database, connection pooling, or FastAPI backend server exists.
- **Conformance Correction:** In SCR-016, telemetry KPI cards were audited to ensure they are not misinterpreted as real operational telemetry. The cards were relabeled to **`Relational Engine (Simulated)`**, **`API Latency (Simulated)`**, and **`Active Sessions (Simulated)`**. A prominent notice was added: *"Real backend infrastructure (FastAPI) and relational persistence (PostgreSQL) belong to Semester 4. Telemetry metrics, database engine states, and API latency values displayed below are simulated prototype values designed to demonstrate the operational monitoring layout specified in SRS Section 26 & 27."*

### 5. Authentication Status
- **Audit Finding:** Production authentication (bcrypt password hashing, JWT token generation, session cookies, TLS mutual auth) belongs to Semester 4 (`MOD-001`).
- **Conformance Correction:** Verified that the prototype login on SCR-001 uses purely client-side React state (`currentUser`) and a 1-click role simulation palette. An explicit legal/architecture disclaimer was embedded directly on SCR-001: *"Prototype Simulation Notice: Production authentication (JWT tokens, password hashing, and session management) belongs to Semester 4. This prototype uses client-side state simulation to demonstrate authorized role screens. Unauthorized navigation is simulated and audited."*

### 6. RBAC Simulation Status
- **Audit Finding:** True security enforcement must be executed server-side via backend authorization dependencies and database row-level security. Client-side hiding of UI elements is a presentation mechanism, not security.
- **Conformance Correction:** The `Forbidden403` component was updated to explicitly document: *"This boundary check demonstrates client-side navigation gating for UI prototype evaluation. It is NOT production security enforcement. Production RBAC authorization and server-side token enforcement are implemented in Semester 4."* Navigation gating strictly demonstrates Table 4 role boundaries without misrepresenting client logic as security.

### 7. Dependencies Added During Cleanup
- **Zero (0) dependencies added.** No external packages were introduced during the conformance cleanup. The dependency footprint remains strictly minimal: `react` and `react-dom` in `dependencies`, and `vite` and `@vitejs/plugin-react` in `devDependencies`.

### 8. Files Changed During Cleanup
1. `src/data/dataService.js`: Relabeled attendance thresholds to design assumptions, updated `ML_MODEL_METADATA` to simulated mock status, and updated SHAP terminology.
2. `src/screens/SCR002_StudentDashboard.jsx`: Replaced statutory attendance threshold labels with configurable baseline prototype assumption labels.
3. `src/screens/SCR005_AttendanceView.jsx`: Replaced statutory/mandatory threshold headings with configurable baseline assumption labels.
4. `src/screens/SCR006_MentorDashboard.jsx`: Replaced statutory compliance labels with baseline assumption advisory labels.
5. `src/screens/SCR014_PredictionAnalytics.jsx`: Added explicit prototype simulation metadata notice and relabeled SHAP attribution to conceptual feature attribution.
6. `src/screens/SCR016_AuditSystemHealth.jsx`: Relabeled telemetry cards to simulated values and added prototype telemetry notice banner.
7. `src/screens/SCR001_Login.jsx`: Added explicit prototype authentication simulation notice.
8. `src/components/common/Forbidden403.jsx`: Added explicit client-side prototype gating disclaimer.
9. `docs/prototype/prototype-review.md`: Appended Section 14 containing this SRS Conformance Audit report.

### 9. Remaining Assumptions
1. **Configurability of Attendance Policies:** In future development phases (Semester 4/5), institutional attendance thresholds must be stored as configurable parameters in an academic configuration table (e.g. `InstitutionSettings`), allowing individual departments or programs to define their own compliance cutoffs (e.g. 75%, 80%, or 85%) rather than hardcoding.
2. **Explainability Algorithm Selection:** The specific mathematical method for feature attribution (whether TreeSHAP, Integrated Gradients, or LIME) will be evaluated in Semester 6 based on the final algorithm chosen and authorized training dataset size.
3. **Audit Log Persistence:** In this prototype, audit records accumulate in volatile memory. Production immutable logging to a dedicated PostgreSQL audit schema with database append-only permissions will be implemented during Semester 4.
