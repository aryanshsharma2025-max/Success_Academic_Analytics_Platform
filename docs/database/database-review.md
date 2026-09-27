# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Database Design & Integrity Review
**Document Reference:** `SAAP-DES-REV-001`  
**Project Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 4: ER Diagram and Database Design)  
**Source of Truth:** SAAP Software Requirements Specification (SRS) Version 1.0 (Section 18, Appendix A, Section 24, Section 25)  
**Review Target:** `docs/database/ERD.md` & `docs/database/database-design.md`  
**Status:** Design Review Baseline  

---

## 1. Executive Summary

This review assesses the logical database design of SAAP against the architectural, functional, security, and data integrity mandates in **SRS v1.0**. 

The design establishes a high-integrity PostgreSQL relational schema covering all 27 specified entities. In accordance with the prompt guidelines, this document systematically catalogs:
1. Requirements directly supported by the SRS.
2. Key architectural design decisions.
3. Ambiguities requiring institutional confirmation.
4. Potential referential integrity risks.
5. Normalization and derived data trade-offs.
6. Explicitly proposed additions to resolve relational gaps.

---

## 2. Review Sections

### A. Requirements Directly Supported by the SRS

1. **Entity Fidelity:** All 27 core database entities specified in SRS Section 18 are fully represented with their exact column names, recommended data types, and primary key structures.
2. **PostgreSQL Relational Engine:** Adheres to the recommended RDBMS specified in Section 11 and Section 18.
3. **Core Academic Hierarchy:** Faithfully implements the containment hierarchy defined in Appendix A:
   $$\text{Departments} \longrightarrow \text{Programs} \longrightarrow \text{Batches}$$
   $$\text{Programs} \longrightarrow \text{Semesters} \longleftarrow \text{AcademicYears}$$
4. **Student Academic Progress Tracking:** Directly supports student marks, assessments, attendance summaries, terminal semester results (SGPA/CGPA), and backlog incidents.
5. **Mentorship Subsystem:** Fully models mentor assignment validity periods (`MentorAssignments`) binding faculty user accounts to students.
6. **Controlled Import Staging:** Directly supports the multi-stage ingestion workflow (`ImportJobs` and `ImportErrors`) required by Section 19 and Business Rule `BR-005`.
7. **Security & Auditability:** Directly implements immutable system audit logs (`AuditLogs`) capturing actors, actions, affected entities, and outcomes (`BR-010`, Section 27).
8. **Decision-Support AI/ML Tracking:** Models the ML model registry (`MLModels`) and predictions (`Predictions`) linked directly to approved model versions (`BR-008`, `BR-009`).

---

### B. Design Decisions Required

1. **Primary Key Strategy (UUID vs. Sequential Integer):**
   - *SRS Specification:* Section 18 specifies `UUID PK` for transactional and academic tables, and `INT PK` for reference tables (`Roles`, `Permissions`).
   - *Design Decision:* Adopt UUID v4 for all entity PKs except `Roles` and `Permissions`. This prevents enumeration attacks (e.g., guessing `student_id` in URL parameters), supports offline synthetic data generation, and enables seamless distributed batch imports without primary key collision.
2. **Timestamp with Timezone Standardization:**
   - *SRS Specification:* Lists data types as `TIMESTAMP`.
   - *Design Decision:* In PostgreSQL implementation, all timestamp fields (`created_at`, `recorded_at`, `assigned_at`, `published_at`) must be defined as `TIMESTAMPTZ` (UTC). This guarantees deterministic sorting and accurate cross-session audit logging across institutional time zones.
3. **Soft Deletion vs. Hard Deletion on Master Data:**
   - *SRS Specification:* Defines `status VARCHAR(30)` on `Students`, `StudentEnrollments`, `BacklogRecords`, `ImportJobs`, `Recommendations`, `MLModels`, and `ReportJobs`.
   - *Design Decision:* For master entities lacking a status column (e.g., `Departments`, `Programs`, `Subjects`, `Users`), physical `DELETE` queries must be strictly prohibited if referenced by historical records (`ON DELETE RESTRICT`). Soft-deletion flags (`is_active` on `Users`) must govern user deactivation.
4. **Scope-Based Polymorphism in Snapshots and Insights:**
   - *SRS Specification:* `AnalyticsSnapshots` and `Insights` utilize `scope_type VARCHAR(50)` and `scope_id VARCHAR(100)`.
   - *Design Decision:* Retain this polymorphic pattern for flexibility across multi-level aggregations (Student, Batch, Department, Institution), with composite indexing on `(scope_type, scope_id)` to ensure dashboard response targets under 3 seconds (Section 26).

---

### C. Ambiguities Requiring Institutional Confirmation

The following ambiguities in the SRS database requirements must be formally confirmed before creating production migrations:

1. **Missing `RolePermissions` Junction Table:**
   - *Issue:* Section 18 lists `Roles` and `Permissions`, but provides no association table between them.
   - *Impact:* Without a junction table, permissions must either be hardcoded in application code or mapped implicitly. Dynamic permission assignments require a `RolePermissions` table.
   - *Status:* **Needs confirmation.**
2. **Lack of Direct Curriculum / Program-Subject Mapping:**
   - *Issue:* Section 18 does not define foreign keys on `Subjects` linking them to `Programs` or `Semesters`. Appendix A explicitly states: *"through curriculum mapping if implemented"*.
   - *Impact:* Currently, subjects are only associated with semesters transitively via `Assessments`, `AttendanceRecords`, and `BacklogRecords`. Before any assessment is created, the system cannot determine which subjects belong to a semester curriculum.
   - *Status:* **Needs confirmation.**
3. **Absence of Faculty-to-Subject Teaching Allocation Table:**
   - *Issue:* Business Rule `BR-003` mandates that faculty access be restricted to their "authorized academic scope." However, Section 18 contains no entity linking a faculty `user_id` to a `subject_id`, `semester_id`, and `batch_id`.
   - *Impact:* The database cannot verify whether a faculty member is authorized to submit marks or attendance for a particular subject section without this mapping.
   - *Status:* **Needs confirmation.**
4. **Student User Activation Decoupling (`Students.user_id` Nullability):**
   - *Issue:* `Students.user_id` is defined as `UUID FK NULL`.
   - *Impact:* This accommodates bulk CSV student imports before user accounts are created. However, the system must define who triggers user account creation (Academic Admin batch invite vs. System Admin provisioning).
   - *Status:* **Needs confirmation.**
5. **Cohort Predictions via Nullable `Predictions.student_id`:**
   - *Issue:* `Predictions.student_id` is defined as `UUID FK NULL`.
   - *Impact:* A NULL `student_id` indicates that predictions can evaluate aggregate cohorts (e.g., predicted batch failure rate). The schema must clarify what entities are targeted when `student_id` is NULL.
   - *Status:* **Needs confirmation.**
6. **Storage Mechanism for Mentor Interaction Notes:**
   - *Issue:* SCR-006 describes a UI widget to "Record mentoring notes where enabled," but Section 18 defines no `MentorNotes` entity.
   - *Impact:* Mentors cannot store historical advising records unless notes are stored as a column in `MentorAssignments` or an explicit entity is approved.
   - *Status:* **Needs confirmation.**

---

### D. Potential Referential Integrity Issues

1. **Independent Relational Vectors for Student Course Context:**
   - In `AttendanceRecords` and `BacklogRecords`, tables reference `(student_id, subject_id, semester_id)`.
   - In `StudentMarks`, the table references `(student_id, assessment_id)`.
   - *Risk:* There is no compound foreign key constraint enforcing that the `student_id` belongs to the `program_id` and `batch_id` associated with that `semester_id`. An erroneous import could insert attendance or marks for a student in a mechanical engineering subject while the student is enrolled in computer science.
   - *Mitigation:* Pre-import validation staging (Step 6 of Section 19 blueprint: *"Validate Academic Relationships"*) must validate cross-table academic context prior to database commit.
2. **Cascade Deletion Danger on Academic History:**
   - If a `Subject` or `Semester` is deleted, applying `ON DELETE CASCADE` would automatically purge student marks, results, and backlogs.
   - *Risk:* Catastrophic loss of permanent institutional transcripts, violating Business Rule `BR-007`.
   - *Mitigation:* `ON DELETE RESTRICT` or `ON DELETE NO ACTION` must be strictly configured on all core academic master entities.
3. **Cumulative Metric Desynchronization:**
   - `SemesterResults` stores terminal `sgpa` and `cgpa`.
   - *Risk:* If a student mark is corrected retroactively under `BR-007`, the stored `sgpa` and `cgpa` will become out of sync with the underlying marks unless a transactional recalculation routine updates all subsequent semester results.

---

### E. Potential Normalization Issues

1. **Denormalized `attendance_percentage` in `AttendanceRecords`:**
   - `attendance_percentage` is stored alongside `classes_held` and `classes_attended`.
   - *Issue:* Storing a derived calculation ($\frac{\text{classes\_attended}}{\text{classes\_held}} \times 100$) introduces potential update anomalies (2NF/3NF violation).
   - *Recommendation:* In PostgreSQL, this should ideally be implemented as a generated column (`GENERATED ALWAYS AS (ROUND((classes_attended::numeric / NULLIF(classes_held, 0)) * 100, 2)) STORED`) or computed in views to guarantee mathematical consistency.
2. **Denormalized `sgpa` and `cgpa` in `SemesterResults`:**
   - Grade point averages are mathematically derived from individual course grade points and credits.
   - *Justification:* Storing published SGPA/CGPA is an accepted enterprise standard in higher education to preserve the historical result at the moment of publication, protecting against changes caused by later curriculum credit modifications.
3. **Polymorphic Foreign Keys in `AnalyticsSnapshots` and `Insights`:**
   - `scope_type` and `scope_id` represent a polymorphic association.
   - *Issue:* Standard SQL cannot enforce foreign key constraints across multiple tables through a single column.
   - *Mitigation:* Integrity must be strictly governed by server-side validation during snapshot calculation.

---

### F. Proposed Additions (Explicitly Flagged)

To resolve the critical relational gaps identified above without violating the baseline SRS schema, the following four (4) additions are formally proposed for stakeholder consideration:

#### 1. Entity: `RolePermissions`
- **Classification:** **Proposed — not explicitly specified in SRS**
- **Purpose:** Implements Many-to-Many mapping between `Roles` and `Permissions`.
- **Proposed Schema:**
  - `role_id` INT NOT NULL FK $\rightarrow$ `Roles(role_id)` ON DELETE CASCADE
  - `permission_id` INT NOT NULL FK $\rightarrow$ `Permissions(permission_id)` ON DELETE CASCADE
  - `PRIMARY KEY (role_id, permission_id)`

#### 2. Entity: `FacultySubjectAllocations`
- **Classification:** **Proposed — not explicitly specified in SRS**
- **Purpose:** Enforces Business Rule `BR-003` (restricting faculty access to authorized academic scope).
- **Proposed Schema:**
  - `allocation_id` UUID PRIMARY KEY
  - `faculty_user_id` UUID NOT NULL FK $\rightarrow$ `Users(user_id)`
  - `subject_id` UUID NOT NULL FK $\rightarrow$ `Subjects(subject_id)`
  - `semester_id` UUID NOT NULL FK $\rightarrow$ `Semesters(semester_id)`
  - `batch_id` UUID NOT NULL FK $\rightarrow$ `Batches(batch_id)`
  - `academic_year_id` UUID NOT NULL FK $\rightarrow$ `AcademicYears(academic_year_id)`
  - `UNIQUE (faculty_user_id, subject_id, semester_id, batch_id)`

#### 3. Entity: `ProgramSubjects` (Curriculum Mapping)
- **Classification:** **Proposed — not explicitly specified in SRS** *(Noted in SRS Appendix A)*
- **Purpose:** Binds subjects to program curriculums and target semester numbers.
- **Proposed Schema:**
  - `program_subject_id` UUID PRIMARY KEY
  - `program_id` UUID NOT NULL FK $\rightarrow$ `Programs(program_id)`
  - `subject_id` UUID NOT NULL FK $\rightarrow$ `Subjects(subject_id)`
  - `semester_number` INT NOT NULL CHECK (`semester_number >= 1`)
  - `is_elective` BOOLEAN NOT NULL DEFAULT FALSE
  - `UNIQUE (program_id, subject_id, semester_number)`

#### 4. Entity: `MentorNotes`
- **Classification:** **Proposed — not explicitly specified in SRS**
- **Purpose:** Supports SCR-006 ("Record mentoring notes where enabled") with full timestamped auditability.
- **Proposed Schema:**
  - `note_id` UUID PRIMARY KEY
  - `assignment_id` UUID NOT NULL FK $\rightarrow$ `MentorAssignments(assignment_id)` ON DELETE CASCADE
  - `author_user_id` UUID NOT NULL FK $\rightarrow$ `Users(user_id)`
  - `note_text` TEXT NOT NULL
  - `created_at` TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP

---

## 3. Review Conclusion

The database design provides a robust, normalized, and enterprise-grade relational foundation for the SAAP platform that is completely faithful to the IEEE SRS v1.0. 

No production code, migrations, or database servers have been created. The design is now fully documented and ready for stakeholder sign-off before proceeding to UI wireframing or subsequent phases.
