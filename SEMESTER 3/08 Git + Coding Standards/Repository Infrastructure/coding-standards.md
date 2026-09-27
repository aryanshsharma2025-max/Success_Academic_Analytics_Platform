# Success & Academic Analytics Platform (SAAP)
## Engineering Standards & Coding Guidelines

**Document Reference:** `SAAP-ENG-STD-001`  
**Standard:** IEEE 730 / Software Quality Assurance Guidelines  
**Project Phase:** Semester 3 — Repository Setup & Coding Standards (Step 8)  
**Applies To:** SAAP Frontend Prototype, Data Pipelines, Scripts, Documentation, and Configuration  

---

### 1. Repository & File Organization

The SAAP repository structure follows clear separation of concerns:

```
Success_Academic_Analytics_Platform/
├── data/
│   ├── import_templates/     # Standard CSV templates for bulk imports
│   └── synthetic/            # Canonical synthetic dataset and generators
├── docs/                     # Architectural, SRS, UI, DB, and development docs
│   ├── data/
│   ├── database/
│   ├── development/
│   ├── prototype/
│   ├── requirements/
│   └── ui/
├── scripts/                  # Build, test, and verification automation
├── src/                      # Prototype React application source code
│   ├── components/common/    # Reusable UI components
│   ├── context/              # Authentication and routing state providers
│   ├── data/                 # Data services and bundled prototype JSON
│   └── screens/              # 16 SRS-mapped screen components
├── index.html                # Vite entry point
├── package.json              # Project manifest and scripts
├── package-lock.json         # Pinned dependency tree
├── vite.config.js            # Vite build configuration
└── .gitignore                # Exclusion rules for artifacts and caches
```

#### File & Directory Naming Rules
- **Directories:** Lowercase with hyphens or underscores (`import_templates`, `synthetic`, `common`, `development`).
- **React Screens:** Exact SRS screen identifier followed by PascalCase name: `SCR###_ScreenName.jsx` (e.g., `SCR001_Login.jsx`, `SCR002_StudentDashboard.jsx`).
- **Reusable React Components:** PascalCase with `.jsx` extension (e.g., `Navbar.jsx`, `Sidebar.jsx`, `MetricCard.jsx`, `Forbidden403.jsx`).
- **Context Providers:** PascalCase ending with `Context.jsx` (e.g., `AuthContext.jsx`, `RouterContext.jsx`).
- **JavaScript Utilities & Services:** camelCase with `.js` extension (e.g., `dataService.js`).
- **Python Scripts:** Lowercase `snake_case.py` (e.g., `build_prototype_data.py`, `generate_dataset.py`, `validate_dataset.py`).
- **CSV Data Files:** Plural lowercase `snake_case.csv` (e.g., `students.csv`, `student_marks.csv`). Import templates prefix `import_template_` (e.g., `import_template_marks.csv`).
- **Documentation:** Lowercase `kebab-case.md` categorized in domain folders (e.g., `srs-v1.0.md`, `coding-standards.md`).

---

### 2. React & Frontend Standards

#### Component Design & Naming
- All functional components must use `PascalCase` and match their file basename.
- Export standard: Use default export for top-level screen/component modules (`export default SCR001_Login;`). Named exports are permitted for component collections (e.g., chart primitives in `Charts.jsx`).
- Component props must be camelCase (e.g., `currentRoute`, `onNavigate`, `activeTab`).
- Avoid deeply nested anonymous inline callbacks in JSX where a named handler improves readability.

#### State Management & Navigation
- State must remain localized to components where possible; global state is strictly reserved for authenticated session (`AuthContext`) and route synchronization (`RouterContext`).
- Keep navigation URL-driven via `RouterContext` hash/path routing to preserve deep-linking capabilities.
- Prototype screens must consume data via `dataService.js` rather than importing raw CSV/JSON directly in multiple places.

---

### 3. JavaScript / JSX Guidelines

- **Formatting:** 2 spaces indentation, no hard tabs.
- **Variable Declarations:** Always use `const` by default; use `let` only when reassignment is required. Never use `var`.
- **Naming Conventions:**
  - Variables & Functions: `camelCase` (e.g., `calculateAttendanceRate`, `selectedStudent`).
  - Constants & Enums: `UPPER_SNAKE_CASE` (e.g., `ROLE_DEFINITIONS`, `STATUS_COLORS`).
  - Custom Hooks: Prefix with `use` (e.g., `useAuth`, `useRouter`).
- **Equality:** Always use strict equality (`===` and `!==`) to prevent coercion bugs.
- **Safety:** Always guard object lookups and array iterations against `null`/`undefined` using optional chaining (`?.`) and nullish coalescing (`??`).

---

### 4. Python Guidelines

- **Standard:** Follow PEP 8 guidelines.
- **Formatting:** 4 spaces indentation, no tabs.
- **Naming Conventions:**
  - Functions & Variables: `snake_case` (e.g., `load_csv`, `validate_dataset`).
  - Module Constants: `UPPER_SNAKE_CASE` (e.g., `BASE_DIR`, `SYNTHETIC_DIR`).
  - Classes (when used): `PascalCase`.
- **Script Execution:** Every standalone executable script must include a docstring and standard entry guard:
  ```python
  if __name__ == "__main__":
      main()
  ```
- **Error Handling:** Catch explicit exceptions; avoid bare `except:` clauses. Always provide descriptive error messages when validation checks fail.

---

### 5. Data & Synthetic Dataset Standards

- **Encoding:** All CSV and JSON data files must be strictly encoded in UTF-8 without BOM.
- **CSV Headers:** Column names must use lowercase `snake_case` with explicit foreign key naming conventions (e.g., `student_id`, `academic_year_id`, `department_code`).
- **Deterministic Generation:** All synthetic data generators (`data/synthetic/generate_dataset.py`) must use a fixed random seed (`RANDOM_SEED = 42`) ensuring reproducible datasets.
- **Integrity Validation:** Every CSV must pass relational referential integrity, range checks, and nullability constraints verified by `data/synthetic/validate_dataset.py`.
- **No Dummy Placeholders:** Never commit dummy placeholder records containing "Lorem Ipsum", "Coming Soon", or non-domain garbage values.

---

### 6. Comments & Code Hygiene

- **Purposeful Comments:** Write comments explaining *why* an architectural or domain decision was made, not restating *what* the syntax does.
- **Zero Forbidden Placeholders:** The codebase must maintain zero occurrences of forbidden prototype strings (`lorem ipsum`, `coming soon`, `todo`, `ai-generated insight`, `sample dashboard`). This is enforced via `scripts/verify_prototype.py`.
- **No Dead Code:** Commented-out code blocks, abandoned test functions, and unused imports must be cleaned before completing any step.
- **Traceability:** When implementing logic governed by a specific SRS requirement or Business Rule, cite the identifier directly in comments (e.g., `// SRS Ref: BR-001 - Student read-only isolation`, `// SRS Ref: FR-004 - Continuous assessment grade calculation`).

---

### 7. Dependency & Tooling Policy

- **Minimalist Footprint:** Keep dependencies strictly lean. Only core runtime libraries (`react`, `react-dom`) and build tooling (`vite`, `@vitejs/plugin-react`) are approved for the prototype.
- **Lockfile Integrity:** `package-lock.json` must be tracked in version control and stay synchronized with `package.json`.
- **No Heavy External UI Libraries:** UI components, charts, and layout elements are implemented with lightweight, zero-dependency SVG/CSS to maintain performance and total architectural control.
- **Third-Party Additions:** No new npm packages or Python packages may be installed without documented architectural justification.

---

### 8. SRS Traceability Standards

Every screen, permission gate, data field, and diagnostic feature in SAAP maps to the approved Software Requirements Specification (`docs/requirements/srs-v1.0.md`):

| Identifier Type | Prefix | Example | Description |
|---|---|---|---|
| User Roles | `ROL-###` | `ROL-001`, `ROL-005` | 9 System user roles |
| Screens | `SCR-###` | `SCR-001` to `SCR-016` | 16 Primary user interfaces |
| Functional Requirements | `FR-###` | `FR-001` to `FR-022` | Core capabilities |
| Business Rules | `BR-###` | `BR-001` to `BR-015` | Institutional academic policies |
| Non-Functional Req. | `NFR-###` | `NFR-001` to `NFR-012` | Performance, security, accessibility |
| Error Codes | `ERR-CAT-###` | `ERR-AUTHZ-001` | Standardized diagnostic alerts |

---

### 9. Version Control & Git Commit Conventions

Git commit messages must adhere to the Conventional Commits specification:

```
<type>(<scope>): <subject>
```

#### Commit Types
- `feat`: A new feature, screen, or functional capability.
- `fix`: A bug fix or correction to existing functionality.
- `docs`: Documentation additions or updates (SRS, architecture, README).
- `chore`: Repository maintenance, configuration, `.gitignore`, dependency updates.
- `refactor`: Code restructures that neither fix a bug nor add a feature.
- `test`: Adding or updating verification scripts, dataset assertions, QA checks.

#### Rules
- Use present tense, imperative mood: "add student dashboard" instead of "added student dashboard".
- Keep the subject line under 72 characters.
- Reference the Semester and Step in chore/milestone commits (e.g., `chore(repo): configure .gitignore and repository standards [Sem3-Step8]`).
- Never commit ignored artifacts (`node_modules/`, `dist/`, `.env`, temporary files).
