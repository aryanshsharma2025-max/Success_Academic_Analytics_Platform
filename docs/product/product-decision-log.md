# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Product Architecture Decision Log
**Document Reference:** `SAAP-PRD-DEC-001`  
**Project Phase:** Semester 3 — Product Architecture & System Direction (Phase 1)  
**Author:** Lead Systems Architect & Product Engineering Team  
**Review Target:** Complete Architectural Baseline for SAAP  
**Status:** Approved Product Decision Baseline  

---

### Classification Legend
Every decision record in this log identifies its authoritative source:
- `[SRS]` — Mandated directly by the approved IEEE Software Requirements Specification v1.0.
- `[CURRENT IMPLEMENTATION]` — Derived from the existing Semester 3 code and documentation baseline.
- `[TECHNICAL OBSERVATION]` — Identified during the Phase 0 forensic audit as a technical necessity.
- `[PRODUCT RECOMMENDATION]` — Recommended by engineering to improve product coherence and usability.
- `[PROPOSED ENHANCEMENT]` — An extension beyond baseline SRS text to resolve operational gaps.
- `[INSTITUTIONAL DECISION]` — Requires formal confirmation from academic leadership/mentor.
- `[FUTURE]` — Strictly reserved for implementation in Semester 4, 5, 6, 7, or 8.

---

## Architectural Decision Records (ADRs)

### ADR-001: Adoption of Progressive Evolution Model
- **Decision:** The platform architecture shall strictly adhere to the sequential evolution model: $\text{DATA} \longrightarrow \text{INFORMATION} \longrightarrow \text{ANALYTICS} \longrightarrow \text{SIGNALS} \longrightarrow \text{HUMAN ACTION} \longrightarrow \text{OUTCOME}$. The Semester 3 prototype shall focus exclusively on Data, Information, Analytics, and Heuristic Early-Warning Signals.
- **Reason:** Rushing into premature predictive machine learning or automated decision-making without establishing verified underlying data models and descriptive analytics violates core systems engineering discipline and creates artificial "black box" demos.
- **Source:** `[SRS]` (Section 5, Section 30) & `[TECHNICAL OBSERVATION]`

---

### ADR-002: Strategic Reframing of SCR-014 (Elimination of Fake ML Artifacts)
- **Decision:** Reposition SCR-014 from an interface displaying mock floating-point predictions (`0.724`, `0.142`), fake latency (`42 ms`), and fake SHAP weights (`+0.34`, `-0.30`) to the **"Semester 6 ML Evolution Specification & Governance Blueprint"**. In the active prototype, predictive indicators shall be replaced with transparent, deterministic, rule-based baseline scores.
- **Reason:** The Phase 0 forensic audit revealed a critical perception risk: evaluators will perceive hardcoded floating-point weights as "fake AI" or misrepresent the project as having an operational ML pipeline. Real ML is scheduled for Semester 6; Semester 3 must maintain absolute scientific and academic integrity.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[TECHNICAL OBSERVATION]`

---

### ADR-003: Dynamic Data Rewiring for SCR-007 (Faculty Analytics)
- **Decision:** Replace the 100% hardcoded static score distribution histograms, pass rate (`88.3%`), and class average (`14.8/20`) on SCR-007 with dynamic JavaScript aggregation routines that compute metrics directly from `syntheticData.json` (`student_marks.csv`) whenever the faculty user selects a course.
- **Reason:** SCR-007 currently fails as an analytics tool because toggling between `CS301` and `CS202` produces zero change in charts or metrics. Real decision-support requires that selecting a subject dynamically displays its empirical score distribution.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[TECHNICAL OBSERVATION]`

---

### ADR-004: Dynamic Cohort Aggregation for SCR-008 (Department Analytics)
- **Decision:** Replace the static hardcoded batch progression lines and hardcoded summary numbers on SCR-008 with dynamic aggregations across all 200 synthetic students in `syntheticData.json`, comparing Batch 2023, 2024, and 2025 across departments.
- **Reason:** Department heads need to evaluate actual batch performance differences. Static numbers prevent meaningful analysis of curriculum bottlenecks or cross-subject failure patterns.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[TECHNICAL OBSERVATION]`

---

### ADR-005: Grounding SCR-002 (Student Dashboard) in Real Marks & Attendance
- **Decision:** Eliminate hardcoded subject comparison bars and static monthly attendance points on SCR-002. Dynamically calculate the logged-in student's continuous marks and attendance across their enrolled subjects, and add an explicit "Session Buffer to 75%" compliance indicator.
- **Reason:** The dashboard must answer the student's primary question: *"Which specific subject is close to the 75% attendance detention threshold, and exactly how many lectures can I afford to miss?"*
- **Source:** `[PRODUCT RECOMMENDATION]` & `[SRS]` (FR-009)

---

### ADR-006: Deterministic Rule-Based Engine for SCR-013 (Academic Advisories)
- **Decision:** Replace the static 4-element array in `insightsData` with a deterministic rule evaluation function in `dataService.js` that scans the student population and generates real, evidence-backed advisories based on configurable institutional thresholds (e.g. Attendance < 75%, SGPA drop > 1.0, active backlogs).
- **Reason:** Generates realistic, scalable insights across all 200 students rather than relying on two canned persona exhibits ("Aryan Verma" and "Aryansh Sharma").
- **Source:** `[PRODUCT RECOMMENDATION]` & `[SRS]` (FR-013, FR-015)

---

### ADR-007: Retention of Two-Stage Ingestion Pipeline (SCR-009 / SCR-010)
- **Decision:** Retain and defend the two-stage staging and gated commit model implemented in SCR-009 and SCR-010. Commits remain strictly blocked until pre-commit validation reports are generated and reviewed.
- **Reason:** Business Rules `BR-005` and `BR-006` explicitly forbid uncontrolled bulk data writes. SCR-010 serves as an exemplary operational model for higher education data governance.
- **Source:** `[SRS]` (FR-008, Section 19, BR-005, BR-006) & `[CURRENT IMPLEMENTATION]`

---

### ADR-008: Adoption of Schema Entity `RolePermissions`
- **Decision:** Incorporate the `RolePermissions` junction table into the database architecture baseline prior to drafting Semester 4 migrations.
- **Reason:** SRS Section 18 specifies `Roles` and `Permissions` as independent tables with no association table. Dynamic server-side RBAC authorization middleware in FastAPI cannot operate without a Many-to-Many junction entity.
- **Source:** `[TECHNICAL OBSERVATION]` & `[PROPOSED ENHANCEMENT]`

---

### ADR-009: Adoption of Schema Entity `FacultySubjectAllocations`
- **Decision:** Incorporate `FacultySubjectAllocations` into the database architecture baseline to link faculty user accounts (`user_id`) to assigned courses (`subject_id`), academic terms (`semester_id`), and cohorts (`batch_id`).
- **Reason:** Business Rule `BR-003` mandates that faculty access be restricted to their "authorized academic scope." Without this mapping table, the database cannot enforce instructional boundaries.
- **Source:** `[TECHNICAL OBSERVATION]` & `[SRS]` (BR-003 Inferred)

---

### ADR-010: Adoption of Schema Entity `ProgramSubjects` (Curriculum Mapping)
- **Decision:** Incorporate `ProgramSubjects` into the database architecture baseline to associate subjects with degree programs and target semester numbers.
- **Reason:** Without an explicit curriculum mapping table, subjects exist in isolation; the system cannot identify which subjects belong to a degree syllabus until an assessment or mark is recorded.
- **Source:** `[TECHNICAL OBSERVATION]` & `[SRS]` (Appendix A Inferred)

---

### ADR-011: Adoption of Schema Entity `MentorNotes`
- **Decision:** Incorporate `MentorNotes` into the database architecture baseline to persist advising consultation notes linked to `MentorAssignments`.
- **Reason:** SCR-006 mandates that mentors record consultation notes. In a persistent database (Semester 4), these notes cannot exist only in volatile React memory.
- **Source:** `[TECHNICAL OBSERVATION]` & `[SRS]` (SCR-006, FR-010)

---

### ADR-012: Deferral of Full Case-Management Entity to Semester 4/5
- **Decision:** Do not implement a complex `InterventionCases` multi-stage workflow entity in Semester 3. Support advising notes in SCR-006 and action status flags in SCR-013 using the current schema baseline. Design the closed-loop intervention workflow conceptually for implementation in Semester 4/5.
- **Reason:** The original SRS v1.0 does not specify a full case-management entity. Adding it now would violate the Semester 3 scope boundary.
- **Source:** `[SRS]` (Scope Boundary) & `[FUTURE]`

---

### ADR-013: Preservation of Zero Third-Party Dependency Rule
- **Decision:** Strictly forbid the addition of third-party charting libraries (Recharts, Chart.js), CSS frameworks (Tailwind, Bootstrap), or icon fonts. Retain custom semantic SVG charts in `Charts.jsx` and pure CSS in `index.css`.
- **Reason:** Maintains an ultra-lean repository footprint, total architectural control, instant Vite build times (1.6s), zero package security vulnerabilities, and high accessibility compliance.
- **Source:** `[TECHNICAL OBSERVATION]` & `[CURRENT IMPLEMENTATION]`

---

### ADR-014: Analytical Visualization Constraints
- **Decision:** All analytical charts must enforce explicit axis labels, measurement units (e.g. `%`, `Marks / 20`, `SGPA`), statutory threshold markers (e.g. 75% red line), and explicit sample size tags (e.g. `n = 62`).
- **Reason:** Eliminates decorative, ungrounded graphs and reinforces the platform's purpose as an institutional decision-support system.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[SRS]` (Section 20)

---

### ADR-015: Retention of Client-Side Router and Role Switcher for Semester 3
- **Decision:** Retain the custom hash router (`RouterContext.jsx`) and the 1-click Prototype Role Simulator for the Semester 3 prototype. Replace with server-side JWT authentication in Semester 4.
- **Reason:** Enables evaluators to effortlessly explore all nine user roles without managing mock database passwords, while preserving deep-linking capabilities.
- **Source:** `[CURRENT IMPLEMENTATION]` & `[FUTURE]`

---

### ADR-016: Strict Segregation of Academic vs. System Administration
- **Decision:** Maintain rigid separation of duties between Academic Administrator (`ROL-005`) and System Administrator (`ROL-008`). SysAdmins manage user accounts and security, but cannot alter grades. Academic Admins govern master data and grade publications, but cannot manage infrastructure.
- **Reason:** Core enterprise software security principle; prevents technical staff from tampering with official student academic transcripts.
- **Source:** `[SRS]` (Section 10, Section 25)

---

### ADR-017: Mandatory Universal Disclaimer Banner (BR-009)
- **Decision:** Render `DisclaimerBanner.jsx` prominently across all predictive, advisory, and early-intervention screens (SCR-002, SCR-006, SCR-013, SCR-014).
- **Reason:** Strictly enforces Business Rule `BR-009`: predictive indicators are statistical decision-support aids and do not replace formal human evaluation or institutional policies.
- **Source:** `[SRS]` (BR-009, Section 12)

---

### ADR-018: Strict Semester 3 Phase Boundary
- **Decision:** Zero server-side code (FastAPI), zero database migrations (Alembic), zero production authentication (bcrypt/JWT), and zero machine learning models (scikit-learn) shall be introduced during Semester 3.
- **Reason:** Adheres strictly to the semester-by-semester development plan mandated by the university and IEEE SRS.
- **Source:** `[SRS]` (Section 30)

---

### ADR-019: Real CSV Generation in SCR-015 (Reports)
- **Decision:** Enhance SCR-015 in the prototype to generate real client-side downloadable CSV blobs for official transcripts, attendance audits, and audit ledger extracts.
- **Reason:** Replaces fake browser alerts with functional artifact delivery, proving end-to-end report generation capability.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[SRS]` (FR-016)

---

### ADR-020: Policy on Undergraduate Visibility into Predictive Risk Indicators
- **Decision:** Undergraduate students (`ROL-001`) shall have access to actionable attendance buffers, marks breakdowns, and evidence-backed advisories (SCR-002, SCR-013), but quantitative failure probability meters and risk classifier scorecards (SCR-014) shall be restricted to Mentors, Faculty, and Department Leadership.
- **Reason:** Prevents undue psychological stress, defeatism, or algorithmic anxiety among struggling students, while empowering mentors with the data needed to intervene constructively. Flagged for institutional confirmation.
- **Source:** `[PRODUCT RECOMMENDATION]` & `[INSTITUTIONAL DECISION]`

---

## Phase 2 Implementation Status (Prototype Grounding Complete)

| ADR Identifier | Decision Summary | Phase 2 Execution Status | Target Component(s) |
|---|---|:---:|---|
| **ADR-001** | Progressive Evolution Model | **Enforced** | Platform-wide (Data $\rightarrow$ Information $\rightarrow$ Analytics $\rightarrow$ Signals) |
| **ADR-002** | Reframing of SCR-014 (Purge ML Theater) | **Implemented** | `SCR014_PredictionAnalytics.jsx`, `dataService.js` |
| **ADR-003** | Dynamic Data Rewiring for Faculty Analytics | **Implemented** | `SCR007_FacultyAnalytics.jsx`, `dataService.js` |
| **ADR-004** | Dynamic Aggregation for Department Analytics | **Implemented** | `SCR008_DepartmentAnalytics.jsx`, `dataService.js` |
| **ADR-005** | Grounding Student Dashboard & Attendance Buffers | **Implemented** | `SCR002_StudentDashboard.jsx`, `dataService.js` |
| **ADR-006** | Deterministic Rule-Based Academic Attention Signals | **Implemented** | `SCR013_InsightsRecommendations.jsx`, `dataService.js` |
| **ADR-007** | Two-Stage Ingestion Pipeline Retention | **Preserved** | `SCR009_DataImportCenter.jsx`, `SCR010_ImportValidationResult.jsx` |
| **ADR-008 – 011** | Proposed Semester 4 Database Extensions | **Preserved for Sem 4** | Documented in schema baseline; no runtime schema modification |
| **ADR-013** | Zero Third-Party Dependency Rule | **Maintained** | Strictly React, React-DOM, and Vite. Zero new packages added. |
| **ADR-014** | Analytical Visualization Constraints | **Enforced** | Units, sample tags, and threshold lines rendered across all charts |
| **ADR-017** | Mandatory Universal Disclaimer Banner | **Rendered** | `DisclaimerBanner.jsx` active across SCR-002, SCR-006, SCR-007, SCR-008, SCR-013, SCR-014, SCR-015 |
| **ADR-019** | Real Client-Side CSV Generation | **Operational** | `exportDataToCSV` active across SCR-006, SCR-008, SCR-015, SCR-016 |

---

**END OF PRODUCT DECISION LOG**

