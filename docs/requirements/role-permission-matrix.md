# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Role & Access Permission Matrix Specification
**Document Reference:** `SAAP-REQ-RAM-001`  
**Standard:** IEEE 29148 (Adapted) / Enterprise RBAC Standard  
**Project Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 3: Define Roles and Access Matrix)  
**Source of Truth:** SAAP Software Requirements Specification (SRS) Version 1.0 (September 2026)  
**Status:** Approved Baseline for Design Phase  

---

## 1. Purpose

The purpose of this document is to establish the authoritative **Role-Based Access Control (RBAC) and Access Matrix** for the Success & Academic Analytics Platform (SAAP). 

Based strictly on Section 10 (*User Classes and Roles*), Section 15 (*Functional Requirements*), Section 16 (*Module Specifications*), Section 17 (*User Interface Specifications*), Section 24 (*Business Rules*), and Section 25 (*Privacy and Security Requirements*) of the SAAP SRS v1.0, this document formally specifies:
1. The exact user roles supported by the platform.
2. The core responsibilities and operational boundaries of each role.
3. The comprehensive permission matrix mapping all platform capabilities to each role.
4. The mandatory data-scoping rules governing individual vs. aggregate data access.
5. The non-negotiable security, audit, and validation rules mandated by the SRS.
6. Explicit identification of unresolved permission ambiguities that require institutional confirmation before subsequent development phases.

This specification serves as the design contract for Step 4 (*ER Diagram and Database Design*), Step 5 (*UI Wireframes*), and subsequent backend API authorization middleware.

---

## 2. List of All User Roles

In strict adherence to **SRS Section 10 (User Classes and Roles)**, the platform defines exactly nine (9) primary user roles:

| Role Identifier | Role Name | System Category | Primary Actor Scope |
|---|---|---|---|
| **ROL-001** | **Student** | Academic End-User | Self-service individual student |
| **ROL-002** | **Mentor** | Academic Evaluator | Assigned mentee group |
| **ROL-003** | **Faculty** | Academic Instruction | Assigned subjects, sections & batches |
| **ROL-004** | **Department User** | Academic Oversight | Departmental programs & batches (Aggregates) |
| **ROL-005** | **Academic Administrator** | Academic Operations | Institution-wide academic structures & master data |
| **ROL-006** | **Data Analyst** | Analytics & Evaluation | Analytics algorithms, metrics & snapshots |
| **ROL-007** | **ML Engineer** | AI/ML Pipeline | Model artifacts, training & risk evaluation |
| **ROL-008** | **System Administrator** | Platform Operations | Security, accounts, roles & system infrastructure |
| **ROL-009** | **Auditor / Viewer** | Compliance & Governance | Read-only compliance, audit logs & system health |

---

## 3. Responsibility of Each Role

### 3.1 Student (`ROL-001`)
- **Primary Responsibility:** Monitors personal academic performance, attendance, semester progression, and credit standing.
- **SRS Scope (Section 10, FR-009, SCR-002):** Accesses only their own profile, subject-wise marks, attendance summaries, SGPA/CGPA trends, backlog status, evidence-linked insights, and academic recommendations.
- **Boundary Restriction (BR-001):** Strictly prohibited from accessing records, trends, or identifiers of other students.

### 3.2 Mentor (`ROL-002`)
- **Primary Responsibility:** Provides proactive student advising, identifies academic risk patterns, and conducts timely interventions for assigned mentees.
- **SRS Scope (Section 10, FR-010, SCR-006):** Accesses full permitted academic histories, attendance trends, assessment summaries, attention indicators, and decision-support alerts for officially assigned students (`MentorAssignments`). Records mentoring interaction notes where enabled.
- **Boundary Restriction (BR-002):** Prohibited from viewing student details outside assigned mentoring batches unless explicitly authorized.

### 3.3 Faculty (`ROL-003`)
- **Primary Responsibility:** Manages subject assessments, records internal marks, enters attendance metrics, and analyzes subject-level academic trends.
- **SRS Scope (Section 10, FR-005, FR-006, FR-011, SCR-007):** Accesses and enters marks/attendance for subjects and batches officially allocated to them. Analyzes score distributions, pass percentages, average trends, and performance bands within their instructional domain.
- **Boundary Restriction (BR-003):** Access is strictly restricted to authorized academic scope (subjects and sections mapped to the faculty member).

### 3.4 Department User (`ROL-004`)
- **Primary Responsibility:** Evaluates curriculum performance, monitors batch-level outcomes, analyzes cross-subject failure patterns, and assists in departmental planning.
- **SRS Scope (Section 10, FR-012, SCR-008):** Accesses batch performance aggregates, subject trends, semester comparisons, attendance distributions, backlog patterns, and department KPIs across programs belonging to their department.
- **Boundary Restriction (BR-004):** Department analytics use authorized aggregate scope. Prohibited from unconstrained institution-wide administrative actions or direct marks modification.

### 3.5 Academic Administrator (`ROL-005`)
- **Primary Responsibility:** Maintains institutional academic structures, executes official data import workflows, coordinates data validation, and enforces academic integrity.
- **SRS Scope (Section 10, FR-003, FR-004, FR-007, FR-008, SCR-009, SCR-010, SCR-011):** Manages academic master data (departments, programs, batches, semesters, subjects), student profile enrollments, semester result publications, and batch data imports (marks, attendance, results). Governs pre-import validation and transaction commits.
- **Boundary Restriction (BR-005, BR-007):** Must follow controlled correction rules for historical records; cannot bypass pre-import validation.

### 3.6 Data Analyst (`ROL-006`)
- **Primary Responsibility:** Configures analytics definitions, validates statistical KPI calculations, monitors descriptive trends, and ensures algorithmic correctness.
- **SRS Scope (Section 10, Section 20, FR-013):** Configures analytical snapshot routines, reviews metric definitions, evaluates insight generation heuristics, and analyzes aggregate trends across cohorts.
- **Boundary Restriction (BR-011, Section 25):** Operates on anonymized, de-identified, or aggregate analytics data; no unapproved access to student Personally Identifiable Information (PII).

### 3.7 ML Engineer (`ROL-007`)
- **Primary Responsibility:** Manages the machine learning lifecycle, conducts model evaluation, registers trained models, monitors prediction calibration, and documents explainability.
- **SRS Scope (Section 10, Section 21, FR-014, SCR-014, `/api/v1/models`):** Manages model registry (`MLModels`), reviews model metrics (precision, recall, F1, latency), verifies training splits, and triggers experimental/prototype prediction pipelines.
- **Boundary Restriction (BR-008, BR-009, Section 21.1):** ML development is conditional on validated historical data; all predictions remain decision-support indicators; models must be version-linked.

### 3.8 System Administrator (`ROL-008`)
- **Primary Responsibility:** Oversees technical platform infrastructure, authentication management, user account provisioning, role assignments, system health, and disaster recovery.
- **SRS Scope (Section 10, FR-001, FR-002, SCR-012, SCR-016, MOD-001, MOD-002, Section 28):** Creates and deactivates user accounts, assigns RBAC roles, configures security policies, monitors platform logs, and executes backup/restore operations.
- **Boundary Restriction:** Technical administrator role is segregated from academic data tampering. SysAdmins do not enter, alter, or certify student marks or grades.

### 3.9 Auditor / Viewer (`ROL-009`)
- **Primary Responsibility:** Conducts independent verification of academic operations, data changes, security compliance, and institutional reporting.
- **SRS Scope (Section 10, FR-017, SCR-016):** Read-only inspection of system audit logs (`AuditLogs`), data import records, export histories, user activity trails, and platform health telemetry.
- **Boundary Restriction:** Strictly read-only ("where explicitly granted"); zero create, update, delete, or commit privileges anywhere in the system.

---

## 4. Role-Permission Matrix

### 4.1 Permission Level Definitions
To prevent ambiguity, permission values are categorized with explicit granularity:

- **Manage:** Full operational authority within scope (Create, Read/View, Update, Archive/Delete, and Configure).
- **Create / Enter:** Ability to author and insert new transactional records.
- **View Own:** Read-only access restricted strictly to the authenticated user’s individual records.
- **View Assigned:** Read-only access restricted to students/records officially assigned to the user.
- **View Mapped Scope:** Read-only access restricted to subjects, sections, or programs assigned to the user.
- **View Aggregate:** Read-only access restricted to summarized, de-identified, or batch-level data.
- **View All:** Read-only access across the entire institutional catalog or module.
- **Import:** Ability to upload bulk data files into the staging/validation pipeline.
- **Export:** Ability to generate and download authorized reports (subject to audit logging).
- **No Access (`-`):** Explicit denial; neither UI navigation nor API execution permitted.
- **Not explicitly specified — confirmation required:** The SRS does not explicitly define this capability for this role; flagged for design confirmation.

---

### 4.2 Comprehensive Capability Access Matrix

| # | Functional Capability / Entity | Student | Mentor | Faculty | Department User | Academic Admin | Data Analyst | ML Engineer | System Admin | Auditor / Viewer |
|---|---|---|---|---|---|---|---|---|---|---|
| **1** | **User Authentication & Session** (FR-001) | Authenticate | Authenticate | Authenticate | Authenticate | Authenticate | Authenticate | Authenticate | Authenticate | Authenticate |
| **2** | **User Account Lifecycle** (FR-002, SCR-012) | - | - | - | - | Not explicitly specified — confirmation required | - | - | **Manage** | View (Audit only) |
| **3** | **Role & Permission Assignment** (FR-002) | - | - | - | - | - | - | - | **Manage** | View |
| **4** | **Academic Master Data** (FR-003, SCR-011) | View Enrolled | View Relevant | View Mapped | View Department | **Manage** | View (Meta) | View (Meta) | - | View |
| **5** | **Student Profile & Enrollment** (FR-004, SCR-003) | View Own | View Assigned | View Mapped Scope | Not explicitly specified — confirmation required | **Manage** | - | - | View (Account Link) | View |
| **6** | **Marks & Internal Assessments** (FR-005, SCR-004) | View Own | View Assigned | **Create / Update / View (Mapped)** | View Aggregate | **Manage / Import** | View Aggregate | Not explicitly specified — confirmation required | - | View |
| **7** | **Attendance Tracking** (FR-006, SCR-005) | View Own | View Assigned | **Create / Update / View (Mapped)** | View Aggregate | **Manage / Import** | View Aggregate | Not explicitly specified — confirmation required | - | View |
| **8** | **Semester Results & SGPA/CGPA** (FR-007, SCR-003) | View Own | View Assigned | Not explicitly specified — confirmation required | View Aggregate | **Manage / Import** | View Aggregate | Not explicitly specified — confirmation required | - | View |
| **9** | **Backlog Tracking & Clearance** (FR-007, SCR-002) | View Own | View Assigned | Not explicitly specified — confirmation required | View Aggregate | **Manage** | View Aggregate | - | - | View |
| **10** | **Data Import Upload (Staging)** (FR-008, SCR-009) | - | - | Import Marks/Att (Mapped) | - | **Import All** | - | - | - | - |
| **11** | **Import Validation Review** (FR-008, SCR-010) | - | - | View Mapped Validation | - | **Manage / Review** | - | - | - | View Logs |
| **12** | **Import Transaction Commit** (FR-008, BR-005) | - | - | Commit Mapped | - | **Commit All** | - | - | - | - |
| **13** | **Student Personal Dashboard** (FR-009, SCR-002) | **View Own** | - | - | - | View (Scoped) | - | - | - | - |
| **14** | **Mentor Dashboard & Alerts** (FR-010, SCR-006) | - | **View Assigned** | - | - | View All | - | - | - | - |
| **15** | **Mentor Notes Entry** (SCR-006) | - | **Create / Update** | - | - | Not explicitly specified — confirmation required | - | - | - | Not explicitly specified — confirmation required |
| **16** | **Faculty Analytics Dashboard** (FR-011, SCR-007) | - | - | **View Mapped** | - | View All | - | - | - | - |
| **17** | **Department Analytics Dashboard** (FR-012, SCR-008)| - | - | Not explicitly specified — confirmation required | **View Department** | View All | View Aggregate | - | - | View |
| **18** | **Academic Insights View** (FR-013, SCR-013) | View Own | View Assigned | View Mapped | View Department | View All | View All | View (Eval) | - | View |
| **19** | **Analytics Rules & Snapshots Config** (FR-013) | - | - | - | - | - | **Manage** | - | - | View |
| **20** | **Academic Recommendations View** (FR-015, SCR-013)| View Own | View Assigned | View Mapped | View Aggregate | View All | View All | - | - | View |
| **21** | **Recommendation Engine Config** (FR-015) | - | - | - | - | - | **Manage** | Not explicitly specified — confirmation required | - | - |
| **22** | **Prediction & Risk Indicator View** (FR-014, SCR-014)| View Own (Support) | View Assigned | View Mapped | View Aggregate | View All | View (Eval) | View (Eval) | - | View |
| **23** | **ML Model Lifecycle Management** (Section 21, `/api/v1/models`)| - | - | - | - | Not explicitly specified — confirmation required | View / Evaluate | **Manage** | Configure Infra | View |
| **24** | **Ad-hoc / Batch Report Export** (FR-016, SCR-015)| Export Own | Export Assigned | Export Mapped | Export Department | **Export Institutional** | Export Anonymized | Export Metrics | Export Admin | Export Audit |
| **25** | **Audit Log Inspection** (FR-017, SCR-016) | - | - | - | - | Not explicitly specified — confirmation required | - | - | **View All** | **View All** |
| **26** | **System Health Telemetry** (SCR-016, `/api/v1/health`)| - | - | - | - | - | - | - | **View / Manage** | View |
| **27** | **System & Security Configuration** (Section 10, 25)| - | - | - | - | - | - | - | **Manage** | - |
| **28** | **Database Backup & Recovery** (Section 28) | - | - | - | - | - | - | - | **Manage** | View Status |

---

## 5. Data-Scope Rules

In enterprise academic systems, a role assignment alone does not grant unrestricted data access. Permissions must intersect with strict **Data Scoping Rules** enforced server-side:

```
+-------------------------------------------------------------------------+
|                       DATA SCOPING HIERARCHY                            |
+-------------------------------------------------------------------------+
| Level 1: Platform & IT Scope         -> System Administrator, Auditor   |
| Level 2: Institutional Academic Scope-> Academic Administrator          |
| Level 3: Department Aggregate Scope  -> Department User, Data Analyst   |
| Level 4: Instructional Scope         -> Faculty (Mapped Subjects)       |
| Level 5: Mentorship Cohort Scope     -> Mentor (Assigned Students)      |
| Level 6: Self Scope                  -> Student (Own Record Only)       |
+-------------------------------------------------------------------------+
```

### 5.1 Student Scope (`ROL-001`)
- **Enforcement:** `WHERE student_id == :current_user_student_id`
- **Rule:** A student may access academic records, marks, attendance, results, insights, and recommendations belonging exclusively to their own verified identity.
- **Prohibition:** Cross-student query attempts must return an immediate authorization fault (`ERR-AUTHZ-001`) and trigger a security audit entry.

### 5.2 Mentor Scope (`ROL-002`)
- **Enforcement:** `WHERE student_id IN (SELECT student_id FROM MentorAssignments WHERE mentor_user_id == :current_user_id AND end_date IS NULL)`
- **Rule:** Mentors can inspect academic profiles, historical trends, marks, attendance, and risk indicators *only* for currently assigned mentees.
- **Prohibition:** Querying a student without an active mentor assignment is rejected.

### 5.3 Faculty Scope (`ROL-003`)
- **Enforcement:** `WHERE subject_id IN (SELECT subject_id FROM FacultySubjectAllocations WHERE faculty_user_id == :current_user_id)`
- **Rule:** Faculty members can input/edit marks, submit attendance, and view academic performance solely for the subjects, sections, and academic semesters assigned to them.
- **Prohibition:** Faculty cannot edit marks or attendance for subjects taught by other faculty members or alter student profile master data.

### 5.4 Department User Scope (`ROL-004`)
- **Enforcement:** `WHERE department_id == :current_user_department_id AND aggregate_level >= 'batch'`
- **Rule:** Department users (such as Heads of Department) view aggregated trends, pass/fail percentages, subject comparisons, and backlog counts within their department's degree programs.
- **Prohibition (BR-004):** Direct unaggregated student record modification or institutional configuration outside their department boundary.

### 5.5 Academic Administrator Scope (`ROL-005`)
- **Enforcement:** Institution-wide academic scope across all departments, programs, batches, and semesters.
- **Rule:** Governs master data tables (`Departments`, `Programs`, `Batches`, `Semesters`, `Subjects`), executes bulk ingestion pipelines (`ImportJobs`), and handles official grade corrections (`SemesterResults`).
- **Prohibition:** Cannot manipulate system infrastructure, database connection strings, or system user passwords.

### 5.6 Data Analyst Scope (`ROL-006`)
- **Enforcement:** Analytics snapshots, aggregated views, and de-identified data cubes.
- **Rule:** Manages analytical rules, snapshot jobs, and statistical baselines across the platform.
- **Prohibition:** Zero access to raw unmasked personal identifiers (contact details, passwords) without formal institutional clearance.

### 5.7 ML Engineer Scope (`ROL-007`)
- **Enforcement:** Machine learning model registry, evaluation benchmarks, and training pipeline artifacts.
- **Rule:** Full control over `MLModels`, hyperparameter records, and evaluation metrics (precision, recall, F1).
- **Prohibition:** Cannot directly alter academic grades, attendance, or publish unauthorized risk scores without an approved model.

### 5.8 System Administrator Scope (`ROL-008`)
- **Enforcement:** Platform IT layer (`Users`, `Roles`, `Permissions`, `AuditLogs`, `SystemHealth`).
- **Rule:** Oversees account provisioning, credential resets, role assignments, environment settings, and backups.
- **Prohibition:** Strictly barred from altering academic records (grades, marks, attendance) to prevent administrative tampering.

### 5.9 Auditor / Viewer Scope (`ROL-009`)
- **Enforcement:** Global read-only filter across audit and monitoring endpoints.
- **Rule:** Inspects security logs, data import histories, system telemetry, and export audit trails.
- **Prohibition:** Completely devoid of mutation (`POST`, `PUT`, `PATCH`, `DELETE`) endpoints.

---

## 6. Important Security & Access Rules

Strictly derived from **SRS Section 24 (Business Rules)** and **Section 25 (Privacy and Security Requirements)**:

### Rule 1: Server-Side RBAC Enforcement (BR-001, BR-002, BR-003, BR-004, Section 25)
- Access permissions and data-scope filters **must be enforced strictly on the server-side API layer** (via token inspection, dependency injection, and query parameter constraints).
- Client-side (React UI) view hiding is solely for user experience; the backend must independently reject any unauthorized request with `HTTP 403 Forbidden` (`ERR-AUTHZ-001`).

### Rule 2: Pre-Import Validation Gate (BR-005, BR-006, FR-008, Section 19)
- Academic data imports (CSV/XLSX) must pass a mandatory multi-stage validation pipeline (Schema -> Mandatory Fields -> Relational Integrity -> Value Ranges -> Duplicate Detection) before any database commit occurs.
- Invalid rows shall **never silently convert** to valid records (`BR-006`). A staging transaction cannot commit partially without explicit administrative override or validation resolution.

### Rule 3: Controlled Academic Record Corrections (BR-007)
- Historical academic records (published marks, SGPA/CGPA, attendance summaries) cannot be silently overwritten. Any retroactive modification must follow a controlled correction procedure that logs the actor, prior value, new value, timestamp, and justification in `AuditLogs`.

### Rule 4: Prediction & Recommendation Governance (BR-008, BR-009, Section 12, Section 21)
- Every prediction must reference an approved model version in `MLModels` (`BR-008`).
- Predictions and recommendations are strictly **decision-support indicators**, not guaranteed academic outcomes (`BR-009`, Section 12).
- Final academic decisions (e.g., detention, mentoring escalation, honors eligibility) remain under authorized human control.

### Rule 5: Sensitive Export Authorization & Audit (BR-010, FR-016, FR-017)
- Any export of student data or departmental performance reports must be checked against user role scope.
- Every export trigger must generate an immediate record in `AuditLogs` capturing `actor_user_id`, `report_type`, filter parameters, and timestamp.

### Rule 6: Data Minimization & Institutional Data Approval (BR-011, Section 12)
- Synthetic or anonymized datasets are mandatory for prototype development and initial testing.
- Processing real student data is strictly contingent upon institutional authorization.

---

## 7. Simple Visual Representations

### 7.1 Role vs. Operational Domain Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                  SAAP OPERATIONAL DOMAINS                                         |
+----------------------------------+----------------------------------+------------------------------+
|       ACADEMIC OPERATIONS        |      ANALYTICS & AI / ML         |   INFRASTRUCTURE & AUDIT     |
+----------------------------------+----------------------------------+------------------------------+
| - Academic Administrator (Lead)  | - Data Analyst (Analytics lead)  | - System Administrator (IT)  |
| - Faculty (Subject transactions) | - ML Engineer (Model lifecycle)  | - Auditor / Viewer (Inspect) |
| - Mentor (Cohort monitoring)     |                                  |                              |
| - Student (Self-monitoring)      |                                  |                              |
| - Department User (Aggregates)   |                                  |                              |
+----------------------------------+----------------------------------+------------------------------+
```

### 7.2 Data Import & Validation Control Flow

```
[ Academic Admin / Faculty ]
            │
            ▼
    [ Upload CSV/XLSX ]
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│               STAGING VALIDATION ENGINE                     │
│  - Verify file format (ERR-IMP-001)                         │
│  - Validate columns & data types                            │
│  - Check academic context (batch, subject, sem)             │
│  - Validate score ranges (0 to max_marks) (ERR-MRK-001)     │
│  - Check attendance values (ERR-ATT-001)                    │
│  - Check uniqueness & duplicates (ERR-DUP-001)              │
└─────────────────────────────┬───────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       [ Validation Errors ]          [ Validation Passed ]
               │                             │
       Display Error Summary          Admin Review & Commit
       (No DB Write)                         │
                                             ▼
                                     ┌────────────────┐
                                     │ Database Write │
                                     └───────┬────────┘
                                             │
                                     ┌───────▼────────┐
                                     │   Audit Log    │
                                     │ & Snapshots    │
                                     └────────────────┘
```

---

## 8. Open Questions & Ambiguities Requiring Institutional Confirmation

During analysis of SRS v1.0, the following specific access control edge cases were identified where the SRS is silent or ambiguous. In compliance with project guidelines, these have been marked as **"Not explicitly specified — confirmation required"** rather than invented:

1. **Department User Individual Student Drill-Down:**
   - *SRS Context:* SRS Section 10 and BR-004 explicitly specify that Department Users have "authorized batch/subject/department analytics" using "authorized aggregate scope."
   - *Ambiguity:* In practice, Heads of Department (HODs) frequently need to inspect individual profiles of high-risk or detained students. Does the Department User have permission to drill down from batch aggregates into an individual student's detailed profile, or are they strictly limited to de-identified aggregates?

2. **Student Direct Access to Machine Learning Risk Scores:**
   - *SRS Context:* SRS Section 10 states students see "own profile, marks, attendance, results, trends and authorized insights." Section 25 specifies "prediction access restricted to authorized roles."
   - *Ambiguity:* Does a Student have permission to see their raw ML risk probability score (e.g., "78% risk of backlog"), or is direct prediction access restricted to Mentors and Faculty, while students only see rule-based recommendations and trend charts to avoid student anxiety/demotivation?

3. **Cross-Subject Visibility for Instructional Faculty:**
   - *SRS Context:* SRS Section 10 and BR-003 state Faculty access is restricted to "authorized academic scope" and "authorized subject/student analytics."
   - *Ambiguity:* Can an instructor teaching Subject A view the overall CGPA, SGPA, or marks obtained by their enrolled students in Subject B to understand overall academic context, or are they restricted purely to marks and attendance within Subject A?

4. **Academic Administrator vs. System Administrator User Provisioning Boundary:**
   - *SRS Context:* FR-002 assigns "User and Role Management" to the System Administrator. FR-004 assigns "Student Profile Management" and program/batch assignment to the Academic Administrator.
   - *Ambiguity:* When new student batches are enrolled, does the Academic Administrator trigger automatic generation of user accounts, or must the System Administrator independently provision user login credentials?

5. **Confidentiality of Mentor Notes:**
   - *SRS Context:* SCR-006 includes a "Notes" component to "Record mentoring notes where enabled."
   - *Ambiguity:* Who has permission to read mentor interaction notes? Are they visible to the student, accessible only to the assigned mentor and HOD, or viewable by the Academic Administrator?

6. **ML Model Approval Authority:**
   - *SRS Context:* Section 21.2 defines the lifecycle: `Evaluation -> Review -> Approval -> Controlled Deployment`. FR-014 requires an "approved model."
   - *Ambiguity:* Which specific role possesses official authority to grant "Approval" for model deployment? Is it the Academic Administrator, a designated Data Science Lead, or an Institutional Ethics Committee?

---

## 9. Conclusion & Baseline Sign-Off

This document completes **Step 3 (Define Roles and Access Matrix)** of the Semester 3 development blueprint. It provides a formal, traceable, and secure role-access foundation for the Success & Academic Analytics Platform.

- **Next Phase:** Semester 3, Step 4 — *Create ER Diagram and Database Design*.
- **Implementation Note:** All permission codes and scope checks defined herein must be translated into database schema constraints (tables: `Roles`, `Permissions`, `UserRoles`, `MentorAssignments`) and FastAPI dependency security guards in subsequent development phases.
