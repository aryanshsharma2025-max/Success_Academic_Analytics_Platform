# Success & Academic Analytics Platform (SAAP)

[![Requirements](https://img.shields.io/badge/Specification-IEEE%20SRS%20v1.0-blue?style=for-the-badge&logo=googledocs&logoColor=white)](https://github.com/aryanshsharma2025-max/Success_Academic_Analytics_Platform)
[![Database](https://img.shields.io/badge/Database-13%20Entities%20(3NF)-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://github.com/aryanshsharma2025-max/Success_Academic_Analytics_Platform)
[![Validation](https://img.shields.io/badge/Validation-6%2C991%20Verified%20Records-10B981?style=for-the-badge&logo=python&logoColor=white)](https://github.com/aryanshsharma2025-max/Success_Academic_Analytics_Platform)

A system design, software requirements engineering, and synthetic data modeling repository for an institutional academic analytics platform.

This project phase establishes the architectural foundation, 3NF database schema, role-based authorization matrix, and data validation tooling prior to software implementation.

---

## 📌 Problem Statement & Project Scope

Institutional academic performance tracking is often fragmented across separate spreadsheets and legacy records, preventing timely identification of students at academic risk.

SAAP was engineered through a disciplined systems engineering lifecycle to model how department directors, heads of department, mentors, and faculty can track student progress, internal assessment marks, lecture attendance, and backlogs.

---

## 📦 Repository Deliverables

```
Success_Academic_Analytics_Platform/
├── schema.sql                               # Declarative 3NF DDL schema with constraints & indexes
├── SEMESTER 3/
│   ├── 01 Problem Statement & Scope/
│   │   └── Project charter, stakeholders, and institutional scope
│   ├── 02 IEEE SRS/
│   │   └── Formal Software Requirements Specification (SRS v1.0)
│   ├── 03 Roles & Access Matrix/
│   │   └── 9-role authorization matrix (Student to Director)
│   ├── 04 ERD + Database Design/
│   │   └── Entity Relationship Diagram, schema.sql, and 3NF relational data dictionary
│   ├── 05 UI Wireframes/
│   │   └── Screen mockups for student, faculty, and administrative views
│   ├── 06 Synthetic Dataset/Sample Data/
│   │   ├── 13 CSV data files (6,991 total records)
│   │   ├── generate_dataset.py (Synthetic data generation script)
│   │   └── validate_dataset.py (Automated data integrity test suite)
│   ├── 07 Basic Clickable Prototype/
│   │   └── UI flow specifications
│   └── 08 Git + Coding Standards/
│       └── Repository governance and branch workflows
└── docs/ (Product architecture and audit logs)
```

---

## 🚦 Implementation Status

| Component | Status | Implementation Details |
|---|:---:|---|
| **IEEE SRS Specification** | **Implemented** | Complete formal requirements specification (SRS v1.0) |
| **Role & Permission Matrix** | **Implemented** | 9-tier RBAC definition across all academic workflows |
| **Relational Database Design** | **Implemented** | 13-entity relational model in 3rd Normal Form (3NF) |
| **SQL DDL Schema (`schema.sql`)** | **Implemented** | Full declarative DDL with foreign keys, checks, and analytical indexes |
| **Synthetic Relational Dataset** | **Implemented** | 13 CSV tables comprising 6,991 consistent records |
| **Data Validation Test Suite** | **Implemented** | Python test suite checking schema, uniqueness, and FK integrity |
| **Web Frontend / Dashboard** | **Planned** | Planned for subsequent implementation phase |
| **Backend REST API** | **Planned** | Planned for subsequent implementation phase |
| **Predictive ML Early Warning** | **Planned** | Planned early-warning intervention models |

---

## 📊 Relational Architecture & Dataset Composition

The dataset models an engineering college following the CSVTU academic scheme across 13 relational entities:

```
academic_years ──► semesters ──► subjects ──► assessments ──► student_marks
      │               │                                             ▲
      ▼               ▼                                             │
 departments ──► programs ──► batches ──► students ─────────────────┤
                                            │                       │
                                            ├──► attendance_records ─┤
                                            ├──► semester_results ──┤
                                            └──► backlog_records ───┘
```

### Dataset Composition (6,991 Total Records):
1. `departments.csv` (3 records)
2. `programs.csv` (3 records)
3. `batches.csv` (9 records)
4. `academic_years.csv` (4 records)
5. `semesters.csv` (24 records)
6. `subjects.csv` (36 records)
7. `students.csv` (200 records)
8. `student_enrollments.csv` (200 records)
9. `assessments.csv` (108 records)
10. `student_marks.csv` (4,278 records)
11. `attendance_records.csv` (1,426 records)
12. `semester_results.csv` (648 records)
13. `backlog_records.csv` (52 records)

---

## 🧪 Running the Dataset Validation Suite

The repository includes an automated Python validation script that checks column conformance, primary key uniqueness, foreign key referential integrity, mark boundaries, and GPA mathematical bounds across all 13 CSV tables.

### Execution Instructions:
```bash
# Navigate to the dataset directory:
cd "SEMESTER 3/06 Synthetic Dataset/Sample Data"

# Run the validation suite:
python validate_dataset.py
```

### Verified Test Output:
- **Total Tables Checked:** 13
- **Total Records Inspected:** 6,991
- **Primary Key Uniqueness:** Verified
- **Foreign Key Integrity:** Verified (0 orphan records)
- **Marks Range Compliance:** Verified
- **SGPA / CGPA Bounds [0.0 - 10.0]:** Verified
- **Total Errors Found:** 0

---

## ⚠️ Known Scope & Limitations

1. **Design and Specifications Scope:** This repository documents the software requirements, architecture, and database design phase. It does not contain an active web application or runnable backend server.
2. **Synthetic Data Only:** All 200 student profiles, marks, and attendance records are mathematically generated synthetic data and do not represent real individuals.
3. **Repository Description Correction:** Past repository descriptions mentioned "built with React and Vite"; this represented an aspirational future phase and has been reconciled to reflect the current design artifacts.

---

## 🎯 Learning Outcomes

- Formulating formal IEEE Software Requirements Specifications (SRS).
- Designing normalized relational database schemas (3NF) for multi-tier academic institutions.
- Generating relational test datasets with realistic distributions and domain rules.
- Writing automated data integrity validation scripts in Python to verify referential integrity.
