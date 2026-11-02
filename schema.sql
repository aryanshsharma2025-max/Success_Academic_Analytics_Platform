-- =====================================================================
-- SUCCESS & ACADEMIC ANALYTICS PLATFORM (SAAP)
-- RELATIONAL DATABASE DEFINITION (DDL) — 3NF CANONICAL SCHEMA
-- Matches: CSV Dataset (13 Entities, 6,991 Records) & IEEE SRS v1.0
-- Standard: ANSI SQL / MySQL 8.0+ / PostgreSQL Compatible
-- =====================================================================

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    department_id CHAR(36) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    CONSTRAINT pk_departments PRIMARY KEY (department_id),
    CONSTRAINT uq_department_code UNIQUE (code)
);

-- 2. ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS academic_years (
    academic_year_id CHAR(36) NOT NULL,
    year_label VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT pk_academic_years PRIMARY KEY (academic_year_id),
    CONSTRAINT uq_academic_year_label UNIQUE (year_label)
);

-- 3. PROGRAMS
CREATE TABLE IF NOT EXISTS programs (
    program_id CHAR(36) NOT NULL,
    department_id CHAR(36) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    CONSTRAINT pk_programs PRIMARY KEY (program_id),
    CONSTRAINT uq_program_code UNIQUE (code),
    CONSTRAINT fk_programs_department FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. BATCHES
CREATE TABLE IF NOT EXISTS batches (
    batch_id CHAR(36) NOT NULL,
    program_id CHAR(36) NOT NULL,
    batch_name VARCHAR(255) NOT NULL,
    admission_year INT NOT NULL,
    CONSTRAINT pk_batches PRIMARY KEY (batch_id),
    CONSTRAINT fk_batches_program FOREIGN KEY (program_id) 
        REFERENCES programs(program_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. SEMESTERS
CREATE TABLE IF NOT EXISTS semesters (
    semester_id CHAR(36) NOT NULL,
    program_id CHAR(36) NOT NULL,
    semester_number INT NOT NULL,
    academic_year_id CHAR(36) NOT NULL,
    CONSTRAINT pk_semesters PRIMARY KEY (semester_id),
    CONSTRAINT fk_semesters_program FOREIGN KEY (program_id) 
        REFERENCES programs(program_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_semesters_academic_year FOREIGN KEY (academic_year_id) 
        REFERENCES academic_years(academic_year_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_program_semester_year UNIQUE (program_id, semester_number, academic_year_id)
);

-- 6. SUBJECTS
CREATE TABLE IF NOT EXISTS subjects (
    subject_id CHAR(36) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    credits DECIMAL(3, 1) NOT NULL,
    CONSTRAINT pk_subjects PRIMARY KEY (subject_id),
    CONSTRAINT uq_subject_code UNIQUE (subject_code)
);

-- 7. STUDENTS
CREATE TABLE IF NOT EXISTS students (
    student_id CHAR(36) NOT NULL,
    institutional_identifier VARCHAR(100) NOT NULL,
    user_id CHAR(36) NULL,
    full_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT pk_students PRIMARY KEY (student_id),
    CONSTRAINT uq_student_identifier UNIQUE (institutional_identifier)
);

-- 8. STUDENT ENROLLMENTS
CREATE TABLE IF NOT EXISTS student_enrollments (
    enrollment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    program_id CHAR(36) NOT NULL,
    batch_id CHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ENROLLED',
    CONSTRAINT pk_student_enrollments PRIMARY KEY (enrollment_id),
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_enrollments_program FOREIGN KEY (program_id) 
        REFERENCES programs(program_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_enrollments_batch FOREIGN KEY (batch_id) 
        REFERENCES batches(batch_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_student_program_enrollment UNIQUE (student_id, program_id, batch_id)
);

-- 9. ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id CHAR(36) NOT NULL,
    subject_id CHAR(36) NOT NULL,
    semester_id CHAR(36) NOT NULL,
    assessment_type VARCHAR(100) NOT NULL,
    max_marks DECIMAL(5, 2) NOT NULL,
    CONSTRAINT pk_assessments PRIMARY KEY (assessment_id),
    CONSTRAINT fk_assessments_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_assessments_semester FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 10. STUDENT MARKS
CREATE TABLE IF NOT EXISTS student_marks (
    student_mark_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    assessment_id CHAR(36) NOT NULL,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    recorded_at DATETIME NOT NULL,
    CONSTRAINT pk_student_marks PRIMARY KEY (student_mark_id),
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_marks_assessment FOREIGN KEY (assessment_id) 
        REFERENCES assessments(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_student_assessment_mark UNIQUE (student_id, assessment_id),
    CONSTRAINT chk_marks_non_negative CHECK (marks_obtained >= 0.0)
);

-- 11. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
    attendance_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    subject_id CHAR(36) NOT NULL,
    semester_id CHAR(36) NOT NULL,
    classes_held INT NOT NULL,
    classes_attended INT NOT NULL,
    attendance_percentage DECIMAL(5, 2) NOT NULL,
    CONSTRAINT pk_attendance_records PRIMARY KEY (attendance_id),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_attendance_semester FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_student_subject_semester_attendance UNIQUE (student_id, subject_id, semester_id),
    CONSTRAINT chk_attendance_bounds CHECK (classes_attended <= classes_held AND classes_attended >= 0)
);

-- 12. SEMESTER RESULTS
CREATE TABLE IF NOT EXISTS semester_results (
    result_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    semester_id CHAR(36) NOT NULL,
    sgpa DECIMAL(4, 2) NOT NULL,
    cgpa DECIMAL(4, 2) NOT NULL,
    result_status VARCHAR(50) NOT NULL,
    published_at DATETIME NOT NULL,
    CONSTRAINT pk_semester_results PRIMARY KEY (result_id),
    CONSTRAINT fk_results_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_results_semester FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_student_semester_result UNIQUE (student_id, semester_id),
    CONSTRAINT chk_gpa_bounds CHECK (sgpa >= 0.0 AND sgpa <= 10.0 AND cgpa >= 0.0 AND cgpa <= 10.0)
);

-- 13. BACKLOG RECORDS
CREATE TABLE IF NOT EXISTS backlog_records (
    backlog_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    subject_id CHAR(36) NOT NULL,
    semester_id CHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    cleared_at DATE NULL,
    CONSTRAINT pk_backlog_records PRIMARY KEY (backlog_id),
    CONSTRAINT fk_backlog_student FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_backlog_subject FOREIGN KEY (subject_id) 
        REFERENCES subjects(subject_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_backlog_semester FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_student_subject_semester_backlog UNIQUE (student_id, subject_id, semester_id)
);

-- =====================================================================
-- PERFORMANCE INDEXES FOR ANALYTICAL QUERIES
-- =====================================================================
CREATE INDEX idx_marks_student ON student_marks (student_id);
CREATE INDEX idx_marks_assessment ON student_marks (assessment_id);
CREATE INDEX idx_attendance_student_percentage ON attendance_records (student_id, attendance_percentage);
CREATE INDEX idx_results_student_sgpa ON semester_results (student_id, sgpa);
CREATE INDEX idx_backlog_student_status ON backlog_records (student_id, status);
