# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Final Product Architecture & System Direction Blueprint
**Document Reference:** `SAAP-PRD-ARC-001`  
**Standard:** IEEE 29148 / Enterprise Software Product Architecture Standard  
**Project Phase:** Semester 3 — Product Architecture & System Direction (Phase 1)  
**Author:** Lead Systems Architect & Product Engineering Team  
**Review Baseline:** Phase 0 Forensic Audit (`docs/audit/phase-0-forensic-audit.md`) & IEEE SRS v1.0  
**Status:** Authoritative Architectural Baseline for Semester 3 Prototype Redesign & Semester 4 Transition  

---

## 1. Product Definition

The **Success & Academic Analytics Platform (SAAP)** is an institutional academic intelligence, longitudinal progress tracking, and early-intervention decision-support platform designed for higher education institutions. 

SAAP is **not** a generic Student Information System (SIS), a learning management system (LMS), or a superficial administrative dashboard. While an SIS records static transactional data and an LMS delivers learning materials, SAAP acts as an **analytical decision-support layer** that centralizes verified academic records across departments and converts multi-semester data into auditable trends, cohort comparisons, and proactive advising signals.

The platform serves higher education institutions governed by structured academic regulations (e.g. continuous internal evaluations, mandatory attendance thresholds, semester credit accumulation, and autonomous grading systems). It operates under strict Role-Based Access Control (RBAC) across nine (9) institutional user classes, enforcing data isolation, audit immutability, and pre-commit ingestion validation.

---

## 2. Problem Definition

Higher education institutions face three systemic operational failures in academic governance:

1. **Information Fragmentation:**  
   Student academic performance data is isolated in departmental silos, individual faculty grading spreadsheets, biometric attendance logs, and university examination ledgers. Consolidating this information into a longitudinal cohort trajectory is manual, slow, and error-prone.
2. **Reactive Failure Interventions:**  
   Academic interventions currently occur *post-mortem*—after semester results are declared, exams are failed, or students are detained due to attendance shortages (< 75%). Institutions lack an operational system that continuously correlates low continuous internal marks with attendance declines to alert mentors while remediation is still possible.
3. **Uncontrolled Data Ingestion:**  
   Admissions, marks, and attendance data are frequently ingested without automated schema validation or relational integrity checks, resulting in duplicate student records, orphaned subject scores, and inaccurate official transcripts.

---

## 3. Product Principles

The architecture of SAAP is governed by six fundamental product principles:

```
[DATA] ───► [INFORMATION] ───► [ANALYTICS] ───► [SIGNALS] ───► [HUMAN DECISION] ───► [OUTCOME]
```

1. **Progressive Evolution Principle:**  
   The platform strictly follows the progression mandated in SRS Section 5:
   $$\text{DATA} \longrightarrow \text{INFORMATION} \longrightarrow \text{ANALYTICS} \longrightarrow \text{INSIGHTS} \longrightarrow \text{PREDICTION} \longrightarrow \text{RECOMMENDATION} \longrightarrow \text{INTELLIGENCE}$$
   Semester 3 establishes verified **Data, Information, Analytics, and Heuristic Signals**. Advanced machine learning prediction and prescriptive AI are explicitly reserved for subsequent semesters (Semesters 6 and 7).
2. **Decision-Support Primacy (BR-009):**  
   Every chart, metric, indicator, and signal must directly serve a specific institutional decision. Analytics that exist purely for visual decoration without informing an action are strictly prohibited. The system never automates punitive academic determinations; all interventions remain under authorized human control.
3. **Strict Scope Containment (BR-001 – BR-004):**  
   Information visibility is strictly bounded by role and assignment. Students see only themselves; mentors see only assigned mentees; faculty see only mapped courses; department users see aggregate cohorts without individual PII; administrators operate within institutional master boundaries.
4. **Data Grounding & Auditability (BR-005, BR-010):**  
   Every displayed metric must be independently reproducible from verified underlying datasets. No bulk ingestion modifies the database without pre-commit validation (`BR-005`), and every privileged data modification or export is immutably logged (`BR-010`).
5. **No AI/ML Theater:**  
   The platform never simulates artificial intelligence or displays fabricated decimal probabilities, precision/recall benchmarks, or mock SHAP values when real statistical pipelines do not exist. Early-warning signals at this stage are transparent, deterministic, and evidence-grounded.
6. **Institutional Software Over SaaS Hype:**  
   The UI/UX prioritizes typographic clarity, tabular data density, explicit units, clear axes, and high accessibility over trendy consumer SaaS aesthetics, gradients, and meaningless cards.

---

## 4. Target Users

In strict accordance with **SRS Section 10 (*User Classes and Roles*)**, SAAP serves nine distinct user classes:

| Role ID | Role Name | Institutional Stakeholder Class | Primary Operational Focus |
|---|---|---|---|
| **ROL-001** | **Student** | Academic End-User | Self-monitoring, attendance compliance, degree progression |
| **ROL-002** | **Mentor** | Academic Advisor / Faculty Mentor | Cohort monitoring, risk triage, student advising |
| **ROL-003** | **Faculty** | Course Instructor | Course assessment entry, attendance logging, score analysis |
| **ROL-004** | **Department User** | Head of Department / Program Chair | Curriculum evaluation, batch performance, bottleneck detection |
| **ROL-005** | **Academic Administrator** | Registrar / Dean of Academic Affairs | Master data, bulk ingestion, result publication |
| **ROL-006** | **Data Analyst** | Institutional Research Officer | Statistical benchmarking, aggregate trends, KPI modeling |
| **ROL-007** | **ML Engineer** | Data Science Specialist | Model governance, training quality gates, prediction pipelines |
| **ROL-008** | **System Administrator** | IT Operations / Platform Admin | Account provisioning, RBAC enforcement, system security |
| **ROL-009** | **Auditor / Viewer** | Academic Quality Assurance / Inspector | Regulatory compliance, immutable audit ledger inspection |

---

## 5. User Jobs (Jobs-to-be-Done Framework)

To guarantee that SAAP is built around real academic operations rather than disconnected screens, user needs are defined through the **Jobs-to-be-Done (JTBD)** framework:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ WHEN [Academic Context]                                                           │
│ I WANT TO [Specific System Capability]                                            │
│ SO THAT I CAN [Measurable Institutional Decision / Academic Outcome]             │
└───────────────────────────────────────────────────────────────────────────────────┘
```

1. **Student:**  
   *When* I am progressing through an academic semester, *I want to* monitor my continuous marks, attendance percentages, and credit standing in each course against statutory thresholds, *so that I can* prevent exam detention and take timely remedial actions before final exams.
2. **Mentor:**  
   *When* I advise my assigned mentee cohort, *I want to* instantly identify students exhibiting attendance deficits (< 75%) or continuous marks drops, *so that I can* conduct structured academic advising sessions and document timely interventions.
3. **Faculty:**  
   *When* I administer an assigned course, *I want to* record session attendance and assessment scores with real-time validation, and analyze score distributions, *so that I can* identify struggling topics and provide targeted tutorials.
4. **Department User:**  
   *When* I evaluate departmental academic outcomes, *I want to* compare batch pass rates, multi-semester trajectories, and course failure densities, *so that I can* allocate teaching resources and revise curriculum delivery.
5. **Academic Administrator:**  
   *When* I ingest bulk academic datasets from departments, *I want to* validate file schemas and referential integrity in staging before committing, *so that I can* protect the permanent academic registry from corrupted or unmapped data.
6. **Data Analyst:**  
   *When* I analyze institutional performance, *I want to* evaluate statistical KPI distributions and validate trend calculation algorithms, *so that I can* provide authoritative evidence for institutional accreditation.
7. **ML Engineer:**  
   *When* preparing predictive models in later phases, *I want to* verify historical data sufficiency, track model governance versions, and evaluate baseline heuristics, *so that I can* ensure predictive models are mathematically sound and ethical.
8. **System Administrator:**  
   *When* managing platform infrastructure, *I want to* provision user accounts, assign RBAC roles, and monitor authentication security, *so that I can* maintain system integrity without having access to alter academic grades.
9. **Auditor / Viewer:**  
   *When* conducting institutional quality compliance audits, *I want to* inspect immutable operational logs and data commit trails, *so that I can* verify that grade modifications and student records adhere to institutional policies.

---

## 6. Role-Centric Product Architecture

The detailed operational profile for each role is specified below:

### 6.1 Student (`ROL-001`)
- **Primary Job:** Track personal academic health, verify official grades, and maintain statutory attendance compliance.
- **Secondary Jobs:** Review personal transcript, verify credit accumulation, review evidence-backed advisories.
- **Key Questions Answered:**
  - Am I in danger of attendance detention in any subject? Exactly how many lectures can I miss (or must I attend) to stay above 75%?
  - How are my continuous assessment scores tracking across subjects?
  - What is my current SGPA/CGPA trajectory across completed terms?
  - Do I have active backlogs that must be cleared?
- **Key Data Needed:** Personal profile, enrolled subjects, internal marks per assessment component, classes held vs. attended per course, historical SGPA/CGPA transcript, active backlog list.
- **Key Actions:** View personal dashboard, inspect course-wise attendance breakdown, view official transcript, download verified grade transcript.
- **Key Decisions:** Prioritize attendance in borderline subjects; schedule faculty office hours for low-scoring courses.
- **Key Screens:** SCR-002 (Dashboard), SCR-003 (Official Profile & Transcript), SCR-004 (Personal Marks Ledger), SCR-005 (Personal Attendance Ledger), SCR-013 (Personal Advisories), SCR-015 (Transcript Export).
- **Important Restrictions (BR-001):** Strictly prohibited from accessing records, grades, roll numbers, or aggregate metrics of any other student.

### 6.2 Mentor (`ROL-002`)
- **Primary Job:** Proactively monitor an assigned cohort of students and conduct early advising interventions.
- **Secondary Jobs:** Record formal mentoring consultation notes; track student backlog resolution.
- **Key Questions Answered:**
  - Which of my assigned mentees are in academic distress right now?
  - Who has dropped below the 75% attendance threshold?
  - Who experienced a sharp drop in continuous assessment marks?
  - What prior intervention notes were logged for this student?
- **Key Data Needed:** Roster of officially assigned mentees (`MentorAssignments`), aggregate mentee attendance, term SGPA, continuous assessment summaries, active backlogs, historical advising notes.
- **Key Actions:** Filter mentee roster by risk flag (`ATTENDANCE`, `MARKS DROP`, `BACKLOG`), open student longitudinal profile, log mentoring interaction notes, export mentee summary report.
- **Key Decisions:** Schedule immediate advising meetings; recommend remedial tutorial sessions; alert department leadership to severe cases.
- **Key Screens:** SCR-006 (Mentor Advising Center), SCR-003 (Mentee Profile Inspection), SCR-013 (Mentee Advisories), SCR-015 (Cohort Reports).
- **Important Restrictions (BR-002):** Prohibited from accessing student records outside officially assigned mentoring cohorts.

### 6.3 Faculty (`ROL-003`)
- **Primary Job:** Administer course assessments, log classroom attendance, and evaluate instructional outcomes for assigned courses.
- **Secondary Jobs:** Identify struggling students within taught sections; stage bulk marks spreadsheets.
- **Key Questions Answered:**
  - What is the score distribution and pass rate for my course assessments?
  - Which students are consistently absent from my lecture sessions?
  - Are student failures concentrated in a specific assessment component or syllabus unit?
- **Key Data Needed:** Assigned courses, enrolled students per section, assessment components (`max_marks`), session attendance counts, continuous evaluation marks.
- **Key Actions:** Enter and edit assessment marks with instant range validation (`ERR-MRK-001`), log session attendance, upload marks CSV into staging, inspect score histograms.
- **Key Decisions:** Plan revision lectures for low-scoring units; flag chronically absent students to their designated mentors.
- **Key Screens:** SCR-007 (Course Analytics), SCR-004 (Marks Entry & Roster), SCR-005 (Attendance Roster & Session Logger), SCR-009 (Course Marks Staging), SCR-010 (Validation Review).
- **Important Restrictions (BR-003):** Restricted strictly to courses, sections, and semesters mapped to the faculty member. Cannot alter student demographics or institutional master data.

### 6.4 Department User (`ROL-004`)
- **Primary Job:** Oversee curriculum performance, monitor cohort progression, and detect departmental academic bottlenecks.
- **Secondary Jobs:** Compare batch trajectories; evaluate cross-subject failure patterns; prepare accreditation metrics.
- **Key Questions Answered:**
  - How does Batch 2024 performance compare to Batch 2023 at the same academic milestone?
  - Which courses in our degree programs have abnormal failure or backlog densities?
  - What is the overall departmental pass percentage and SGPA distribution?
- **Key Data Needed:** Aggregated student counts, batch SGPA progressions, course-level pass rates, backlog cluster counts, curriculum difficulty indicators.
- **Key Actions:** Filter by program and batch cohort, inspect curriculum bottleneck tables, export departmental performance audits.
- **Key Decisions:** Allocate senior faculty to high-difficulty courses; initiate curriculum syllabus revisions; adjust internal assessment weightages.
- **Key Screens:** SCR-008 (Departmental Oversight Analytics), SCR-013 (Curriculum Alerts), SCR-015 (Departmental Reports).
- **Important Restrictions (BR-004):** Operates strictly at the aggregate and cohort level. Prohibited from viewing unmasked individual student PII or modifying student marks.

### 6.5 Academic Administrator (`ROL-005`)
- **Primary Job:** Administer institutional academic structures, govern bulk data ingestion, and ensure the integrity of official academic records.
- **Secondary Jobs:** Maintain departments, programs, batches, semesters, and subjects; publish terminal semester results.
- **Key Questions Answered:**
  - Does this bulk marks spreadsheet contain duplicate entries, invalid student IDs, or out-of-range scores?
  - Are all academic programs, curricula, and semesters properly structured for the current academic session?
- **Key Data Needed:** Institutional catalog (`Departments`, `Programs`, `Batches`, `Semesters`, `Subjects`), bulk ingestion staging queues (`ImportJobs`, `ImportErrors`), student enrollments, result publications.
- **Key Actions:** Configure academic master data, upload bulk CSVs, inspect row-level error scorecards in staging, execute gated database commits, publish semester results.
- **Key Decisions:** Approve or reject bulk data ingestion batches; authorize controlled grade corrections under `BR-007`.
- **Key Screens:** SCR-011 (Academic Master Data), SCR-009 (Data Ingestion Center), SCR-010 (Pre-Commit Validation Diagnostics), SCR-003 (Institutional Registry), SCR-015 (Institutional Exports).
- **Important Restrictions:** Segregated from system technical administration. Cannot alter database connection strings, modify system server settings, or manage user passwords.

### 6.6 Data Analyst (`ROL-006`)
- **Primary Job:** Verify statistical metrics, validate analytical algorithms, and monitor descriptive KPI calculations.
- **Secondary Jobs:** Configure analytical snapshot jobs; generate de-identified institutional extracts.
- **Key Questions Answered:**
  - Are GPA calculations and pass rates mathematically consistent across cohorts?
  - Are analytical aggregations performing within the sub-3-second response benchmark?
- **Key Data Needed:** Aggregated academic metrics, distribution tables, de-identified cohort extracts, system calculation snapshots (`AnalyticsSnapshots`).
- **Key Actions:** Review KPI definitions, evaluate heuristic rule thresholds, export de-identified analytical datasets.
- **Key Decisions:** Recommend adjustments to baseline warning thresholds (e.g. attendance advisory triggers).
- **Key Screens:** SCR-008 (Cohort Analytics), SCR-013 (Heuristics Validation), SCR-015 (Data Extracts).
- **Important Restrictions:** Zero access to unmasked student personal identity data without institutional authorization.

### 6.7 ML Engineer (`ROL-007`)
- **Primary Job:** Govern machine learning readiness, track model lifecycle metadata, and evaluate baseline risk heuristics.
- **Secondary Jobs:** Document training split requirements; evaluate future feature attribution techniques.
- **Key Questions Answered:**
  - Does the institution possess sufficient, authorized historical data to train a statistically valid risk classifier?
  - What are the documented target performance benchmarks (precision, recall, F1) for future predictive models?
- **Key Data Needed:** Model registry specifications (`MLModels`), historical cohort readiness metrics, feature correlation tables, heuristic baseline benchmarks.
- **Key Actions:** Inspect model governance specifications, evaluate deterministic baseline heuristics against target benchmarks.
- **Key Decisions:** Certify whether data quality and volume meet SRS Section 21 prerequisites for training.
- **Key Screens:** SCR-014 (Model Governance & Prediction Architecture), SCR-013 (Signal Evaluation), SCR-015 (Model Telemetry Reports).
- **Important Restrictions (BR-008, BR-009):** Cannot publish automated risk scores as official institutional grades; models must remain decision-support indicators.

### 6.8 System Administrator (`ROL-008`)
- **Primary Job:** Administer user accounts, enforce Role-Based Access Control, and maintain system security and operational availability.
- **Secondary Jobs:** Configure authentication policies; monitor infrastructure telemetry; manage backup schedules.
- **Key Questions Answered:**
  - Are all active user accounts assigned to valid RBAC roles?
  - Have any unauthorized access attempts (`ERR-AUTHZ-001`) occurred?
  - Are platform response times meeting the sub-3-second benchmark?
- **Key Data Needed:** User account directory (`Users`), role assignments (`UserRoles`), authentication audit logs, system telemetry.
- **Key Actions:** Provision user accounts, assign/revoke roles, suspend inactive accounts, inspect audit trails.
- **Key Decisions:** Suspend compromised accounts; adjust system capacity allocations.
- **Key Screens:** SCR-012 (User Management), SCR-016 (System Health & Audit Ledger).
- **Important Restrictions:** Segregated strictly from academic data tampering. SysAdmins cannot enter, edit, or certify student marks.

### 6.9 Auditor / Viewer (`ROL-009`)
- **Primary Job:** Conduct independent inspection of academic transactions, data mutations, and security events for compliance.
- **Secondary Jobs:** Verify that grade modifications followed approved procedures; export regulatory audit logs.
- **Key Questions Answered:**
  - Who committed or altered student marks, and at what timestamp?
  - Was any data imported that bypassed validation checks?
  - Have user permission boundaries been respected?
- **Key Data Needed:** Immutable audit logs (`AuditLogs`), data ingestion history (`ImportJobs`), export tracking records.
- **Key Actions:** Filter audit logs by actor, action, and entity; export compliance CSV ledgers.
- **Key Decisions:** Certify institutional compliance for accreditation bodies.
- **Key Screens:** SCR-016 (Audit Ledger), SCR-011 (Read-Only Master Data), SCR-012 (Read-Only Users), SCR-015 (Compliance Exports).
- **Important Restrictions:** **Strictly Read-Only across all modules.** Zero create, update, delete, or commit authority.

---

## 7. Core Product Workflow

The core operational workflow of SAAP transforms verified data into human action:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            SAAP CORE WORKFLOW                                │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
[STEP 1: CONTROLLED INGESTION]
  Academic Admin/Faculty uploads CSV ──► Staging Schema Validation 
  ──► Gated Pre-Commit Review (SCR-009 / SCR-010) ──► Valid Records Committed
                                      │
                                      ▼
[STEP 2: NORMALIZED PERSISTENCE]
  Relational storage across 27 PostgreSQL entities 
  (Departments, Students, Marks, Attendance, Results)
                                      │
                                      ▼
[STEP 3: COMPUTATIONAL ANALYTICS ENGINE]
  Deterministic aggregation of metrics:
  - Subject Attendance % & Session Buffer
  - Assessment Distributions & Grade Bands
  - Longitudinal SGPA/CGPA Progressions
  - Cohort Pass Rates & Backlog Clusters
                                      │
                                      ▼
[STEP 4: EVIDENCE-LINKED HEURISTIC SIGNALS]
  Automated detection of academic risk thresholds:
  - Attendance Deficit Signal (Attendance < 75%)
  - Continuous Evaluation Drop Signal (Marks drop > 25% below cohort mean)
  - Curriculum Bottleneck Signal (Course backlog density > 20%)
                                      │
                                      ▼
[STEP 5: ROLE-SCOPED PRESENTATION]
  Signals routed to authorized stakeholders:
  - Student views personal buffer & catch-up targets (SCR-002)
  - Mentor views prioritized mentee attention list (SCR-006)
  - Faculty views course score histogram (SCR-007)
  - Department Chair views curriculum bottlenecks (SCR-008)
                                      │
                                      ▼
[STEP 6: HUMAN INTERPRETATION & ACTION LOOP]
  Authorized human decision executed:
  - Mentor logs advising consultation note
  - Faculty schedules remedial tutorial
  - Department initiates curriculum review
                                      │
                                      ▼
[STEP 7: IMMUTABLE AUDIT TRAIL]
  Every privileged action, commit, and export logged to AuditLogs (SCR-016)
```

### Analysis of Intervention / Case-Management Workflow
[ARCHITECTURAL INFERENCE & PROPOSED ENHANCEMENT]  
In traditional dashboards, the workflow ends at Step 5 (visualization). The mentor looks at an alert, but no structured mechanism tracks whether an advising session occurred or whether the student improved.

- **Status in SRS v1.0:** The SRS defines the *foundation*—SCR-006 has "Notes: Record mentoring notes where enabled", and SCR-013 has "Status: New/Viewed/Actioned". However, the SRS *does NOT* define a complete case-management entity (e.g. `InterventionCases` with fields for `case_status`, `assigned_counselor`, `intervention_type`, `follow_up_date`, `outcome_evaluation`).
- **Architectural Classification:** `[PROPOSED ENHANCEMENT] / [INSTITUTIONAL DECISION REQUIRED]`
- **Recommendation:**
  1. *Semester 3:* Support lightweight advising interaction notes in SCR-006 and action status updates in SCR-013 using the current schema baseline.
  2. *Semester 4/5:* Formally introduce an `AcademicInterventions` entity in the backend to provide closed-loop case tracking (`Flagged -> Advised -> Action Plan -> Re-evaluation -> Resolved`).

---

## 8. Information Architecture

The information architecture organizes the platform into logical, role-governed operational spaces:

```
+-----------------------------------------------------------------------------------+
| GLOBAL APPLICATION SHELL                                                          |
| ├── Header: Logo | Institutional Context (2026-27 | Sem 3) | Role Switcher | User |
| └── Layout: Collapsible Sidebar (Role-Scoped) + Main Content Area + Legal Footer  |
+-----------------------------------------------------------------------------------+

SIDEBAR NAVIGATION HIERARCHY BY ROLE:

STUDENT (ROL-001):
├── Academic Overview (/student/dashboard)               -> SCR-002
├── Official Profile & Transcript (/student/profile)    -> SCR-003
├── Assessment Marks (/student/marks)                   -> SCR-004
├── Attendance Record (/student/attendance)             -> SCR-005
├── Academic Advisories (/insights)                     -> SCR-013
└── Official Reports (/reports)                         -> SCR-015

MENTOR (ROL-002):
├── Advising Center (/mentor/dashboard)                 -> SCR-006
├── Mentee Detail (/mentor/student/:id)                 -> SCR-003
├── Predictive Risk Governance (/analytics/predictions) -> SCR-014
├── Advisories & Interventions (/insights)              -> SCR-013
└── Cohort Reports (/reports)                           -> SCR-015

FACULTY (ROL-003):
├── Course Analytics (/faculty/analytics)               -> SCR-007
├── Marks Entry & Roster (/faculty/marks)               -> SCR-004
├── Attendance Tracker (/faculty/attendance)            -> SCR-005
├── Marks Data Staging (/faculty/import)                -> SCR-009
└── Course Reports (/reports)                           -> SCR-015

DEPARTMENT USER (ROL-004):
├── Departmental Oversight (/department/analytics)      -> SCR-008
├── Curriculum Advisories (/insights)                   -> SCR-013
└── Department Reports (/reports)                       -> SCR-015

ACADEMIC ADMINISTRATOR (ROL-005):
├── Academic Master Data (/admin/master-data)           -> SCR-011
├── Data Ingestion Center (/admin/import)               -> SCR-009
├── Ingestion Diagnostics (/admin/import/validate/:id)  -> SCR-010
├── Student Directory (/student/profile)                -> SCR-003
└── Institutional Reports (/reports)                    -> SCR-015

SYSTEM ADMINISTRATOR (ROL-008):
├── User Management (/admin/users)                      -> SCR-012
├── System Health & Audit Ledger (/admin/audit)         -> SCR-016
└── Security Reports (/reports)                         -> SCR-015

AUDITOR / VIEWER (ROL-009):
├── Regulatory Audit Ledger (/admin/audit)              -> SCR-016
├── Master Data Inspection (/admin/master-data)         -> SCR-011
├── User Directory Inspection (/admin/users)            -> SCR-012
└── Compliance Exports (/reports)                       -> SCR-015
```

---

## 9. Screen Architecture & Strategic Directions

Every screen (SCR-001 through SCR-016) was evaluated against its user job and analytical fidelity:

| Screen ID | Screen Name | Action Verdict | Strategic Architectural Direction |
|---|---|---|---|
| **SCR-001** | Login | **KEEP** | Retain clean split-card layout. The right-side prototype simulator is clearly labeled as a Step 7 evaluation tool. In Semester 4, replace with real JWT/session credentials. |
| **SCR-002** | Student Dashboard | **RESTRUCTURE** | Preserve screen identity, but **eliminate all hardcoded subject bars and monthly points**. Dynamically calculate course marks from `student_marks.csv` and attendance from `attendance_records.csv`. Add an explicit "Session Buffer to 75%" indicator on attendance. |
| **SCR-003** | Academic Profile | **KEEP** | Already 100% compliant with synthetic data. Excellent longitudinal transcript and backlog registry. Mentors/Admins retain student picker. |
| **SCR-004** | Marks & Assessment View | **MODIFY** | Retain interactive grid and inline range validation (`ERR-MRK-001`). Filter course dropdown strictly by faculty assignment. |
| **SCR-005** | Attendance View | **MODIFY** | Retain dual-mode view. Enhance session logger to allow individual present/absent toggling rather than uniform incrementing. |
| **SCR-006** | Mentor Dashboard | **RESTRUCTURE** | Keep the dynamic mentee roster and risk indicators. **Replace the hardcoded distribution bar charts** with dynamic aggregations computed across the 28 mentees. Maintain the consultation notes register. |
| **SCR-007** | Faculty Analytics | **REPLACE CONTENT** | **Replace completely hardcoded static charts**. Connect dropdowns to `student_marks.csv` to dynamically calculate real score histograms, pass percentages, and assessment averages for whichever course is selected. |
| **SCR-008** | Department Analytics | **REPLACE CONTENT** | **Replace completely hardcoded static metrics**. Compute real batch comparisons (Batch 2023 vs 2024 vs 2025) and departmental pass rates dynamically across all 200 synthetic students. |
| **SCR-009** | Data Import Center | **KEEP** | Retain two-stage staging workflow, template downloads, and pre-commit validation routing. |
| **SCR-010** | Import Validation Result | **KEEP** | Exemplary screen. Retain row-level error diagnostics (`IMP-104`), blocked commit logic (`BR-006`), and audited commit actions (`BR-005`). |
| **SCR-011** | Academic Master Data | **KEEP** | 100% compliant with synthetic dataset. Retain 6 tabs, duplicate prevention (`ERR-DUP-001`), and referential deletion protection. |
| **SCR-012** | User Management | **KEEP** | Clean RBAC role assignment and account lifecycle administration. |
| **SCR-013** | Insights & Recommendations | **RESTRUCTURE** | **Replace static 4-item array** with a deterministic heuristic rule engine that scans the student population and generates real evidence-backed advisories based on configured thresholds (attendance < 75%, SGPA drops, backlogs). |
| **SCR-014** | Prediction Analytics | **RESTRUCTURE / REFRAME** | **Strip away fake decimal risk scores (`0.724`, `0.142`) and fake benchmark metrics**. Reframe SCR-014 as the "Semester 6 ML Evolution Specification & Governance Blueprint", presenting the model lifecycle, data quality readiness checklist, and an explainable heuristic baseline. |
| **SCR-015** | Reports | **MODIFY** | Retain role-tailored report menu. Connect "Download" buttons to generate real client-side CSV files from data in memory. |
| **SCR-016** | Audit & System Health | **MODIFY** | Retain the immutable operational audit ledger. Maintain clear disclaimers that infrastructure telemetry is simulated for Semester 3. |

---

## 10. Analytics Architecture & Hierarchy

To prevent arbitrary and disconnected charts, all analytics in SAAP must follow an explicit four-level computational hierarchy:

```
LEVEL 1: RAW TRANSACTIONAL DATA
  Student Marks (0–100), Attendance Counts (held/attended), Terminal SGPA (0–10)
                                │
                                ▼
LEVEL 2: NORMALIZED DESCRIPTIVE METRICS
  Attendance % = (attended / held) * 100
  Course Average = SUM(marks) / COUNT(students)
  Pass Rate = (COUNT(marks >= 40) / COUNT(students)) * 100
                                │
                                ▼
LEVEL 3: LONGITUDINAL & COHORT TRENDS
  Term-over-Term SGPA Delta = SGPA(Term N) - SGPA(Term N-1)
  Score Distribution Frequency Histogram (Buckets: <40, 40-59, 60-79, >=80)
  Batch Comparative Trajectory
                                │
                                ▼
LEVEL 4: EVIDENCE-LINKED HEURISTIC SIGNALS
  Attendance Shortage Flag = (Attendance % < 75.0%)
  Marks Vulnerability Flag = (Assessment Score < 0.60 * max_marks)
  Curriculum Bottleneck Index = (Active Backlog Count / Total Enrolled) >= 0.15
```

### Hard Analytical Constraints (SRS Mandated)
1. **Scope Bounding:** Aggregations must never cross role boundaries (e.g. Faculty analytics only aggregate students in their mapped sections).
2. **Explicit Temporal Context:** Every chart, table, and metric card must explicitly display the academic session and semester period (e.g. `2026-27 | Semester 3`).
3. **Missing Data vs. Zero:** Missing marks (absent students) must be explicitly flagged as `ABSENT` or `NOT RECORDED` and excluded from average calculations; they must never silently default to numerical `0.00`.
4. **Absolute Reproducibility:** Every calculated number must be testable and reproducible from the underlying raw data.

---

## 11. AI/ML Product Position for Semester 3

[TECHNICAL OBSERVATION & STRATEGIC REALIGNMENT]  
The forensic audit confirmed that **zero machine learning models exist in SAAP today**. This is **100% compliant with the IEEE SRS v1.0 blueprint**, which strictly schedules ML exploration for **Semester 6** (`MOD-014`).

However, displaying hardcoded precision (84.2%), recall (81.5%), risk scores (0.724), and mock SHAP weights creates an unacceptable risk that project evaluators will accuse the project of presenting "fake AI" or misleading mockups.

### Strategic Redesign for SCR-014
In the redesigned Semester 3 prototype, SCR-014 will be repositioned as the **Machine Learning Governance & Evolution Specification**:
1. **Historical Data Quality & Readiness Checklist:**  
   Displays an automated evaluation of whether current institutional datasets satisfy the prerequisites of SRS Section 21.1 (e.g. minimum 3 historical cohorts, feature completeness, target label definitions).
2. **Model Lifecycle & Governance Registry:**  
   Documents the approved algorithmic candidate for Semester 6 (Random Forest Classifier), training split policies (80/20 train/validation), and target evaluation criteria.
3. **Transparent Heuristic Baseline Preview:**  
   Replaces fake decimal scores with a **deterministic, rule-based baseline scorecard** (e.g. `Attendance Deficit + Internal Marks Drop + Historical Backlogs`). This provides real decision-support today and establishes the benchmark that future Semester 6 ML models will be required to beat.

---

## 12. Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 13 Relational CSVs in data/synthetic/ (6,991 Records)                  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ scripts/build_prototype_data.py                                        │
│ - Compiles relational CSVs into single indexed JSON bundle             │
│ - Preserves foreign key relationships across all 13 entities           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ src/data/syntheticData.json (53,000 Lines)                             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ src/data/dataService.js (Domain Query & Aggregation Layer)             │
│ - getStudentResults(id) -> Calculates real multi-term transcript       │
│ - getStudentAttendance(id) -> Calculates real subject attendance %     │
│ - getFacultyAnalytics(course) -> DYNAMICALLY computes histograms       │
│ - getDepartmentAnalytics(dept) -> DYNAMICALLY aggregates batch cohorts │
│ - generateHeuristicSignals() -> Evaluates real rules over dataset      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ React Prototype Screens (SCR-001 through SCR-016)                      │
│ - Pure presentation & interactive filtering                            │
│ - All charts render dynamically from dataService calculations          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Database Evolution & Operational Gaps

The forensic audit evaluated four operational entities missing from the baseline SRS Section 18 schema:

| Entity Candidate | Classification | Necessity for Semester 4 Backend | Strategic Recommendation |
|---|---|---|---|
| **`RolePermissions`** | **TECHNICALLY NECESSARY** | **MANDATORY.** Section 18 lists `Roles` and `Permissions` but no junction table. Dynamic RBAC middleware in FastAPI cannot function without it. | Add to database design baseline before drafting Semester 4 migrations. |
| **`FacultySubjectAllocations`** | **TECHNICALLY NECESSARY / SRS INFERRED** | **MANDATORY.** Business Rule `BR-003` restricts faculty to authorized scope. The database must link `faculty_user_id` to `subject_id`, `semester_id`, and `batch_id`. | Add to database design baseline before drafting Semester 4 migrations. |
| **`ProgramSubjects`** (Curriculum Mapping) | **PROPOSED ENHANCEMENT / SRS APPENDIX A** | **HIGHLY RECOMMENDED.** Without this, subjects cannot be associated with a degree curriculum or target semester until an assessment is created. | Add to database design baseline as an explicit relational enhancement. |
| **`MentorNotes`** | **PROPOSED ENHANCEMENT** | **RECOMMENDED.** SCR-006 requires recording mentoring notes. In a real database, notes cannot live in volatile memory. | Add to database design baseline before Semester 4. |

---

## 14. Semester Boundary Blueprint

To maintain absolute software engineering discipline, project capabilities are strictly segregated across semesters:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ SEMESTER 3 (CURRENT BASELINE): Requirements, Design & Static Prototype    │
│ - COMPLETE: IEEE SRS v1.0, ERD, Data Dictionary, Synthetic Data (6.9k rows)│
│ - COMPLETE: 16 Screens wired, Git repo, Coding Standards                   │
│ - NEXT STEP: Rewire prototype analytics to dynamically aggregate data      │
│ - STRICTLY PROHIBITED: Real backend, FastAPI, PostgreSQL runtime, JWT, ML │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ SEMESTER 4 (NEXT PHASE): Core Web Application & Relational Persistence     │
│ - Set up FastAPI backend and PostgreSQL database with Alembic migrations   │
│ - Implement SQLAlchemy models including the 4 operational tables           │
│ - Implement real server-side JWT authentication, bcrypt hashing, and RBAC  │
│ - Implement real REST APIs (/api/v1/*) for CRUD and import staging         │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ SEMESTER 5: Analytics Engine & Longitudinal Aggregations                   │
│ - Integrate Pandas and NumPy for institutional cohort processing           │
│ - Implement automated alert dispatch for attendance shortages              │
│ - Implement closed-loop mentoring intervention tracking                    │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ SEMESTER 6+: Machine Learning Exploration & Explainability                 │
│ - Conduct data sufficiency quality audits                                  │
│ - Train baseline Scikit-learn Random Forest classifiers on historical data │
│ - Implement explainable AI / SHAP feature attributions                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. UX & Visual Design Principles

The visual and interaction design of SAAP adheres to the following standards:

1. **Information Density:** Designed for academic professionals who need dense, scannable data. Avoids bloated cards with excessive white space; uses compact, structured tables.
2. **Sober Color Palette:**
   - Primary: Deep slate navy (`#1e293b`, `#0f172a`) representing institutional stability.
   - Accents: Subdued indigo (`#4338ca`) for interactive elements.
   - Status Tokens: High-contrast, semantic colors (Success: `#059669`, Warning/Attention: `#d97706`, Danger/Risk: `#dc2626`).
3. **Tabular First:** Academic records are inherently relational. Tables feature fixed headers, right-aligned numeric data, monospace formatting for codes and IDs, and integrated search/pagination.
4. **Accessible Visualizations:** Charts in `Charts.jsx` use semantic SVG with explicit axis labels, units, baseline threshold markers, and accessible contrast ratios.
5. **Universal Decision Disclaimers:** Mandatory banners (`DisclaimerBanner.jsx`) appear on all analytical and advising screens to enforce Business Rule `BR-009`.

---

## 16. Anti-Vibe-Coding Rules

To maintain high professional standards and eliminate all traces of careless AI generation, the codebase must adhere to these sixteen (16) strict rules:

1. **Zero Fake Metrics:** Never display a number, pass rate, average, or percentage that is not calculated from underlying data.
2. **Zero Fake AI Language:** Eliminate phrases like "AI-powered prediction", "neural risk estimate", "smart AI insight". Use precise terms: "Heuristic Early-Warning Signal", "Statistical Score Distribution", "Continuous Evaluation Analysis".
3. **Zero Disconnected Dropdowns:** Every filter dropdown on screen must alter the data query and visually update the displayed charts and tables.
4. **Zero Gratuitous Gradients:** All UI surfaces must use flat, clean, solid borders (`1px solid var(--slate-200)`) and sober background tones.
5. **Zero Glassmorphism or 3D Shadows:** Prohibit frosted glass effects, floating cards, or excessive blurs.
6. **Zero Non-Functional Animations:** Animations are restricted to instantaneous state transitions (0.15s ease). No spinning or bouncing elements.
7. **Zero Placeholder Text:** Strictly maintain zero occurrences of "lorem ipsum", "coming soon", "sample dashboard", "placeholder text".
8. **Zero Third-Party Chart Bloat:** Retain lean, custom SVG chart implementations. Do not import heavy libraries (Recharts, Chart.js, D3) for simple bar and line charts.
9. **Zero Heavy CSS Frameworks:** Maintain the pure, semantic CSS design system in `src/index.css`. Do not install Tailwind, Bootstrap, or Material-UI.
10. **Zero Fabricated Precision:** Do not display decimals (e.g. `0.724`, `84.2%`) unless they are mathematically computed.
11. **Zero Repetitive Canned Personas:** Replace hardcoded student exhibits with dynamic queries that work for *any* student in the dataset.
12. **Explicit Sample Sizes:** Every chart and aggregate metric must state the underlying sample size (e.g. `Showing 62 Enrolled Students` or `Computed across 28 Mentees`).
13. **Distinguish Missing from Zero:** Never represent an unrecorded mark as `0.00`. Always display `NOT ENTERED` or `ABSENT`.
14. **Direct Architecture Over Multi-Layer Bloat:** Screens must query `dataService.js` directly without unnecessary mediator layers.
15. **Meaningful Empty States:** When search queries return zero results, always render a helpful empty state with instructions to clear filters.
16. **Strict Git Discipline:** Never use `git add .` without pre-commit status verification; never commit `node_modules` or build artifacts.

---

## 17. Master KEEP / MODIFY / REPLACE / REMOVE / ADD / FUTURE Matrix

```
┌────────────────────────────────────────────────────────────────────────────┐
│ MASTER ARCHITECTURAL ACTION MATRIX                                         │
└────────────────────────────────────────────────────────────────────────────┘

[KEEP]
├── data/synthetic/*.csv (13 Relational CSVs)
├── data/synthetic/generate_dataset.py & validate_dataset.py
├── data/import_templates/*.csv (4 Bulk Ingestion Templates)
├── src/screens/SCR001_Login.jsx
├── src/screens/SCR003_AcademicProfile.jsx
├── src/screens/SCR004_MarksAssessmentView.jsx
├── src/screens/SCR005_AttendanceView.jsx
├── src/screens/SCR009_DataImportCenter.jsx
├── src/screens/SCR010_ImportValidationResult.jsx
├── src/screens/SCR011_AcademicMasterData.jsx
├── src/screens/SCR012_UserManagement.jsx
├── src/screens/SCR015_Reports.jsx
├── src/screens/SCR016_AuditSystemHealth.jsx
├── src/components/common/Charts.jsx (Custom SVG Charts)
├── src/components/common/DisclaimerBanner.jsx & Forbidden403.jsx
├── src/index.css (Design System CSS)
├── scripts/build_prototype_data.py & verify_prototype.py
└── package.json & vite.config.js (Minimal Build Setup)

[MODIFY / RESTRUCTURE]
├── src/screens/SCR002_StudentDashboard.jsx -> Rewire subject bars & attendance to real data
├── src/screens/SCR006_MentorDashboard.jsx -> Rewire distribution charts to mentee data
├── src/screens/SCR013_InsightsRecommendations.jsx -> Replace 4 static items with heuristic engine
├── src/screens/SCR014_PredictionAnalytics.jsx -> Reframe as Sem-6 ML Governance Specification
└── src/data/dataService.js -> Implement dynamic aggregation queries across syntheticData.json

[REPLACE CONTENT]
├── src/screens/SCR007_FacultyAnalytics.jsx -> Replace static charts with dynamic course calculator
└── src/screens/SCR008_DepartmentAnalytics.jsx -> Replace static lines with dynamic cohort calculator

[REMOVE]
├── Hardcoded footnote on SCR-002: "Cohort Rank: Top 15% (Percentile: 88th)"
├── Hardcoded footnote on SCR-002: "▲ Trend: +0.25"
├── Hardcoded footnote on SCR-006: "Dept Baseline: 7.40 (+0.42)"
└── Fake telemetry pool card on SCR-016: "Pool: 18/20"

[ADD]
├── docs/product/final-product-architecture.md (This authoritative architecture blueprint)
├── docs/product/product-decision-log.md (Detailed architectural decision register)
└── Dynamic aggregation utilities in dataService.js (calculating real histograms & pass rates)

[FUTURE - SEMESTER 4+]
├── FastAPI REST API application (/api/v1/*)
├── PostgreSQL database schema & Alembic migrations
├── SQLAlchemy models including RolePermissions, FacultySubjectAllocations, ProgramSubjects
├── Server-side JWT authentication & bcrypt password hashing
├── Python Pandas / NumPy institutional analytics pipeline (Semester 5)
└── Scikit-learn ML training & evaluation pipeline (Semester 6)
```

---

## 18. Unresolved Institutional Decisions

The following three decisions cannot be resolved from the SRS alone and require human institutional confirmation:

1. **Undergraduate Visibility into Predictive Risk Indicators (SCR-014):**  
   *Question:* Should undergraduate students have access to risk meters and failure vulnerability indicators, or should predictive indicators be restricted to Mentors, Faculty, and Department Leadership to avoid student stress and anxiety?
2. **Formal Adoption of Four Operational Schema Tables:**  
   *Question:* Do you approve formally incorporating `RolePermissions`, `FacultySubjectAllocations`, `ProgramSubjects`, and `MentorNotes` into the database design baseline before Semester 4 migrations are drafted?
3. **Formalization of an Intervention Entity:**  
   *Question:* Should the system introduce an explicit `AcademicInterventions` entity in Semester 4/5 to track closed-loop counseling interactions, or should mentoring notes remain freeform text entries?

---

## 19. Proposed Semester-3 Prototype Direction

The final polish of the Semester 3 prototype will focus exclusively on **Data Grounding and Honest Analytics Wiring**:
1. Update `dataService.js` to compute real frequency histograms, course pass rates, and assessment averages directly from `syntheticData.json`.
2. Connect SCR-007 (Faculty Analytics) and SCR-008 (Department Analytics) so that selecting different subjects or cohorts instantly recalculates and renders genuine data visualizations.
3. Rewire SCR-002 (Student Dashboard) so subject bars and attendance points accurately match the logged-in student's empirical records.
4. Reposition SCR-014 as the ML Governance & Architecture Specification, replacing fake decimal scores with transparent, deterministic early-warning heuristics.
5. Ensure zero backend dependencies or Semester 4 code are introduced.

---

## 20. Proposed Semester-4 Transition Direction

Following the completion of the Semester 3 prototype, Semester 4 will execute the transition to a **Production Web Application**:
1. **Backend Initialization:** Initialize a FastAPI application structured with clean separation: `app/api/v1/`, `app/models/`, `app/schemas/`, `app/services/`, `app/core/security.py`.
2. **Database Migration:** Implement PostgreSQL schemas using Alembic migrations, incorporating all 27 SRS entities plus the four operational tables.
3. **Server-Side RBAC:** Implement JWT bearer token authentication, bcrypt password hashing, and dependency-injected data scoping (`WHERE student_id == :current_user_id`).
4. **Data Ingestion APIs:** Implement server-side streaming CSV parsers and validation pipelines for bulk student, marks, and attendance uploads.

---

**END OF PRODUCT ARCHITECTURE BLUEPRINT**
