# Success & Academic Analytics Platform (SAAP)

## Project Purpose
The Success & Academic Analytics Platform (SAAP) is an institutional analytics, early intervention, and academic outcome tracking platform designed for higher education institutions. The platform monitors student performance trends, continuous assessment marks, attendance patterns, and cohort progress to enable proactive academic mentoring and data-driven administrative decisions.

## Current Project Phase
- **Milestone:** Semester 3 — Requirements, Architecture, Data Design, and Static/Clickable Prototype
- **Current Step:** Step 8 — Git Repository Setup, .gitignore Configuration, and Engineering Coding Standards
- **Notice:** This repository contains the Semester 3 deliverables. Development for Semester 4 (backend services, database persistence, production APIs) has not started.

## Current Technology Used
- **Frontend Prototype:** React 18, Vite 5, JavaScript (ES modules), CSS3, custom SVG data visualizations (no third-party chart libraries).
- **Data Engineering & Scripts:** Python 3 (standard libraries: `csv`, `json`, `os`, `sys`, `random`, `math`, `datetime`, `re`).
- **Data Format:** Normalized CSV datasets in `data/synthetic/` and bundled JSON in `src/data/syntheticData.json` for client-side prototype operation.
- **Documentation:** Markdown with IEEE-aligned specifications and Mermaid diagram models.

## Repository Structure
```
Success_Academic_Analytics_Platform/
├── data/
│   ├── import_templates/         # Standard CSV templates for bulk imports
│   └── synthetic/                # 13 synthetic relational CSVs + generators
├── docs/                         # Formal project engineering documentation
│   ├── data/                     # Synthetic data design specification
│   ├── database/                 # ERD, schema designs, and data dictionary
│   ├── development/              # Coding standards and development guidelines
│   ├── prototype/                # Prototype QA review and screen mappings
│   ├── requirements/             # SRS v1.0 and Role-Permission Matrix
│   └── ui/                       # Wireframes and screen specifications
├── scripts/
│   ├── build_prototype_data.py   # Compiles CSV datasets to prototype JSON
│   └── verify_prototype.py       # Prototype QA auditor & placeholder checker
├── src/                          # React prototype application
│   ├── components/common/        # Shared UI components (Navbar, Sidebar, Charts)
│   ├── context/                  # AuthContext (RBAC) and RouterContext (navigation)
│   ├── data/                     # dataService.js and syntheticData.json
│   ├── screens/                  # 16 SRS screens (SCR-001 to SCR-016)
│   ├── App.jsx                   # Application shell and route orchestration
│   ├── index.css                 # Application styling and design system tokens
│   └── main.jsx                  # Application mount point
├── index.html                    # Vite HTML shell
├── package.json                  # Dependencies and NPM build scripts
├── package-lock.json             # Pinned dependency tree
├── vite.config.js                # Vite build configuration
└── .gitignore                    # Git tracking exclusion rules
```

## How to Run the Current Prototype

### Prerequisites
- Node.js (version 18 or later)
- npm (version 9 or later)

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. On the login screen (`SCR-001`), select any of the 9 pre-configured persona buttons (Student, Mentor, Faculty, Department User, Academic Administrator, Data Analyst, Institution Leadership, System Administrator, Auditor) to simulate role-based access control and navigate through all 16 SRS screens.

## How to Regenerate Synthetic Data
The canonical synthetic dataset consists of 13 interconnected CSV files generated with a fixed seed (`42`) for reproducibility.

1. Generate the canonical CSV datasets:
   ```bash
   python data/synthetic/generate_dataset.py
   ```
2. Compile the CSV datasets into the web prototype data bundle:
   ```bash
   python scripts/build_prototype_data.py
   ```

## How to Validate Synthetic Data and Prototype Integrity
1. Validate relational referential integrity, ranges, and schema compliance across all CSV files:
   ```bash
   python data/synthetic/validate_dataset.py
   ```
2. Run the automated prototype audit to verify all 16 screens, routing connections, and ensure zero forbidden placeholder strings:
   ```bash
   python scripts/verify_prototype.py
   ```

## Current Limitations
- **Client-Side Simulation:** The prototype runs entirely in the browser using pre-compiled synthetic JSON. State modifications (e.g. adding users, logging attendance, uploading data) persist during the browser session only and reset upon full page refresh.
- **In-Memory RBAC:** Authentication and session management are simulated locally for UX and workflow validation.
- **Static Analytics:** Prediction indicators and risk flags are pre-computed synthetic outputs designed to demonstrate user interface workflows rather than real-time machine learning inference.

## Production Status Notice
> **IMPORTANT:** The current prototype is a basic static and clickable frontend demonstration developed strictly for Semester 3 requirements validation and UI workflow verification. It is **NOT** the production backend or production application. Real database connectivity, production backend APIs, persistent authentication, live ML inference engines, and enterprise integrations will be implemented in subsequent project phases (Semester 4 and beyond).
