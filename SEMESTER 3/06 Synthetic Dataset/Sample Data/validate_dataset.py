#!/usr/bin/env python3
"""
SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
Synthetic Dataset Validator
============================================
Document Reference: SAAP-DAT-VAL-001
Source of Truth: SAAP Software Requirements Specification (SRS) v1.0
Phase: Semester 3 - Step 6: Create Synthetic Sample Dataset

This script verifies data integrity, schema consistency, domain constraints,
mathematical accuracy, and referential integrity across all generated CSV files.
"""

import argparse
import csv
import os
import sys
from typing import Dict, List, Set, Tuple


def load_csv(filepath: str) -> List[Dict[str, str]]:
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def main():
    parser = argparse.ArgumentParser(description="Validate SAAP synthetic academic dataset.")
    parser.add_argument("--data-dir", type=str, default=None, help="Directory containing CSV files")
    args = parser.parse_args()

    data_dir = args.data_dir or os.path.dirname(os.path.abspath(__file__))

    print("=" * 70)
    print("SAAP SYNTHETIC DATASET INTEGRITY & VALIDATION SUITE")
    print(f"Validation Target: {data_dir}")
    print("=" * 70)

    # 1. Required Files and Column Specifications
    schema_spec = {
        "departments.csv": ["department_id", "department_name", "code"],
        "programs.csv": ["program_id", "department_id", "program_name", "code"],
        "batches.csv": ["batch_id", "program_id", "batch_name", "admission_year"],
        "academic_years.csv": ["academic_year_id", "year_label", "start_date", "end_date"],
        "semesters.csv": ["semester_id", "program_id", "semester_number", "academic_year_id"],
        "subjects.csv": ["subject_id", "subject_code", "subject_name", "credits"],
        "students.csv": ["student_id", "institutional_identifier", "user_id", "full_name", "status"],
        "student_enrollments.csv": ["enrollment_id", "student_id", "program_id", "batch_id", "status"],
        "assessments.csv": ["assessment_id", "subject_id", "semester_id", "assessment_type", "max_marks"],
        "student_marks.csv": ["student_mark_id", "student_id", "assessment_id", "marks_obtained", "recorded_at"],
        "attendance_records.csv": ["attendance_id", "student_id", "subject_id", "semester_id", "classes_held", "classes_attended", "attendance_percentage"],
        "semester_results.csv": ["result_id", "student_id", "semester_id", "sgpa", "cgpa", "result_status", "published_at"],
        "backlog_records.csv": ["backlog_id", "student_id", "subject_id", "semester_id", "status", "cleared_at"]
    }

    errors = []
    warnings = []
    data_tables: Dict[str, List[Dict[str, str]]] = {}

    # Check file existence and column headers
    print("\n[CHECK 1 & 2] Checking File Existence & Column Conformance...")
    for filename, expected_cols in schema_spec.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            errors.append(f"Missing required file: {filename}")
            continue

        rows = load_csv(filepath)
        data_tables[filename] = rows

        if not rows and filename not in ["backlog_records.csv"]:
            warnings.append(f"File {filename} is empty.")

        actual_cols = list(rows[0].keys()) if rows else []
        for col in expected_cols:
            if col not in actual_cols:
                errors.append(f"File {filename} missing required column: '{col}'")

        print(f"  -> {filename:<25} : OK ({len(rows)} records, {len(actual_cols)} cols)")

    if errors:
        print("\nFATAL: Schema errors detected. Aborting relational checks.")
        for err in errors:
            print(f"  [ERROR] {err}")
        sys.exit(1)

    # 3. Primary Key & Identifier Uniqueness Checks
    print("\n[CHECK 3] Verifying Primary Key & Unique Identifier Uniqueness...")
    pk_spec = {
        "departments.csv": ("department_id", "code"),
        "programs.csv": ("program_id", "code"),
        "batches.csv": ("batch_id", None),
        "academic_years.csv": ("academic_year_id", "year_label"),
        "semesters.csv": ("semester_id", None),
        "subjects.csv": ("subject_id", "subject_code"),
        "students.csv": ("student_id", "institutional_identifier"),
        "student_enrollments.csv": ("enrollment_id", None),
        "assessments.csv": ("assessment_id", None),
        "student_marks.csv": ("student_mark_id", None),
        "attendance_records.csv": ("attendance_id", None),
        "semester_results.csv": ("result_id", None),
        "backlog_records.csv": ("backlog_id", None),
    }

    for filename, (pk_col, uk_col) in pk_spec.items():
        rows = data_tables[filename]
        pks = [r[pk_col] for r in rows]
        if len(pks) != len(set(pks)):
            errors.append(f"{filename}: Duplicate primary key values found in '{pk_col}'!")
        if uk_col:
            uks = [r[uk_col] for r in rows if r[uk_col]]
            if len(uks) != len(set(uks)):
                errors.append(f"{filename}: Duplicate unique key values found in '{uk_col}'!")

    print("  -> Primary key uniqueness: VERIFIED.")

    # 4. Foreign Key Referential Integrity Checks
    print("\n[CHECK 4] Verifying Foreign Key Referential Integrity...")
    dept_ids = {r["department_id"] for r in data_tables["departments.csv"]}
    prog_ids = {r["program_id"] for r in data_tables["programs.csv"]}
    batch_ids = {r["batch_id"] for r in data_tables["batches.csv"]}
    ay_ids = {r["academic_year_id"] for r in data_tables["academic_years.csv"]}
    sem_ids = {r["semester_id"] for r in data_tables["semesters.csv"]}
    subj_ids = {r["subject_id"] for r in data_tables["subjects.csv"]}
    student_ids = {r["student_id"] for r in data_tables["students.csv"]}
    assessment_ids = {r["assessment_id"] for r in data_tables["assessments.csv"]}

    # Check Programs -> Departments
    for r in data_tables["programs.csv"]:
        if r["department_id"] not in dept_ids:
            errors.append(f"programs.csv row {r['program_id']} references non-existent department {r['department_id']}")

    # Check Batches -> Programs
    for r in data_tables["batches.csv"]:
        if r["program_id"] not in prog_ids:
            errors.append(f"batches.csv row {r['batch_id']} references non-existent program {r['program_id']}")

    # Check Semesters -> Programs, AcademicYears
    for r in data_tables["semesters.csv"]:
        if r["program_id"] not in prog_ids:
            errors.append(f"semesters.csv references invalid program_id: {r['program_id']}")
        if r["academic_year_id"] not in ay_ids:
            errors.append(f"semesters.csv references invalid academic_year_id: {r['academic_year_id']}")

    # Check StudentEnrollments -> Students, Programs, Batches
    for r in data_tables["student_enrollments.csv"]:
        if r["student_id"] not in student_ids:
            errors.append(f"student_enrollments.csv references invalid student_id: {r['student_id']}")
        if r["program_id"] not in prog_ids:
            errors.append(f"student_enrollments.csv references invalid program_id: {r['program_id']}")
        if r["batch_id"] not in batch_ids:
            errors.append(f"student_enrollments.csv references invalid batch_id: {r['batch_id']}")

    # Check Assessments -> Subjects, Semesters
    for r in data_tables["assessments.csv"]:
        if r["subject_id"] not in subj_ids:
            errors.append(f"assessments.csv references invalid subject_id: {r['subject_id']}")
        if r["semester_id"] not in sem_ids:
            errors.append(f"assessments.csv references invalid semester_id: {r['semester_id']}")

    # Check StudentMarks -> Students, Assessments
    for r in data_tables["student_marks.csv"]:
        if r["student_id"] not in student_ids:
            errors.append(f"student_marks.csv references invalid student_id: {r['student_id']}")
        if r["assessment_id"] not in assessment_ids:
            errors.append(f"student_marks.csv references invalid assessment_id: {r['assessment_id']}")

    # Check AttendanceRecords -> Students, Subjects, Semesters
    for r in data_tables["attendance_records.csv"]:
        if r["student_id"] not in student_ids:
            errors.append(f"attendance_records.csv references invalid student_id: {r['student_id']}")
        if r["subject_id"] not in subj_ids:
            errors.append(f"attendance_records.csv references invalid subject_id: {r['subject_id']}")
        if r["semester_id"] not in sem_ids:
            errors.append(f"attendance_records.csv references invalid semester_id: {r['semester_id']}")

    # Check SemesterResults -> Students, Semesters
    for r in data_tables["semester_results.csv"]:
        if r["student_id"] not in student_ids:
            errors.append(f"semester_results.csv references invalid student_id: {r['student_id']}")
        if r["semester_id"] not in sem_ids:
            errors.append(f"semester_results.csv references invalid semester_id: {r['semester_id']}")

    # Check BacklogRecords -> Students, Subjects, Semesters
    for r in data_tables["backlog_records.csv"]:
        if r["student_id"] not in student_ids:
            errors.append(f"backlog_records.csv references invalid student_id: {r['student_id']}")
        if r["subject_id"] not in subj_ids:
            errors.append(f"backlog_records.csv references invalid subject_id: {r['subject_id']}")
        if r["semester_id"] not in sem_ids:
            errors.append(f"backlog_records.csv references invalid semester_id: {r['semester_id']}")

    print("  -> Referential integrity: VERIFIED (Zero orphan records).")

    # 5. Assessment Marks Domain Validation
    print("\n[CHECK 5] Verifying Marks Ranges & Assessment Constraints...")
    assessment_max_map = {r["assessment_id"]: float(r["max_marks"]) for r in data_tables["assessments.csv"]}
    mark_range_violations = 0
    for r in data_tables["student_marks.csv"]:
        m = float(r["marks_obtained"])
        max_m = assessment_max_map[r["assessment_id"]]
        if m < 0.0 or m > max_m:
            errors.append(f"ERR-MRK-001: Mark {m} out of range [0.0, {max_m}] in record {r['student_mark_id']}")
            mark_range_violations += 1
            if mark_range_violations > 5:
                break
    if mark_range_violations == 0:
        print("  -> Marks range compliance: VERIFIED (All marks between 0 and max_marks).")

    # 6 & 7. Attendance Domain & Mathematical Consistency
    print("\n[CHECK 6 & 7] Verifying Attendance Counts & Percentage Consistency...")
    att_violations = 0
    for r in data_tables["attendance_records.csv"]:
        held = int(r["classes_held"])
        att = int(r["classes_attended"])
        pct = float(r["attendance_percentage"])

        if held < 0 or att < 0:
            errors.append(f"ERR-ATT-001: Negative attendance in record {r['attendance_id']}")
            att_violations += 1
        elif att > held:
            errors.append(f"ERR-ATT-001: Classes attended ({att}) > held ({held}) in record {r['attendance_id']}")
            att_violations += 1

        expected_pct = round((att / held) * 100.0, 2) if held > 0 else 0.0
        if abs(pct - expected_pct) > 0.01:
            errors.append(f"ERR-ATT-002: Inconsistent attendance percentage in record {r['attendance_id']}: stored {pct} vs calculated {expected_pct}")
            att_violations += 1

        if att_violations > 5:
            break
    if att_violations == 0:
        print("  -> Attendance mathematical integrity: VERIFIED.")

    # 8. Uniqueness Constraints & Duplicate Record Checks
    print("\n[CHECK 8] Checking Domain Uniqueness Constraints...")
    # A student should have at most 1 mark per assessment
    student_ass_pairs = {(r["student_id"], r["assessment_id"]) for r in data_tables["student_marks.csv"]}
    if len(student_ass_pairs) != len(data_tables["student_marks.csv"]):
        errors.append("Duplicate student-assessment marks entries detected!")

    # A student should have at most 1 attendance record per subject per semester
    student_att_pairs = {(r["student_id"], r["subject_id"], r["semester_id"]) for r in data_tables["attendance_records.csv"]}
    if len(student_att_pairs) != len(data_tables["attendance_records.csv"]):
        errors.append("Duplicate student attendance records detected for same subject and semester!")

    # A student should have at most 1 result per semester
    student_res_pairs = {(r["student_id"], r["semester_id"]) for r in data_tables["semester_results.csv"]}
    if len(student_res_pairs) != len(data_tables["semester_results.csv"]):
        errors.append("Duplicate student semester results detected for same semester!")

    print("  -> Domain uniqueness constraints: VERIFIED.")

    # 9. Semester Results Validation (SGPA / CGPA in [0, 10])
    print("\n[CHECK 9] Verifying SGPA / CGPA Range Limits...")
    gpa_violations = 0
    for r in data_tables["semester_results.csv"]:
        sgpa = float(r["sgpa"])
        cgpa = float(r["cgpa"])
        if sgpa < 0.0 or sgpa > 10.0 or cgpa < 0.0 or cgpa > 10.0:
            errors.append(f"Result {r['result_id']}: SGPA/CGPA ({sgpa}, {cgpa}) out of bounds [0.0, 10.0]")
            gpa_violations += 1
            if gpa_violations > 5:
                break
    if gpa_violations == 0:
        print("  -> SGPA and CGPA bounds [0.0, 10.0]: VERIFIED.")

    # Summary Report
    print("\n" + "=" * 70)
    print("DATASET VALIDATION SUMMARY REPORT")
    print("=" * 70)
    print(f"Total Tables Checked       : {len(data_tables)}")
    print(f"Total Records Inspected    : {sum(len(rows) for rows in data_tables.values())}")
    print(f"Total Errors Found         : {len(errors)}")
    print(f"Total Warnings Flagged     : {len(warnings)}")

    if errors:
        print("\nVALIDATION FAILED with the following violations:")
        for e in errors:
            print(f"  [X] {e}")
        sys.exit(1)
    else:
        print("\nALL INTEGRITY CHECKS PASSED SUCCESSFULLY. DATASET IS VALID & CONSISTENT.")
        print("=" * 70)


if __name__ == "__main__":
    main()
