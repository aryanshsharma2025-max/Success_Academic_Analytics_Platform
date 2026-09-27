# SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
## Semester 3 — Step 8: Git Repository & Infrastructure Standards

**Document Reference:** `SAAP-INF-GIT-001`  
**Phase:** Semester 3 — Requirements, Design & Basic Prototype (Step 8)  
**Authoritative Source:** IEEE SRS Version 1.0 (Section 30)  
**Standard:** Enterprise Git Workflow & Repository Hygiene  

---

### 1. Repository Purpose & Scope
This repository houses the authoritative source, specifications, architecture blueprints, database designs, and synthetic datasets for the **Success & Academic Analytics Platform (SAAP)**, developed systematically across 6 semesters (Semester 3 to Semester 8).

### 2. Semester 3 Directory Architecture
The repository strictly segregates Semester 3 deliverables into independent, traceable stages:

```
SEMESTER 3/
├── 01 Problem Statement & Scope/
│   └── Documentation/
│       └── problem-statement-and-scope.md
├── 02 IEEE SRS/
│   └── Documentation/
│       └── srs-v1.0.md
├── 03 Roles & Access Matrix/
│   └── Documentation/
│       └── role-permission-matrix.md
├── 04 ERD + Database Design/
│   └── Design/
│       ├── ERD.md
│       ├── database-design.md
│       ├── data-dictionary.md
│       └── database-review.md
├── 05 UI Wireframes/
│   └── Design/
│       └── ui-wireframes.md
├── 06 Synthetic Dataset/
│   └── Sample Data/
│       ├── *.csv (13 Relational Tables)
│       ├── generate_dataset.py
│       ├── validate_dataset.py
│       ├── synthetic-data-design.md
│       └── import_templates/
├── 07 Basic Clickable Prototype/
│   └── README.md (Reserved for new prototype)
└── 08 Git + Coding Standards/
    └── Repository Infrastructure/
        ├── .gitignore
        ├── coding-standards.md
        └── repository-infrastructure.md
```

### 3. Git Ignore Policy
The root `.gitignore` guarantees that runtime environments, package dependencies, temporary artifacts, and operating system caches are excluded from version control:
- Dependencies: `node_modules/`, `venv/`, `.venv/`
- Build Artifacts: `dist/`, `build/`
- Environment Secrets: `.env`, `.env.*` (excluding `.env.example`)
- Python Caches: `__pycache__/`, `*.py[cod]`
- OS Metadata: `.DS_Store`, `Thumbs.db`
- IDE Metadata: `.vscode/`, `.idea/`

### 4. Branching & Commit Discipline
1. **Branch Model:** Feature branches branch off `main` using standard naming conventions:
   - `docs/<topic>` — For requirements, architecture, and design specifications.
   - `data/<topic>` — For synthetic dataset refinements and validation suites.
   - `prototype/<topic>` — For prototype visual and interaction demonstrations.
2. **Commit Hygiene:** Commits must be atomic, descriptive, and follow conventional commit prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
3. **No Unvalidated Pushes:** Code and synthetic datasets must pass automated validation suites prior to merging.
