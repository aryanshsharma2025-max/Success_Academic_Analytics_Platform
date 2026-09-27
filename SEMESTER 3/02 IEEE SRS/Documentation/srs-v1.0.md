SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

SUCCESS & ACADEMIC ANALYTICS PLATFORM

IEEE 29148 (Adapted) – Enterprise / MNC Software Development Standard

Version 1.0

September 2026

Table of Contents

1. Document Control

2. Revision History

3. Purpose

4. Scope

5. Product Vision

6. Intended Audience

7. Definitions and Acronyms

8. Product Perspective

9. Product Features

10. User Classes and Roles

11. Operating Environment

12. Design Constraints

13. Assumptions and Dependencies

14. System Architecture

15. Functional Requirements

16. Module Specifications

17. User Interface Specifications

18. Database Requirements

19. Data Collection and Validation Blueprint

20. Analytics and Insight Requirements

21. AI/ML Evolution Requirements

22. External Interface and API Requirements

23. Validation and Error Handling

24. Business Rules

25. Privacy and Security Requirements

26. Performance and Scalability Requirements

27. Logging, Audit and Monitoring

28. Backup and Recovery

29. Use Cases

30. Semester 3 to Semester 8 Development Blueprint

31. Testing and Quality Assurance

32. Acceptance Criteria

33. Traceability Matrix

Appendix A – Database Entity Relationships

Appendix B – Recommended Project Structure

Appendix C – Technology Blueprint

1. Document Control

Item

Details

Document Name

Software Requirements Specification (SRS)

Project Name

Success & Academic Analytics Platform

Version

1.0

Status

Development Baseline

Prepared By

Project Development Team

Reviewed By

Project Mentor / Academic Coordinator

Approved By

Project Sponsor / Authorized Institution

Standard

IEEE 29148 (Adapted)

2. Revision History

Version

Date

Description

1.0

September 2026

Initial complete enterprise-style SRS and software development blueprint

3. Purpose

This Software Requirements Specification defines the functional, non-functional, database, interface, analytics, privacy, security, testing and deployment requirements for the Success & Academic Analytics Platform (SAAP). The document is intended to act as the primary blueprint for project development from Semester 3 through Semester 8.

4. Scope

SAAP is a web-based academic analytics and decision-support platform that centralizes authorized academic information and converts validated data into dashboards, trends, analytics and actionable insights. The platform supports role-based access for students, mentors, faculty and authorized department users.

Student academic profile and progress tracking

Subject-wise marks and performance analysis

Attendance monitoring

Internal assessment and semester result management

SGPA and CGPA tracking

Backlog record management

Mentor/faculty monitoring of assigned students

Batch-level and subject-level analytics

Interactive dashboards and visualizations

Data validation and controlled import

Risk/prediction features when sufficient authorized historical data is available

Recommendations and explainable analytics in later project stages

Reports, audit logs and administrative monitoring

5. Product Vision

The long-term evolution of the platform is represented as:

DATA → INFORMATION → ANALYTICS → INSIGHTS → PREDICTION → RECOMMENDATION → INTELLIGENCE

The system shall begin as a practical academic data and analytics platform and evolve into an intelligent academic decision-support platform as validated features and authorized historical data become available.

6. Intended Audience

Stakeholder

Primary Responsibility

Student

View own authorized academic information and insights

Mentor

Monitor assigned students and identify students requiring attention

Faculty

Review authorized subject/student academic trends

Department User

View authorized batch and department analytics

Academic Administrator

Manage academic master data and controlled imports

Data Analyst

Develop and validate analytics

ML Engineer

Develop and evaluate approved prediction models

System Administrator

Manage users, roles, configuration and operations

Project Mentor

Review requirements and development progress

7. Definitions and Acronyms

Term

Meaning

SAAP

Success & Academic Analytics Platform

SGPA

Semester Grade Point Average

CGPA

Cumulative Grade Point Average

RBAC

Role-Based Access Control

ML

Machine Learning

AI

Artificial Intelligence

API

Application Programming Interface

KPI

Key Performance Indicator

Risk Score

Model or rule-based indicator requiring interpretation

Synthetic Data

Artificially generated data used for development/testing

Anonymized Data

Data processed to reduce direct identification according to applicable policy

8. Product Perspective

8.1 Current Situation (As-Is)

Academic information may exist in multiple spreadsheets, files or systems. This can make consolidated analysis, trend identification and timely academic review difficult.

8.2 Proposed Situation (To-Be)

Authorized Data Sources        ↓Data Collection / Import        ↓Data Validation        ↓Centralized PostgreSQL Database        ↓Academic Data Processing        ↓Analytics Engine (Pandas / NumPy)        ↓Visualization & Dashboards        ↓Insights        ↓Prediction (when justified)        ↓Recommendations / AI Assistance        ↓Role-Based Users

9. Product Features

Authentication and role-based authorization

Student profile and academic record management

Academic structure and subject master management

Marks and internal assessment management

Attendance management

Semester result management

SGPA/CGPA and backlog tracking

Controlled data import and validation

Student personalized dashboard

Mentor dashboard

Faculty analytics dashboard

Department analytics dashboard

Academic trends and comparisons

Insight generation

Optional ML prediction when sufficient authorized data exists

Recommendation and explainable analytics features

Reporting and export

Audit logging and system monitoring

10. User Classes and Roles

Role

Access Summary

Student

Own profile, marks, attendance, results, trends and authorized insights

Mentor

Assigned students and aggregate mentoring analytics

Faculty

Authorized subject/student analytics

Department User

Authorized batch/subject/department analytics

Academic Administrator

Master data, academic data import and correction workflow

Data Analyst

Authorized analytics configuration and evaluation

ML Engineer

Authorized model management

System Administrator

User, role and system configuration

Auditor/Viewer

Read-only access where explicitly granted

11. Operating Environment

Component

Recommended Environment

Frontend

React, HTML5, CSS3, JavaScript/TypeScript

Backend

FastAPI (preferred)

Data Processing

Python, Pandas, NumPy

Machine Learning

Scikit-learn and approved libraries when required

Database

PostgreSQL

Development

VS Code, Git, GitHub

Testing

Pytest, frontend testing tools and API testing

Deployment

Linux server or Docker-based deployment

Browser

Chrome, Edge, Firefox

12. Design Constraints

Initial stages shall preferably use synthetic or anonymized data.

Real student data shall only be processed with appropriate institutional authorization.

Users shall only access data permitted by their role and assignment.

Prediction shall not be presented as a guaranteed outcome.

AI/ML modules are dependent on sufficient, relevant and authorized historical data.

Academic decisions remain under authorized human/institutional control.

UI shall be usable on standard desktop and responsive browser environments.

13. Assumptions and Dependencies

Academic structure and data definitions are available from authorized stakeholders.

Institutional permission defines permitted data access.

Imported data follows an agreed template or mapping.

User assignments such as mentor-to-student are maintained.

Database and backend services are available.

Historical data quality is sufficient before any prediction module is deployed.

14. System Architecture

Layer

Components

Responsibility

Presentation

React Web Application

Role-based dashboards and UI

API

FastAPI

Secure business APIs

Business Services

Academic, Attendance, Result, Analytics services

Business processing

Data Processing

Pandas / NumPy

Analytics and aggregation

AI Layer

Optional ML service

Prediction and model evaluation

Data

PostgreSQL

Centralized authorized academic data

Reporting

Report service

Generate authorized reports

Security

Authentication + RBAC + Audit

Access control and traceability

Core flow: Data Collection → Validation → Storage → Analysis → Visualization → Insights.

Frontend shall not directly connect to the database.

All protected APIs shall enforce authorization.

Analytics calculations shall be reproducible and version-controlled where practical.

ML model versions shall be recorded.

Sensitive actions shall be audited.

Secrets shall not be stored in source code.

15. Functional Requirements

FR-001 – User Authentication

Item

Specification

Description

Allow authorized users to securely authenticate and access role-appropriate functions.

Priority

Critical

Actors

All Users

Preconditions

Active account exists.

Main Flow

1. Open login screen2. Enter credentials3. Validate credentials4. Create authenticated session/token5. Load role-based dashboard6. Write audit record

Postconditions

Authorized access is granted.

FR-002 – User and Role Management

Item

Specification

Description

Allow administrators to manage users, roles and account status.

Priority

Critical

Actors

System Administrator

Preconditions

Administrator authenticated.

Main Flow

1. Create/update user2. Assign role3. Validate uniqueness4. Save changes5. Audit action

Postconditions

User and role data is maintained.

FR-003 – Academic Master Data Management

Item

Specification

Description

Manage departments, programs, batches, semesters, subjects and academic structures.

Priority

Critical

Actors

Academic Administrator

Preconditions

Authorized role.

Main Flow

1. Select master data area2. Create/update record3. Validate relationships4. Save record5. Audit change

Postconditions

Academic structure is available for transactions.

FR-004 – Student Profile Management

Item

Specification

Description

Maintain authorized student profile and academic enrollment information.

Priority

Critical

Actors

Academic Administrator; Student (limited view)

Preconditions

Academic structure exists.

Main Flow

1. Create/import student2. Validate unique identifier3. Assign program/batch4. Save profile

Postconditions

Student record is available.

FR-005 – Marks and Assessment Management

Item

Specification

Description

Store and manage subject-wise marks and internal assessments.

Priority

Critical

Actors

Academic Administrator; Authorized Faculty

Preconditions

Student and subject exist.

Main Flow

1. Select/import assessment data2. Validate score range3. Map student/subject/semester4. Save record5. Record validation result

Postconditions

Assessment record is stored.

FR-006 – Attendance Management

Item

Specification

Description

Store and display authorized attendance information.

Priority

High

Actors

Authorized Faculty/Admin; Student view

Preconditions

Student and subject/class context exists.

Main Flow

1. Enter/import attendance summary2. Validate percentage/count values3. Save record4. Recalculate summary

Postconditions

Attendance data is available.

FR-007 – Semester Results and Academic Progress

Item

Specification

Description

Maintain semester results, SGPA, CGPA and backlog information.

Priority

Critical

Actors

Academic Administrator

Preconditions

Required academic records exist.

Main Flow

1. Import/enter semester result2. Validate semester and values3. Calculate/store progress values as applicable4. Update backlog status5. Save

Postconditions

Academic progress is available.

FR-008 – Data Import and Validation

Item

Specification

Description

Import academic data through approved templates or APIs and produce validation results.

Priority

Critical

Actors

Academic Administrator

Preconditions

Authorized import format available.

Main Flow

1. Upload file2. Parse data3. Validate schema and values4. Show error summary5. Approve valid records6. Store transaction

Postconditions

Valid records are stored; invalid records are reported.

FR-009 – Student Dashboard

Item

Specification

Description

Provide each student with personalized authorized academic analytics.

Priority

High

Actors

Student

Preconditions

Authenticated student.

Main Flow

1. Load student profile context2. Retrieve authorized data3. Calculate metrics4. Display trends and insights

Postconditions

Student views current permitted information.

FR-010 – Mentor Monitoring

Item

Specification

Description

Allow mentors to monitor assigned students and identify academic attention indicators.

Priority

High

Actors

Mentor

Preconditions

Assignments exist.

Main Flow

1. Load assigned students2. Aggregate authorized indicators3. Filter/sort students4. Open student detail where permitted

Postconditions

Mentor analytics are displayed.

FR-011 – Faculty Analytics

Item

Specification

Description

Provide authorized subject and student performance analytics to faculty.

Priority

High

Actors

Faculty

Preconditions

Authorized subject mapping exists.

Main Flow

1. Select period/subject2. Retrieve permitted data3. Calculate analytics4. Display charts and summaries

Postconditions

Faculty analytics are available.

FR-012 – Department Analytics

Item

Specification

Description

Provide authorized batch-level and subject-level analytics.

Priority

High

Actors

Department User

Preconditions

Department scope assigned.

Main Flow

1. Select academic filters2. Retrieve aggregate data3. Calculate metrics4. Display dashboard

Postconditions

Department analytics are displayed.

FR-013 – Insight Generation

Item

Specification

Description

Generate understandable insights from validated academic analytics.

Priority

High

Actors

Analytics Service

Preconditions

Sufficient validated data exists.

Main Flow

1. Calculate indicators2. Apply configured rules/analytics3. Generate insight text4. Associate evidence/metric

Postconditions

Insights are available with supporting context.

FR-014 – Prediction and Risk Analysis

Item

Specification

Description

When sufficient authorized historical data is available, evaluate approved models for academic prediction or risk indicators.

Priority

Medium

Actors

ML Service; Authorized Users

Preconditions

Approved model and compatible data exist.

Main Flow

1. Validate data/model compatibility2. Generate prediction3. Store score/model version4. Display as decision-support indicator with explanation

Postconditions

Prediction is recorded and presented appropriately.

FR-015 – Recommendations

Item

Specification

Description

Generate academic recommendations based on configured analytics, rules or approved AI methods.

Priority

Medium

Actors

Recommendation Service

Preconditions

Relevant insight exists.

Main Flow

1. Identify applicable context2. Generate recommendation3. Link to supporting indicators4. Display to authorized user

Postconditions

Recommendation is available for review.

FR-016 – Reports and Export

Item

Specification

Description

Generate authorized academic and analytics reports.

Priority

Medium

Actors

Authorized Roles

Preconditions

Authenticated and authorized.

Main Flow

1. Select report type and filters2. Validate scope3. Generate report4. Record export

Postconditions

Report is generated.

FR-017 – Audit Logging

Item

Specification

Description

Record defined security and administrative actions.

Priority

Critical

Actors

System

Preconditions

Relevant action occurs.

Main Flow

1. Capture actor/action/entity/time/result2. Store audit record3. Restrict audit access

Postconditions

Audit trail is maintained.

16. Module Specifications

Module ID

Module Name

Priority

Purpose

Main Tables

MOD-001

Authentication & RBAC

Critical

Login, sessions and authorization

Users, Roles, Permissions, UserRoles

MOD-002

User Management

High

User lifecycle

Users, AuditLogs

MOD-003

Academic Master Data

Critical

Departments, programs, semesters, subjects

Departments, Programs, Batches, Semesters, Subjects

MOD-004

Student Academic Profile

Critical

Student enrollment/profile

Students, StudentEnrollments

MOD-005

Assessment & Marks

Critical

Marks and internal assessments

Assessments, StudentMarks

MOD-006

Attendance

High

Attendance records and summaries

AttendanceRecords

MOD-007

Results & Progress

Critical

Results, SGPA, CGPA, backlog

SemesterResults, BacklogRecords

MOD-008

Data Import & Validation

Critical

Controlled import pipeline

ImportJobs, ImportErrors

MOD-009

Analytics Engine

High

Metrics and trends

AnalyticsSnapshots

MOD-010

Student Dashboard

High

Personal analytics

Views/Aggregates

MOD-011

Mentor & Faculty Analytics

High

Assigned/subject analysis

MentorAssignments

MOD-012

Department Analytics

High

Batch/subject analytics

Aggregates

MOD-013

Insights & Recommendations

Medium

Decision-support output

Insights, Recommendations

MOD-014

ML Prediction

Medium

Model-based prediction

MLModels, Predictions

MOD-015

Reporting

Medium

Reports and exports

ReportJobs

MOD-016

Audit & Monitoring

Critical

Audit and system health

AuditLogs, SystemHealth

Module Dependency Order

MOD-001 → MOD-002 → MOD-003 → MOD-004 → MOD-005/MOD-006 → MOD-007 → MOD-008 → MOD-009 → MOD-010/MOD-011/MOD-012 → MOD-013 → MOD-014 → MOD-015 → MOD-016

17. User Interface Specifications

Screen ID

Screen Name

Module

Related FR

Actors

SCR-001

Login

MOD-001

FR-001

All users

SCR-002

Student Dashboard

MOD-010

FR-009

Student

SCR-003

Academic Profile

MOD-004

FR-004/007

Student/Admin

SCR-004

Marks & Assessment View

MOD-005

FR-005

Authorized roles

SCR-005

Attendance View

MOD-006

FR-006

Student/Faculty

SCR-006

Mentor Dashboard

MOD-011

FR-010

Mentor

SCR-007

Faculty Analytics

MOD-011

FR-011

Faculty

SCR-008

Department Analytics

MOD-012

FR-012

Department User

SCR-009

Data Import Center

MOD-008

FR-008

Academic Admin

SCR-010

Import Validation Result

MOD-008

FR-008

Academic Admin

SCR-011

Academic Master Data

MOD-003

FR-003

Academic Admin

SCR-012

User Management

MOD-002

FR-002

System Admin

SCR-013

Insights & Recommendations

MOD-013

FR-013/015

Authorized roles

SCR-014

Prediction Analytics

MOD-014

FR-014

Authorized roles

SCR-015

Reports

MOD-015

FR-016

Authorized roles

SCR-016

Audit & System Health

MOD-016

FR-017

Admin/Auditor

SCR-001 – Login

+----------------------------------------------------------------+|           SUCCESS & ACADEMIC ANALYTICS PLATFORM                 |+----------------------------------------------------------------+| Username / Email: [________________________________________]   || Password:         [________________________________________]   ||                 [ LOGIN ]    [ CLEAR ]                         |+----------------------------------------------------------------+

Field

Type

Mandatory

Validation

Username/Email

Textbox

Yes

Existing active account

Password

Password

Yes

Secure verification

Login

Button

-

Authenticate

Clear

Button

-

Reset form

SCR-002 – Student Dashboard

+--------------------------------------------------------------------------------+| LOGO | Student Dashboard                         Profile | Notifications | Logout|+--------------------------------------------------------------------------------+| Dashboard | Academic Profile | Marks | Attendance | Results | Insights            ||--------------------------------------------------------------------------------|| Current SGPA | Current CGPA | Attendance | Active Backlogs                       ||--------------------------------------------------------------------------------|| Semester Trend Chart                 | Subject Performance                       ||--------------------------------------------------------------------------------|| Attendance Trend                     | Academic Insights                         ||--------------------------------------------------------------------------------|| Recent Results / Assessments         | Recommended Academic Actions              |+--------------------------------------------------------------------------------+

Widget

Purpose

Current SGPA

Display authorized current semester performance

Current CGPA

Display cumulative progress

Attendance

Display applicable summary

Backlogs

Display authorized active count/status

Semester Trend

Show historical performance trend

Subject Performance

Compare subject metrics

Insights

Show evidence-linked observations

Recommendations

Show applicable decision-support suggestions

SCR-006 – Mentor Dashboard

Component

Purpose

Assigned Student Count

Total students assigned to mentor

Attention Indicators

Students meeting configured review criteria

Performance Distribution

Aggregate trend

Attendance Distribution

Aggregate attendance view

Student List

Searchable/filterable assigned students

Student Detail

Open permitted academic history

Notes

Record mentoring notes where enabled

SCR-007 – Faculty Analytics

Key filters: Academic Year, Semester, Subject, Batch, Assessment Type. Charts may include score distribution, average trend, pass percentage and performance bands.

SCR-008 – Department Analytics

Key analytics: batch performance, subject trends, semester comparison, attendance distribution, backlog patterns and aggregate performance indicators within authorized scope.

SCR-009 – Data Import Center

Field/Control

Purpose

Validation

Data Type

Select Students/Marks/Attendance/Results

Required

Academic Context

Select year/semester/program

Required where applicable

Upload File

CSV/XLSX as supported

Approved format

Validate

Run pre-import validation

No database write before validation

Error Summary

Display row/field issues

Read-only

Import Valid Data

Commit approved valid data

Authorized action

Import History

Show previous jobs

Role restricted

SCR-013 – Insights & Recommendations

Field

Description

Insight Title

Short understandable observation

Evidence

Metrics/trends supporting the insight

Period

Relevant academic period

Confidence/Strength

Optional analytics indicator

Recommendation

Suggested academic action

Status

New/Viewed/Actioned where enabled

SCR-014 – Prediction Analytics

Prediction screens shall display model version, applicable data period, prediction/risk indicator and understandable supporting factors. The UI shall state that predictions are decision-support indicators and not guaranteed academic outcomes.

18. Database Requirements

PostgreSQL is recommended. All schema changes shall be managed through versioned database migrations.

Table

Core Columns

Users

user_id UUID PK; username VARCHAR(50) UNIQUE; email VARCHAR(100) UNIQUE; password_hash VARCHAR(255); is_active BOOLEAN; created_at TIMESTAMP

Roles

role_id INT PK; role_name VARCHAR(50) UNIQUE; description VARCHAR(255)

Permissions

permission_id INT PK; permission_code VARCHAR(100) UNIQUE

UserRoles

user_id FK; role_id FK; assigned_at TIMESTAMP

Departments

department_id UUID PK; department_name VARCHAR(150); code VARCHAR(30) UNIQUE

Programs

program_id UUID PK; department_id FK; program_name VARCHAR(150); code VARCHAR(30)

Batches

batch_id UUID PK; program_id FK; batch_name VARCHAR(50); admission_year INT

AcademicYears

academic_year_id UUID PK; year_label VARCHAR(20); start_date DATE; end_date DATE

Semesters

semester_id UUID PK; program_id FK; semester_number INT; academic_year_id FK

Subjects

subject_id UUID PK; subject_code VARCHAR(30) UNIQUE; subject_name VARCHAR(200); credits DECIMAL(4,1)

Students

student_id UUID PK; institutional_identifier VARCHAR(50) UNIQUE; user_id FK NULL; full_name VARCHAR(150); status VARCHAR(30)

StudentEnrollments

enrollment_id UUID PK; student_id FK; program_id FK; batch_id FK; status VARCHAR(30)

MentorAssignments

assignment_id UUID PK; mentor_user_id FK; student_id FK; start_date DATE; end_date DATE NULL

Assessments

assessment_id UUID PK; subject_id FK; semester_id FK; assessment_type VARCHAR(50); max_marks DECIMAL(7,2)

StudentMarks

student_mark_id UUID PK; student_id FK; assessment_id FK; marks_obtained DECIMAL(7,2); recorded_at TIMESTAMP

AttendanceRecords

attendance_id UUID PK; student_id FK; subject_id FK; semester_id FK; classes_held INT; classes_attended INT; attendance_percentage DECIMAL(5,2)

SemesterResults

result_id UUID PK; student_id FK; semester_id FK; sgpa DECIMAL(4,2); cgpa DECIMAL(4,2); result_status VARCHAR(30); published_at TIMESTAMP

BacklogRecords

backlog_id UUID PK; student_id FK; subject_id FK; semester_id FK; status VARCHAR(30); cleared_at DATE NULL

ImportJobs

import_job_id UUID PK; data_type VARCHAR(50); uploaded_by UUID FK; status VARCHAR(30); total_rows INT; valid_rows INT; invalid_rows INT; created_at TIMESTAMP

ImportErrors

import_error_id UUID PK; import_job_id FK; row_number INT; field_name VARCHAR(100); error_message TEXT

AnalyticsSnapshots

snapshot_id UUID PK; scope_type VARCHAR(50); scope_id VARCHAR(100); metric_name VARCHAR(100); metric_value JSONB; calculated_at TIMESTAMP

Insights

insight_id UUID PK; scope_type VARCHAR(50); scope_id VARCHAR(100); title VARCHAR(255); evidence JSONB; created_at TIMESTAMP

Recommendations

recommendation_id UUID PK; insight_id FK; recommendation_text TEXT; status VARCHAR(30)

MLModels

model_id UUID PK; model_name VARCHAR(100); version VARCHAR(50); status VARCHAR(30); metrics JSONB

Predictions

prediction_id UUID PK; student_id FK NULL; model_id FK; prediction_type VARCHAR(100); score DECIMAL(8,5); explanation JSONB; created_at TIMESTAMP

ReportJobs

report_job_id UUID PK; requested_by UUID FK; report_type VARCHAR(100); status VARCHAR(30); created_at TIMESTAMP

AuditLogs

audit_id UUID PK; actor_user_id UUID FK; action VARCHAR(100); entity_type VARCHAR(100); entity_id VARCHAR(100); result VARCHAR(30); created_at TIMESTAMP

19. Data Collection and Validation Blueprint

STEP 1: Identify Authorized Data Source        ↓STEP 2: Select Data Type and Academic Context        ↓STEP 3: Upload/Receive Data        ↓STEP 4: Validate File Schema        ↓STEP 5: Validate Mandatory Fields        ↓STEP 6: Validate Academic Relationships        ↓STEP 7: Detect Duplicate/Invalid Records        ↓STEP 8: Display Validation Report        ↓STEP 9: Authorized Approval        ↓STEP 10: Database Transaction        ↓STEP 11: Audit Log        ↓STEP 12: Refresh Analytics

Validation Area

Examples

Identity

Unique student/institution identifier

Academic Context

Valid program, batch and semester

Marks

Numeric and within permitted range

Attendance

Counts non-negative; percentage valid

SGPA/CGPA

Valid configured numeric range

Subjects

Valid subject mapping

Duplicates

Duplicate records detected according to import rules

Dates

Valid academic period

Access

Uploader authorized for data scope

20. Analytics and Insight Requirements

Analytics Area

Examples

Student Progress

SGPA/CGPA trend across semesters

Subject Performance

Average, distribution and trend

Attendance

Percentage and trend

Assessment Performance

Internal assessment comparison

Backlog Analytics

Count, subject pattern and resolution trend

Mentor Analytics

Assigned student aggregate indicators

Faculty Analytics

Authorized subject/batch metrics

Department Analytics

Aggregate batch and subject trends

Analytics must display the relevant period and scope.

Aggregates must respect RBAC and data scope.

Insight statements should link to supporting metrics.

Missing data should be visibly distinguished from zero values.

Analytics calculations should be testable and reproducible.

21. AI/ML Evolution Requirements

21.1 Eligibility

ML development shall only proceed after sufficient, relevant and authorized historical data is available and data quality has been assessed.

21.2 Model Lifecycle

Data Selection → Data Quality Review → Preprocessing → Train/Validation Split → Model Training → Evaluation → Review → Approval → Controlled Deployment → Monitoring → Retirement

21.3 Model Requirements

Model version and evaluation metrics shall be recorded.

Training data reference and preprocessing version shall be documented.

Prediction outputs shall be labeled as decision-support indicators.

Explanations/supporting factors should be provided where feasible.

Model performance shall be reviewed before continued use.

22. External Interface and API Requirements

Endpoint

Method

Purpose

/api/v1/auth/login

POST

Authenticate user

/api/v1/students/me/dashboard

GET

Student dashboard

/api/v1/students/{id}

GET

Authorized student profile

/api/v1/marks

GET/POST

Retrieve/manage marks

/api/v1/attendance

GET/POST

Retrieve/manage attendance

/api/v1/results

GET/POST

Retrieve/manage results

/api/v1/imports

POST

Upload import job

/api/v1/imports/{id}/validate

POST

Validate import

/api/v1/imports/{id}/commit

POST

Commit approved data

/api/v1/analytics/student/{id}

GET

Student analytics

/api/v1/analytics/mentor

GET

Mentor analytics

/api/v1/analytics/faculty

GET

Faculty analytics

/api/v1/analytics/department

GET

Department analytics

/api/v1/insights

GET

Authorized insights

/api/v1/models

GET/POST

Model management

/api/v1/predictions

GET

Authorized predictions

/api/v1/reports

POST

Create report job

/api/v1/health

GET

System health

Success response: {"success": true, "data": {...}, "request_id": "..."}

Error response: {"success": false, "error": {"code": "...", "message": "..."}, "request_id": "..."}

23. Validation and Error Handling

Error Code

Message

ERR-AUTH-001

Invalid username or password.

ERR-AUTH-002

Account is inactive.

ERR-AUTHZ-001

You are not authorized to perform this action.

ERR-STU-001

Student record not found.

ERR-ACA-001

Invalid academic context.

ERR-IMP-001

Unsupported import file format.

ERR-IMP-002

Import validation failed.

ERR-MRK-001

Marks value is outside the permitted range.

ERR-ATT-001

Invalid attendance value.

ERR-DUP-001

Duplicate record detected.

ERR-ML-001

No approved compatible model is available.

ERR-ML-002

Prediction could not be generated.

ERR-DB-001

Database service is unavailable.

24. Business Rules

BR-001: Students may access only their own authorized academic information.

BR-002: Mentors may access only students assigned to them unless additional authorization exists.

BR-003: Faculty access shall be restricted to authorized academic scope.

BR-004: Department analytics shall use authorized aggregate scope.

BR-005: Data imports shall be validated before final commit.

BR-006: Invalid import rows shall not silently become valid data.

BR-007: Academic records with history shall follow controlled correction rules.

BR-008: Every prediction shall reference a model version.

BR-009: Predictions and recommendations are decision-support outputs.

BR-010: Sensitive exports shall be authorized and audited.

BR-011: Real student data use requires applicable institutional approval.

25. Privacy and Security Requirements

RBAC enforced on server-side APIs.

Data minimization according to approved purpose.

Synthetic/anonymized data preferred during initial development.

Secure password hashing.

HTTPS/TLS for deployment.

Parameterized database access and input validation.

Secrets managed outside source code.

Audit privileged and data export actions.

Session timeout and logout support.

Backups protected according to institutional policy.

Prediction access restricted to authorized roles.

26. Performance and Scalability Requirements

Requirement

Target / Policy

Dashboard Response

Target under 3 seconds for normal prototype workload

Search and Filter

Indexed queries for common filters

Import Processing

Large imports may be asynchronous

Pagination

Required for large student/event lists

Analytics

Precompute/cache aggregates where justified

Scalability

Stateless API design preferred

ML Latency

Measured and documented on target environment

27. Logging, Audit and Monitoring

Login success/failure

User and role changes

Academic master data changes

Import validation and commit

Academic record correction

Report exports

Model registration/activation

Prediction generation

System errors and health changes

28. Backup and Recovery

Scheduled PostgreSQL backups.

Periodic restore testing.

Versioned migrations.

Versioned analytics/model artifacts where applicable.

Documented rollback procedure.

Retention policy configurable according to institutional requirements.

29. Use Cases

ID

Use Case

Actor

Outcome

UC-001

Login

All Users

Role-based access granted

UC-002

Manage Academic Master Data

Academic Admin

Academic structure maintained

UC-003

Import Student Data

Academic Admin

Validated students stored

UC-004

Import Marks

Academic Admin/Faculty

Validated marks stored

UC-005

View Student Dashboard

Student

Personal analytics displayed

UC-006

Monitor Assigned Students

Mentor

Authorized student insights displayed

UC-007

Analyze Subject Performance

Faculty

Subject analytics displayed

UC-008

View Department Analytics

Department User

Aggregate analytics displayed

UC-009

Generate Insight

Analytics Service

Evidence-linked insight available

UC-010

Generate Prediction

ML Service

Decision-support indicator generated

UC-011

Generate Report

Authorized User

Authorized report produced

30. Semester 3 to Semester 8 Development Blueprint

SEMESTER 3 – REQUIREMENTS, DESIGN & BASIC PROTOTYPE

Finalize problem statement and scope.

Prepare IEEE-style SRS.

Define roles and access matrix.

Create ER diagram and database design.

Prepare UI wireframes.

Create synthetic sample dataset.

Develop basic static/clickable prototype.

Create Git repository and coding standards.

Deliverables: SRS, ERD, data dictionary, UI prototype, sample data, project plan.

SEMESTER 4 – CORE WEB APPLICATION

Set up React frontend.

Set up FastAPI backend.

Set up PostgreSQL and migrations.

Implement authentication and RBAC.

Implement academic master data.

Implement student profiles.

Implement marks, attendance and results modules.

Implement controlled import APIs.

Deliverables: Working core application with CRUD and role-based access.

SEMESTER 5 – ANALYTICS & VISUALIZATION

Integrate Pandas and NumPy.

Define KPI calculations.

Build student trend analytics.

Build mentor/faculty analytics.

Build department aggregates.

Implement charts and dashboard filters.

Add insight generation rules.

Deliverables: Analytics engine and interactive dashboards.

SEMESTER 6 – ML EXPLORATION

Assess data sufficiency and authorization.

Perform data quality analysis.

Define prediction problem only if justified.

Create baseline models.

Evaluate precision/recall/F1 and other relevant metrics.

Document limitations.

Create controlled prediction prototype.

Deliverables: ML evaluation report and optional prediction module.

SEMESTER 7 – RECOMMENDATIONS & EXPLAINABLE ANALYTICS

Implement evidence-linked recommendations.

Improve explainability.

Add recommendation workflow.

Improve analytics narratives.

Review bias and limitations.

Conduct user feedback evaluation.

Deliverables: Decision-support and recommendation features.

SEMESTER 8 – QUALITY, SECURITY, DEPLOYMENT & FINALIZATION

Complete unit/integration/system testing.

Perform security and privacy review.

Perform performance testing.

Prepare Docker/deployment configuration.

Prepare backup/recovery procedures.

Complete documentation.

Conduct final evaluation and demonstration.

Deliverables: Final prototype, test report, deployment guide, user manual and final project documentation.

31. Testing and Quality Assurance

Test Level

Scope

Unit Testing

Business logic, validation and calculations

Integration Testing

Frontend/API/database integration

System Testing

End-to-end workflows

Data Validation Testing

Valid/invalid/duplicate import cases

Analytics Validation

Verify calculations against controlled datasets

ML Validation

Approved metrics and model evaluation

Security Testing

Authentication, RBAC and input handling

Performance Testing

Import, dashboard and analytics workload

UAT

Role-based stakeholder acceptance

Test ID

Scenario

Expected Result

TC-001

Valid student login

Own dashboard displayed

TC-002

Student accesses another student's data

Access denied

TC-003

Valid marks import

Valid records stored

TC-004

Invalid marks value

Row rejected with clear error

TC-005

Duplicate import

Duplicate handled according to policy

TC-006

Student trend calculation

Matches controlled expected result

TC-007

Mentor dashboard

Shows assigned students only

TC-008

Prediction request without approved model

Controlled error returned

TC-009

Unauthorized export

Access denied and action logged

32. Acceptance Criteria

Core academic data modules are implemented and tested.

Role-based access correctly restricts student and staff data.

Import validation prevents invalid records from uncontrolled storage.

Student dashboard displays authorized academic information.

Mentor/faculty/department analytics respect assigned scope.

Analytics calculations are validated using controlled datasets.

Insights link to supporting indicators.

ML features are enabled only when data and model requirements are satisfied.

Audit logging records defined actions.

Security and backup procedures are documented.

Final end-to-end demonstration succeeds.

33. Traceability Matrix

Requirement

Module

Screen/API

Database

FR-001

MOD-001

SCR-001 / auth/login

Users, Roles, AuditLogs

FR-003

MOD-003

SCR-011

Departments, Programs, Semesters, Subjects

FR-004

MOD-004

SCR-003

Students, StudentEnrollments

FR-005

MOD-005

SCR-004 / marks

Assessments, StudentMarks

FR-006

MOD-006

SCR-005 / attendance

AttendanceRecords

FR-007

MOD-007

SCR-003 / results

SemesterResults, BacklogRecords

FR-008

MOD-008

SCR-009/SCR-010

ImportJobs, ImportErrors

FR-009

MOD-010

SCR-002

Academic tables/Aggregates

FR-010

MOD-011

SCR-006

MentorAssignments

FR-011

MOD-011

SCR-007

Academic tables

FR-012

MOD-012

SCR-008

Aggregates

FR-013

MOD-013

SCR-013

Insights

FR-014

MOD-014

SCR-014

MLModels, Predictions

FR-015

MOD-013

SCR-013

Recommendations

FR-016

MOD-015

SCR-015

ReportJobs

FR-017

MOD-016

SCR-016

AuditLogs

Appendix A – Database Entity Relationships

Users ──< UserRoles >── RolesDepartments ──< Programs ──< BatchesPrograms ──< SemestersPrograms ──< Subjects (through curriculum mapping if implemented)Students ──< StudentEnrollmentsStudents ──< StudentMarks >── Assessments ──> SubjectsStudents ──< AttendanceRecords >── SubjectsStudents ──< SemesterResultsStudents ──< BacklogRecords >── SubjectsUsers (Mentor) ──< MentorAssignments >── StudentsImportJobs ──< ImportErrorsInsights ──< RecommendationsMLModels ──< PredictionsUsers ──< AuditLogs

Appendix B – Recommended Project Structure

success-academic-analytics-platform/├── frontend/│   ├── src/components/│   ├── src/pages/│   ├── src/services/│   └── src/features/├── backend/│   ├── app/api/│   ├── app/services/│   ├── app/models/│   ├── app/schemas/│   ├── app/repositories/│   ├── app/security/│   ├── app/analytics/│   ├── app/ml/│   ├── migrations/│   └── tests/├── data/│   ├── synthetic/│   ├── anonymized/│   └── import_templates/├── notebooks/├── docs/├── infrastructure/└── README.md

Appendix C – Technology Blueprint

Area

Technology

Purpose

Frontend

React

Web UI and dashboards

Backend

FastAPI

Secure REST APIs

Database

PostgreSQL

Centralized academic data

Analytics

Python + Pandas + NumPy

Data analysis

Visualization

React chart library

Interactive charts

ML

Scikit-learn (when justified)

Prediction experiments

Development

VS Code + Git + GitHub

Team development

Deployment

Docker optional

Repeatable deployment

END OF SOFTWARE REQUIREMENTS SPECIFICATION