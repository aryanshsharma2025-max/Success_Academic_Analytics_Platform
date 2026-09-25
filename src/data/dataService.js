/**
 * SAAP Prototype Data Service
 * Reads and serves the verified synthetic academic dataset (data/synthetic/*.csv)
 * and provides domain query accessors for all 16 prototype screens.
 *
 * Fully traceable to:
 * - IEEE SRS v1.0 (Section 10, 15, 17, 18, 24, 25)
 * - Database Design & ERD (docs/database/database-design.md)
 * - Synthetic Dataset (docs/data/synthetic-data-design.md)
 */

import rawData from './syntheticData.json';

// Prototype Demo Users mapped strictly to SRS Roles (Table 4)
export const PROTOTYPE_USERS = [
  {
    userId: 'usr-student-001',
    username: 'aryansh',
    email: 'aryansh@ssitm.ac.in',
    fullName: 'Aryansh Sharma',
    roleId: 'ROL-001',
    roleName: 'Student',
    studentId: 'e0e96a43-ded5-5312-9090-65e653459b27', // SYN-2024-CSE-0004
    rollNumber: 'SYN-2024-CSE-0004',
    department: 'Computer Science & Engineering',
    program: 'B.Tech Computer Science & Engineering',
    batch: 'BT-CSE Batch 2024-2028',
    currentSemester: 'Semester 3',
    mentorName: 'Prof. V. Sharma',
    isActive: true,
    lastLogin: '22-Sep-2026 19:40'
  },
  {
    userId: 'usr-mentor-001',
    username: 'v_sharma',
    email: 'v.sharma@ssitm.ac.in',
    fullName: 'Prof. V. Sharma',
    roleId: 'ROL-002',
    roleName: 'Mentor',
    department: 'Computer Science & Engineering',
    cohortBatch: 'BT-CSE Batch 2024-2028',
    isActive: true,
    lastLogin: '22-Sep-2026 11:20'
  },
  {
    userId: 'usr-faculty-001',
    username: 'dr_rk_sharma',
    email: 'rk.sharma@ssitm.ac.in',
    fullName: 'Dr. R. K. Sharma',
    roleId: 'ROL-003',
    roleName: 'Faculty',
    department: 'Computer Science & Engineering',
    taughtSubjectCodes: ['CS301', 'CS202'],
    isActive: true,
    lastLogin: '22-Sep-2026 14:15'
  },
  {
    userId: 'usr-hod-001',
    username: 'm_sen_hod',
    email: 'm.sen@ssitm.ac.in',
    fullName: 'Dr. M. Sen',
    roleId: 'ROL-004',
    roleName: 'Department User',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    isActive: true,
    lastLogin: '22-Sep-2026 10:00'
  },
  {
    userId: 'usr-admin-001',
    username: 'acad_admin',
    email: 'admin.acad@ssitm.ac.in',
    fullName: 'Academic Administrator',
    roleId: 'ROL-005',
    roleName: 'Academic Administrator',
    department: 'Office of Academic Affairs',
    isActive: true,
    lastLogin: '22-Sep-2026 15:30'
  },
  {
    userId: 'usr-analyst-001',
    username: 'data_analyst',
    email: 'analyst@ssitm.ac.in',
    fullName: 'Dr. A. Verma',
    roleId: 'ROL-006',
    roleName: 'Data Analyst',
    department: 'Institutional Research & Analytics',
    isActive: true,
    lastLogin: '21-Sep-2026 16:00'
  },
  {
    userId: 'usr-ml-001',
    username: 'ml_engineer',
    email: 'ml.eng@ssitm.ac.in',
    fullName: 'Er. S. Gupta',
    roleId: 'ROL-007',
    roleName: 'ML Engineer',
    department: 'AI & Predictive Analytics Unit',
    isActive: true,
    lastLogin: '22-Sep-2026 09:15'
  },
  {
    userId: 'usr-sysadmin-001',
    username: 'sys_admin',
    email: 'admin.sys@ssitm.ac.in',
    fullName: 'System Administrator (SuperUser)',
    roleId: 'ROL-008',
    roleName: 'System Administrator',
    department: 'IT Infrastructure Operations',
    isActive: true,
    lastLogin: '22-Sep-2026 18:00'
  },
  {
    userId: 'usr-auditor-001',
    username: 'auditor_user',
    email: 'auditor@ssitm.ac.in',
    fullName: 'Compliance Auditor',
    roleId: 'ROL-009',
    roleName: 'Auditor / Viewer',
    department: 'Academic Compliance & Governance',
    isActive: true,
    lastLogin: '22-Sep-2026 08:30'
  }
];

// In-memory mutable audit log state (traceable to SCR-016)
let auditLogs = [
  {
    id: 'aud-001',
    timestamp: '2026-09-22 14:15:30',
    actorUserId: 'dr_rk_sharma',
    action: 'MARKS_COMMIT',
    entityAffected: 'StudentMarks',
    entityId: 'CS301-CT1',
    result: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-22 14:10:12',
    actorUserId: 'dr_rk_sharma',
    action: 'IMPORT_VALIDATE',
    entityAffected: 'ImportJobs',
    entityId: 'IMP-104',
    result: 'FAILED'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-22 11:30:00',
    actorUserId: 'm_sen_hod',
    action: 'REPORT_EXPORT',
    entityAffected: 'ReportJobs',
    entityId: 'REP-502',
    result: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-22 10:05:44',
    actorUserId: 'unauthenticated',
    action: 'LOGIN_ATTEMPT',
    entityAffected: 'Users',
    entityId: 'unknown',
    result: 'DENIED'
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-22 09:30:21',
    actorUserId: 'admin_acad',
    action: 'MASTER_DATA_EDIT',
    entityAffected: 'Subjects',
    entityId: 'CS304',
    result: 'SUCCESS'
  }
];

// Staging Import Jobs (SCR-009 / SCR-010)
let importJobs = [
  {
    jobId: 'IMP-104',
    dataType: 'MARKS',
    fileName: 'marks_sem3_cs301_internal.csv',
    uploadedBy: 'Dr. R. K. Sharma',
    uploadedAt: '22-Sep-2026 14:10',
    program: 'B.Tech CSE',
    batch: 'Batch 2024-2028',
    semester: 'Semester 3',
    subject: 'CS301 - Database Management Systems',
    assessment: 'Class Test 1 (Max: 20.00)',
    totalRows: 62,
    validRows: 60,
    invalidRows: 2,
    status: 'FAILED',
    errors: [
      {
        rowNumber: 14,
        studentRoll: 'SYN-2024-CSE-0014',
        offendingField: 'marks_obtained',
        valueEntered: '25.00',
        errorCode: 'ERR-MRK-001',
        diagnosticReason: 'Marks value (25.00) exceeds maximum allowed (20.00).'
      },
      {
        rowNumber: 38,
        studentRoll: 'SYN-2024-CSE-0999',
        offendingField: 'student_id',
        valueEntered: 'SYN-2024-CSE-0999',
        errorCode: 'ERR-STU-001',
        diagnosticReason: 'Student identifier not found in enrolled batch roster.'
      }
    ]
  },
  {
    jobId: 'IMP-103',
    dataType: 'ATTENDANCE',
    fileName: 'attendance_sem3_cs301_aug.csv',
    uploadedBy: 'Dr. R. K. Sharma',
    uploadedAt: '20-Sep-2026 09:30',
    program: 'B.Tech CSE',
    batch: 'Batch 2024-2028',
    semester: 'Semester 3',
    subject: 'CS301 - Database Management Systems',
    assessment: 'Continuous Attendance',
    totalRows: 62,
    validRows: 62,
    invalidRows: 0,
    status: 'COMMITTED',
    errors: []
  },
  {
    jobId: 'IMP-102',
    dataType: 'STUDENTS',
    fileName: 'student_admission_roster_2024.csv',
    uploadedBy: 'Academic Administrator',
    uploadedAt: '15-Sep-2026 11:00',
    program: 'B.Tech CSE',
    batch: 'Batch 2024-2028',
    semester: 'Semester 1',
    subject: 'All Enrolled',
    assessment: 'Admissions',
    totalRows: 120,
    validRows: 120,
    invalidRows: 0,
    status: 'COMMITTED',
    errors: []
  }
];

// Mentoring notes store (SCR-006)
let mentoringNotes = {
  'e0e96a43-ded5-5312-9090-65e653459b27': [ // Aryansh
    {
      date: '10-Sep-2026',
      mentor: 'Prof. V. Sharma',
      text: 'Reviewed strong Semester 2 performance (SGPA 7.50). Advised applying for undergraduate research seminar in algorithms.'
    }
  ],
  '0ebe59cd-25d5-595a-974f-e02daeb7bb92': [ // Aryan Verma (SYN-2024-CSE-0006)
    {
      date: '15-Aug-2026',
      mentor: 'Prof. V. Sharma',
      text: 'Discussed digital electronics lab absence. Student cited illness. Advised to submit medical certificate.'
    }
  ]
};

// Insights Store (SCR-013)
let insightsData = [
  {
    id: 'ins-001',
    studentId: '0ebe59cd-25d5-595a-974f-e02daeb7bb92', // Aryan Verma
    studentRoll: 'SYN-2024-CSE-0006',
    studentName: 'Aryan Verma',
    category: 'ATTENDANCE_DEFICIT',
    typeBadge: 'ATTENDANCE BOUNDARY ALERT',
    severity: 'danger',
    title: 'Critical attendance decline in Discrete Mathematics (CS302)',
    academicPeriod: 'August-September 2026 (Sem 3)',
    evidenceMetric: 'Current attendance is 66.7% (Baseline Design Threshold: 75.0% [Prototype Assumption]). Attended 28 of 42 sessions.',
    supportingFactor: 'Missed 4 consecutive lecture sessions between Sep 5 and Sep 12.',
    confidence: 'HIGH (100% recorded empirical attendance)',
    recommendationText: 'Attend the next 5 consecutive lectures to raise attendance above 75% prior to exam lock. Schedule an advising session with Dr. R. K. Sharma.',
    status: 'NEW'
  },
  {
    id: 'ins-002',
    studentId: 'e0e96a43-ded5-5312-9090-65e653459b27', // Aryansh Sharma
    studentRoll: 'SYN-2024-CSE-0004',
    studentName: 'Aryansh Sharma',
    category: 'ACADEMIC_MASTERY',
    typeBadge: 'PERFORMANCE EXCELLENCE INDICATOR',
    severity: 'success',
    title: 'Consistent performance in Object-Oriented Programming (CS201)',
    academicPeriod: 'Semester 2 Completion',
    evidenceMetric: 'Earned 88.5% marks (Cohort Top 10%, Percentile: 92nd).',
    supportingFactor: 'Scored top tier marks in both mid-semester and laboratory evaluations.',
    confidence: 'HIGH',
    recommendationText: 'Eligible to apply for Undergraduate Peer Tutoring / Advanced Competitive Programming Track.',
    status: 'VIEWED'
  },
  {
    id: 'ins-003',
    studentId: 'e0e96a43-ded5-5312-9090-65e653459b27', // Aryansh Sharma
    studentRoll: 'SYN-2024-CSE-0004',
    studentName: 'Aryansh Sharma',
    category: 'ATTENDANCE_DEFICIT',
    typeBadge: 'ATTENDANCE ADVISORY',
    severity: 'warning',
    title: 'Digital Electronics attendance near threshold (77.5%)',
    academicPeriod: 'Semester 3 Ongoing',
    evidenceMetric: 'Attended 31 of 40 sessions (77.5%). Baseline threshold buffer is only 1 session.',
    supportingFactor: 'One additional absence will bring attendance below the 75% configurable advisory threshold.',
    confidence: 'HIGH',
    recommendationText: 'Maintain high attendance over the next 2 weeks to ensure uninterrupted exam eligibility.',
    status: 'NEW'
  },
  {
    id: 'ins-004',
    departmentCode: 'CSE',
    category: 'DEPARTMENT_CURRICULUM',
    typeBadge: 'CURRICULUM BOTTLENECK ALERT',
    severity: 'warning',
    title: 'Elevated Backlog Density in Discrete Mathematics (CS302)',
    academicPeriod: 'Academic Year 2026-27 (Sem 3)',
    evidenceMetric: '14 active backlogs recorded across Batch 2024. Failure rate 23.8% vs 8.6% dept average.',
    supportingFactor: 'Students consistently struggle on Unit 2 (Combinatorics and Graph Theory).',
    confidence: 'HIGH',
    recommendationText: 'Conduct department-wide tutorial sessions and review assessment weightage alignment.',
    status: 'NEW'
  }
];

// Simulated Model Metadata (SCR-014) — Prototype specification mock for Semester 6 UI evaluation
export const ML_MODEL_METADATA = {
  modelName: 'AcademicRiskClassifier',
  version: 'v1.2.0 (Simulated Specification)',
  status: 'SIMULATED / PROTOTYPE SPECIFICATION ONLY',
  trainingHorizon: '2022-2025 Institutional Cohorts (Simulated Scope)',
  algorithm: 'Random Forest (Conceptual Design — Implementation in Sem 6)',
  metrics: {
    precision: '84.2% (Target/Benchmark)',
    recall: '81.5% (Target/Benchmark)',
    f1Score: '0.828 (Target/Benchmark)',
    latencyP95: '42 ms (Simulated Benchmark)'
  }
};

export const PREDICTION_CASES = {
  '0ebe59cd-25d5-595a-974f-e02daeb7bb92': { // Aryan Verma
    studentName: 'Aryan Verma',
    rollNumber: 'SYN-2024-CSE-0006',
    batch: 'BT-CSE Batch 2024-2028',
    targetIndicator: 'Semester 3 Backlog Vulnerability (CS302 Discrete Mathematics)',
    riskScore: 0.724,
    riskBand: 'HIGH RISK (SIMULATED)',
    applicablePeriod: 'Current Active Term (Semester 3)',
    supportingFactors: [
      { factor: 'Discrete Maths Internal Test score dropped 38% below cohort mean', weight: '+0.34 risk weight' },
      { factor: 'Subject Attendance is 66.7% — 8.3% below baseline design threshold (75%)', weight: '+0.26 risk weight' },
      { factor: 'Historical Trend: Cumulative CGPA declined across recent terms', weight: '+0.12 risk weight' }
    ],
    recommendedIntervention: 'Immediate mentor counseling required. Assign remedial problem sets in Discrete Maths Unit 2 and mandate tutorial attendance.'
  },
  'e0e96a43-ded5-5312-9090-65e653459b27': { // Aryansh Sharma
    studentName: 'Aryansh Sharma',
    rollNumber: 'SYN-2024-CSE-0004',
    batch: 'BT-CSE Batch 2024-2028',
    targetIndicator: 'Semester 3 Backlog Vulnerability',
    riskScore: 0.142,
    riskBand: 'LOW RISK (SIMULATED)',
    applicablePeriod: 'Current Active Term (Semester 3)',
    supportingFactors: [
      { factor: 'Internal assessment scores rank in upper quartile (+0.85 percentile)', weight: '-0.30 risk weight' },
      { factor: 'Attendance across all subjects exceeds 77.5%', weight: '-0.22 risk weight' },
      { factor: 'Zero historical backlogs across Semesters 1 and 2', weight: '-0.15 risk weight' }
    ],
    recommendedIntervention: 'No risk intervention required. Maintain current academic trajectory.'
  }
};

// Report Jobs (SCR-015)
let reportJobs = [
  {
    jobId: 'REP-502',
    reportTitle: 'Dept_Performance_Sem2.pdf',
    reportType: 'Department Academic Performance Summary',
    requestedBy: 'Dr. M. Sen',
    requestedAt: '22-Sep-2026 11:30',
    format: 'PDF',
    status: 'COMPLETED'
  },
  {
    jobId: 'REP-501',
    reportTitle: 'Attendance_Shortage_Aug.csv',
    reportType: 'Comprehensive Attendance Shortage Audit',
    requestedBy: 'Dr. R. K. Sharma',
    requestedAt: '20-Sep-2026 16:45',
    format: 'CSV',
    status: 'COMPLETED'
  }
];

// Exported Data Service Accessor Object
export const dataService = {
  // Master Entities
  getDepartments: () => rawData.departments,
  getPrograms: () => rawData.programs,
  getBatches: () => rawData.batches,
  getAcademicYears: () => rawData.academic_years,
  getSemesters: () => rawData.semesters,
  getSubjects: () => rawData.subjects,
  getStudents: () => rawData.students,
  getStudentEnrollments: () => rawData.student_enrollments,
  getAssessments: () => rawData.assessments,

  // Student specific queries
  getStudentById: (id) => rawData.students.find(s => s.student_id === id),
  getStudentByRoll: (roll) => rawData.students.find(s => s.institutional_identifier === roll),
  
  getStudentEnrollment: (studentId) => {
    const enr = rawData.student_enrollments.find(e => e.student_id === studentId);
    if (!enr) return null;
    const prog = rawData.programs.find(p => p.program_id === enr.program_id);
    const batch = rawData.batches.find(b => b.batch_id === enr.batch_id);
    const dept = prog ? rawData.departments.find(d => d.department_id === prog.department_id) : null;
    return {
      ...enr,
      programName: prog ? prog.program_name : 'Unknown Program',
      programCode: prog ? prog.code : '',
      batchName: batch ? batch.batch_name : 'Unknown Batch',
      departmentName: dept ? dept.department_name : 'Unknown Department'
    };
  },

  getStudentResults: (studentId) => {
    return rawData.semester_results
      .filter(r => r.student_id === studentId)
      .map(r => {
        const sem = rawData.semesters.find(s => s.semester_id === r.semester_id);
        const year = sem ? rawData.academic_years.find(y => y.academic_year_id === sem.academic_year_id) : null;
        return {
          ...r,
          semesterNumber: sem ? sem.semester_number : '?',
          academicYearLabel: year ? year.year_label : '2024-2025'
        };
      })
      .sort((a, b) => parseInt(a.semesterNumber) - parseInt(b.semesterNumber));
  },

  getStudentAttendance: (studentId) => {
    return rawData.attendance_records
      .filter(a => a.student_id === studentId)
      .map(a => {
        const sub = rawData.subjects.find(s => s.subject_id === a.subject_id);
        const sem = rawData.semesters.find(s => s.semester_id === a.semester_id);
        return {
          ...a,
          subjectCode: sub ? sub.subject_code : 'N/A',
          subjectName: sub ? sub.subject_name : 'N/A',
          semesterNumber: sem ? sem.semester_number : '?'
        };
      });
  },

  getStudentMarks: (studentId) => {
    return rawData.student_marks
      .filter(m => m.student_id === studentId)
      .map(m => {
        const ass = rawData.assessments.find(a => a.assessment_id === m.assessment_id);
        const sub = ass ? rawData.subjects.find(s => s.subject_id === ass.subject_id) : null;
        const sem = ass ? rawData.semesters.find(s => s.semester_id === ass.semester_id) : null;
        return {
          ...m,
          assessmentType: ass ? ass.assessment_type : 'N/A',
          maxMarks: ass ? ass.max_marks : '100',
          subjectCode: sub ? sub.subject_code : 'N/A',
          subjectName: sub ? sub.subject_name : 'N/A',
          semesterNumber: sem ? sem.semester_number : '?'
        };
      });
  },

  getStudentBacklogs: (studentId) => {
    return rawData.backlog_records
      .filter(b => b.student_id === studentId)
      .map(b => {
        const sub = rawData.subjects.find(s => s.subject_id === b.subject_id);
        const sem = rawData.semesters.find(s => s.semester_id === b.semester_id);
        return {
          ...b,
          subjectCode: sub ? sub.subject_code : 'N/A',
          subjectName: sub ? sub.subject_name : 'N/A',
          originSemester: sem ? `Sem ${sem.semester_number}` : 'Sem ?'
        };
      });
  },

  // Mentor queries
  getMentorMentees: (batchName = 'BT-CSE Batch 2024-2028') => {
    // Return the cohort of students belonging to CSE Batch 2024
    const batch = rawData.batches.find(b => b.batch_name.includes('2024') && b.batch_name.includes('CSE'));
    const batchId = batch ? batch.batch_id : null;
    const enrollments = rawData.student_enrollments.filter(e => e.batch_id === batchId);
    const menteeList = enrollments.slice(0, 28).map(e => {
      const stu = rawData.students.find(s => s.student_id === e.student_id);
      const results = rawData.semester_results.filter(r => r.student_id === e.student_id);
      const latestResult = results.length > 0 ? results[results.length - 1] : { sgpa: '7.50', cgpa: '7.40' };
      const attRecords = rawData.attendance_records.filter(a => a.student_id === e.student_id);
      const avgAtt = attRecords.length > 0
        ? (attRecords.reduce((acc, cur) => acc + parseFloat(cur.attendance_percentage), 0) / attRecords.length).toFixed(1)
        : '82.0';
      const backlogs = rawData.backlog_records.filter(b => b.student_id === e.student_id && b.status === 'ACTIVE');

      let riskFlag = 'NORMAL';
      if (parseFloat(avgAtt) < 75.0) riskFlag = 'ATTENDANCE';
      else if (parseFloat(latestResult.sgpa) < 7.0) riskFlag = 'MARKS DROP';
      else if (backlogs.length > 0) riskFlag = 'BACKLOG';

      return {
        studentId: e.student_id,
        rollNumber: stu ? stu.institutional_identifier : 'N/A',
        fullName: stu ? stu.full_name : 'Unknown Student',
        sgpa: latestResult.sgpa,
        cgpa: latestResult.cgpa,
        attendance: `${avgAtt}%`,
        attendanceNum: parseFloat(avgAtt),
        riskFlag,
        activeBacklogs: backlogs.length
      };
    });
    return menteeList;
  },

  getMentoringNotes: (studentId) => {
    return mentoringNotes[studentId] || [];
  },

  saveMentoringNote: (studentId, mentorName, noteText) => {
    if (!mentoringNotes[studentId]) mentoringNotes[studentId] = [];
    const newNote = {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      mentor: mentorName,
      text: noteText
    };
    mentoringNotes[studentId].unshift(newNote);
    return newNote;
  },

  // Faculty Queries
  getFacultySubjectMarksRoster: (subjectCode = 'CS301', assessmentType = 'Class Test 1') => {
    const subject = rawData.subjects.find(s => s.subject_code === subjectCode);
    if (!subject) return [];
    const assessment = rawData.assessments.find(a => a.subject_id === subject.subject_id && a.assessment_type === assessmentType);
    const assessmentId = assessment ? assessment.assessment_id : null;
    const maxMarks = assessment ? parseFloat(assessment.max_marks) : 20.0;

    // Filter marks for this assessment
    const marks = rawData.student_marks.filter(m => m.assessment_id === assessmentId);
    return marks.slice(0, 40).map(m => {
      const student = rawData.students.find(s => s.student_id === m.student_id);
      return {
        studentMarkId: m.student_mark_id,
        studentId: m.student_id,
        rollNumber: student ? student.institutional_identifier : 'N/A',
        studentName: student ? student.full_name : 'N/A',
        marksObtained: parseFloat(m.marks_obtained).toFixed(2),
        maxMarks: maxMarks.toFixed(2),
        grade: parseFloat(m.marks_obtained) >= (0.8 * maxMarks) ? 'A' : parseFloat(m.marks_obtained) >= (0.6 * maxMarks) ? 'B' : 'C'
      };
    });
  },

  getFacultyAttendanceRoster: (subjectCode = 'CS301') => {
    const subject = rawData.subjects.find(s => s.subject_code === subjectCode);
    if (!subject) return [];
    const attList = rawData.attendance_records.filter(a => a.subject_id === subject.subject_id);
    return attList.slice(0, 40).map(a => {
      const student = rawData.students.find(s => s.student_id === a.student_id);
      const pct = parseFloat(a.attendance_percentage);
      return {
        attendanceId: a.attendance_id,
        studentId: a.student_id,
        rollNumber: student ? student.institutional_identifier : 'N/A',
        studentName: student ? student.full_name : 'N/A',
        classesHeld: parseInt(a.classes_held),
        classesAttended: parseInt(a.classes_attended),
        attendancePercentage: `${pct.toFixed(1)}%`,
        riskStatus: pct < 75.0 ? 'AT RISK (!)' : 'NORMAL'
      };
    });
  },

  // Department Analytics (SCR-008)
  getDepartmentSummary: (deptCode = 'CSE') => {
    const cseSubjects = rawData.subjects.filter(s => s.subject_code.startsWith('CS'));
    const subjectOutcomes = cseSubjects.slice(0, 8).map(s => {
      const marks = rawData.student_marks.filter(m => {
        const ass = rawData.assessments.find(a => a.assessment_id === m.assessment_id);
        return ass && ass.subject_id === s.subject_id;
      });
      const avg = marks.length > 0
        ? (marks.reduce((acc, m) => acc + parseFloat(m.marks_obtained), 0) / marks.length).toFixed(1)
        : '68.4';
      const backlogs = rawData.backlog_records.filter(b => b.subject_id === s.subject_id && b.status === 'ACTIVE');
      return {
        subjectCode: s.subject_code,
        subjectName: s.subject_name,
        passPercentage: s.subject_code === 'CS302' ? '76.2%' : s.subject_code === 'CS301' ? '92.5%' : '88.0%',
        avgMarks: `${avg} / 100`,
        backlogCount: backlogs.length > 0 ? backlogs.length : s.subject_code === 'CS302' ? 14 : 4,
        difficultyRating: s.subject_code === 'CS302' ? 'High Difficulty!' : 'Normal'
      };
    });

    return {
      departmentName: 'Computer Science & Engineering',
      code: 'CSE',
      totalStudents: 113,
      overallPassRate: '91.4%',
      avgDeptSgpa: '7.65',
      highRiskBacklogs: 18,
      subjectOutcomes
    };
  },

  // Import Jobs (SCR-009 / SCR-010)
  getImportJobs: () => importJobs,
  getImportJobById: (id) => importJobs.find(j => j.jobId === id),
  addImportJob: (newJob) => {
    importJobs = [newJob, ...importJobs];
    return newJob;
  },
  commitImportJob: (jobId, committedRows) => {
    const job = importJobs.find(j => j.jobId === jobId);
    if (job) {
      job.status = 'COMMITTED';
      job.validRows = committedRows;
      job.invalidRows = 0;
      dataService.addAuditLog({
        actorUserId: 'admin_acad',
        action: 'IMPORT_COMMIT',
        entityAffected: 'ImportJobs',
        entityId: jobId,
        result: 'SUCCESS'
      });
    }
  },

  // Insights (SCR-013)
  getInsights: (role, studentId) => {
    if (role === 'Student' && studentId) {
      return insightsData.filter(i => i.studentId === studentId);
    }
    if (role === 'Mentor') {
      return insightsData.filter(i => i.studentId);
    }
    if (role === 'Department User') {
      return insightsData.filter(i => i.departmentCode === 'CSE' || !i.studentId);
    }
    return insightsData;
  },

  updateInsightStatus: (id, newStatus) => {
    const item = insightsData.find(i => i.id === id);
    if (item) item.status = newStatus;
  },

  // Predictions (SCR-014)
  getPrediction: (studentId) => {
    return PREDICTION_CASES[studentId] || PREDICTION_CASES['0ebe59cd-25d5-595a-974f-e02daeb7bb92'];
  },

  // Reports (SCR-015)
  getReportJobs: () => reportJobs,
  addReportJob: (reportType, format, requestedBy) => {
    const newId = `REP-${Math.floor(500 + Math.random() * 500)}`;
    const job = {
      jobId: newId,
      reportTitle: `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`,
      reportType,
      requestedBy,
      requestedAt: new Date().toLocaleString(),
      format,
      status: 'COMPLETED'
    };
    reportJobs = [job, ...reportJobs];
    dataService.addAuditLog({
      actorUserId: requestedBy,
      action: 'REPORT_EXPORT',
      entityAffected: 'ReportJobs',
      entityId: newId,
      result: 'SUCCESS'
    });
    return job;
  },

  // Audit Logs (SCR-016)
  getAuditLogs: () => auditLogs,
  addAuditLog: (entry) => {
    const newLog = {
      id: `aud-${String(auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      result: 'SUCCESS',
      ...entry
    };
    auditLogs = [newLog, ...auditLogs];
    return newLog;
  }
};
