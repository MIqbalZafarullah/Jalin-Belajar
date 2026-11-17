import Dexie, { Table } from 'dexie';
import { 
  User, 
  School, 
  Competency, 
  Question, 
  Material, 
  Assessment, 
  AssessmentSubmission, 
  PracticeSession, 
  SyncQueueItem, 
  SyncHistoryItem, 
  BestPracticePost, 
  MentoringNote 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_SCHOOLS, 
  INITIAL_COMPETENCIES, 
  INITIAL_QUESTIONS, 
  INITIAL_MATERIALS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_BEST_PRACTICES, 
  INITIAL_MENTORING_NOTES 
} from './seedData';

export class JalinBelajarDB extends Dexie {
  users!: Table<User, string>;
  schools!: Table<School, string>;
  competencies!: Table<Competency, string>;
  questions!: Table<Question, string>;
  materials!: Table<Material, string>;
  assessments!: Table<Assessment, string>;
  submissions!: Table<AssessmentSubmission, string>;
  practiceSessions!: Table<PracticeSession, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  syncHistory!: Table<SyncHistoryItem, string>;
  bestPractices!: Table<BestPracticePost, string>;
  mentoringNotes!: Table<MentoringNote, string>;

  constructor() {
    super('JalinBelajarDB');
    this.version(1).stores({
      users: 'id, username, role, schoolId',
      schools: 'id, npsn, name, level, district, priorityLevel, is3TArea',
      competencies: 'id, code, domain, level',
      questions: 'id, competencyId, domain, level, difficulty',
      materials: 'id, domain, level, competencyId, isDownloadedOffline',
      assessments: 'id, schoolId, teacherId, domain, level, status',
      submissions: 'id, assessmentId, studentId, schoolId, score, isSynced',
      practiceSessions: 'id, studentId, materialId, competencyId, isSynced',
      syncQueue: 'id, action, entity, status, createdAt',
      syncHistory: 'id, syncedAt, status',
      bestPractices: 'id, category, authorName, createdAt',
      mentoringNotes: 'id, teacherId, date'
    });
  }

  async populateInitialData() {
    const userCount = await this.users.count();
    if (userCount === 0) {
      console.log('Menginisialisasi data awal JALIN BELAJAR...');
      await this.users.bulkAdd(INITIAL_USERS);
      await this.schools.bulkAdd(INITIAL_SCHOOLS);
      await this.competencies.bulkAdd(INITIAL_COMPETENCIES);
      await this.questions.bulkAdd(INITIAL_QUESTIONS);
      await this.materials.bulkAdd(INITIAL_MATERIALS);
      await this.assessments.bulkAdd(INITIAL_ASSESSMENTS);
      await this.bestPractices.bulkAdd(INITIAL_BEST_PRACTICES);
      await this.mentoringNotes.bulkAdd(INITIAL_MENTORING_NOTES);
      
      // Default initial sync history
      await this.syncHistory.add({
        id: 'sync-init-1',
        syncedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        itemsSynced: 12,
        status: 'SUKSES',
        connectionType: 'USB Hub Luring Mukomuko'
      });
      console.log('Inisialisasi basis data lokal selesai.');
    }
  }

  async resetToDefault() {
    await this.users.clear();
    await this.schools.clear();
    await this.competencies.clear();
    await this.questions.clear();
    await this.materials.clear();
    await this.assessments.clear();
    await this.submissions.clear();
    await this.practiceSessions.clear();
    await this.syncQueue.clear();
    await this.syncHistory.clear();
    await this.bestPractices.clear();
    await this.mentoringNotes.clear();
    await this.populateInitialData();
  }
}

export const db = new JalinBelajarDB();
// Auto populate if empty
db.populateInitialData().catch(err => {
  console.error('Gagal mengisi data awal:', err);
});

