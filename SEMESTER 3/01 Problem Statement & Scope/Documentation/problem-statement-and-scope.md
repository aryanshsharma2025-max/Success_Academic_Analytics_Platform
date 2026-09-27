# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Semester 3 — Step 1: Problem Statement & Scope Specification

**Document Reference:** `SAAP-DOC-PSS-001`  
**Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 1)  
**Authoritative Source:** IEEE SRS Version 1.0 (Sections 3, 4, 5, 8, 9, 12, 13, 30)  
**Standard:** IEEE 29148 (Adapted)  

---

### 1. Problem Statement

#### 1.1 Current Institutional Context (As-Is)
In conventional higher education institutions, academic performance data, internal assessment marks, continuous attendance registers, backlog records, and examination results are fragmented across disparate systems, physical files, and unstandardized departmental spreadsheets. 

This operational fragmentation introduces critical institutional challenges:
1. **Data Inconsistency & Silos:** Conflicting records across departments, lack of standardized identifiers, and unsynchronized data entries prevent a single source of academic truth.
2. **Delayed Intervention:** Student academic difficulties (such as chronic absenteeism or failing continuous assessment trends) are often identified only after terminal semester examinations, precluding timely remedial mentoring or academic advising.
3. **Manual Administrative Overhead:** Faculty and department administrators spend substantial effort manually collating, cross-referencing, and calculating grade metrics (SGPA/CGPA) and attendance percentages, increasing error rates.
4. **Lack of Transparent Decision-Support:** Academic leadership and department heads lack consolidated, timely analytical oversight into cohort progression, curriculum bottlenecks, cross-subject failure patterns, and institutional retention trends.

#### 1.2 Proposed System Solution (To-Be)
The **Success & Academic Analytics Platform (SAAP)** is a centralized, web-based academic analytics and decision-support platform. SAAP consolidates authorized academic records into a centralized, referentially sound relational database, validates all data entries through strict pre-commit validation rules, and converts validated data into role-scoped dashboards, longitudinal trends, descriptive analytics, and actionable early decision-support signals.

---

### 2. Product Vision & Evolution Blueprint

The long-term evolution of SAAP follows a rigorous, sequential data-to-intelligence continuum (SRS Section 5):

$$\text{DATA} \longrightarrow \text{INFORMATION} \longrightarrow \text{ANALYTICS} \longrightarrow \text{INSIGHTS} \longrightarrow \text{PREDICTION} \longrightarrow \text{RECOMMENDATION} \longrightarrow \text{INTELLIGENCE}$$

- **Semester 3 Focus:** Rigorous requirements engineering, relational database design, role-access boundaries, synthetic dataset generation, and basic clickable prototyping.
- **Semester 4 Focus:** Core web application implementation (FastAPI backend, PostgreSQL persistence, React frontend, RBAC enforcement, CRUD workflows).
- **Semester 5 Focus:** Core descriptive analytics, Pandas/NumPy integration, aggregation metrics, and interactive visualizations.
- **Semester 6 Focus:** Machine learning exploration and predictive models (strictly contingent upon authorized multi-cohort historical datasets).
- **Semester 7 Focus:** Recommendations, closed-loop mentoring workflows, and decision support.
- **Semester 8 Focus:** Capstone integration, governance, compliance auditing, and production readiness.

---

### 3. Project Scope Boundaries

#### 3.1 In-Scope Capabilities (Overall Platform Roadmap)
- **Student Academic Profiles:** Comprehensive tracking of student enrollment, degree progression, term results, and transcript history.
- **Marks & Assessments:** Subject-wise continuous internal assessments (Class Tests, Mid-Semesters, Practical Evaluations) and terminal semester examinations.
- **Attendance Monitoring:** Subject-level lecture attendance tracking, percentage calculation, and session buffer/deficit computation relative to configurable institutional baselines.
- **Academic Results & Progression:** Term SGPA, cumulative CGPA, active and cleared backlog tracking, and graduation eligibility verification.
- **Role-Scoped Decision-Support:** Role-tailored dashboards and analytics for Students, Mentors, Faculty, Department Users, and Academic Administrators.
- **Data Ingestion Governance:** Two-stage controlled data import with mandatory pre-commit schema, format, referential, and domain validation.
- **Security & Compliance Auditing:** Role-Based Access Control (RBAC), separation of administrative duties, and an append-only immutable audit ledger.

#### 3.2 Out-of-Scope (Semester 3 Explicit Boundaries)
In accordance with SRS Section 30, Semester 3 is strictly confined to **Requirements, Design, Synthetic Data, and Basic Prototyping**. The following capabilities are explicitly out-of-scope for Semester 3:
- Production backend runtime (FastAPI / Uvicorn).
- Production database engine (PostgreSQL / SQLite).
- Database migrations and ORM layers (Alembic / SQLAlchemy).
- Production authentication (bcrypt password hashing, JWT tokens, session cookies).
- Live machine learning models, scikit-learn pipelines, statistical probabilities, or automated predictions.
- Cloud hosting, Docker containers, or production server deployment.

---

### 4. Primary Stakeholders and User Classes

| Role | Classification | Primary Responsibility |
|---|---|---|
| **Student** (`ROL-001`) | Academic User | Inspect own verified marks, attendance buffers, SGPA/CGPA progression, and academic advisories. |
| **Mentor** (`ROL-002`) | Faculty Advisor | Monitor assigned mentee cohort, identify students requiring attention, and record formal mentoring consultation notes. |
| **Faculty** (`ROL-003`) | Instructional User | Enter and review component marks and session attendance for assigned subjects; inspect subject-level distribution metrics. |
| **Department User** (`ROL-004`) | Academic Leadership (HOD) | Review aggregate department pass rates, batch progression trajectories, and cross-subject curriculum bottlenecks. |
| **Academic Administrator** (`ROL-005`) | Operational Governance | Maintain academic master data (programs, terms, courses) and govern controlled batch data imports. |
| **Data Analyst** (`ROL-006`) | Analytical User | Develop, validate, and verify institutional analytical formulas and de-identified data extracts. |
| **ML Engineer** (`ROL-007`) | Technical Specialist | Design and evaluate future predictive model architectures (Semester 6). |
| **System Administrator** (`ROL-008`) | Infrastructure & Security | Manage user accounts, role mappings, and system security; monitor operational health and audit logs. |
| **Auditor / Viewer** (`ROL-009`) | Compliance Inspector | Conduct read-only regulatory inspections of immutable audit logs, user assignments, and compliance reports. |

---

### 5. Design Constraints & Operating Assumptions

1. **Phase Discipline:** Work completed in Semester 3 must serve as an authoritative, traceable baseline for subsequent semesters without requiring architectural rework.
2. **Data Privacy & Statutory Governance:** Student academic data constitutes protected personal information. Access must be strictly governed by the approved Role-Permission Matrix; students cannot inspect peer data, and department users cannot access student PII without authorization.
3. **Attendance Baseline Threshold:** The 75.0% attendance cutoff is recognized as an institutional design baseline assumption (configurable per institution/program), not an immutable universal statutory law.
4. **Zero Prediction Assumption:** Semester 3 design shall not assume operational AI/ML models. All early decision-support signals in Semester 3 must be transparent, deterministic, rule-based indicators.
