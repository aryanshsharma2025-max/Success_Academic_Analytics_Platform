#!/usr/bin/env python3
"""
SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
Synthetic Dataset Generator
============================================
Document Reference: SAAP-DAT-GEN-001
Source of Truth: SAAP Software Requirements Specification (SRS) v1.0
Phase: Semester 3 - Step 6: Create Synthetic Sample Dataset

This script generates a realistic, statistically varied, and referentially
sound academic dataset purely for design, testing, and prototype evaluation.
ZERO real student data or PII is used.
"""

import argparse
import csv
import datetime
import math
import os
import random
import sys
import uuid
from typing import Dict, List, Tuple


def deterministic_uuid(namespace: str, index: int) -> str:
    """Generate a reproducible, deterministic UUID v4 string."""
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{namespace}-{index}"))


def parse_args():
    parser = argparse.ArgumentParser(description="Generate synthetic academic dataset for SAAP.")
    parser.add_argument("--students", type=int, default=200, help="Total number of students to generate (default: 200)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility (default: 42)")
    parser.add_argument("--output-dir", type=str, default=None, help="Directory to save generated CSV files")
    return parser.parse_args()


def main():
    args = parse_args()
    random.seed(args.seed)

    base_dir = args.output_dir or os.path.dirname(os.path.abspath(__file__))
    os.makedirs(base_dir, exist_ok=True)

    print("=" * 70)
    print("SAAP SYNTHETIC DATASET GENERATOR")
    print(f"Target Students: {args.students} | Random Seed: {args.seed}")
    print(f"Output Directory: {base_dir}")
    print("=" * 70)

    # -------------------------------------------------------------
    # 1. Departments (3 departments)
    # -------------------------------------------------------------
    departments = [
        {
            "department_id": deterministic_uuid("dept", 1),
            "department_name": "Computer Science & Engineering",
            "code": "CSE"
        },
        {
            "department_id": deterministic_uuid("dept", 2),
            "department_name": "Electronics & Communication Engineering",
            "code": "ECE"
        },
        {
            "department_id": deterministic_uuid("dept", 3),
            "department_name": "Mechanical Engineering",
            "code": "MECH"
        }
    ]

    # -------------------------------------------------------------
    # 2. Programs (3 degree programs)
    # -------------------------------------------------------------
    programs = [
        {
            "program_id": deterministic_uuid("prog", 1),
            "department_id": departments[0]["department_id"],
            "program_name": "B.Tech Computer Science & Engineering",
            "code": "BT-CSE"
        },
        {
            "program_id": deterministic_uuid("prog", 2),
            "department_id": departments[1]["department_id"],
            "program_name": "B.Tech Electronics & Communication Engineering",
            "code": "BT-ECE"
        },
        {
            "program_id": deterministic_uuid("prog", 3),
            "department_id": departments[2]["department_id"],
            "program_name": "B.Tech Mechanical Engineering",
            "code": "BT-MECH"
        }
    ]

    # -------------------------------------------------------------
    # 3. Batches (3 cohort intakes per program)
    # -------------------------------------------------------------
    batches = []
    batch_idx = 1
    cohort_years = [2023, 2024, 2025]
    for prog in programs:
        for year in cohort_years:
            batches.append({
                "batch_id": deterministic_uuid("batch", batch_idx),
                "program_id": prog["program_id"],
                "batch_name": f"{prog['code']} Batch {year}-{year+4}",
                "admission_year": year
            })
            batch_idx += 1

    # -------------------------------------------------------------
    # 4. Academic Years (4 institutional academic years)
    # -------------------------------------------------------------
    academic_years = [
        {
            "academic_year_id": deterministic_uuid("ay", 1),
            "year_label": "2023-2024",
            "start_date": "2023-07-01",
            "end_date": "2024-06-30"
        },
        {
            "academic_year_id": deterministic_uuid("ay", 2),
            "year_label": "2024-2025",
            "start_date": "2024-07-01",
            "end_date": "2025-06-30"
        },
        {
            "academic_year_id": deterministic_uuid("ay", 3),
            "year_label": "2025-2026",
            "start_date": "2025-07-01",
            "end_date": "2026-06-30"
        },
        {
            "academic_year_id": deterministic_uuid("ay", 4),
            "year_label": "2026-2027",
            "start_date": "2026-07-01",
            "end_date": "2027-06-30"
        }
    ]

    # -------------------------------------------------------------
    # 5. Semesters (8 semesters for B.Tech programs)
    # -------------------------------------------------------------
    # Map semester number to an academic year relative to 2023 cohort baseline
    semesters = []
    sem_idx = 1
    # For simplicity, define canonical semesters 1 through 8 for each program
    for prog in programs:
        for sem_no in range(1, 9):
            # Term mapping to academic years
            ay_index = min((sem_no - 1) // 2, len(academic_years) - 1)
            semesters.append({
                "semester_id": deterministic_uuid("sem", sem_idx),
                "program_id": prog["program_id"],
                "semester_number": sem_no,
                "academic_year_id": academic_years[ay_index]["academic_year_id"]
            })
            sem_idx += 1

    # Quick lookup helper for semesters: (program_id, semester_number) -> semester_id
    sem_lookup = {(s["program_id"], s["semester_number"]): s["semester_id"] for s in semesters}

    # -------------------------------------------------------------
    # 6. Subjects (36 curriculum subjects across CSE, ECE, MECH)
    # -------------------------------------------------------------
    raw_subjects = [
        # CSE Subjects (16)
        ("CS101", "Programming in C", 4.0, "BT-CSE", 1),
        ("CS102", "Digital Logic Design", 4.0, "BT-CSE", 1),
        ("CS201", "Object Oriented Programming in C++", 4.0, "BT-CSE", 2),
        ("CS202", "Data Structures & Algorithms", 4.0, "BT-CSE", 2),
        ("CS301", "Database Management Systems", 4.0, "BT-CSE", 3),
        ("CS302", "Discrete Mathematics", 3.5, "BT-CSE", 3),
        ("CS303", "Computer Organization & Architecture", 4.0, "BT-CSE", 3),
        ("CS304", "Digital Electronics & Microprocessors", 3.5, "BT-CSE", 3),
        ("CS401", "Operating Systems", 4.0, "BT-CSE", 4),
        ("CS402", "Theory of Computation", 4.0, "BT-CSE", 4),
        ("CS501", "Design and Analysis of Algorithms", 4.0, "BT-CSE", 5),
        ("CS502", "Computer Networks", 4.0, "BT-CSE", 5),
        ("CS601", "Software Engineering & Testing", 3.5, "BT-CSE", 6),
        ("CS602", "Compiler Design", 4.0, "BT-CSE", 6),
        ("CS701", "Artificial Intelligence & Machine Learning", 4.0, "BT-CSE", 7),
        ("CS801", "Major Project & Capstone Defense", 6.0, "BT-CSE", 8),

        # ECE Subjects (10)
        ("EC101", "Basic Electrical & Electronics Engg", 4.0, "BT-ECE", 1),
        ("EC102", "Network Analysis & Synthesis", 4.0, "BT-ECE", 1),
        ("EC201", "Analog Electronic Circuits", 4.0, "BT-ECE", 2),
        ("EC202", "Signals and Systems", 4.0, "BT-ECE", 2),
        ("EC301", "Electromagnetic Fields & Waves", 3.5, "BT-ECE", 3),
        ("EC302", "Analog Communication Systems", 4.0, "BT-ECE", 3),
        ("EC401", "Digital Signal Processing", 4.0, "BT-ECE", 4),
        ("EC501", "Microcontrollers & Embedded Systems", 4.0, "BT-ECE", 5),
        ("EC601", "VLSI Design & Technology", 4.0, "BT-ECE", 6),
        ("EC701", "Wireless & Mobile Communication", 3.5, "BT-ECE", 7),

        # MECH Subjects (10)
        ("ME101", "Engineering Mechanics", 4.0, "BT-MECH", 1),
        ("ME102", "Engineering Graphics & Design", 3.5, "BT-MECH", 1),
        ("ME201", "Thermodynamics", 4.0, "BT-MECH", 2),
        ("ME202", "Material Science & Metallurgy", 3.5, "BT-MECH", 2),
        ("ME301", "Fluid Mechanics & Hydraulic Machinery", 4.0, "BT-MECH", 3),
        ("ME302", "Strength of Materials", 4.0, "BT-MECH", 3),
        ("ME401", "Kinematics & Dynamics of Machines", 4.0, "BT-MECH", 4),
        ("ME501", "Heat & Mass Transfer", 4.0, "BT-MECH", 5),
        ("ME601", "Manufacturing Technology & Metrology", 4.0, "BT-MECH", 6),
        ("ME701", "Automobile Engineering & Dynamics", 3.5, "BT-MECH", 7),
    ]

    subjects = []
    subject_curriculum_map = {}  # (program_id, sem_number) -> list of subject_ids
    prog_code_map = {p["code"]: p["program_id"] for p in programs}

    for idx, (code, name, credits, prog_code, sem_num) in enumerate(raw_subjects, start=1):
        subj_id = deterministic_uuid("subj", idx)
        prog_id = prog_code_map[prog_code]
        subjects.append({
            "subject_id": subj_id,
            "subject_code": code,
            "subject_name": name,
            "credits": f"{credits:.1f}"
        })
        key = (prog_id, sem_num)
        if key not in subject_curriculum_map:
            subject_curriculum_map[key] = []
        subject_curriculum_map[key].append(subj_id)

    # -------------------------------------------------------------
    # 7. Assessments (3 standard components per subject per semester)
    # Class Test 1 (20 max), Mid-Sem (30 max), End-Sem (50 max)
    # -------------------------------------------------------------
    assessments = []
    ass_idx = 1
    # For every entry in subject_curriculum_map, create the 3 assessments
    subj_assessment_map = {}  # (subject_id, semester_id) -> dict of {type: assessment_id}

    for (prog_id, sem_num), subj_list in subject_curriculum_map.items():
        sem_id = sem_lookup[(prog_id, sem_num)]
        for subj_id in subj_list:
            subj_assessment_map[(subj_id, sem_id)] = {}
            for a_type, max_m in [("CLASS_TEST_1", 20.0), ("MID_SEM", 30.0), ("END_SEM", 50.0)]:
                a_id = deterministic_uuid("ass", ass_idx)
                assessments.append({
                    "assessment_id": a_id,
                    "subject_id": subj_id,
                    "semester_id": sem_id,
                    "assessment_type": a_type,
                    "max_marks": f"{max_m:.2f}"
                })
                subj_assessment_map[(subj_id, sem_id)][a_type] = a_id
                ass_idx += 1

    # -------------------------------------------------------------
    # 8. Students & StudentEnrollments (Configurable: default 200)
    # -------------------------------------------------------------
    students = []
    enrollments = []

    # Distribution across programs: 60% CSE, 20% ECE, 20% MECH
    # Distribution across cohorts:
    # 2024 Batch: currently in Semester 3 (40%)
    # 2023 Batch: currently in Semester 5 (35%)
    # 2025 Batch: currently in Semester 1 (25%)
    prog_weights = [0.60, 0.20, 0.20]
    cohort_weights = [(2024, 3, 0.40), (2023, 5, 0.35), (2025, 1, 0.25)]

    # Persona distribution for academic variation:
    # 1: High Performer (15%)
    # 2: Above Average (30%)
    # 3: Average (30%)
    # 4: Improving (10%)
    # 5: Declining (8%)
    # 6: Struggling / At Risk (7%)
    personas = [
        ("HIGH_PERFORMER", 0.15),
        ("ABOVE_AVERAGE", 0.30),
        ("AVERAGE", 0.30),
        ("IMPROVING", 0.10),
        ("DECLINING", 0.08),
        ("STRUGGLING", 0.07)
    ]
    persona_types, persona_probs = zip(*personas)

    # Batch lookup helper: (program_id, admission_year) -> batch_id
    batch_lookup = {(b["program_id"], b["admission_year"]): b["batch_id"] for b in batches}

    student_meta = []  # stores (student_id, prog_id, batch_id, current_sem, persona)

    for i in range(1, args.students + 1):
        s_id = deterministic_uuid("student", i)
        prog_choice = random.choices(programs, weights=prog_weights)[0]
        cohort_choice = random.choices(cohort_weights, weights=[c[2] for c in cohort_weights])[0]
        adm_year, curr_sem, _ = cohort_choice
        persona = random.choices(persona_types, weights=persona_probs)[0]

        # Status logic: 95% Active, 4% Alumni/Detention
        status = "ACTIVE"
        if persona == "STRUGGLING" and random.random() < 0.25:
            status = "DETENTION"

        student_code = f"SYN-{adm_year}-{prog_choice['code'].split('-')[1]}-{i:04d}"
        full_name = f"Synthetic Student {i:03d}"

        students.append({
            "student_id": s_id,
            "institutional_identifier": student_code,
            "user_id": "",  # NULL as allowed in SRS Section 18
            "full_name": full_name,
            "status": status
        })

        b_id = batch_lookup[(prog_choice["program_id"], adm_year)]
        e_id = deterministic_uuid("enrollment", i)

        enrollments.append({
            "enrollment_id": e_id,
            "student_id": s_id,
            "program_id": prog_choice["program_id"],
            "batch_id": b_id,
            "status": "ENROLLED"
        })

        student_meta.append({
            "student_id": s_id,
            "program_id": prog_choice["program_id"],
            "admission_year": adm_year,
            "current_sem": curr_sem,
            "persona": persona,
            "status": status
        })

    # -------------------------------------------------------------
    # 9. StudentMarks, AttendanceRecords, SemesterResults, Backlogs
    # -------------------------------------------------------------
    student_marks = []
    attendance_records = []
    semester_results = []
    backlog_records = []

    mark_idx = 1
    att_idx = 1
    res_idx = 1
    backlog_idx = 1

    for s in student_meta:
        s_id = s["student_id"]
        prog_id = s["program_id"]
        persona = s["persona"]
        current_sem = s["current_sem"]

        cumulative_earned_points = 0.0
        cumulative_credits = 0.0

        # Generate history for each semester from 1 up to current_sem
        for sem_no in range(1, current_sem + 1):
            sem_id = sem_lookup[(prog_id, sem_no)]
            subjects_in_sem = subject_curriculum_map.get((prog_id, sem_no), [])
            if not subjects_in_sem:
                continue

            sem_points = 0.0
            sem_credits = 0.0
            has_failed_subject_in_sem = False

            # Determine performance parameters based on persona and progression
            if persona == "HIGH_PERFORMER":
                base_pct = random.uniform(0.85, 0.95)
                base_att_pct = random.uniform(88.0, 98.0)
            elif persona == "ABOVE_AVERAGE":
                base_pct = random.uniform(0.72, 0.84)
                base_att_pct = random.uniform(80.0, 90.0)
            elif persona == "AVERAGE":
                base_pct = random.uniform(0.55, 0.70)
                base_att_pct = random.uniform(75.0, 85.0)
            elif persona == "IMPROVING":
                # Starts low (0.45) in sem 1, increases by +0.08 each semester
                growth = min(0.35, (sem_no - 1) * 0.08)
                base_pct = random.uniform(0.45, 0.55) + growth
                base_att_pct = min(92.0, 68.0 + (sem_no - 1) * 5.0 + random.uniform(0, 5))
            elif persona == "DECLINING":
                # Starts high (0.80), drops by -0.10 in recent semester
                decay = (sem_no - 1) * 0.07
                base_pct = max(0.40, random.uniform(0.78, 0.85) - decay)
                base_att_pct = max(60.0, 88.0 - (sem_no - 1) * 6.0 - random.uniform(0, 4))
            else:  # STRUGGLING
                base_pct = random.uniform(0.35, 0.48)
                base_att_pct = random.uniform(55.0, 72.0)

            for subj_id in subjects_in_sem:
                # Find subject credit
                subj_credit = float(next(sub["credits"] for sub in subjects if sub["subject_id"] == subj_id))

                # Subject-level variation (+/- 6%)
                subj_pct = max(0.20, min(0.98, base_pct + random.uniform(-0.06, 0.06)))

                # 1. Assessment Marks
                ct1_id = subj_assessment_map[(subj_id, sem_id)]["CLASS_TEST_1"]
                mid_id = subj_assessment_map[(subj_id, sem_id)]["MID_SEM"]
                end_id = subj_assessment_map[(subj_id, sem_id)]["END_SEM"]

                m_ct1 = round(min(20.0, max(0.0, 20.0 * subj_pct + random.uniform(-1.5, 1.5))), 2)
                m_mid = round(min(30.0, max(0.0, 30.0 * subj_pct + random.uniform(-2.0, 2.0))), 2)
                m_end = round(min(50.0, max(0.0, 50.0 * subj_pct + random.uniform(-3.0, 3.0))), 2)

                # Store Marks
                for a_id, val in [(ct1_id, m_ct1), (mid_id, m_mid), (end_id, m_end)]:
                    student_marks.append({
                        "student_mark_id": deterministic_uuid("mark", mark_idx),
                        "student_id": s_id,
                        "assessment_id": a_id,
                        "marks_obtained": f"{val:.2f}",
                        "recorded_at": f"{academic_years[min(sem_no//2, 3)]['start_date']} 14:00:00"
                    })
                    mark_idx += 1

                # 2. Attendance Record
                classes_held = random.randint(40, 48)
                # Subject attendance percentage
                att_p = max(40.0, min(100.0, base_att_pct + random.uniform(-5.0, 5.0)))
                classes_attended = int(round(classes_held * (att_p / 100.0)))
                classes_attended = min(classes_held, max(0, classes_attended))
                actual_att_pct = round((classes_attended / classes_held) * 100.0, 2)

                attendance_records.append({
                    "attendance_id": deterministic_uuid("att", att_idx),
                    "student_id": s_id,
                    "subject_id": subj_id,
                    "semester_id": sem_id,
                    "classes_held": classes_held,
                    "classes_attended": classes_attended,
                    "attendance_percentage": f"{actual_att_pct:.2f}"
                })
                att_idx += 1

                # Total marks in subject (out of 100)
                tot_marks = m_ct1 + m_mid + m_end
                # Grade point calculation (standard 10-point scale: >=90 -> 10, >=80 -> 9, etc.)
                if tot_marks >= 90:
                    grade_pt = 10.0
                elif tot_marks >= 80:
                    grade_pt = 9.0
                elif tot_marks >= 70:
                    grade_pt = 8.0
                elif tot_marks >= 60:
                    grade_pt = 7.0
                elif tot_marks >= 50:
                    grade_pt = 6.0
                elif tot_marks >= 40:
                    grade_pt = 5.0
                else:
                    grade_pt = 0.0  # Fail / Backlog
                    has_failed_subject_in_sem = True

                    # 3. Create Backlog Record
                    # If this is an earlier semester, struggling/average students may have cleared it
                    is_cleared = (sem_no < current_sem) and (persona in ["AVERAGE", "IMPROVING"] or random.random() < 0.4)
                    status_backlog = "CLEARED" if is_cleared else "ACTIVE"
                    cleared_date = f"{academic_years[min(sem_no//2, 3)]['end_date']}" if is_cleared else ""

                    backlog_records.append({
                        "backlog_id": deterministic_uuid("backlog", backlog_idx),
                        "student_id": s_id,
                        "subject_id": subj_id,
                        "semester_id": sem_id,
                        "status": status_backlog,
                        "cleared_at": cleared_date
                    })
                    backlog_idx += 1

                sem_points += (grade_pt * subj_credit)
                sem_credits += subj_credit

            # Compute SGPA
            sgpa = round(sem_points / sem_credits, 2) if sem_credits > 0 else 0.0
            cumulative_earned_points += sem_points
            cumulative_credits += sem_credits
            cgpa = round(cumulative_earned_points / cumulative_credits, 2) if cumulative_credits > 0 else 0.0

            # Result status
            if has_failed_subject_in_sem:
                res_status = "ATKT" if sgpa >= 4.0 else "FAIL"
            else:
                res_status = "PASS"

            semester_results.append({
                "result_id": deterministic_uuid("res", res_idx),
                "student_id": s_id,
                "semester_id": sem_id,
                "sgpa": f"{sgpa:.2f}",
                "cgpa": f"{cgpa:.2f}",
                "result_status": res_status,
                "published_at": f"{academic_years[min(sem_no//2, 3)]['end_date']} 18:00:00"
            })
            res_idx += 1

    # -------------------------------------------------------------
    # 10. Write All CSV Files
    # -------------------------------------------------------------
    datasets = [
        ("departments.csv", departments, ["department_id", "department_name", "code"]),
        ("programs.csv", programs, ["program_id", "department_id", "program_name", "code"]),
        ("batches.csv", batches, ["batch_id", "program_id", "batch_name", "admission_year"]),
        ("academic_years.csv", academic_years, ["academic_year_id", "year_label", "start_date", "end_date"]),
        ("semesters.csv", semesters, ["semester_id", "program_id", "semester_number", "academic_year_id"]),
        ("subjects.csv", subjects, ["subject_id", "subject_code", "subject_name", "credits"]),
        ("students.csv", students, ["student_id", "institutional_identifier", "user_id", "full_name", "status"]),
        ("student_enrollments.csv", enrollments, ["enrollment_id", "student_id", "program_id", "batch_id", "status"]),
        ("assessments.csv", assessments, ["assessment_id", "subject_id", "semester_id", "assessment_type", "max_marks"]),
        ("student_marks.csv", student_marks, ["student_mark_id", "student_id", "assessment_id", "marks_obtained", "recorded_at"]),
        ("attendance_records.csv", attendance_records, ["attendance_id", "student_id", "subject_id", "semester_id", "classes_held", "classes_attended", "attendance_percentage"]),
        ("semester_results.csv", semester_results, ["result_id", "student_id", "semester_id", "sgpa", "cgpa", "result_status", "published_at"]),
        ("backlog_records.csv", backlog_records, ["backlog_id", "student_id", "subject_id", "semester_id", "status", "cleared_at"])
    ]

    print("\nWriting generated entities to CSV files:")
    print("-" * 50)
    for filename, data, fieldnames in datasets:
        filepath = os.path.join(base_dir, filename)
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        print(f"  -> {filename:<25} : {len(data):>6} rows written")

    print("-" * 50)
    print("Dataset generation completed successfully.")


if __name__ == "__main__":
    main()
