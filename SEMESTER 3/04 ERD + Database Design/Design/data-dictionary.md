# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Data Dictionary Specification
**Document Reference:** `SAAP-DES-DD-001`  
**Project Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 4: ER Diagram and Database Design)  
**Source of Truth:** SAAP Software Requirements Specification (SRS) Version 1.0 (Section 18, 19, 23, 24, 25)  
**Status:** Approved Design Baseline  

---

## 1. Overview

This document provides the definitive **Data Dictionary** for the 27 database entities specified in **SRS Section 18 (*Database Requirements*)**. Each field is documented with its physical type, nullability, relational key status, permitted value constraints, and formal business definition.

Where the SRS does not explicitly define specific allowed value sets or business defaults, the field is explicitly flagged as **"Needs confirmation."** to prevent arbitrary schema invention.

---

## 2. Comprehensive Data Dictionary Tables

### 2.1 Table: `Users`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `user_id` | UUID | NOT NULL | PRIMARY KEY | Unique surrogate identifier for a system user | Valid UUID v4 | Specified in SRS |
| `username` | VARCHAR(50) | NOT NULL | UNIQUE | Unique alphanumeric login username | Alphanumeric, max 50 chars | Specified in SRS |
| `email` | VARCHAR(100) | NOT NULL | UNIQUE | Institutional or primary contact email | Valid email format | Specified in SRS |
| `password_hash` | VARCHAR(255) | NOT NULL | - | Cryptographic hash of the user password | Argon2id / bcrypt string | Specified in SRS |
| `is_active` | BOOLEAN | NOT NULL | DEFAULT TRUE | Indicates if the user account is active or disabled | `TRUE`, `FALSE` | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Audit timestamp when account was registered | Valid timestamp | Specified in SRS |

---

### 2.2 Table: `Roles`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `role_id` | INT | NOT NULL | PRIMARY KEY | Unique integer identifier for system role | Positive integer | Specified in SRS |
| `role_name` | VARCHAR(50) | NOT NULL | UNIQUE | Formal designation of the role | `Student`, `Mentor`, `Faculty`, `Department User`, `Academic Administrator`, `Data Analyst`, `ML Engineer`, `System Administrator`, `Auditor/Viewer` | Specified in SRS |
| `description` | VARCHAR(255) | NULL | - | Human-readable explanation of role responsibility | Text, max 255 chars | Specified in SRS |

---

### 2.3 Table: `Permissions`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `permission_id` | INT | NOT NULL | PRIMARY KEY | Unique integer identifier for a permission token | Positive integer | Specified in SRS |
| `permission_code` | VARCHAR(100)| NOT NULL | UNIQUE | Programmatic code used in API access checks | String (e.g., `MARKS_IMPORT`, `PROFILE_VIEW`) | Exact naming taxonomy needs confirmation. |

---

### 2.4 Table: `UserRoles`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `user_id` | UUID | NOT NULL | FK $\rightarrow$ `Users.user_id` | User account granted the role | Valid existing `Users.user_id` | Specified in SRS |
| `role_id` | INT | NOT NULL | FK $\rightarrow$ `Roles.role_id` | Role assigned to the user | Valid existing `Roles.role_id` | Specified in SRS |
| `assigned_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Timestamp when role assignment was made | Valid timestamp | Specified in SRS |

---

### 2.5 Table: `Departments`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `department_id` | UUID | NOT NULL | PRIMARY KEY | Unique departmental identifier | Valid UUID | Specified in SRS |
| `department_name` | VARCHAR(150)| NOT NULL | - | Full official name of academic department | String, max 150 chars | Specified in SRS |
| `code` | VARCHAR(30) | NOT NULL | UNIQUE | Short institutional department code | String (e.g., `CSE`, `MECH`, `ECE`) | Specified in SRS |

---

### 2.6 Table: `Programs`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `program_id` | UUID | NOT NULL | PRIMARY KEY | Unique degree program identifier | Valid UUID | Specified in SRS |
| `department_id` | UUID | NOT NULL | FK $\rightarrow$ `Departments.department_id` | Department offering the degree program | Valid existing `Departments.department_id` | Specified in SRS |
| `program_name` | VARCHAR(150)| NOT NULL | - | Full title of the academic program | String (e.g., `B.Tech Computer Science & Engineering`) | Specified in SRS |
| `code` | VARCHAR(30) | NOT NULL | - | Short program code | String (e.g., `BT-CSE`) | Specified in SRS |

---

### 2.7 Table: `Batches`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `batch_id` | UUID | NOT NULL | PRIMARY KEY | Unique cohort batch identifier | Valid UUID | Specified in SRS |
| `program_id` | UUID | NOT NULL | FK $\rightarrow$ `Programs.program_id` | Degree program to which the batch belongs | Valid existing `Programs.program_id` | Specified in SRS |
| `batch_name` | VARCHAR(50) | NOT NULL | - | Descriptive cohort name | String (e.g., `Batch 2024-2028`) | Specified in SRS |
| `admission_year` | INT | NOT NULL | - | Calendar year of student matriculation | Integer $\ge 2000$ | Specified in SRS |

---

### 2.8 Table: `AcademicYears`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `academic_year_id`| UUID | NOT NULL | PRIMARY KEY | Unique academic calendar year identifier | Valid UUID | Specified in SRS |
| `year_label` | VARCHAR(20) | NOT NULL | - | Institutional year display label | String (e.g., `2026-2027`) | Specified in SRS |
| `start_date` | DATE | NOT NULL | - | Official commencement date of session | Valid date | Specified in SRS |
| `end_date` | DATE | NOT NULL | - | Official conclusion date of session | Valid date ($> \text{start\_date}$) | Specified in SRS |

---

### 2.9 Table: `Semesters`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `semester_id` | UUID | NOT NULL | PRIMARY KEY | Unique semester term identifier | Valid UUID | Specified in SRS |
| `program_id` | UUID | NOT NULL | FK $\rightarrow$ `Programs.program_id` | Program offering this semester | Valid existing `Programs.program_id` | Specified in SRS |
| `semester_number` | INT | NOT NULL | - | Ordinal term sequence number | Integer $1$ to $12$ | Specified in SRS |
| `academic_year_id`| UUID | NOT NULL | FK $\rightarrow$ `AcademicYears.academic_year_id` | Calendar academic year context | Valid existing `AcademicYears.academic_year_id` | Specified in SRS |

---

### 2.10 Table: `Subjects`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `subject_id` | UUID | NOT NULL | PRIMARY KEY | Unique subject/course identifier | Valid UUID | Specified in SRS |
| `subject_code` | VARCHAR(30) | NOT NULL | UNIQUE | Official curriculum subject code | String (e.g., `CS301`, `MA101`) | Specified in SRS |
| `subject_name` | VARCHAR(200)| NOT NULL | - | Complete title of the subject | String, max 200 chars | Specified in SRS |
| `credits` | DECIMAL(4,1)| NOT NULL | - | Assigned academic credits | Decimal $> 0.0$ (e.g., `4.0`, `1.5`) | Specified in SRS |

---

### 2.11 Table: `Students`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `student_id` | UUID | NOT NULL | PRIMARY KEY | System surrogate primary key for student | Valid UUID | Specified in SRS |
| `institutional_identifier`| VARCHAR(50)| NOT NULL| UNIQUE | College enrollment / PRN / roll number | String, max 50 chars | Specified in SRS |
| `user_id` | UUID | NULL | FK $\rightarrow$ `Users.user_id` (UNIQUE) | Associated login account (NULL before invite) | Valid existing `Users.user_id` | Specified in SRS |
| `full_name` | VARCHAR(150)| NOT NULL | - | Legal full name of student | String, max 150 chars | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Academic standing of student | Values like `ACTIVE`, `INACTIVE`, `DETENTION`, `ALUMNI` (Exact vocabulary needs confirmation.) | Specified in SRS |

---

### 2.12 Table: `StudentEnrollments`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `enrollment_id` | UUID | NOT NULL | PRIMARY KEY | Unique student enrollment transaction ID | Valid UUID | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student being enrolled | Valid existing `Students.student_id` | Specified in SRS |
| `program_id` | UUID | NOT NULL | FK $\rightarrow$ `Programs.program_id` | Degree program enrolled into | Valid existing `Programs.program_id` | Specified in SRS |
| `batch_id` | UUID | NOT NULL | FK $\rightarrow$ `Batches.batch_id` | Cohort batch enrolled into | Valid existing `Batches.batch_id` | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Lifecycle status of enrollment record | Values like `ENROLLED`, `COMPLETED`, `WITHDRAWN` (Needs confirmation.) | Specified in SRS |

---

### 2.13 Table: `MentorAssignments`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `assignment_id` | UUID | NOT NULL | PRIMARY KEY | Unique mentorship assignment record ID | Valid UUID | Specified in SRS |
| `mentor_user_id`| UUID | NOT NULL | FK $\rightarrow$ `Users.user_id` | Faculty member assigned as mentor | Valid existing `Users.user_id` | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student assigned to mentor | Valid existing `Students.student_id` | Specified in SRS |
| `start_date` | DATE | NOT NULL | - | Official date assignment took effect | Valid date | Specified in SRS |
| `end_date` | DATE | NULL | - | Date assignment concluded (NULL if active) | Valid date or NULL | Specified in SRS |

---

### 2.14 Table: `Assessments`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `assessment_id` | UUID | NOT NULL | PRIMARY KEY | Unique assessment event identifier | Valid UUID | Specified in SRS |
| `subject_id` | UUID | NOT NULL | FK $\rightarrow$ `Subjects.subject_id` | Subject being assessed | Valid existing `Subjects.subject_id` | Specified in SRS |
| `semester_id` | UUID | NOT NULL | FK $\rightarrow$ `Semesters.semester_id` | Term during which assessment was held | Valid existing `Semesters.semester_id` | Specified in SRS |
| `assessment_type`| VARCHAR(50)| NOT NULL | - | Assessment classification | Strings such as `CLASS_TEST_1`, `MID_SEM`, `END_SEM_THEORY` (Needs confirmation.) | Specified in SRS |
| `max_marks` | DECIMAL(7,2)| NOT NULL | - | Maximum total score possible | Decimal $> 0.00$ | Specified in SRS |

---

### 2.15 Table: `StudentMarks`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `student_mark_id`| UUID | NOT NULL | PRIMARY KEY | Unique student marks entry identifier | Valid UUID | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student evaluated | Valid existing `Students.student_id` | Specified in SRS |
| `assessment_id` | UUID | NOT NULL | FK $\rightarrow$ `Assessments.assessment_id`| Assessment evaluated | Valid existing `Assessments.assessment_id` | Specified in SRS |
| `marks_obtained`| DECIMAL(7,2)| NOT NULL | - | Actual marks scored by student | Decimal $\ge 0.00$ (must be $\le \text{max\_marks}$) | Specified in SRS |
| `recorded_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Audit timestamp when marks were stored | Valid timestamp | Specified in SRS |

---

### 2.16 Table: `AttendanceRecords`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `attendance_id` | UUID | NOT NULL | PRIMARY KEY | Unique attendance entry identifier | Valid UUID | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student tracked | Valid existing `Students.student_id` | Specified in SRS |
| `subject_id` | UUID | NOT NULL | FK $\rightarrow$ `Subjects.subject_id` | Subject tracked | Valid existing `Subjects.subject_id` | Specified in SRS |
| `semester_id` | UUID | NOT NULL | FK $\rightarrow$ `Semesters.semester_id` | Academic term context | Valid existing `Semesters.semester_id` | Specified in SRS |
| `classes_held` | INT | NOT NULL | - | Total instructional sessions conducted | Integer $\ge 0$ | Specified in SRS |
| `classes_attended`| INT | NOT NULL | - | Total sessions attended by student | Integer $\ge 0$ and $\le \text{classes\_held}$ | Specified in SRS |
| `attendance_percentage`| DECIMAL(5,2)| NOT NULL | - | Computed attendance percentage | Decimal $0.00$ to $100.00$ | Specified in SRS |

---

### 2.17 Table: `SemesterResults`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `result_id` | UUID | NOT NULL | PRIMARY KEY | Unique terminal result publication ID | Valid UUID | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student receiving result | Valid existing `Students.student_id` | Specified in SRS |
| `semester_id` | UUID | NOT NULL | FK $\rightarrow$ `Semesters.semester_id` | Term evaluated | Valid existing `Semesters.semester_id` | Specified in SRS |
| `sgpa` | DECIMAL(4,2)| NOT NULL | - | Semester Grade Point Average | Decimal $0.00$ to $10.00$ | Specified in SRS |
| `cgpa` | DECIMAL(4,2)| NOT NULL | - | Cumulative Grade Point Average | Decimal $0.00$ to $10.00$ | Specified in SRS |
| `result_status` | VARCHAR(30) | NOT NULL | - | Final result standing | Values like `PASS`, `FAIL`, `ATKT`, `WITHHELD` (Needs confirmation.) | Specified in SRS |
| `published_at` | TIMESTAMP | NOT NULL | - | Official date/time results released | Valid timestamp | Specified in SRS |

---

### 2.18 Table: `BacklogRecords`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `backlog_id` | UUID | NOT NULL | PRIMARY KEY | Unique backlog record identifier | Valid UUID | Specified in SRS |
| `student_id` | UUID | NOT NULL | FK $\rightarrow$ `Students.student_id` | Student holding backlog | Valid existing `Students.student_id` | Specified in SRS |
| `subject_id` | UUID | NOT NULL | FK $\rightarrow$ `Subjects.subject_id` | Subject failed | Valid existing `Subjects.subject_id` | Specified in SRS |
| `semester_id` | UUID | NOT NULL | FK $\rightarrow$ `Semesters.semester_id` | Semester in which failure occurred | Valid existing `Semesters.semester_id` | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Current state of backlog | Values like `ACTIVE`, `CLEARED` | Specified in SRS |
| `cleared_at` | DATE | NULL | - | Date backlog was cleared in re-exam | Valid date or NULL | Specified in SRS |

---

### 2.19 Table: `ImportJobs`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `import_job_id` | UUID | NOT NULL | PRIMARY KEY | Unique ingestion batch job identifier | Valid UUID | Specified in SRS |
| `data_type` | VARCHAR(50) | NOT NULL | - | Data domain of upload | `STUDENTS`, `MARKS`, `ATTENDANCE`, `RESULTS` | Specified in SRS |
| `uploaded_by` | UUID | NOT NULL | FK $\rightarrow$ `Users.user_id` | User account who uploaded file | Valid existing `Users.user_id` | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Processing lifecycle status | `UPLOADED`, `VALIDATING`, `VALIDATED`, `FAILED`, `COMMITTED` (Needs confirmation.) | Specified in SRS |
| `total_rows` | INT | NOT NULL | DEFAULT 0 | Count of rows parsed from file | Integer $\ge 0$ | Specified in SRS |
| `valid_rows` | INT | NOT NULL | DEFAULT 0 | Count of rows passing validation | Integer $\ge 0$ | Specified in SRS |
| `invalid_rows` | INT | NOT NULL | DEFAULT 0 | Count of rows rejected with error | Integer $\ge 0$ | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Submission timestamp of the job | Valid timestamp | Specified in SRS |

---

### 2.20 Table: `ImportErrors`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `import_error_id`| UUID | NOT NULL | PRIMARY KEY | Unique diagnostic entry identifier | Valid UUID | Specified in SRS |
| `import_job_id` | UUID | NOT NULL | FK $\rightarrow$ `ImportJobs.import_job_id`| Associated staging job | Valid existing `ImportJobs.import_job_id` | Specified in SRS |
| `row_number` | INT | NOT NULL | - | Line/row number in uploaded file | Integer $\ge 1$ | Specified in SRS |
| `field_name` | VARCHAR(100)| NOT NULL | - | Name of column failing validation | String, max 100 chars | Specified in SRS |
| `error_message` | TEXT | NOT NULL | - | Clear diagnostic error statement | Text (e.g., `ERR-MRK-001`) | Specified in SRS |

---

### 2.21 Table: `AnalyticsSnapshots`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `snapshot_id` | UUID | NOT NULL | PRIMARY KEY | Unique analytical snapshot identifier | Valid UUID | Specified in SRS |
| `scope_type` | VARCHAR(50) | NOT NULL | - | Entity level of the aggregation | `STUDENT`, `BATCH`, `DEPARTMENT`, `INSTITUTION` | Specified in SRS |
| `scope_id` | VARCHAR(100)| NOT NULL | - | Target entity primary key string | Valid UUID string or code | Specified in SRS |
| `metric_name` | VARCHAR(100)| NOT NULL | - | Standardized analytical KPI code | String (e.g., `ATTENDANCE_DISTRIBUTION`, `PASS_RATE_TREND`) | Specified in SRS |
| `metric_value` | JSONB | NOT NULL | - | Arbitrary JSON analytical payload | Valid JSON object/array | Specified in SRS |
| `calculated_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Timestamp when metrics computed | Valid timestamp | Specified in SRS |

---

### 2.22 Table: `Insights`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `insight_id` | UUID | NOT NULL | PRIMARY KEY | Unique insight item identifier | Valid UUID | Specified in SRS |
| `scope_type` | VARCHAR(50) | NOT NULL | - | Target level of observation | `STUDENT`, `MENTOR`, `SUBJECT`, `DEPARTMENT` | Specified in SRS |
| `scope_id` | VARCHAR(100)| NOT NULL | - | Target entity identifier string | Valid UUID string or code | Specified in SRS |
| `title` | VARCHAR(255)| NOT NULL | - | Plain-language headline of insight | String, max 255 chars | Specified in SRS |
| `evidence` | JSONB | NOT NULL | - | Supporting metric values & trends | Valid JSON object (`FR-013`) | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Generation timestamp | Valid timestamp | Specified in SRS |

---

### 2.23 Table: `Recommendations`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `recommendation_id`| UUID | NOT NULL | PRIMARY KEY | Unique recommendation identifier | Valid UUID | Specified in SRS |
| `insight_id` | UUID | NOT NULL | FK $\rightarrow$ `Insights.insight_id` | Supporting insight generating this advice | Valid existing `Insights.insight_id` | Specified in SRS |
| `recommendation_text`| TEXT | NOT NULL | - | Suggested academic action | Non-empty text string | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | DEFAULT 'NEW' | Actionable review state | `NEW`, `VIEWED`, `ACTIONED` (SCR-013) | Specified in SRS |

---

### 2.24 Table: `MLModels`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `model_id` | UUID | NOT NULL | PRIMARY KEY | Unique model artifact identifier | Valid UUID | Specified in SRS |
| `model_name` | VARCHAR(100)| NOT NULL | - | Formal name of the ML model | String (e.g., `AcademicRiskPredictor`) | Specified in SRS |
| `version` | VARCHAR(50) | NOT NULL | - | Semantic version string | Semantic version (e.g., `v1.0.0`) | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Deployment status of model | `EXPERIMENTAL`, `APPROVED`, `RETIRED` (Needs confirmation.) | Specified in SRS |
| `metrics` | JSONB | NOT NULL | - | Offline evaluation metrics | JSON containing precision, recall, F1, accuracy | Specified in SRS |

---

### 2.25 Table: `Predictions`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `prediction_id` | UUID | NOT NULL | PRIMARY KEY | Unique prediction event identifier | Valid UUID | Specified in SRS |
| `student_id` | UUID | NULL | FK $\rightarrow$ `Students.student_id` | Evaluated student (NULL for batch model) | Valid existing `Students.student_id` or NULL | Specified in SRS |
| `model_id` | UUID | NOT NULL | FK $\rightarrow$ `MLModels.model_id` | Generating model reference (`BR-008`)| Valid existing `MLModels.model_id` | Specified in SRS |
| `prediction_type`| VARCHAR(100)| NOT NULL | - | Target classification / risk indicator | String (e.g., `BACKLOG_RISK`, `DROPOUT_RISK`) | Specified in SRS |
| `score` | DECIMAL(8,5)| NOT NULL | - | Probability or quantitative risk index | Decimal $0.00000$ to $1.00000$ | Specified in SRS |
| `explanation` | JSONB | NULL | - | Feature contributions / SHAP weights | Valid JSON object or NULL | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Inference timestamp | Valid timestamp | Specified in SRS |

---

### 2.26 Table: `ReportJobs`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `report_job_id` | UUID | NOT NULL | PRIMARY KEY | Unique asynchronous report job ID | Valid UUID | Specified in SRS |
| `requested_by` | UUID | NOT NULL | FK $\rightarrow$ `Users.user_id` | User requesting the export | Valid existing `Users.user_id` | Specified in SRS |
| `report_type` | VARCHAR(100)| NOT NULL | - | Format and category of report | Strings like `STUDENT_SUMMARY`, `DEPT_PERFORMANCE` (Needs confirmation.) | Specified in SRS |
| `status` | VARCHAR(30) | NOT NULL | - | Generation status | `PENDING`, `GENERATING`, `COMPLETED`, `FAILED` (Needs confirmation.) | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Request timestamp | Valid timestamp | Specified in SRS |

---

### 2.27 Table: `AuditLogs`
| Field Name | Physical Type | Nullable | Key / Constraint | Description / Business Meaning | Allowed Values / Ranges | Status |
|---|---|---|---|---|---|---|
| `audit_id` | UUID | NOT NULL | PRIMARY KEY | Unique immutable audit log identifier | Valid UUID | Specified in SRS |
| `actor_user_id` | UUID | NOT NULL | FK $\rightarrow$ `Users.user_id` | User account who executed action | Valid existing `Users.user_id` | Specified in SRS |
| `action` | VARCHAR(100)| NOT NULL | - | Audited operation name | Strings like `LOGIN`, `IMPORT_COMMIT`, `EXPORT`, `UPDATE` (SRS Section 27) | Specified in SRS |
| `entity_type` | VARCHAR(100)| NOT NULL | - | Target database table or entity | String, max 100 chars | Specified in SRS |
| `entity_id` | VARCHAR(100)| NOT NULL | - | Primary key identifier of target entity | String, max 100 chars | Specified in SRS |
| `result` | VARCHAR(30) | NOT NULL | - | Operational outcome | `SUCCESS`, `FAILURE`, `DENIED` | Specified in SRS |
| `created_at` | TIMESTAMP | NOT NULL | DEFAULT CURRENT_TIMESTAMP | Immutable event timestamp | Valid timestamp | Specified in SRS |
