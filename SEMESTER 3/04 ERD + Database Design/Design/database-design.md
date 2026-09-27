# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Logical Database Design Specification
**Document Reference:** `SAAP-DES-DBD-001`  
**Project Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 4: ER Diagram and Database Design)  
**Source of Truth:** SAAP Software Requirements Specification (SRS) Version 1.0 (Section 18, 19, 24, 25)  
**Target RDBMS:** PostgreSQL 15+ (Relational Design Baseline)  
**Status:** Approved Design Baseline  

---

## 1. Architectural Guidelines & Schema Conventions

1. **Identifier Strategy:**
   - Transactional, organizational, and dynamic entities utilize universally unique identifiers (`UUID`) as Primary Keys to facilitate decoupled ingestion, distributed analytics, and secure non-sequential references.
   - Fixed, static enumeration and reference catalogs (`Roles`, `Permissions`) utilize standard serial integers (`INT`) for compact index performance.
2. **Naming Conventions:**
   - Table names use `PascalCase` matching the exact entity names in SRS Section 18.
   - Column names use `snake_case` matching the attributes specified in the SRS.
3. **Temporal Tracking:**
   - Timestamps default to UTC timestamp with timezone (`TIMESTAMPTZ` or `TIMESTAMP` in SRS specification) to guarantee reliable audit trails.
4. **Data Integrity Enforcement:**
   - Foreign key integrity is mandated for all direct relationships. Cascade rules are defined conservative (`RESTRICT` / `NO ACTION` on core master and historical data; `CASCADE` on transient errors/junction records).
   - Domain constraints (`CHECK` constraints) are applied where explicitly dictated by business rules in SRS Section 19 (`Validation Area`) and Section 23 (`Validation and Error Handling`).

---

## 2. Security and RBAC Module Tables

### 2.1 Table: `Users`
- **Purpose:** Stores authenticated user identity, login credentials, and account lifecycle state.
- **Primary Key:** `user_id` (UUID)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `user_id` | UUID | NOT NULL | PRIMARY KEY | Unique surrogate identifier for platform user account |
  | `username` | VARCHAR(50) | NOT NULL | UNIQUE | Unique system login name |
  | `email` | VARCHAR(100) | NOT NULL | UNIQUE | Institutional or contact email address |
  | `password_hash` | VARCHAR(255) | NOT NULL | - | Secure hashed password string (SRS Section 25) |
  | `is_active` | BOOLEAN | NOT NULL | DEFAULT TRUE | Account state (TRUE = active, FALSE = suspended/inactive) |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
- **Check Constraints:** None explicitly specified in SRS.
- **Relationships:**
  - One-to-Many with `UserRoles` (user account to assigned roles).
  - One-to-Zero-or-One with `Students` (optional user login mapping).
  - One-to-Many with `MentorAssignments` (as `mentor_user_id`).
  - One-to-Many with `ImportJobs` (as `uploaded_by`).
  - One-to-Many with `ReportJobs` (as `requested_by`).
  - One-to-Many with `AuditLogs` (as `actor_user_id`).

---

### 2.2 Table: `Roles`
- **Purpose:** Catalogs authorized system roles supported by the platform (e.g., Student, Mentor, Faculty, etc.).
- **Primary Key:** `role_id` (INT)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `role_id` | INT | NOT NULL | PRIMARY KEY | Unique integer role code |
  | `role_name` | VARCHAR(50) | NOT NULL | UNIQUE | Standard role title matching SRS Section 10 |
  | `description` | VARCHAR(255) | NULL | - | Functional role scope summary |
- **Relationships:**
  - One-to-Many with `UserRoles` (role mapping to users).

---

### 2.3 Table: `Permissions`
- **Purpose:** Defines granular operational permission tokens (e.g., `MARKS_IMPORT`, `ATTENDANCE_VIEW`).
- **Primary Key:** `permission_id` (INT)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `permission_id` | INT | NOT NULL | PRIMARY KEY | Unique integer permission identifier |
  | `permission_code` | VARCHAR(100) | NOT NULL | UNIQUE | Programmatic permission string |
- **Relationships:**
  - Defined as a standalone catalog in SRS Section 18. *(Note: Linking `Roles` to `Permissions` requires the proposed `RolePermissions` junction table; see `database-review.md`)*.

---

### 2.4 Table: `UserRoles`
- **Purpose:** Junction table implementing Many-to-Many association between users and roles.
- **Primary Key:** Composite `(user_id, role_id)` or surrogate; logical PK is `(user_id, role_id)`.
- **Foreign Keys:**
  - `user_id` $\rightarrow$ `Users(user_id)` ON DELETE CASCADE
  - `role_id` $\rightarrow$ `Roles(role_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `user_id` | UUID | NOT NULL | FK to Users | Authenticated user account |
  | `role_id` | INT | NOT NULL | FK to Roles | Role granted to user |
  | `assigned_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Audit timestamp when role was granted |
- **Relationships:**
  - Resolves Many-to-Many relationship between `Users` and `Roles`.

---

## 3. Academic Master Data Module Tables

### 3.1 Table: `Departments`
- **Purpose:** Represents institutional academic departments (e.g., Department of Computer Science & Engineering).
- **Primary Key:** `department_id` (UUID)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `department_id` | UUID | NOT NULL | PRIMARY KEY | Unique department identifier |
  | `department_name`| VARCHAR(150) | NOT NULL | - | Full department title |
  | `code` | VARCHAR(30) | NOT NULL | UNIQUE | Unique departmental abbreviation code (e.g., "CSE") |
- **Relationships:**
  - One-to-Many with `Programs` (department offers degree programs).

---

### 3.2 Table: `Programs`
- **Purpose:** Represents formal academic degree programs (e.g., B.Tech in CSE).
- **Primary Key:** `program_id` (UUID)
- **Foreign Keys:**
  - `department_id` $\rightarrow$ `Departments(department_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `program_id` | UUID | NOT NULL | PRIMARY KEY | Unique degree program identifier |
  | `department_id` | UUID | NOT NULL | FK to Departments | Parent department offering the degree |
  | `program_name` | VARCHAR(150) | NOT NULL | - | Formal program name |
  | `code` | VARCHAR(30) | NOT NULL | - | Program code (e.g., "BT-CSE") |
- **Check Constraints:** None explicitly in SRS.
- **Relationships:**
  - Many-to-One with `Departments`.
  - One-to-Many with `Batches`.
  - One-to-Many with `Semesters`.
  - One-to-Many with `StudentEnrollments`.

---

### 3.3 Table: `Batches`
- **Purpose:** Defines student admission cohorts/intakes within a program (e.g., "2024–2028").
- **Primary Key:** `batch_id` (UUID)
- **Foreign Keys:**
  - `program_id` $\rightarrow$ `Programs(program_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `batch_id` | UUID | NOT NULL | PRIMARY KEY | Unique batch identifier |
  | `program_id` | UUID | NOT NULL | FK to Programs | Program to which this batch belongs |
  | `batch_name` | VARCHAR(50) | NOT NULL | - | Descriptive cohort name (e.g., "Batch 2024") |
  | `admission_year` | INT | NOT NULL | - | Year of intake (e.g., 2024) |
- **Check Constraints:**
  - `CHECK (admission_year >= 2000)` (Supported by Section 19 context).
- **Relationships:**
  - Many-to-One with `Programs`.
  - One-to-Many with `StudentEnrollments`.

---

### 3.4 Table: `AcademicYears`
- **Purpose:** Defines the institutional calendar academic year (e.g., "2026–2027").
- **Primary Key:** `academic_year_id` (UUID)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `academic_year_id`| UUID | NOT NULL | PRIMARY KEY | Unique academic year identifier |
  | `year_label` | VARCHAR(20) | NOT NULL | - | Descriptive calendar label (e.g., "2026-27") |
  | `start_date` | DATE | NOT NULL | - | Official start date of academic session |
  | `end_date` | DATE | NOT NULL | - | Official end date of academic session |
- **Check Constraints:**
  - `CHECK (start_date < end_date)` (SRS Section 19: Valid academic period).
- **Relationships:**
  - One-to-Many with `Semesters`.

---

### 3.5 Table: `Semesters`
- **Purpose:** Represents specific terms of instruction within a degree program.
- **Primary Key:** `semester_id` (UUID)
- **Foreign Keys:**
  - `program_id` $\rightarrow$ `Programs(program_id)` ON DELETE RESTRICT
  - `academic_year_id` $\rightarrow$ `AcademicYears(academic_year_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `semester_id` | UUID | NOT NULL | PRIMARY KEY | Unique semester term identifier |
  | `program_id` | UUID | NOT NULL | FK to Programs | Academic degree program context |
  | `semester_number`| INT | NOT NULL | - | Ordinal semester number (1 to 8/10) |
  | `academic_year_id`| UUID | NOT NULL | FK to AcademicYears| Session term schedule |
- **Check Constraints:**
  - `CHECK (semester_number >= 1 AND semester_number <= 12)`
- **Unique Constraints:**
  - Recommended candidate key: `UNIQUE (program_id, semester_number, academic_year_id)`.
- **Relationships:**
  - Many-to-One with `Programs` and `AcademicYears`.
  - One-to-Many with `Assessments`, `AttendanceRecords`, `SemesterResults`, `BacklogRecords`.

---

### 3.6 Table: `Subjects`
- **Purpose:** Master catalog of educational courses/subjects offered across degrees.
- **Primary Key:** `subject_id` (UUID)
- **Foreign Keys:** None in SRS Section 18.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `subject_id` | UUID | NOT NULL | PRIMARY KEY | Unique course/subject identifier |
  | `subject_code` | VARCHAR(30) | NOT NULL | UNIQUE | Institutional subject code (e.g., "CS301") |
  | `subject_name` | VARCHAR(200) | NOT NULL | - | Full title of the course |
  | `credits` | DECIMAL(4,1) | NOT NULL | - | Academic credits assigned (e.g., 4.0, 3.5) |
- **Check Constraints:**
  - `CHECK (credits > 0.0)`
- **Relationships:**
  - One-to-Many with `Assessments`.
  - One-to-Many with `AttendanceRecords`.
  - One-to-Many with `BacklogRecords`.

---

## 4. Student and Mentorship Module Tables

### 4.1 Table: `Students`
- **Purpose:** Authoritative registry of student personal and institutional identity.
- **Primary Key:** `student_id` (UUID)
- **Foreign Keys:**
  - `user_id` $\rightarrow$ `Users(user_id)` ON DELETE SET NULL (Nullable)
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `student_id` | UUID | NOT NULL | PRIMARY KEY | Internal surrogate primary key |
  | `institutional_identifier`| VARCHAR(50)| NOT NULL | UNIQUE | Official college roll number / university PRN |
  | `user_id` | UUID | NULL | UNIQUE | Link to user authentication account |
  | `full_name` | VARCHAR(150) | NOT NULL | - | Complete legal student name |
  | `status` | VARCHAR(30) | NOT NULL | - | Academic status (e.g., "ACTIVE", "DETENTION", "ALUMNI") |
- **Relationships:**
  - Zero-or-One to One with `Users`.
  - One-to-Many with `StudentEnrollments`.
  - One-to-Many with `MentorAssignments`.
  - One-to-Many with `StudentMarks`.
  - One-to-Many with `AttendanceRecords`.
  - One-to-Many with `SemesterResults`.
  - One-to-Many with `BacklogRecords`.
  - One-to-Many with `Predictions`.

---

### 4.2 Table: `StudentEnrollments`
- **Purpose:** Tracks student progression and registration under specific degree programs and cohorts.
- **Primary Key:** `enrollment_id` (UUID)
- **Foreign Keys:**
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
  - `program_id` $\rightarrow$ `Programs(program_id)` ON DELETE RESTRICT
  - `batch_id` $\rightarrow$ `Batches(batch_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `enrollment_id` | UUID | NOT NULL | PRIMARY KEY | Unique enrollment transaction identifier |
  | `student_id` | UUID | NOT NULL | FK to Students | Enrolled student reference |
  | `program_id` | UUID | NOT NULL | FK to Programs | Academic degree program |
  | `batch_id` | UUID | NOT NULL | FK to Batches | Cohort batch assignment |
  | `status` | VARCHAR(30) | NOT NULL | - | Enrollment status (e.g., "ENROLLED", "TRANSFERRED") |
- **Relationships:**
  - Many-to-One with `Students`, `Programs`, `Batches`.

---

### 4.3 Table: `MentorAssignments`
- **Purpose:** Maintains official faculty-to-student advising relationships over time.
- **Primary Key:** `assignment_id` (UUID)
- **Foreign Keys:**
  - `mentor_user_id` $\rightarrow$ `Users(user_id)` ON DELETE RESTRICT
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `assignment_id` | UUID | NOT NULL | PRIMARY KEY | Unique assignment identifier |
  | `mentor_user_id`| UUID | NOT NULL | FK to Users | Faculty user account acting as mentor |
  | `student_id` | UUID | NOT NULL | FK to Students | Student assigned to mentor |
  | `start_date` | DATE | NOT NULL | - | Effective date of mentorship |
  | `end_date` | DATE | NULL | - | Date mentorship ended (NULL indicates active) |
- **Check Constraints:**
  - `CHECK (end_date IS NULL OR start_date <= end_date)`
- **Relationships:**
  - Enforces Business Rule `BR-002` (Mentors access only assigned students).

---

## 5. Assessments, Marks, Attendance & Results Module Tables

### 5.1 Table: `Assessments`
- **Purpose:** Catalogs individual assessment events and evaluation components.
- **Primary Key:** `assessment_id` (UUID)
- **Foreign Keys:**
  - `subject_id` $\rightarrow$ `Subjects(subject_id)` ON DELETE RESTRICT
  - `semester_id` $\rightarrow$ `Semesters(semester_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `assessment_id` | UUID | NOT NULL | PRIMARY KEY | Unique assessment component identifier |
  | `subject_id` | UUID | NOT NULL | FK to Subjects | Course being evaluated |
  | `semester_id` | UUID | NOT NULL | FK to Semesters | Term in which assessment is administered |
  | `assessment_type`| VARCHAR(50) | NOT NULL | - | Evaluation category (e.g., "CLASS_TEST_1", "MID_SEM", "END_SEM")|
  | `max_marks` | DECIMAL(7,2)| NOT NULL | - | Maximum achievable score (e.g., 20.00, 100.00) |
- **Check Constraints:**
  - `CHECK (max_marks > 0.00)`
- **Relationships:**
  - Many-to-One with `Subjects` and `Semesters`.
  - One-to-Many with `StudentMarks`.

---

### 5.2 Table: `StudentMarks`
- **Purpose:** Stores individual student scores achieved in specific assessments.
- **Primary Key:** `student_mark_id` (UUID)
- **Foreign Keys:**
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
  - `assessment_id` $\rightarrow$ `Assessments(assessment_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `student_mark_id`| UUID | NOT NULL | PRIMARY KEY | Unique mark record identifier |
  | `student_id` | UUID | NOT NULL | FK to Students | Student receiving the score |
  | `assessment_id` | UUID | NOT NULL | FK to Assessments| Specific assessment evaluated |
  | `marks_obtained`| DECIMAL(7,2)| NOT NULL | - | Numeric marks scored |
  | `recorded_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Audit timestamp when marks were submitted |
- **Check Constraints:**
  - `CHECK (marks_obtained >= 0.00)` (SRS Section 23 `ERR-MRK-001`).
- **Unique Constraints:**
  - `UNIQUE (student_id, assessment_id)` (A student receives exactly one score per assessment component).
- **Relationships:**
  - Many-to-One with `Students` and `Assessments`.

---

### 5.3 Table: `AttendanceRecords`
- **Purpose:** Stores cumulative attendance summaries per student per subject per semester.
- **Primary Key:** `attendance_id` (UUID)
- **Foreign Keys:**
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
  - `subject_id` $\rightarrow$ `Subjects(subject_id)` ON DELETE RESTRICT
  - `semester_id` $\rightarrow$ `Semesters(semester_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `attendance_id` | UUID | NOT NULL | PRIMARY KEY | Unique attendance entry identifier |
  | `student_id` | UUID | NOT NULL | FK to Students | Student whose attendance is logged |
  | `subject_id` | UUID | NOT NULL | FK to Subjects | Subject attended |
  | `semester_id` | UUID | NOT NULL | FK to Semesters | Academic term context |
  | `classes_held` | INT | NOT NULL | - | Total number of conducted sessions |
  | `classes_attended`| INT | NOT NULL | - | Sessions attended by student |
  | `attendance_percentage`| DECIMAL(5,2)| NOT NULL | - | Computed attendance ratio ($0.00$ to $100.00$) |
- **Check Constraints:**
  - `CHECK (classes_held >= 0)`
  - `CHECK (classes_attended >= 0)`
  - `CHECK (classes_attended <= classes_held)`
  - `CHECK (attendance_percentage >= 0.00 AND attendance_percentage <= 100.00)` (SRS Section 23 `ERR-ATT-001`).
- **Unique Constraints:**
  - `UNIQUE (student_id, subject_id, semester_id)` (One aggregate attendance row per student-course-term).
- **Relationships:**
  - Many-to-One with `Students`, `Subjects`, and `Semesters`.

---

### 5.4 Table: `SemesterResults`
- **Purpose:** Official record of terminal semester grade performance, SGPA, CGPA, and completion status.
- **Primary Key:** `result_id` (UUID)
- **Foreign Keys:**
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
  - `semester_id` $\rightarrow$ `Semesters(semester_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `result_id` | UUID | NOT NULL | PRIMARY KEY | Unique result publication identifier |
  | `student_id` | UUID | NOT NULL | FK to Students | Candidate student |
  | `semester_id` | UUID | NOT NULL | FK to Semesters | Term evaluated |
  | `sgpa` | DECIMAL(4,2)| NOT NULL | - | Semester Grade Point Average (0.00–10.00) |
  | `cgpa` | DECIMAL(4,2)| NOT NULL | - | Cumulative Grade Point Average (0.00–10.00) |
  | `result_status` | VARCHAR(30) | NOT NULL | - | Official outcome (e.g., "PASS", "FAIL", "ATKT") |
  | `published_at` | TIMESTAMP | NOT NULL | - | Date/time results were officially released |
- **Check Constraints:**
  - `CHECK (sgpa >= 0.00 AND sgpa <= 10.00)`
  - `CHECK (cgpa >= 0.00 AND cgpa <= 10.00)` (SRS Section 19: Valid configured numeric range).
- **Unique Constraints:**
  - `UNIQUE (student_id, semester_id)`
- **Relationships:**
  - Many-to-One with `Students` and `Semesters`.

---

### 5.5 Table: `BacklogRecords`
- **Purpose:** Tracks active and historical subject backlogs per student.
- **Primary Key:** `backlog_id` (UUID)
- **Foreign Keys:**
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE
  - `subject_id` $\rightarrow$ `Subjects(subject_id)` ON DELETE RESTRICT
  - `semester_id` $\rightarrow$ `Semesters(semester_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `backlog_id` | UUID | NOT NULL | PRIMARY KEY | Unique backlog incident identifier |
  | `student_id` | UUID | NOT NULL | FK to Students | Student holding backlog |
  | `subject_id` | UUID | NOT NULL | FK to Subjects | Subject failed |
  | `semester_id` | UUID | NOT NULL | FK to Semesters | Semester in which the failure occurred |
  | `status` | VARCHAR(30) | NOT NULL | - | Status (e.g., "ACTIVE", "CLEARED") |
  | `cleared_at` | DATE | NULL | - | Date the backlog was cleared in re-exam |
- **Check Constraints:**
  - `CHECK (status != 'CLEARED' OR cleared_at IS NOT NULL)`
- **Relationships:**
  - Many-to-One with `Students`, `Subjects`, and `Semesters`.

---

## 6. Data Import and Ingestion Module Tables

### 6.1 Table: `ImportJobs`
- **Purpose:** Manages the controlled staging and ingestion pipeline for bulk file uploads.
- **Primary Key:** `import_job_id` (UUID)
- **Foreign Keys:**
  - `uploaded_by` $\rightarrow$ `Users(user_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `import_job_id` | UUID | NOT NULL | PRIMARY KEY | Unique upload transaction tracking job |
  | `data_type` | VARCHAR(50) | NOT NULL | - | Target domain ("STUDENTS", "MARKS", "ATTENDANCE", "RESULTS")|
  | `uploaded_by` | UUID | NOT NULL | FK to Users | User performing the upload |
  | `status` | VARCHAR(30) | NOT NULL | - | Job state ("UPLOADED", "VALIDATED", "FAILED", "COMMITTED") |
  | `total_rows` | INT | NOT NULL | DEFAULT 0 | Total rows parsed from uploaded file |
  | `valid_rows` | INT | NOT NULL | DEFAULT 0 | Count of rows passing pre-import validation |
  | `invalid_rows` | INT | NOT NULL | DEFAULT 0 | Count of rows failing validation checks |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Job submission timestamp |
- **Check Constraints:**
  - `CHECK (total_rows >= 0 AND valid_rows >= 0 AND invalid_rows >= 0)`
  - `CHECK (valid_rows + invalid_rows <= total_rows)`
- **Relationships:**
  - Many-to-One with `Users`.
  - One-to-Many with `ImportErrors`.

---

### 6.2 Table: `ImportErrors`
- **Purpose:** Stores specific field- and row-level diagnostic rejection reasons during data staging.
- **Primary Key:** `import_error_id` (UUID)
- **Foreign Keys:**
  - `import_job_id` $\rightarrow$ `ImportJobs(import_job_id)` ON DELETE CASCADE
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `import_error_id`| UUID | NOT NULL | PRIMARY KEY | Unique diagnostic entry identifier |
  | `import_job_id` | UUID | NOT NULL | FK to ImportJobs | Parent batch ingestion job |
  | `row_number` | INT | NOT NULL | - | Exact spreadsheet row index containing error |
  | `field_name` | VARCHAR(100)| NOT NULL | - | Column name violating validation rule |
  | `error_message` | TEXT | NOT NULL | - | Specific diagnostic explanation (e.g., "Marks > max_marks")|
- **Relationships:**
  - Many-to-One with `ImportJobs`.

---

## 7. Analytics, Insights, Recommendations & AI/ML Module Tables

### 7.1 Table: `AnalyticsSnapshots`
- **Purpose:** Stores precomputed analytical metrics, trends, and aggregations across multiple scopes.
- **Primary Key:** `snapshot_id` (UUID)
- **Foreign Keys:** None (Uses polymorphic `scope_type` and `scope_id`).
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `snapshot_id` | UUID | NOT NULL | PRIMARY KEY | Unique snapshot record identifier |
  | `scope_type` | VARCHAR(50) | NOT NULL | - | Scope level (e.g., "STUDENT", "BATCH", "DEPARTMENT") |
  | `scope_id` | VARCHAR(100)| NOT NULL | - | Target scope entity identifier (e.g., student_id, batch_id)|
  | `metric_name` | VARCHAR(100)| NOT NULL | - | Metric name (e.g., "PASS_RATE_TREND", "COHORT_PERCENTILE")|
  | `metric_value` | JSONB | NOT NULL | - | Structured analytical payload / time-series data |
  | `calculated_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Calculation execution timestamp |
- **Relationships:**
  - Standalone analytical cache table referenced by dashboards (`MOD-009`, `MOD-010`, `MOD-011`, `MOD-012`).

---

### 7.2 Table: `Insights`
- **Purpose:** Stores evidence-backed analytical observations generated by statistical analysis rules.
- **Primary Key:** `insight_id` (UUID)
- **Foreign Keys:** None (Polymorphic `scope_type` and `scope_id`).
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `insight_id` | UUID | NOT NULL | PRIMARY KEY | Unique insight entry identifier |
  | `scope_type` | VARCHAR(50) | NOT NULL | - | Observation scope (e.g., "STUDENT", "MENTOR", "SUBJECT")|
  | `scope_id` | VARCHAR(100)| NOT NULL | - | Identifier of the entity observed |
  | `title` | VARCHAR(255)| NOT NULL | - | Understandable observation headline |
  | `evidence` | JSONB | NOT NULL | - | Supporting numerical metrics and trends (`FR-013`) |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Insight generation timestamp |
- **Relationships:**
  - One-to-Many with `Recommendations`.

---

### 7.3 Table: `Recommendations`
- **Purpose:** Prescriptive academic decision-support suggestions tied directly to analytical insights.
- **Primary Key:** `recommendation_id` (UUID)
- **Foreign Keys:**
  - `insight_id` $\rightarrow$ `Insights(insight_id)` ON DELETE CASCADE
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `recommendation_id`| UUID | NOT NULL | PRIMARY KEY | Unique recommendation identifier |
  | `insight_id` | UUID | NOT NULL | FK to Insights | Root insight providing justification |
  | `recommendation_text`| TEXT | NOT NULL | - | Actionable academic advice |
  | `status` | VARCHAR(30) | NOT NULL | DEFAULT 'NEW' | Workflow state (e.g., "NEW", "VIEWED", "ACTIONED") |
- **Relationships:**
  - Many-to-One with `Insights`.

---

### 7.4 Table: `MLModels`
- **Purpose:** Registry of machine learning models, versions, evaluation metrics, and operational lifecycle state.
- **Primary Key:** `model_id` (UUID)
- **Foreign Keys:** None.
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `model_id` | UUID | NOT NULL | PRIMARY KEY | Unique model registry identifier |
  | `model_name` | VARCHAR(100)| NOT NULL | - | Formal model designation (e.g., "AtRiskClassifier") |
  | `version` | VARCHAR(50) | NOT NULL | - | Semantic version string (e.g., "v1.2.0") |
  | `status` | VARCHAR(30) | NOT NULL | - | Lifecycle state ("EXPERIMENTAL", "APPROVED", "RETIRED")|
  | `metrics` | JSONB | NOT NULL | - | Offline evaluation metrics (Precision, Recall, F1, AUC) |
- **Unique Constraints:**
  - `UNIQUE (model_name, version)`
- **Relationships:**
  - One-to-Many with `Predictions`.

---

### 7.5 Table: `Predictions`
- **Purpose:** Stores model-generated academic risk scores, probabilities, and explainability factors.
- **Primary Key:** `prediction_id` (UUID)
- **Foreign Keys:**
  - `model_id` $\rightarrow$ `MLModels(model_id)` ON DELETE RESTRICT
  - `student_id` $\rightarrow$ `Students(student_id)` ON DELETE CASCADE (Nullable)
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `prediction_id` | UUID | NOT NULL | PRIMARY KEY | Unique prediction record identifier |
  | `student_id` | UUID | NULL | FK to Students | Evaluated student (NULL for cohort aggregate models) |
  | `model_id` | UUID | NOT NULL | FK to MLModels | Approved model generating prediction (`BR-008`) |
  | `prediction_type`| VARCHAR(100)| NOT NULL | - | Nature of prediction (e.g., "BACKLOG_RISK", "DETENTION_RISK")|
  | `score` | DECIMAL(8,5)| NOT NULL | - | Numerical probability / risk index |
  | `explanation` | JSONB | NULL | - | Explainability factors / feature importance weights |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Inference timestamp |
- **Check Constraints:**
  - `CHECK (score >= 0.00000 AND score <= 1.00000)` (When representing probabilities).
- **Relationships:**
  - Many-to-One with `MLModels`.
  - Many-to-Zero-or-One with `Students`.

---

## 8. Reporting, Audit and System Administration Module Tables

### 8.1 Table: `ReportJobs`
- **Purpose:** Tracks asynchronous report export generation requests, filters, and output artifact states.
- **Primary Key:** `report_job_id` (UUID)
- **Foreign Keys:**
  - `requested_by` $\rightarrow$ `Users(user_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `report_job_id` | UUID | NOT NULL | PRIMARY KEY | Unique export job identifier |
  | `requested_by` | UUID | NOT NULL | FK to Users | User requesting report export |
  | `report_type` | VARCHAR(100)| NOT NULL | - | Report classification (e.g., "DEPARTMENT_SUMMARY_PDF")|
  | `status` | VARCHAR(30) | NOT NULL | - | Generation status ("PENDING", "COMPLETED", "FAILED") |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Request timestamp |
- **Relationships:**
  - Many-to-One with `Users`. Enforces Business Rule `BR-010` (Sensitive exports authorized and audited).

---

### 8.2 Table: `AuditLogs`
- **Purpose:** Immutable audit ledger recording privileged actions, administrative updates, and security events.
- **Primary Key:** `audit_id` (UUID)
- **Foreign Keys:**
  - `actor_user_id` $\rightarrow$ `Users(user_id)` ON DELETE RESTRICT
- **Columns & Data Types:**
  | Column Name | Data Type | Nullable | Constraints & Defaults | Business Description |
  |---|---|---|---|---|
  | `audit_id` | UUID | NOT NULL | PRIMARY KEY | Unique audit entry identifier |
  | `actor_user_id` | UUID | NOT NULL | FK to Users | Account identity performing the action |
  | `action` | VARCHAR(100)| NOT NULL | - | Action name (e.g., "LOGIN", "IMPORT_COMMIT", "RECORD_UPDATE")|
  | `entity_type` | VARCHAR(100)| NOT NULL | - | Affected table or entity (e.g., "StudentMarks", "Users")|
  | `entity_id` | VARCHAR(100)| NOT NULL | - | Primary key identifier of the modified record |
  | `result` | VARCHAR(30) | NOT NULL | - | Outcome status ("SUCCESS", "FAILURE", "DENIED") |
  | `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Immutable event timestamp |
- **Relationships:**
  - Many-to-One with `Users`. Implements SRS Section 27 (`Logging, Audit and Monitoring`).
