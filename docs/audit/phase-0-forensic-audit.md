# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Phase 0 — Comprehensive Forensic Project Audit
**Document Reference:** `SAAP-AUD-P0-001`  
**Standard:** IEEE 29148 / IEEE 730 / Software Quality Assurance Guidelines  
**Project Phase:** Semester 3 Baseline Audit (Pre-Semester 4 Transition)  
**Author:** Senior Forensic Software Audit Team & Systems Architect  
**Review Target:** Complete SAAP Repository, IEEE SRS v1.0, Database Models, UI Wireframes, Synthetic Datasets, and React Prototype  
**Status:** Complete — Forensic Audit Baseline  

---

## 1. Executive Summary

This document presents a comprehensive, read-only forensic audit of the **Success & Academic Analytics Platform (SAAP)** at the completion of **Semester 3 (Step 8)**. The audit evaluates the entire repository—including the IEEE SRS v1.0, database architecture, synthetic data pipelines, React/Vite frontend prototype, role-based workflows, and codebase hygiene—against formal software engineering standards and the semester-by-semester development plan.

### High-Level Verdict
The project demonstrates strong foundations in requirements definition, architectural structure, and minimal dependency discipline. All sixteen (16) SRS-mandated screens exist and are navigable, zero third-party chart or UI framework dependencies bloat the repository, and the synthetic dataset of 6,991 records passes strict relational integrity checks.

However, a rigorous technical and product inspection reveals significant discrepancies between the **outward presentation of analytical intelligence** and the **actual underlying data wiring**:
1. **Disconnected Data Aggregations:** Despite the presence of 4,278 empirical marks and 1,426 attendance records in `syntheticData.json`, key analytical screens—specifically **SCR-002 (Student Dashboard)**, **SCR-007 (Faculty Analytics)**, and **SCR-008 (Department Analytics)**—display hardcoded arrays, static score distributions, and hardcoded KPI metrics that do not recalculate when user filters are toggled.
2. **AI/ML Prototype Illusion:** While SCR-014 (Prediction Analytics) features clear disclaimers stating it is a Semester 6 conceptual mock, its presentation of calibrated decimal risk scores (`0.724`, `0.142`), precision/recall target metrics, and SHAP-like feature weightings (`+0.34`, `-0.30`) creates a substantial risk that evaluators will mistake static mock strings for a functioning machine learning pipeline.
3. **Product Workflow Gaps:** The platform excels as an informational viewer, but several screens function as passive dashboards rather than active academic decision-support tools. Critical closed-loop workflows—such as intervention dispatch, attendance shortage remediation, and curriculum revision ticketing—are represented merely as informational alerts or transient browser notifications.
4. **Relational Schema Blindspots:** While the SRS Section 18 schema specifies 27 entities, it lacks critical operational tables required to enforce business rules in production, notably: a many-to-many `RolePermissions` mapping table, an explicit `FacultySubjectAllocations` table (needed to enforce `BR-003`), a curriculum mapping table (`ProgramSubjects`), and a persistence entity for mentor advising notes (`SCR-006`).

All findings in this report are categorized using strict classification tags (`[SRS]`, `[CURRENT IMPLEMENTATION]`, `[TECHNICAL OBSERVATION]`, `[PRODUCT RECOMMENDATION]`, `[PROPOSED ENHANCEMENT]`, `[FUTURE SEMESTER]`, `[AMBIGUITY]`) and sorted into the mandatory action matrix (**KEEP**, **MODIFY**, **REPLACE**, **REMOVE**, **ADD**, **FUTURE**, **NEEDS HUMAN DECISION**).

---

## 2. Current Product Definition

### What is SAAP Actually Doing Today?
[CURRENT IMPLEMENTATION] SAAP is currently implemented as a client-side React 18 single-page application built with Vite. It embeds a 53,000-line pre-compiled JSON dataset (`src/data/syntheticData.json`) generated from 13 relational CSV files. The application simulates a centralized academic portal where users can switch between nine (9) institutional roles via a header dropdown or login screen. It provides interactive, read-only visualization of student transcripts, continuous assessment marks, attendance registers, mentor cohorts, department comparisons, and mock prediction scorecards.

### What Problem Does It Solve Today?
[CURRENT IMPLEMENTATION] At its current Semester 3 stage, SAAP serves as a **clickable proof-of-concept and UI validation prototype**. It demonstrates to academic stakeholders how fragmented institutional spreadsheets (student admissions, internal marks, attendance registers, semester grades) can be visually consolidated into a unified role-governed user experience.

### Who is the Primary User?
[SRS] Section 10 defines nine user classes: Student, Mentor, Faculty, Department User, Academic Administrator, Data Analyst, ML Engineer, System Administrator, and Auditor/Viewer.  
[CURRENT IMPLEMENTATION] In practice, the current prototype is heavily centered on three primary personas:
- **Student (`aryansh`):** Views academic standing, SGPA trajectory, attendance, and personal advisories.
- **Mentor (`v_sharma`):** Views an assigned cohort of 28 mentees, flags at-risk students, and enters advising notes.
- **Faculty (`dr_rk_sharma`):** Reviews course analytics, inputs marks, and logs classroom sessions.  
The remaining six roles (Department User, Academic Admin, Data Analyst, ML Engineer, System Admin, Auditor) have functional screens, but their capabilities consist primarily of viewing static summaries or administering mock in-memory lists.

### What Decisions Does Each Role Make Using the Platform?
[SRS] vs [CURRENT IMPLEMENTATION] Audit of Decision-Support Fidelity:
- **Student (`ROL-001`):** *Intended Decision:* Which subjects require immediate study effort or attendance catch-up? *Current Prototype:* Effectively communicates attendance threshold proximity (e.g. 77.5% vs 75.0%), but recommendations are static strings.
- **Mentor (`ROL-002`):** *Intended Decision:* Which mentees require urgent academic counseling or parental outreach? *Current Prototype:* Clearly sorts mentees by risk flag (`ATTENDANCE`, `MARKS DROP`, `BACKLOG`), but the threshold rules are hardcoded in a 5-line frontend utility rather than configurable analytics.
- **Faculty (`ROL-003`):** *Intended Decision:* Are students failing due to a difficult assessment unit or widespread absenteeism? *Current Prototype:* Disconnected; the score histogram does not dynamically group the actual student marks in `syntheticData.json`.
- **Department User (`ROL-004`):** *Intended Decision:* Does a specific course curriculum exhibit an abnormal failure bottleneck across batches? *Current Prototype:* Lists a table identifying `CS302` as high difficulty, but the data is hardcoded in `getDepartmentSummary()` rather than aggregated from historical tables.
- **Academic Administrator (`ROL-005`):** *Intended Decision:* Should a batch import of marks be committed to permanent transcripts? *Current Prototype:* Superb decision support; SCR-010 clearly displays row-level error scorecards and halts invalid commits (`BR-005`, `BR-006`).
- **Data Analyst (`ROL-006`):** *Intended Decision:* Are current academic metrics statistically reliable? *Current Prototype:* Weak; Analyst merely accesses the same views as Department User.
- **ML Engineer (`ROL-007`):** *Intended Decision:* Is a model ready for deployment based on validation curves? *Current Prototype:* Merely views static text cards with mock benchmark numbers.
- **System Administrator (`ROL-008`):** *Intended Decision:* Are user accounts secure and active? *Current Prototype:* Functional mock CRUD on user accounts.
- **Auditor (`ROL-009`):** *Intended Decision:* Were academic grade modifications authorized? *Current Prototype:* Functional read-only inspection of the in-memory audit ledger.

### Academic Analytics Platform vs. Generic Dashboard
[TECHNICAL OBSERVATION] SAAP successfully avoids generic SaaS styling (no gratuitous gradients, cartoon illustrations, or dark-mode neon glow). Its design system (`src/index.css`) uses sober, high-contrast, accessible academic styling with tabular density. However, in screens like SCR-007 and SCR-008, it slips into **"decorative dashboard" syndrome**: visual widgets exist to satisfy a wireframe requirement rather than calculating real statistical insights from the underlying data.

---

## 3. SRS Semester-3 Scope

In accordance with **SRS Section 30 (*Semester 3 to Semester 8 Development Blueprint*)**, the explicit boundary for Semester 3 is:
- Finalize problem statement and scope.
- Prepare IEEE-style SRS (completed: `docs/requirements/srs-v1.0.md`).
- Define roles and access matrix (completed: `docs/requirements/role-permission-matrix.md`).
- Create ER diagram and database design (completed: `docs/database/ERD.md`, `database-design.md`, `data-dictionary.md`).
- Prepare UI wireframes (completed: `docs/ui/ui-wireframes.md`).
- Create synthetic sample dataset (completed: `data/synthetic/*.csv`, `generate_dataset.py`, `validate_dataset.py`).
- Develop basic static/clickable prototype (completed: React/Vite application).
- Create Git repository and coding standards (completed: `.gitignore`, `docs/development/coding-standards.md`, README.md).

### Explicit Out-of-Scope Capabilities (Post-Semester 3)
[FUTURE SEMESTER] The SRS explicitly reserves the following capabilities for subsequent semesters:
- **Semester 4:** Core Web Application, FastAPI backend, PostgreSQL database persistence, SQLAlchemy models, Alembic migrations, JWT/bcrypt authentication, and real server-side REST APIs (`MOD-001` through `MOD-008`).
- **Semester 5:** Analytics & Visualization engine using Pandas and NumPy, aggregate batch pipelines, and automated notification dispatches (`MOD-009` through `MOD-012`).
- **Semester 6:** ML Exploration, historical quality audit, scikit-learn models, evaluation metrics (precision/recall/F1), and controlled prediction inference (`MOD-014`).
- **Semester 7:** Explainable AI, evidence-linked recommendation heuristics, and institutional feedback loops (`MOD-013`).
- **Semester 8:** Hardened security, Docker containerization, automated testing suites, and disaster recovery procedures (`MOD-015`, `MOD-016`).

---

## 4. Current Repository Architecture

The repository contains exactly 66 tracked files structured cleanly into dedicated architectural domains:

```
Success_Academic_Analytics_Platform/
├── data/
│   ├── import_templates/         # 4 CSV bulk import templates (attendance, marks, results, students)
│   └── synthetic/                # 13 relational CSVs + generate_dataset.py + validate_dataset.py
├── docs/
│   ├── data/                     # synthetic-data-design.md
│   ├── database/                 # ERD.md, data-dictionary.md, database-design.md, database-review.md
│   ├── development/              # coding-standards.md
│   ├── prototype/                # prototype-review.md
│   ├── requirements/             # role-permission-matrix.md, srs-v1.0.md
│   └── ui/                       # ui-wireframes.md
├── scripts/
│   ├── build_prototype_data.py   # Compiles synthetic CSVs into src/data/syntheticData.json
│   └── verify_prototype.py       # Automated QA auditor verifying screens, routes, and forbidden text
├── src/
│   ├── components/common/        # Charts.jsx, DisclaimerBanner.jsx, Forbidden403.jsx, MetricCard.jsx, Navbar.jsx, Sidebar.jsx
│   ├── context/                  # AuthContext.jsx (RBAC simulator), RouterContext.jsx (hash router)
│   ├── data/                     # dataService.js (domain query accessors), syntheticData.json (bundled JSON)
│   ├── screens/                  # 16 screen modules (SCR001_Login.jsx to SCR016_AuditSystemHealth.jsx)
│   ├── App.jsx                   # Layout shell, route matching, and authorization gate
│   ├── index.css                 # Pure CSS design system (tokens, components, tables, layout)
│   └── main.jsx                  # React application entry point
├── .gitignore                    # Exclusion rules for node_modules/, dist/, build/, caches
├── index.html                    # HTML entry shell
├── package.json                  # Pinned dependencies (react, react-dom, vite, @vitejs/plugin-react)
├── package-lock.json             # Pinned lockfile
├── README.md                     # Comprehensive project guide and reproduction instructions
└── vite.config.js                # Vite build configuration
```

### Architectural Hygiene Observations
- **Zero Third-Party Dependency Bloat:** `package.json` contains only 2 runtime dependencies (`react`, `react-dom`) and 2 dev dependencies (`vite`, `@vitejs/plugin-react`). No external charting libraries, CSS utility libraries (Tailwind), or heavyweight state managers (Redux) are present.
- **Strict Verification Automation:** `scripts/verify_prototype.py` enforces zero forbidden placeholder strings ("lorem ipsum", "coming soon", "todo", "sample dashboard") across all source code.

---

## 5. Requirement Traceability Matrix

This matrix evaluates the implementation fidelity of every requirement defined in the IEEE SRS v1.0.

| SRS Req ID | Requirement Title & Expected Behavior | Current Implementation & Responsible File(s) | Status | Evidence & Audit Findings |
|---|---|---|---|---|
| **FR-001** | User Authentication: Allow authorized users to securely authenticate and access role-appropriate functions. | `src/context/AuthContext.jsx`, `src/screens/SCR001_Login.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Simulates authentication using local credentials and a 1-click persona switcher. [FUTURE SEMESTER] Real JWT authentication and bcrypt password hashing belong to Semester 4. |
| **FR-002** | User & Role Management: Allow administrators to manage users, roles, and account status. | `src/screens/SCR012_UserManagement.jsx`, `src/data/dataService.js` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Supports creating users, toggling active status, and assigning roles in React state with audit logging. Changes do not persist to a database. |
| **FR-003** | Academic Master Data: Manage departments, programs, batches, semesters, and subjects. | `src/screens/SCR011_AcademicMasterData.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Full tabular interface across 6 tabs. Loads 100% real synthetic data. Supports entity creation with duplicate checks (`ERR-DUP-001`) and referential deletion protection. |
| **FR-004** | Student Profile Management: Maintain authorized student profiles and academic enrollment records. | `src/screens/SCR003_AcademicProfile.jsx`, `data/synthetic/students.csv` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Displays legal name, PRN, degree, batch, and mentor. Mentor/Admin can switch between students via a dropdown. |
| **FR-005** | Marks & Assessment Management: Store and manage subject-wise marks and continuous assessments. | `src/screens/SCR004_MarksAssessmentView.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Faculty can filter by course/assessment, edit marks inline with range checks (`ERR-MRK-001`), and commit with audit logs. Student views personal marks. Disconnect: Roster is limited to 40 students; commits do not modify `syntheticData.json`. |
| **FR-006** | Attendance Management: Store and display authorized attendance information. | `src/screens/SCR005_AttendanceView.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Student view displays subject attendance from dataset. Faculty view has quick session logger updating percentages in memory. Disconnect: Does not record per-session date history in database. |
| **FR-007** | Semester Results & Academic Progress: Maintain semester results, SGPA, CGPA, and backlog records. | `src/screens/SCR003_AcademicProfile.jsx`, `data/synthetic/semester_results.csv` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Multi-semester transcript table displays historical SGPA, CGPA, credits registered, and credits earned accurately from `semester_results.csv`. |
| **FR-008** | Data Import & Validation: Import academic data through templates and produce diagnostic validation reports. | `src/screens/SCR009_DataImportCenter.jsx`, `src/screens/SCR010_ImportValidationResult.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Outstanding prototype demonstration of two-stage staging. SCR-010 displays row-level error diagnostics (`IMP-104`), blocks invalid rows (`BR-006`), and logs commits (`BR-005`). |
| **FR-009** | Student Dashboard: Provide personalized academic analytics, progress trends, and insights. | `src/screens/SCR002_StudentDashboard.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Displays real SGPA, CGPA, overall attendance, and backlog count. Disconnect: Subject comparison bars and monthly attendance trends are hardcoded arrays. |
| **FR-010** | Mentor Monitoring: Allow mentors to monitor assigned students and identify attention indicators. | `src/screens/SCR006_MentorDashboard.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Roster of 28 mentees dynamically calculates attendance and SGPA risk flags. Disconnect: Performance and attendance distribution histograms display hardcoded static values. |
| **FR-011** | Faculty Analytics: Provide authorized subject and student performance analytics. | `src/screens/SCR007_FacultyAnalytics.jsx` | **NON-COMPLIANT** | [CURRENT IMPLEMENTATION] The entire screen (score buckets, pass rate of 88.3%, class average of 14.8/20, and performance bands) is hardcoded. Toggling subject/assessment dropdowns does NOT recalculate metrics from `student_marks.csv`. |
| **FR-012** | Department Analytics: Provide authorized batch-level and subject-level aggregate analytics. | `src/screens/SCR008_DepartmentAnalytics.jsx` | **NON-COMPLIANT** | [CURRENT IMPLEMENTATION] Batch 2023 vs 2024 line chart, attendance distribution, and department KPIs (total 113 students, pass rate 91.4%) are hardcoded. Does not dynamically aggregate the 200 synthetic students. |
| **FR-013** | Insight Generation: Generate understandable insights from validated academic analytics. | `src/screens/SCR013_InsightsRecommendations.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Beautifully rendered cards with evidence metrics and supporting factors. Disconnect: Uses a static array of 4 mock insights rather than an algorithmic rule evaluator. |
| **FR-014** | Prediction & Risk Analysis: Evaluate approved models for academic prediction when sufficient data exists. | `src/screens/SCR014_PredictionAnalytics.jsx` | **FUTURE / NOT YET DUE** | [CURRENT IMPLEMENTATION] Renders UI specification mockup for two personas (Aryan Verma vs Aryansh Sharma). Clearly disclaimed as Semester 6 design mock. Risk: Evaluator might think numbers are real ML outputs. |
| **FR-015** | Academic Recommendations: Generate academic recommendations based on analytics or rules. | `src/screens/SCR013_InsightsRecommendations.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Static recommendation text attached to mock insights. Allows updating status to "ACTIONED" with audit trail. |
| **FR-016** | Reports and Export: Generate authorized academic and analytics reports. | `src/screens/SCR015_Reports.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Dynamic template menu based on user role (`getTemplates()`). Simulates export dispatch and logs to audit ledger. Does not generate actual PDF/CSV file blobs. |
| **FR-017** | Audit Logging: Record defined security and administrative actions. | `src/screens/SCR016_AuditSystemHealth.jsx`, `src/data/dataService.js` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Comprehensive in-memory audit ledger updated across login, marks entry, session logging, import commit, user edits, and exports. Filterable by action and actor. |
| **BR-001** | Student Data Isolation: Students access only their own records. | `src/App.jsx`, `src/context/AuthContext.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] When authenticated as Student, URLs targeting other modules or students are blocked via `Forbidden403` (`ERR-AUTHZ-001`). |
| **BR-002** | Mentor Scope Isolation: Mentors access only assigned students. | `src/screens/SCR006_MentorDashboard.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Shows only Batch 2024 mentees. Disconnect: Slice is hardcoded in `dataService.js` rather than querying `MentorAssignments` entity. |
| **BR-003** | Faculty Academic Scope: Faculty restricted to mapped courses. | `src/screens/SCR004_MarksAssessmentView.jsx`, `src/screens/SCR005_AttendanceView.jsx` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Faculty persona has hardcoded list `['CS301', 'CS202']`. Disconnect: Database lacks a `FacultySubjectAllocations` table. |
| **BR-004** | Department Aggregate Scope: Dept users view aggregate data only. | `src/screens/SCR008_DepartmentAnalytics.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] No student PII or individual names are rendered on SCR-008. |
| **BR-005** | Pre-Import Validation: Data imports validated before commit. | `src/screens/SCR009_DataImportCenter.jsx`, `src/screens/SCR010_ImportValidationResult.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Committing is completely disabled until user navigates through validation report screen. |
| **BR-006** | Integrity Enforcement: Invalid rows cannot silently become valid data. | `src/screens/SCR010_ImportValidationResult.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Explicit prompt to discard invalid rows; valid rows committed separately with audit recording. |
| **BR-007** | Controlled Correction: Historical records follow audit rules. | `docs/database/database-review.md` | **PARTIALLY COMPLIANT** | [CURRENT IMPLEMENTATION] Conceptualized in documentation; prototype prevents physical deletion of referenced master entities. |
| **BR-008** | Model Versioning: Predictions must cite approved model version. | `src/screens/SCR014_PredictionAnalytics.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Displays `AcademicRiskClassifier v1.2.0 (Simulated Specification)`. |
| **BR-009** | Decision Support Nature: Predictions are not guaranteed outcomes. | `src/components/common/DisclaimerBanner.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Prominently rendered at the top of SCR-002, SCR-006, SCR-013, and SCR-014. |
| **BR-010** | Audited Exports: Sensitive exports must be logged. | `src/screens/SCR003_AcademicProfile.jsx`, `src/screens/SCR015_Reports.jsx` | **COMPLIANT** | [CURRENT IMPLEMENTATION] Every transcript download and report generation appends a record to `auditLogs`. |
| **BR-011** | Authorized/Synthetic Data Only: Synthetic data preferred during initial stages. | Entire repository | **COMPLIANT** | [CURRENT IMPLEMENTATION] 100% synthetic dataset; zero real student PII. |

---

## 6. Audit of All 16 Screens (SCR-001 through SCR-016)

Every screen was audited individually across 13 engineering criteria:

### SCR-001: Login
- **SRS Requirement:** Authenticate users, validate active status, issue role session, handle invalid credentials (`ERR-AUTH-001`, `ERR-AUTH-002`), route to role-default landing screen.
- **Current Implementation:** Split card layout: left card has standard login form; right card has 1-click Prototype Role Simulator listing all 9 personas.
- **Data Used:** `PROTOTYPE_USERS` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** Prototype user accounts match student roll numbers in synthetic data.
- **Calculations:** Client-side credential matching and role resolution.
- **Workflow & User Job:** Excellent for prototype demonstration and evaluators. Clear error banner on empty input.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Right-side card has a yellow "Prototype Simulator" badge, which is appropriate for Step 7.
- **Misleading Functionality:** Explicit disclaimer informs user that real JWT authentication belongs to Semester 4.
- **SRS Boundary Violations:** None.

### SCR-002: Student Dashboard
- **SRS Requirement:** Personal academic analytics: SGPA, CGPA, attendance summary, active backlogs, progression trend, subject performance, evidence-linked insights, recommendations.
- **Current Implementation:** 4 KPI cards, semester progression line chart, subject performance bar chart, monthly attendance trend, and insight cards.
- **Data Used:** Real SGPA/CGPA from `semester_results.csv`, backlogs from `backlog_records.csv`, overall attendance from `attendance_records.csv`.
- **Real Synthetic vs. Hardcoded:** **MIXED.** Overall SGPA (8.42), CGPA (8.15), and Attendance (81.5%) are computed from synthetic data. However:
  - Subject bars (CS301: 88%, CS302: 74%, CS303: 78%, CS304: 91%) are **hardcoded**.
  - Monthly attendance points (Jul: 86.5%, Aug: 84.0%) are **hardcoded**.
  - Metric card footnotes ("▲ Trend: +0.25", "Cohort Rank: Top 15%") are **hardcoded**.
- **Calculations:** SGPA trend line points and average attendance are genuinely calculated.
- **Workflow & User Job:** Strongly serves the student's need to understand their academic standing at a glance.
- **Unnecessary UI / Duplication:** Duplicate "Download Transcript" button overlaps with SCR-003 and SCR-015.
- **AI/Vibe-Coded Signals:** Hardcoded "Percentile: 88th" without an underlying distribution calculation.
- **Misleading Functionality:** Subject performance bars do not reflect the student's actual marks in `student_marks.csv`.
- **SRS Boundary Violations:** None (scoped strictly to current student).

### SCR-003: Academic Profile & Official Transcript
- **SRS Requirement:** Student demographic details, academic enrollment metadata, autonomous grading transcript (all semesters), active/cleared backlog registry.
- **Current Implementation:** Demographics header card, tabular semester transcript with credits and SGPA/CGPA, filterable backlog table, and audited transcript download button.
- **Data Used:** `students.csv`, `student_enrollments.csv`, `programs.csv`, `batches.csv`, `departments.csv`, `semester_results.csv`, `backlog_records.csv`.
- **Real Synthetic vs. Hardcoded:** **100% Real Synthetic Data.** Every row in the transcript and backlog tables corresponds to actual CSV records.
- **Calculations:** Correct relational joins across 5 tables in `dataService.getStudentEnrollment` and `dataService.getStudentResults`.
- **Workflow & User Job:** Exemplary academic records screen. Mentors and Admins have a dropdown to switch students.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero. High tabular density, formal layout.
- **Misleading Functionality:** None.
- **SRS Boundary Violations:** None.

### SCR-004: Marks & Assessment View
- **SRS Requirement:** Subject-wise marks and continuous internal assessments. Faculty entry and review; student read-only view.
- **Current Implementation:** Dual mode. If Student: personal marks ledger. If Faculty: filterable assessment roster with inline editable input fields, range validation (`ERR-MRK-001`), and save button.
- **Data Used:** `student_marks.csv`, `assessments.csv`, `subjects.csv`.
- **Real Synthetic vs. Hardcoded:** **Real Synthetic Data.** Roster is loaded from `student_marks.csv`.
- **Calculations:** Client-side range validation (`value < 0` or `value > maxMarks`) and letter grade computation.
- **Workflow & User Job:** High utility. Faculty can actually edit a student's mark, see instant error validation if exceeding max marks, and save the result with an audit entry.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero. Clean enterprise data-entry grid.
- **Misleading Functionality:** Minor: Saving marks updates local React component state, not the persistent JSON or CSV file.
- **SRS Boundary Violations:** None.

### SCR-005: Attendance View
- **SRS Requirement:** Store and display attendance. Faculty session logging; student personal attendance tracking.
- **Current Implementation:** Dual mode. If Student: subject-wise attendance summary. If Faculty: course attendance roster with risk indicators, KPI summary cards, and "+ Log Today's Session" modal.
- **Data Used:** `attendance_records.csv`, `subjects.csv`, `students.csv`.
- **Real Synthetic vs. Hardcoded:** **Real Synthetic Data.** Roster loaded from `attendance_records.csv`.
- **Calculations:** Dynamic calculation of `classesHeld + 1`, `classesAttended + 1`, and recalculated percentage.
- **Workflow & User Job:** Realistic faculty workflow for logging class attendance and spotting students below 75%.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero.
- **Misleading Functionality:** Simulated session logger increments all students uniformly instead of providing individual present/absent checkboxes.
- **SRS Boundary Violations:** None.

### SCR-006: Mentor Dashboard
- **SRS Requirement:** Cohort monitoring for assigned students, attention indicators, performance/attendance distributions, mentee roster, and advising notes.
- **Current Implementation:** 4 KPI cards, SGPA and attendance distribution bar charts, searchable/filterable mentee roster, student detail inspection, and note-taking register.
- **Data Used:** `student_enrollments.csv`, `students.csv`, `semester_results.csv`, `attendance_records.csv`, `backlog_records.csv`.
- **Real Synthetic vs. Hardcoded:** **MIXED.**
  - Mentee roster is **real synthetic data** (28 students from CSE Batch 2024).
  - Risk flags (`ATTENDANCE`, `MARKS DROP`, `BACKLOG`) are **dynamically computed** from each student's data.
  - KPI counts (total, attention, low attendance, average SGPA) are **dynamically calculated**.
  - **Distribution charts (SGPA bands and attendance bands) are hardcoded static arrays.**
- **Calculations:** Real aggregation on the mentee roster; static hardcoding in the charts.
- **Workflow & User Job:** Strong mentoring workflow. The mentor can click an at-risk mentee, view their records, type an intervention note, and persist it to the in-memory notes store.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** The distribution charts have hardcoded student counts ("18 Students", "7 Students") that do not sum to the 28 mentees in the roster.
- **Misleading Functionality:** Disconnect between roster data and chart distributions.
- **SRS Boundary Violations:** None.

### SCR-007: Faculty Analytics
- **SRS Requirement:** Subject-level analytics, score distributions, multi-assessment trends, pass percentages, performance bands, and curriculum difficulty indicators.
- **Current Implementation:** Filter strip (Year, Semester, Subject, Batch, Assessment), 4 KPI cards, score histogram, performance bands bar chart, and assessment trend line.
- **Data Used:** `src/screens/SCR007_FacultyAnalytics.jsx`.
- **Real Synthetic vs. Hardcoded:** **100% HARDCODED.**
  - Enrolled: `62`, Appeared: `60`, Pass Rate: `88.3%`, Class Average: `14.8 / 20`.
  - Score histogram buckets (<8, 8-12, 13-16, 17-20) are hardcoded numbers (`5, 12, 26, 17`).
  - Performance bands (A: 45%, B: 33%, C: 13%, F: 9%) are hardcoded numbers.
  - Toggling the subject filter between `CS301` and `CS202` does NOT change any chart or metric!
- **Calculations:** Zero. Pure static display.
- **Workflow & User Job:** **Fundamentally broken as an analytics tool.** It looks like an analytics dashboard, but provides zero actual analytics on the course data.
- **Unnecessary UI / Duplication:** Dropdowns give the illusion of interactive filtering, but do nothing.
- **AI/Vibe-Coded Signals:** **HIGH.** Classic AI-generated static dashboard placeholder.
- **Misleading Functionality:** Very high. A faculty member or evaluator clicking between courses would expect different numbers.
- **SRS Boundary Violations:** Violates expectation that analytics reflect data.

### SCR-008: Department Analytics
- **SRS Requirement:** Batch performance comparisons, subject trends, semester comparisons, attendance distribution, backlog clusters, and department KPIs.
- **Current Implementation:** Filter strip, 4 KPI cards, batch comparison line chart (Batch 2023 vs 2024), attendance distribution bar chart, and cross-subject failure density table.
- **Data Used:** `dataService.getDepartmentSummary('CSE')`.
- **Real Synthetic vs. Hardcoded:** **ALMOST ENTIRELY HARDCODED.**
  - Batch trajectory points (Batch 2023: 7.85, 8.05, 8.12; Batch 2024: 7.50, 7.68, 7.65) are hardcoded arrays.
  - KPI numbers (Total: 113, Pass Rate: 91.4%, Dept SGPA: 7.65, Backlogs: 18) are hardcoded in `dataService.js`.
  - In the subjects table, pass rate (`76.2%`, `92.5%`, `88.0%`) and backlog counts (`14`, `4`) are hardcoded ternary expressions. Only average marks are calculated.
- **Calculations:** Minimal (average mark calculation across subject marks).
- **Workflow & User Job:** Weak. Department user cannot analyze actual cohorts or compare real departments (selecting ECE or MECH changes nothing).
- **Unnecessary UI / Duplication:** Department dropdown is non-functional.
- **AI/Vibe-Coded Signals:** **HIGH.** Pre-baked narrative about "Discrete Mathematics" being a bottleneck without calculating it across all department data.
- **Misleading Functionality:** High. Fails to aggregate the actual 200 students.
- **SRS Boundary Violations:** None (respects aggregate boundary).

### SCR-009: Data Import Center
- **SRS Requirement:** Multi-stage bulk ingestion. Configure academic context, upload spreadsheet, run pre-import validation, review errors, commit valid data.
- **Current Implementation:** Two-step workflow. Step 1: Radio buttons for domain (Students, Marks, Attendance, Results) and target context. Step 2: File selector with sample error-bearing file (`marks_sem3_cs301_internal.csv`), template download button, and "Run Pre-Import Validation" button.
- **Data Used:** `importJobs` in `dataService.js`.
- **Real Synthetic vs. Hardcoded:** Pre-configured demo jobs represent realistic academic staging.
- **Calculations:** Navigation routing to SCR-010 based on selected job state.
- **Workflow & User Job:** Excellent. Directly addresses a core administrative problem in higher education.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero. Clean administrative wizard.
- **Misleading Functionality:** None.
- **SRS Boundary Violations:** None.

### SCR-010: Import Validation Result
- **SRS Requirement:** Display row-level schema and relational validation errors; prevent invalid rows from entering the database (`BR-005`, `BR-006`); permit audited commit of valid rows.
- **Current Implementation:** Staging job banner, 3 KPI cards (Total Parsed: 62, Valid: 60, Rejected: 2), diagnostic error table with row numbers, student rolls, offending fields, error codes (`ERR-MRK-001`, `ERR-STU-001`), and gated commit buttons.
- **Data Used:** `dataService.getImportJobById('IMP-104')`.
- **Real Synthetic vs. Hardcoded:** Real diagnostic scenario representing actual edge cases.
- **Calculations:** Dynamic commit logic: updates job status to `COMMITTED`, clears invalid count, and appends transaction to `AuditLogs`.
- **Workflow & User Job:** Outstanding. This is one of the strongest screens in the entire platform.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero. Genuine enterprise data-quality gate.
- **Misleading Functionality:** None.
- **SRS Boundary Violations:** None.

### SCR-011: Academic Master Data
- **SRS Requirement:** Manage departments, programs, batches, semesters, and subjects. Administer institutional structures.
- **Current Implementation:** Tabbed interface (Departments, Programs, Batches, Academic Years, Semesters, Subjects), search filter, "+ Add New" modal drawer, uniqueness validation (`ERR-DUP-001`), and referential deletion protection.
- **Data Used:** 100% loaded from synthetic datasets (`departments.csv`, `programs.csv`, `batches.csv`, `academic_years.csv`, `semesters.csv`, `subjects.csv`).
- **Real Synthetic vs. Hardcoded:** **100% Real Synthetic Data.**
- **Calculations:** Search filtering, duplicate prevention, and array state mutations with audit logging.
- **Workflow & User Job:** Highly effective administrative maintenance tool.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero.
- **Misleading Functionality:** None.
- **SRS Boundary Violations:** None.

### SCR-012: User Management
- **SRS Requirement:** Administer user accounts, assign roles, toggle active status, and maintain auditability.
- **Current Implementation:** Searchable/filterable user directory, role filter tabs, "+ Create Account" modal, "Assign Roles" modal with multi-role checkboxes, and account lock/unlock toggle with audit logging.
- **Data Used:** `PROTOTYPE_USERS` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** Matches prototype personas.
- **Calculations:** Role toggling, account suspension, search matching, and audit event dispatch.
- **Workflow & User Job:** Standard, solid administration interface.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero.
- **Misleading Functionality:** Changes do not write to a backend server (expected for Semester 3).
- **SRS Boundary Violations:** None.

### SCR-013: Insights & Recommendations
- **SRS Requirement:** Generate understandable, evidence-linked insights and academic recommendations from validated analytics.
- **Current Implementation:** Category and status filter strip, feed of structured insight cards displaying title, evidence metric, supporting factor, heuristic confidence, and actionable recommendation with a "Mark as Actioned" button.
- **Data Used:** `insightsData` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** **HARDCODED.** Fixed array of 4 mock insight objects.
- **Calculations:** Filtering by category/status; state update to "ACTIONED" with audit entry.
- **Workflow & User Job:** Good UX concept for explainability, but lacks an algorithmic engine to generate insights across all 200 students.
- **Unnecessary UI / Duplication:** Partially overlaps with recommendations widget on SCR-002.
- **AI/Vibe-Coded Signals:** Moderate. Canned examples ("Aryan Verma", "Aryansh Sharma") look like static presentation exhibits.
- **Misleading Functionality:** "Confidence / Heuristic Strength: HIGH (100% recorded empirical attendance)" conflates data completeness with statistical confidence.
- **SRS Boundary Violations:** None.

### SCR-014: Prediction Analytics
- **SRS Requirement:** Evaluate approved models for academic risk when sufficient data exists. Display model version, target indicator, risk score, and understandable supporting factors (`BR-008`, `BR-009`).
- **Current Implementation:** Persona switcher (Aryan Verma vs Aryansh Sharma), mandatory decision-support banner (`BR-009`), model governance metadata card (`AcademicRiskClassifier v1.2.0`), SVG needle gauge meter, and feature attribution table.
- **Data Used:** `ML_MODEL_METADATA` and `PREDICTION_CASES` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** **100% HARDCODED / SIMULATED.**
- **Calculations:** None. Needle gauge angles are computed from hardcoded decimal scores (`0.724`, `0.142`).
- **Workflow & User Job:** Illustrates what a future Semester 6 prediction screen would look like.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** **HIGH.** The feature attribution list (`+0.34 risk weight`, `+0.26 risk weight`) simulates SHAP values without any underlying ML computation.
- **Misleading Functionality:** Despite disclaimers, the presence of specific decimals (`0.724`, `p95 latency: 42 ms`) creates a strong risk that reviewers will think ML is already implemented.
- **SRS Boundary Violations:** Borderline: SRS Section 21 and Section 30 explicitly reserve ML for Semester 6.

### SCR-015: Reports
- **SRS Requirement:** Generate authorized academic and analytics reports across roles.
- **Current Implementation:** Dynamic template selector tailored to active user role (`getTemplates()`), format selector (PDF, CSV, XLSX), academic period filter, "Generate Report" button, and table of recent report jobs.
- **Data Used:** `reportJobs` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** Realistic simulation of report queues.
- **Calculations:** Generates new report job ID, dispatches audit entry, appends to table.
- **Workflow & User Job:** Realistic reporting workflow.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** Zero.
- **Misleading Functionality:** Clicking "Download" shows an alert rather than downloading an actual generated PDF/CSV file.
- **SRS Boundary Violations:** None.

### SCR-016: Audit & System Health
- **SRS Requirement:** Record and display security actions, administrative modifications, import commits, and platform health telemetry.
- **Current Implementation:** Simulated infrastructure telemetry cards (PostgreSQL status, p95 latency, active sessions), comprehensive immutable audit log table, action type filter, actor search input, and "Export Audit Log (CSV)" button.
- **Data Used:** `auditLogs` in `src/data/dataService.js`.
- **Real Synthetic vs. Hardcoded:** Audit log is a real, functional in-memory ledger updated dynamically by other screens. Telemetry cards are simulated.
- **Calculations:** Real-time filtering and appending.
- **Workflow & User Job:** Critical for compliance, security demonstration, and Auditor role.
- **Unnecessary UI / Duplication:** None.
- **AI/Vibe-Coded Signals:** The top 4 cards ("PostgreSQL: UP", "145 ms p95", "Pool: 18/20") are classic simulated infrastructure widgets.
- **Misleading Functionality:** Explicit banner prevents misunderstanding by stating telemetry is simulated for Semester 3.
- **SRS Boundary Violations:** None.

---

## 7. Role & Access Audit

All nine (9) roles specified in SRS Section 10 and the Role-Permission Matrix (`SAAP-REQ-RAM-001`) were audited against their actual behavior in the prototype:

| Role Identifier | Role Name | Allowed Screens (Table 4) | Prototype Screen Access | Data Scoping Fidelity | Client-Side Security Boundary |
|---|---|---|---|---|---|
| **ROL-001** | **Student** | SCR-001, 002, 003, 004, 005, 013, 015 | Verified: only permitted screens appear in sidebar. | Scoped to own student ID (`SYN-2024-CSE-0004`). | Gated via `Forbidden403` component on unauthorized path entry. |
| **ROL-002** | **Mentor** | SCR-001, 006, 003, 004, 005, 013, 014, 015 | Verified. Primary landing: `/mentor/dashboard`. | Scoped to 28 mentees in CSE Batch 2024. | Navigating to `/admin/*` triggers 403. |
| **ROL-003** | **Faculty** | SCR-001, 007, 004, 005, 009, 010, 003, 013, 014, 015 | Verified. Primary landing: `/faculty/analytics`. | Taught subjects restricted to `CS301` and `CS202`. | Navigating to `/student/dashboard` triggers 403. |
| **ROL-004** | **Department User** | SCR-001, 008, 004, 005, 013, 014, 015 | Verified. Primary landing: `/department/analytics`. | Aggregate department scope. Zero student PII shown. | Navigating to `/admin/users` triggers 403. |
| **ROL-005** | **Academic Administrator** | SCR-001, 011, 009, 010, 003, 004, 005, 002, 006, 007, 008, 013, 014, 015 | Verified. Primary landing: `/admin/master-data`. | Full institutional catalog and import pipeline. | Cannot access `/admin/users` (SysAdmin role). |
| **ROL-006** | **Data Analyst** | SCR-001, 008, 013, 014, 015 | Verified. Primary landing: `/department/analytics`. | Aggregates and models only. | Blocked from transactional data entry. |
| **ROL-007** | **ML Engineer** | SCR-001, 014, 013, 015 | Verified. Primary landing: `/analytics/predictions`. | Restricted to model governance and predictions. | Blocked from student personal records. |
| **ROL-008** | **System Administrator** | SCR-001, 012, 016, 015 | Verified. Primary landing: `/admin/users`. | Manages accounts and telemetry. Segregated from grades. | Cannot enter or edit student marks. |
| **ROL-009** | **Auditor / Viewer** | SCR-001, 016, 015, 011, 012, 003, 004, 005, 008, 010, 013, 014 | Verified. Primary landing: `/admin/audit`. | Read-only access across modules. | All create/edit/delete buttons are disabled or hidden. |

### Critical Finding on Role Security
[TECHNICAL OBSERVATION] All RBAC enforcement in the current prototype is **strictly client-side**:
1. It relies on `AuthContext.hasAccessToScreen(screenId)` and URL matching in `App.jsx`.
2. Any client-side gate can be bypassed by modifying local state or reading the underlying bundled `syntheticData.json` directly.
3. [FUTURE SEMESTER] This is completely acceptable for Semester 3 Step 7 (static prototype), but **must be replaced in Semester 4 by server-side FastAPI dependency injection (`Depends(get_current_active_user)`) and database query scoping (`WHERE student_id == :current_user_student_id`)**.

---

## 8. Data Flow Audit

The diagram below traces how academic data moves from CSV source files to displayed metrics:

```
+-------------------------------------------------------------------------+
|                  EMPIRICAL SYNTHETIC DATA FLOW (CSV)                    |
+-------------------------------------------------------------------------+
| 13 Canonical CSVs in data/synthetic/*.csv (6,991 total records)         |
|   └── scripts/build_prototype_data.py (name mapping & JSON compilation) |
|         └── src/data/syntheticData.json (53,000 lines)                  |
|               └── src/data/dataService.js (domain accessors)            |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
[TRACEABLE DYNAMIC PATH]                                [HARDCODED PATH]
- SCR-003: Demographics & Transcript                   - SCR-002: Subject Bars & Trend
- SCR-004: Marks Roster & Inline Entry                  - SCR-006: Distribution Charts
- SCR-005: Attendance Roster                            - SCR-007: All Faculty Analytics
- SCR-006: Mentee List & Risk Flags                     - SCR-008: All Dept Batch Trajectories
- SCR-010: Validation Error Scorecard                   - SCR-013: 4 Static Insight Objects
- SCR-011: All 6 Master Data Tables                     - SCR-014: All ML Scores & SHAP Weights
```

### Metric Reproducibility Audit
- **SGPA & CGPA:** 100% reproducible. Values in SCR-002 and SCR-003 match `semester_results.csv` exactly.
- **Attendance Percentages:** 100% reproducible on SCR-003 and SCR-005; matches `attendance_records.csv`.
- **Backlog Counts:** 100% reproducible; matches `backlog_records.csv`.
- **Subject-Level Pass Rates (SCR-007 & SCR-008):** **NOT REPRODUCIBLE.** Hardcoded strings (`88.3%`, `91.4%`, `76.2%`). They cannot be derived from `student_marks.csv`.
- **Score Distribution Histograms (SCR-007):** **NOT REPRODUCIBLE.** Hardcoded bucket counts (`5, 12, 26, 17`).
- **Predicted Risk Scores (SCR-014):** **FABRICATED.** Hardcoded mock values (`0.724`, `0.142`).

---

## 9. Database Audit

The database documentation (`docs/database/ERD.md`, `database-design.md`, `data-dictionary.md`, `database-review.md`) was compared against **SRS Section 18 (*Database Requirements*)**:

### Conformance to SRS Section 18
[SRS] Section 18 specifies 27 core database entities. All 27 entities are fully represented with their exact column names, UUID surrogate keys, and data types across the documentation.

### Gaps, Missing Entities & Normalization Risks
1. **Missing `RolePermissions` Junction Table:**
   [TECHNICAL OBSERVATION] SRS Section 18 defines `Roles` and `Permissions`, but contains no junction entity. In a production relational system, role-based capabilities cannot be assigned dynamically without a `RolePermissions` association table.
2. **Missing `FacultySubjectAllocations` Table:**
   [TECHNICAL OBSERVATION] SRS Business Rule `BR-003` mandates that faculty access be restricted to their "authorized academic scope." However, Section 18 contains no entity linking a faculty `user_id` to a `subject_id`, `semester_id`, and `batch_id`. Without this table, the database cannot enforce instructional boundaries.
3. **Missing `ProgramSubjects` (Curriculum Mapping) Table:**
   [TECHNICAL OBSERVATION] SRS Appendix A mentions curriculum mapping: *"through curriculum mapping if implemented"*. Without this table, subjects exist in isolation; they are not formally bound to a program curriculum or target semester until an assessment or mark is recorded.
4. **Missing `MentorNotes` Entity:**
   [TECHNICAL OBSERVATION] SCR-006 describes a UI widget to "Record mentoring notes where enabled," but Section 18 contains no storage table for these interaction logs.
5. **Denormalization in `AttendanceRecords`:**
   [TECHNICAL OBSERVATION] `attendance_percentage` is stored alongside `classes_held` and `classes_attended`, violating 3NF and introducing potential update anomalies. In PostgreSQL, this should be a generated column or view.

---

## 10. Synthetic Dataset Audit

The synthetic dataset files (`data/synthetic/*.csv`, `generate_dataset.py`, `validate_dataset.py`) were evaluated:

### Data Consistency & Validation Suite
- Running `python data/synthetic/validate_dataset.py` executes **9 automated integrity checks** across all 13 tables (6,991 records).
- All checks pass with **0 errors and 0 warnings**:
  - Primary key uniqueness: VERIFIED.
  - Foreign key referential integrity: VERIFIED (0 orphan records).
  - Marks range compliance: VERIFIED (All marks between 0 and `max_marks`).
  - Attendance math: VERIFIED (`classes_attended <= classes_held`).
  - SGPA/CGPA bounds: VERIFIED (`[0.0, 10.0]`).

### Data Limitations & Disconnects with Prototype
1. **Generic Student Naming:** `students.csv` generates student names as "Synthetic Student 001", "Synthetic Student 002". To satisfy the prototype requirement of realistic personas, `scripts/build_prototype_data.py` injects an override mapping (`name_map`) for key students ("Aryansh Sharma", "Aryan Verma").
2. **Cohort Slicing in Prototype:** The dataset contains 200 students across 3 programs, 3 departments, and 3 batch intakes. However, `dataService.js` often slices records (`slice(0, 28)` or `slice(0, 40)`) to display neat UI lists rather than handling pagination.
3. **Absence of Historical Log Entries:** `AuditLogs` and `ImportJobs` are maintained in `dataService.js` as in-memory arrays rather than standalone synthetic CSV files.

---

## 11. AI/ML Claims Audit

This is a critical section of the forensic audit. Evaluators and accreditation committees scrutinize artificial intelligence claims in academic projects.

### Forensic Inventory of AI/ML Artifacts in Repository

| Term / Claim | Location | Real Implementation? | Calculated? | Simulated / Static? | SRS Grounding & Verdict |
|---|---|---|---|---|---|
| **`AcademicRiskClassifier`** | `src/data/dataService.js:333`, `src/screens/SCR014_PredictionAnalytics.jsx:78` | **NO.** Zero ML code exists. | **NO.** | **Static Mock String.** | [FUTURE SEMESTER] Modeled purely as a UI mock for Semester 6. |
| **Algorithm: "Random Forest"** | `src/data/dataService.js:337`, `src/screens/SCR014_PredictionAnalytics.jsx:78` | **NO.** Scikit-learn is not installed. | **NO.** | **Static Label.** | [FUTURE SEMESTER] Proposed algorithm candidate for Semester 6. |
| **Model Metrics: Precision 84.2%, Recall 81.5%, F1 0.828, Latency 42ms** | `src/data/dataService.js:339-343`, `src/screens/SCR014_PredictionAnalytics.jsx:84-87` | **NO.** No validation split or confusion matrix exists. | **NO.** | **Hardcoded Benchmark Targets.** | [TECHNICAL OBSERVATION] Highly misleading if not explicitly marked as target goals. |
| **Risk Score: `0.724` (High Risk) vs `0.142` (Low Risk)** | `src/data/dataService.js:352, 367`, `src/screens/SCR014_PredictionAnalytics.jsx:121` | **NO.** | **NO.** | **Hardcoded Floating Point Values.** | [TECHNICAL OBSERVATION] Needle gauge visually implies live calibrated inference. |
| **Feature Attribution / SHAP Weights (`+0.34`, `+0.26`, `-0.30`)** | `src/data/dataService.js:356-358`, `src/screens/SCR014_PredictionAnalytics.jsx:153` | **NO.** Zero SHAP tree explainer code exists. | **NO.** | **Static Text Strings.** | [TECHNICAL OBSERVATION] Danger of evaluator believing feature attribution is operational. |
| **"Confidence / Heuristic Strength: HIGH"** | `src/data/dataService.js:279`, `src/screens/SCR013_InsightsRecommendations.jsx:138` | **NO.** | **NO.** | **Static String.** | [TECHNICAL OBSERVATION] Misleadingly presents heuristic data presence as statistical confidence. |
| **Heuristic Risk Flags (`ATTENDANCE`, `MARKS DROP`, `BACKLOG`)** | `src/data/dataService.js:512-516` | **YES.** Simple rule-based `if/else`. | **YES.** | **Empirical Heuristic.** | [COMPLIANT] Genuinely derived from student attendance and SGPA. |

### Verdict on AI/ML
[TECHNICAL OBSERVATION] **There is NO machine learning in SAAP today.**  
- This is **100% correct according to the SRS blueprint**, which schedules ML model exploration for Semester 6 (`MOD-014`).
- However, SCR-014 presents static mock benchmark numbers and SHAP weightings that could easily mislead an external reviewer.
- **Remediation Requirement:** In future steps, SCR-014 should either emphasize its status as a "Semester 6 Conceptual Interface Wireframe" or replace mock floating-point weights with transparent, deterministic rule-based indicators.

---

## 12. Technical Architecture Audit

### React Architecture & Component Structure
- **Component Separation:** Screens are cleanly segregated in `src/screens/SCR###_Name.jsx`. Reusable UI elements (`Charts.jsx`, `MetricCard.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `Forbidden403.jsx`, `DisclaimerBanner.jsx`) live in `src/components/common/`.
- **State Management:** Local component state (`useState`) handles filters, search, and form inputs. Context providers (`AuthContext`, `RouterContext`) handle global session and navigation. No unneeded Redux or Zustand boilerplate was introduced.
- **Routing:** Implemented via a custom, lightweight hash router in `RouterContext.jsx`. It supports path matching and parameterized routes (`/mentor/student/:id`, `/admin/import/validate/:jobId`) without requiring `react-router-dom`.
- **Styling Architecture:** Implemented in pure, semantic CSS (`src/index.css`, 683 lines). It utilizes CSS custom properties (design tokens for colors, spacing, borders, shadows) and responsive flex/grid layouts. Zero third-party CSS dependencies.
- **Charts Implementation:** Custom semantic SVG implementations (`LineTrendChart`, `HorizontalBarChart`, `DistributionHistogram`, `RiskGauge`) in `Charts.jsx`. Clean, accessible, lightweight, and zero dependency.

### Dependency Tree Audit
- `dependencies`:
  - `react`: `^18.3.1` (Mandated by SRS Section 11/14)
  - `react-dom`: `^18.3.1` (Mandated by SRS Section 11/14)
- `devDependencies`:
  - `vite`: `^5.4.11` (Modern build engine)
  - `@vitejs/plugin-react`: `^4.3.4` (JSX/React compiler)
- **Bloat Verdict:** Zero bloat. The dependency tree is minimal, clean, and perfectly aligned with project guidelines.

---

## 13. UI/UX Audit

### Strengths
1. **Academic Tone & Visual Restraint:** The UI avoids trendy SaaS aesthetics (no glassmorphism, no gradient cards, no neon accents). It uses professional slate-blue tones, clean borders, and clear typographic hierarchy.
2. **Accessible Data Display:** Tabular registers (`saap-table`) are well-structured with aligned headers, monospace numbers, and status badges.
3. **Role-Responsive Shell:** The sidebar menu adjusts dynamically based on the active role, displaying only authorized screens.
4. **Universal Disclaimer Integration:** `DisclaimerBanner.jsx` appears across all predictive and decision-support views, explicitly enforcing Business Rule `BR-009`.

### Weaknesses
1. **Non-Functional Form Controls:** In screens like SCR-007 and SCR-008, changing dropdown values (Academic Year, Semester, Subject) causes zero visual change in the charts. Users expect filter changes to alter data.
2. **Missing Empty States:** If search queries return zero results in student or user rosters, screens often render empty table bodies without helpful empty-state feedback.
3. **Pagination Absence:** Long rosters (such as master subjects or audit logs) display only the first 30–40 items without pagination controls.

---

## 14. "AI/Vibe-Coded" Risk Audit

A forensic scan was performed to detect common artifacts of careless AI-generated code:

| AI Tropes & Patterns | Detected? | Evidence / Location | Severity |
|---|---|---|---|
| **Gratuitous Gradients & Glassmorphism** | **NO** | CSS uses flat, solid borders and accessible slate colors. | None |
| **Repetitive Canned Personas** | **YES** | Aryan Verma (failing mentee) and Aryansh Sharma (distinction student) appear repeatedly as hardcoded exhibits in SCR-002, SCR-006, SCR-013, and SCR-014. | Medium |
| **Fake Telemetry & Infrastructure Metrics** | **YES** | SCR-016 renders "PostgreSQL: UP", "Pool: 18/20", "145 ms p95" cards. (Mitigated by prototype disclaimer). | Low |
| **Fake Precision Decimals** | **YES** | SCR-014 displays `0.724` risk score, `42 ms` latency, and `0.828` F1 score without underlying calculations. | High |
| **Disconnected Visual Charts** | **YES** | SCR-007 (Faculty Analytics) and SCR-008 (Department Analytics) charts are static fixtures that do not react to dropdowns. | High |
| **Placeholder Strings ("Lorem Ipsum", "Coming Soon")** | **NO** | Verified zero occurrences across the entire repository by `scripts/verify_prototype.py`. | None |
| **Bloated Multi-Layer Abstractions** | **NO** | Architecture is direct and concise (screens import `dataService` directly). | None |

---

## 15. Code Quality & Hygiene Audit

- **Dead Code & Unused Files:** Zero orphaned JavaScript or JSX files. Every screen in `src/screens/` is imported and routed in `src/App.jsx`.
- **Comment Hygiene:** Comments in `dataService.js` and screen modules explain architectural context, SRS traceability citations (e.g. `// SRS Ref: BR-005`), and design decisions without obvious code restatement.
- **Linting & Formatting:** 2-space indentation in JS/JSX, 4-space in Python. Strict equality (`===`) used consistently. Optional chaining (`?.`) guards object lookups.
- **Reproducibility:** `npm run build` succeeds in 1.6 seconds with zero warnings or errors. Both Python verification scripts run cleanly.

---

## 16. KEEP / MODIFY / REPLACE / REMOVE / ADD / FUTURE Matrix

Every component, file, and architectural pattern in the repository is classified into the mandatory action matrix:

### A. KEEP (Already correct; preserve without changes)
- `data/synthetic/*.csv` (All 13 relational CSV datasets; referentially sound).
- `data/synthetic/generate_dataset.py` & `validate_dataset.py` (Deterministic generation and validation suites).
- `data/import_templates/*.csv` (Standardized bulk ingestion templates).
- `src/screens/SCR001_Login.jsx` (Clean dual-mode authentication wireframe).
- `src/screens/SCR003_AcademicProfile.jsx` (100% synthetic transcript and demographics).
- `src/screens/SCR004_MarksAssessmentView.jsx` (Interactive faculty entry and range validation).
- `src/screens/SCR005_AttendanceView.jsx` (Dual-mode roster and session logger).
- `src/screens/SCR009_DataImportCenter.jsx` & `SCR010_ImportValidationResult.jsx` (Two-stage staging and gated commit).
- `src/screens/SCR011_AcademicMasterData.jsx` (Comprehensive tabular master data management).
- `src/screens/SCR012_UserManagement.jsx` (User lifecycle and role assignment).
- `src/screens/SCR015_Reports.jsx` (Role-tailored reporting menu and job tracking).
- `src/screens/SCR016_AuditSystemHealth.jsx` (Immutable audit ledger).
- `src/components/common/Charts.jsx` (Zero-dependency SVG chart suite).
- `src/components/common/DisclaimerBanner.jsx` & `Forbidden403.jsx` (Compliance and RBAC gates).
- `src/index.css` (Clean, responsive academic styling system).
- `scripts/build_prototype_data.py` & `verify_prototype.py` (Build and QA automation).
- `package.json` & `vite.config.js` (Lean, minimal build setup).
- `.gitignore` (Correctly excludes node_modules, build outputs, and caches).

### B. MODIFY (Useful but needs technical or data correction)
- `src/screens/SCR002_StudentDashboard.jsx`: [PRODUCT RECOMMENDATION] Replace hardcoded subject performance bars and monthly trend points with dynamic queries against `student_marks.csv` and `attendance_records.csv`.
- `src/screens/SCR006_MentorDashboard.jsx`: [PRODUCT RECOMMENDATION] Dynamically aggregate SGPA and attendance distribution histograms from the mentee cohort rather than displaying hardcoded numbers.
- `src/data/dataService.js`: [TECHNICAL OBSERVATION] Remove hardcoded department summary metrics; compute dynamic aggregations over `syntheticData.json`.

### C. REPLACE (Fundamentally weak or misleading approach)
- `src/screens/SCR007_FacultyAnalytics.jsx`: [PRODUCT RECOMMENDATION] Replace completely static hardcoded charts with dynamic aggregations that recalculate scores, histograms, and pass rates from `student_marks.csv` whenever the subject or assessment dropdown changes.
- `src/screens/SCR008_DepartmentAnalytics.jsx`: [PRODUCT RECOMMENDATION] Replace hardcoded batch trajectory lines and static summary values with dynamic cross-cohort calculations over the synthetic student population.
- `src/screens/SCR013_InsightsRecommendations.jsx`: [PRODUCT RECOMMENDATION] Replace the static 4-item array with a deterministic rule evaluation function that analyzes student attendance and marks to generate real evidence-backed insights.

### D. REMOVE (Unnecessary or harmful artifacts)
- Hardcoded percentile footnote on SCR-002 ("Cohort Rank: Top 15% (Percentile: 88th)").
- Hardcoded departmental baseline footnote on SCR-006 ("Dept Baseline: 7.40 (+0.42)").
- Hardcoded trend indicator on SCR-002 ("▲ Trend: +0.25").

### E. ADD (Necessary missing capability for Semester 3 baseline)
- `docs/audit/phase-0-forensic-audit.md` (This comprehensive audit report).
- Empty state components in table views when search filters return zero matches.

### F. FUTURE (Mandatory for later semesters; strictly prohibited in Semester 3)
- [FUTURE SEMESTER - Sem 4] FastAPI backend application with REST endpoints (`/api/v1/*`).
- [FUTURE SEMESTER - Sem 4] PostgreSQL database, SQLAlchemy ORM models, and Alembic migrations.
- [FUTURE SEMESTER - Sem 4] Server-side JWT authentication, bcrypt password hashing, and session tokens.
- [FUTURE SEMESTER - Sem 4] Real database persistence for imported records, marks, and audit logs.
- [FUTURE SEMESTER - Sem 5] Python Pandas/NumPy analytics engine for institutional aggregate reporting.
- [FUTURE SEMESTER - Sem 6] Scikit-learn machine learning training pipelines, cross-validation, and real risk classifiers.
- [FUTURE SEMESTER - Sem 7] Explainable AI (SHAP / feature attribution) inference routines.
- [FUTURE SEMESTER - Sem 8] Docker containerization, CI/CD pipelines, and automated test suites.

### G. NEEDS HUMAN DECISION (Requires institutional/mentor confirmation)
- **Decision 1: Direct Student Access to Risk Gauges (SCR-014):** Should undergraduate students have access to predictive risk meters and failure indicators, or should risk modeling be restricted to Mentors, Faculty, and Department Leadership?
- **Decision 2: Institutional Curriculum Entity (`ProgramSubjects`):** Should the database schema officially incorporate `ProgramSubjects` as a core entity to map accredited courses to degree programs before assessments are recorded?
- **Decision 3: Faculty Allocation Table (`FacultySubjectAllocations`):** Should the relational design include an explicit faculty course allocation table to enforce `BR-003` in production?

---

## 17. Critical Issues Ranked by Severity

### CRITICAL SEVERITY
1. **Disconnected Faculty Analytics (SCR-007):**
   - *Impact:* The entire screen is hardcoded. Changing course filters does not update any metric or chart. Evaluators will immediately spot that the screen is non-functional as an analytics tool.
   - *Classification:* [CURRENT IMPLEMENTATION] vs [PRODUCT RECOMMENDATION]
2. **Disconnected Department Analytics (SCR-008):**
   - *Impact:* Department summaries, batch trajectories, and pass rates do not aggregate the synthetic dataset. Selecting different departments (ECE, MECH) changes nothing.
   - *Classification:* [CURRENT IMPLEMENTATION] vs [PRODUCT RECOMMENDATION]

### HIGH SEVERITY
3. **Misleading AI/ML Precision Decimals (SCR-014):**
   - *Impact:* Displaying hardcoded precision (84.2%), recall (81.5%), risk score (0.724), and feature weights (+0.34) without underlying ML models creates a severe risk of accusations of "fake AI" or misleading prototype claims during project evaluations.
   - *Classification:* [TECHNICAL OBSERVATION]
4. **Relational RBAC Enforcement Blindspot:**
   - *Impact:* Database schema Section 18 lacks `RolePermissions` and `FacultySubjectAllocations`. When Semester 4 backend development starts, the database will be unable to enforce `BR-003` without schema modifications.
   - *Classification:* [TECHNICAL OBSERVATION]

### MEDIUM SEVERITY
5. **Partial Hardcoding in Student Dashboard (SCR-002):**
   - *Impact:* Subject performance bars and monthly attendance trends are static fixtures rather than reading the student's actual marks and attendance records.
   - *Classification:* [CURRENT IMPLEMENTATION]
6. **Static Heuristic Insights (SCR-013):**
   - *Impact:* Uses a fixed 4-element array rather than dynamically evaluating attendance shortages across the student roster.
   - *Classification:* [PRODUCT RECOMMENDATION]
7. **Client-Side Role Gate Vulnerability:**
   - *Impact:* All authorization is enforced in React state; unauthenticated users can inspect the complete data bundle in browser memory.
   - *Classification:* [CURRENT IMPLEMENTATION] (Acceptable for Semester 3, must be resolved in Semester 4).

### LOW SEVERITY
8. **Missing Table Pagination:**
   - *Impact:* Rosters display only initial sliced records (28–40 rows) without pagination controls.
   - *Classification:* [TECHNICAL OBSERVATION]
9. **Simulated Infrastructure Telemetry (SCR-016):**
   - *Impact:* PostgreSQL pool and API latency cards are mock values. (Well-mitigated by informational disclaimer).
   - *Classification:* [TECHNICAL OBSERVATION]

---

## 18. Proposed Direction — High Level Only

*(In strict adherence to project instructions, zero implementation steps or code modifications are initiated here. This section outlines strategic direction only.)*

### 1. Data Grounding & Analytics Wiring
Before transitioning to Semester 4 backend development, the existing Semester 3 prototype should be brought into **100% empirical alignment with its synthetic dataset**. Every chart, histogram, pass rate, and metric card across SCR-002, SCR-006, SCR-007, and SCR-008 should be calculated dynamically from `syntheticData.json` using pure JavaScript aggregation utilities.

### 2. Honest Framing of AI/ML Capabilities
The prototype must maintain absolute academic integrity. SCR-014 should be clearly designated as an architectural interface mockup for Semester 6. Hardcoded decimal probabilities and mock SHAP weights should be replaced with transparent, explainable heuristic indicators (e.g. rule-based attendance and marks drop warnings) that can be genuinely calculated today.

### 3. Preparation for Semester 4 Backend Engineering
The database schema should incorporate the four missing operational entities (`RolePermissions`, `FacultySubjectAllocations`, `ProgramSubjects`, `MentorNotes`) into the design baseline so that FastAPI and SQLAlchemy development in Semester 4 can enforce all business rules natively.

---

## 19. Questions Requiring Stakeholder Decision

The following three (3) questions cannot be decided from the SRS text alone and require explicit confirmation:

1. **Student Access to Predictive Risk Gauges (SCR-014):**
   *Question:* Should undergraduate students have direct visibility into predictive risk scores and failure indicators, or should predictive analytics be strictly restricted to academic advisors, faculty mentors, and department heads to prevent student anxiety?
2. **Database Schema Enhancements for Operational Integrity:**
   *Question:* Do you approve formally adding the four proposed operational tables (`RolePermissions`, `FacultySubjectAllocations`, `ProgramSubjects`, `MentorNotes`) to the database design specification before Semester 4 migrations are drafted?
3. **Analytics Dynamism in Current Prototype:**
   *Question:* Before declaring Step 8 / Semester 3 completely closed and transitioning to Semester 4 backend development, should we rewire the static charts in SCR-002, SCR-007, and SCR-008 to dynamically compute their numbers from the synthetic dataset, or should we leave them as clickable wireframe mocks?

---

## 20. Exact Recommended Next Phase

### Recommended Phase: **Phase 1 — Analytics Grounding & Data Wiring Review**
Following your review and decisions on the questions above, the immediate next recommended phase is **Phase 1: Grounding Prototype Analytics in Real Synthetic Data**. 

This phase will focus strictly on:
1. Connecting SCR-007 (Faculty Analytics) and SCR-008 (Department Analytics) to dynamically aggregate scores, pass rates, and distributions directly from `syntheticData.json`.
2. Connecting SCR-002 (Student Dashboard) subject bars to the student's actual marks.
3. Ensuring every filter dropdown (Subject, Semester, Assessment) produces real, recalculating analytical views.
4. Ensuring that zero Semester 4 backend or database code is introduced.

---

**AUDIT EXECUTION COMPLETE — PRESERVED IN `docs/audit/phase-0-forensic-audit.md`**  
*(No application code was modified. No dependencies were installed. No commits or pushes were executed. Awaiting your review.)*
