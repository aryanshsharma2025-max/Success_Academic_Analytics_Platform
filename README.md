# Success & Academic Analytics Platform (SAAP)

## Project Purpose
The **Success & Academic Analytics Platform (SAAP)** is an institutional academic analytics, early decision-support, and student outcome monitoring platform designed for higher education institutions. The platform monitors student performance progression, continuous internal assessment marks, attendance patterns, and cohort trajectories to enable timely academic mentoring and data-driven administrative decisions.

## Authoritative Requirements & Development Blueprint
The platform is developed systematically across six semesters (Semester 3 to Semester 8) in strict accordance with the approved **IEEE Software Requirements Specification (SRS) v1.0** (adapted from IEEE 29148) and specifically **Section 30: "Semester 3 to Semester 8 Development Blueprint"**.

## Current Project Phase
- **Current Milestone:** Semester 3 — Requirements, System Design, Synthetic Data & Basic Prototype
- **Current Status:** Repository Reset & Reorganization around genuine Semester 3 Deliverables
- **Development Boundary Notice:** Implementation of core application components (FastAPI backend, PostgreSQL persistence, React production frontend, JWT authentication, and production REST APIs) belongs to **Semester 4** and has not been started. Machine learning models belong to **Semester 6**.

---

## Semester 3 High-Level Deliverables Structure
All Semester 3 requirements are organized into independent, traceable directories under `SEMESTER 3/`:

```
SEMESTER 3/
├── 01 Problem Statement & Scope/
│   └── Documentation/
│       └── problem-statement-and-scope.md    # Step 1: Problem statement, scope & objectives
├── 02 IEEE SRS/
│   └── Documentation/
│       └── srs-v1.0.md                       # Step 2: Authoritative IEEE SRS v1.0
├── 03 Roles & Access Matrix/
│   └── Documentation/
│       └── role-permission-matrix.md         # Step 3: 9-Role RBAC permission matrix
├── 04 ERD + Database Design/
│   └── Design/
│       ├── ERD.md                            # Step 4: Entity Relationship Diagram
│       ├── database-design.md                # Step 4: Relational schema & integrity design
│       ├── data-dictionary.md                # Step 4: 13-entity field data dictionary
│       └── database-review.md                # Step 4: Database architecture review
├── 05 UI Wireframes/
│   └── Design/
│       └── ui-wireframes.md                  # Step 5: UI wireframes for 16 screens
├── 06 Synthetic Dataset/
│   └── Sample Data/
│       ├── *.csv (13 Relational Tables)      # Step 6: 6,991-row synthetic dataset
│       ├── generate_dataset.py               # Step 6: Deterministic dataset generator
│       ├── validate_dataset.py               # Step 6: Mathematical & schema validator
│       ├── synthetic-data-design.md          # Step 6: Synthetic dataset design document
│       └── import_templates/                 # Step 6: CSV import schema templates
├── 07 Basic Clickable Prototype/
│   └── README.md                             # Step 7: Reserved area for new prototype
└── 08 Git + Coding Standards/
    └── Repository Infrastructure/
        ├── .gitignore                        # Step 8: Git tracking exclusion rules
        ├── coding-standards.md               # Step 8: Engineering coding standards
        └── repository-infrastructure.md      # Step 8: Repository structure documentation
```

---

## Auxiliary Architectural References
- `docs/audit/phase-0-forensic-audit.md` — Forensic audit of early prototype implementation.
- `docs/product/final-product-architecture.md` — Authoritative product architecture blueprint.
- `docs/product/product-decision-log.md` — Architectural Decision Records (ADR-001 to ADR-020).
- `Success_Academy_structure.pdf` — Institutional structural reference document.

---

## Synthetic Dataset Verification
To verify the integrity and relational consistency of the synthetic dataset:
```bash
python "SEMESTER 3/06 Synthetic Dataset/Sample Data/validate_dataset.py"
```
Output confirms: 13 relational tables, 6,991 inspected records, zero foreign key orphans, zero domain constraint errors, and 100% mathematical consistency.
