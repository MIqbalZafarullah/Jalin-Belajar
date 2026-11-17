// JALIN BELAJAR - Core Type Definitions

export type UserRole = 
  | 'super_admin'
  | 'dinas_pendidikan'
  | 'kepala_sekolah'
  | 'guru_koordinator'
  | 'guru'
  | 'siswa';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  schoolName?: string;
  gradeLevel?: string; // e.g. "Kelas 5 SD" or "Kelas 8 SMP"
  subject?: string; // e.g. "Matematika", "Bahasa Indonesia", "Guru Kelas"
  nipNisn?: string;
}

export type SchoolLevel = 'SD' | 'SMP';
export type ElectricStatus = 'PLN 24 Jam' | 'PLN Terbatas' | 'Genset/Surya' | 'Belum Ada';
export type InternetStatus = 'Stabil (Fiber/4G)' | 'Terbatas (3G/4G Lemah)' | 'VSAT/Satelit' | 'Tidak Ada Sinyal';
export type PriorityLevel = 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah';

export interface School {
  id: string;
  npsn: string;
  name: string;
  level: SchoolLevel;
  district: string; // Kecamatan di Mukomuko
  address: string;
  headmasterName: string;
  electricStatus: ElectricStatus;
  internetStatus: InternetStatus;
  deviceCount: number; // Jumlah komputer/tablet yang berfungsi
  studentCount: number;
  teacherCount: number;
  literacyScoreAvg: number; // Skala 0-100
  numeracyScoreAvg: number; // Skala 0-100
  priorityLevel: PriorityLevel;
  is3TArea: boolean;
  notes?: string;
  updatedAt: string;
}

export type DomainCategory = 'Literasi' | 'Numerasi';
export type EducationLevel = 'SD' | 'SMP';

export interface Competency {
  id: string;
  code: string;
  domain: DomainCategory;
  level: EducationLevel;
  title: string;
  description: string;
  minMasteryScore: number; // e.g. 70
}

export interface Question {
  id: string;
  competencyId: string;
  domain: DomainCategory;
  level: EducationLevel;
  questionText: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
}

export interface Material {
  id: string;
  title: string;
  domain: DomainCategory;
  level: EducationLevel;
  competencyId: string;
  competencyName: string;
  description: string;
  content: string; // Markdown / Text pembelajaraan
  readingTimeMinutes: number;
  isDownloadedOffline: boolean;
  downloadedAt?: string;
  fileSizeBytes: number;
  recommendedForWeakCompetency?: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  domain: DomainCategory;
  level: EducationLevel;
  targetGrade: string;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  durationMinutes: number;
  questionIds: string[];
  competencyIds: string[];
  createdAt: string;
  status: 'Draf' | 'Aktif' | 'Selesai';
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  competencyId: string;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  score: number; // 0-100
  totalQuestions: number;
  correctCount: number;
  submittedAt: string;
  answers: StudentAnswer[];
  competencyMastery: {
    competencyId: string;
    competencyName: string;
    percentage: number;
    isMastered: boolean;
  }[];
  recommendedMaterialIds: string[];
  isSynced: boolean;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  materialId: string;
  competencyId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  isSynced: boolean;
}

export interface SyncQueueItem {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SUBMISSION';
  entity: 'submission' | 'school' | 'material_download' | 'practice';
  payload: any;
  createdAt: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  errorMessage?: string;
}

export interface SyncHistoryItem {
  id: string;
  syncedAt: string;
  itemsSynced: number;
  status: 'SUKSES' | 'GAGAL';
  connectionType: string;
}

export interface BestPracticePost {
  id: string;
  authorName: string;
  authorRole: string;
  schoolName: string;
  title: string;
  category: 'Strategi 3T' | 'Literasi Kelas Rendah' | 'Numerasi Kontekstual' | 'Media Offline';
  content: string;
  likes: number;
  createdAt: string;
}

export interface MentoringNote {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  date: string;
  focusArea: string;
  studentProgressObserved: string;
  actionPlan: string;
}

