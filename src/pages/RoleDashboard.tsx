import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { db } from '../database/db';
import { 
  School, 
  Material, 
  Assessment, 
  AssessmentSubmission, 
  User, 
  Competency, 
  MentoringNote, 
  SyncHistoryItem, 
  PracticeSession 
} from '../types';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StudentAchievements } from '../modules/tuntas/StudentAchievements';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Wifi, 
  Laptop, 
  RotateCw, 
  ArrowRight,
  ShieldCheck,
  Award,
  PlayCircle,
  HelpCircle,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  Activity,
  Check,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';

export const RoleDashboard: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { isEffectiveOffline, syncQueueCount, triggerSync } = useOffline();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<School[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mentoringNotes, setMentoringNotes] = useState<MentoringNote[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>([]);
  const [practices, setPractices] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [s, m, a, sub, c, u, mn, sh, p] = await Promise.all([
          db.schools.toArray(),
          db.materials.toArray(),
          db.assessments.toArray(),
          db.submissions.toArray(),
          db.competencies.toArray(),
          db.users.toArray(),
          db.mentoringNotes.toArray(),
          db.syncHistory.toArray(),
          db.practiceSessions.toArray()
        ]);
        setSchools(s);
        setMaterials(m);
        setAssessments(a);
        setSubmissions(sub);
        setCompetencies(c);
        setUsers(u);
        setMentoringNotes(mn);
        setSyncHistory(sh);
        setPractices(p);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Common aggregates
  const totalStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
  const totalTeachers = schools.reduce((acc, s) => acc + s.teacherCount, 0);
  const avgLitKabupaten = (schools.reduce((acc, s) => acc + s.literacyScoreAvg, 0) / (schools.length || 1)).toFixed(1);
  const avgNumKabupaten = (schools.reduce((acc, s) => acc + s.numeracyScoreAvg, 0) / (schools.length || 1)).toFixed(1);

  // Current School (for Kepala Sekolah / Guru / Siswa)
  const mySchool = schools.find(s => s.id === currentUser?.schoolId) || schools[0] || {
    id: 'sch-01',
    name: 'SDN 05 Air Rami',
    studentCount: 142,
    teacherCount: 8,
    deviceCount: 6,
    electricStatus: 'PLN Terbatas',
    internetStatus: 'VSAT/Satelit',
    priorityLevel: 'Sangat Tinggi',
    district: 'Air Rami',
    literacyScoreAvg: 48,
    numeracyScoreAvg: 42
  };

  // ==========================================
  // 1. DASHBOARD SISWA
  // ==========================================
  if (role === 'siswa') {
    const mySubmissions = submissions.filter(s => s.studentId === currentUser?.id);
    const latestSub = mySubmissions.length > 0 ? mySubmissions[mySubmissions.length - 1] : null;

    // Recommended Materials (Top 3)
    const recommendedMaterials = materials
      .filter(m => latestSub?.recommendedMaterialIds?.includes(m.id) || m.recommendedForWeakCompetency)
      .slice(0, 3);

    const displayMaterials = recommendedMaterials.length > 0 
      ? recommendedMaterials 
      : materials.slice(0, 3);

    // Active Assessments
    const activeAssessments = assessments.filter(a => a.status === 'Aktif').slice(0, 3);

    // RadarChart Data showing competency levels
    const radarData = competencies.slice(0, 6).map(c => {
      // Find latest mastery or default baseline
      const mastery = latestSub?.competencyMastery?.find(m => m.competencyId === c.id);
      return {
        subject: c.code,
        fullTitle: c.title,
        capaian: mastery ? mastery.percentage : (c.domain === 'Numerasi' ? 62 : 78),
        target: 70
      };
    });

    // Recent Activity
    const recentActivities: { id: string; type: string; title: string; time: string; badge: 'success' | 'warning' | 'primary' }[] = [
      ...(mySubmissions.map(s => ({
        id: s.id,
        type: 'Asesmen Diagnostik',
        title: `Menyelesaikan Asesmen (Skor: ${s.score})`,
        time: s.submittedAt,
        badge: (s.score >= 70 ? 'success' : 'warning') as 'success' | 'warning'
      }))),
      ...(practices.filter(p => p.studentId === currentUser?.id).map(p => ({
        id: p.id,
        type: 'Latihan Mandiri',
        title: `Latihan Penguatan (${p.score}%)`,
        time: p.completedAt,
        badge: 'primary' as const
      })))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

    return (
      <div className="space-y-6">
        {/* Siswa Header Banner */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="primary" size="sm">
                  Ruang Belajar Mandiri Siswa
                </Badge>
                <span className="text-xs text-slate-400 font-medium">
                  {currentUser?.schoolName} • {currentUser?.gradeLevel}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Selamat Datang, {currentUser?.name}! 👋
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                Platform JALIN-TUNTAS membantumu memahami materi berhitung dan membaca cerita secara mandiri, baik saat daring maupun luring di sekolah.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                icon={<PlayCircle className="w-4 h-4" />}
                onClick={() => navigate('/tuntas/asesmen')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Mulai Asesmen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tuntas/materi')}
              >
                Bank Materi
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Asesmen Selesai"
            value={mySubmissions.length}
            subtitle="Tes diagnostik terekam"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Skor Asesmen Terakhir"
            value={latestSub ? `${latestSub.score}` : '75'}
            subtitle={latestSub ? `${latestSub.correctCount} dari ${latestSub.totalQuestions} Soal Benar` : 'Skor diagnostik awal'}
            icon={<Award className="w-5 h-5" />}
            colorScheme={latestSub && latestSub.score >= 70 ? 'emerald' : 'amber'}
          />
          <StatCard
            title="Materi Tersimpan Luring"
            value={materials.filter(m => m.isDownloadedOffline).length}
            subtitle="Dapat dibaca tanpa sinyal"
            icon={<BookOpen className="w-5 h-5" />}
            colorScheme="teal"
          />
        </div>

        {/* Progress Chart (RadarChart) & Recommended Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Progress Chart (RadarChart) */}
          <div className="lg:col-span-5">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader
                title="Peta Radar Penguasaan Kompetensi"
                subtitle="Capaian pemahaman pada indikator Literasi & Numerasi"
                icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              />
              <CardBody className="p-4 flex-1 flex flex-col items-center justify-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <PolarRadiusAxis domain={[0, 100]} stroke="#CBD5E1" tick={{ fontSize: 10 }} />
                      <Radar
                        name="Capaian Siswa"
                        dataKey="capaian"
                        stroke="#2563EB"
                        fill="#2563EB"
                        fillOpacity={0.4}
                      />
                      <Radar
                        name="Ambang KKM"
                        dataKey="target"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.1}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span> Capaian Anda
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span> Target KKM (70)
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Recommended Materials (Top 3) */}
          <div className="lg:col-span-7">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader
                title="Rekomendasi Modul Pembelajaran Untukmu"
                subtitle="Disesuaikan otomatis oleh sistem berdasarkan hasil diagnostik"
                icon={<Sparkles className="w-5 h-5 text-amber-500" />}
                action={
                  <Button variant="ghost" size="sm" onClick={() => navigate('/tuntas/rekomendasi')}>
                    Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Button>
                }
              />
              <CardBody className="p-6 space-y-3">
                {displayMaterials.map(mat => (
                  <div
                    key={mat.id}
                    onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                          {mat.domain}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Jenjang {mat.level}
                        </span>
                        {mat.isDownloadedOffline && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Luring
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{mat.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{mat.description}</p>
                    </div>

                    <Button variant="outline" size="sm" className="shrink-0">
                      Buka
                    </Button>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Active Assessments & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Assessments */}
          <Card>
            <CardHeader
              title="Paket Asesmen Aktif"
              subtitle="Tes diagnostik yang siap Anda kerjakan hari ini"
              icon={<FileCheck className="w-5 h-5 text-blue-600" />}
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/tuntas/asesmen')}>
                  Semua Asesmen
                </Button>
              }
            />
            <CardBody className="p-6 space-y-3">
              {activeAssessments.map(asm => (
                <div key={asm.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div>
                    <Badge variant={asm.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                      {asm.domain}
                    </Badge>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{asm.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {asm.questionIds?.length || 0} Soal • Waktu {asm.durationMinutes} Menit
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/tuntas/ujian/${asm.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 shrink-0"
                  >
                    Kerjakan
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader
              title="Aktivitas Belajar Terkini"
              subtitle="Riwayat penyelesaian tes dan latihan mandiri Anda"
              icon={<Clock className="w-5 h-5 text-slate-600" />}
            />
            <CardBody className="p-6">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Belum ada aktivitas. Mulai dengan mengerjakan paket asesmen atau modul latihan mandiri!
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map(act => (
                    <div key={act.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <Badge variant={act.badge} size="sm">{act.type}</Badge>
                        <p className="text-xs font-bold text-slate-800 mt-1">{act.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(act.time).toLocaleDateString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Student Achievements */}
        <StudentAchievements
          scoreAvg={latestSub ? latestSub.score : 75}
          completedTests={mySubmissions.length || 1}
          completedPractices={practices.filter(p => p.studentId === currentUser?.id).length || 1}
          offlineReadsCount={materials.filter(m => m.isDownloadedOffline).length || 1}
        />
      </div>
    );
  }

  // ==========================================
  // 2. DASHBOARD GURU
  // ==========================================
  if (role === 'guru') {
    const studentsNeedingAttention = submissions.filter(s => s.score < 70);
    const activeAssessments = assessments.filter(a => a.status === 'Aktif');
    const avgClassScore = submissions.length > 0 
      ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length)
      : 74;

    return (
      <div className="space-y-6">
        {/* Guru Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Dasbor Guru Pengajar</h1>
              <Badge variant="primary" size="sm">
                {currentUser?.schoolName}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Pemantauan kelas binaan ({currentUser?.gradeLevel || 'Kelas 5 SD'}), deteksi kesenjangan belajar, dan rekap hasil asesmen.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              icon={<BookOpen className="w-4 h-4 text-blue-600" />}
              onClick={() => navigate('/tuntas/materi')}
            >
              Bank Materi
            </Button>
            <Button
              variant="primary"
              icon={<FileCheck className="w-4 h-4" />}
              onClick={() => navigate('/tuntas/asesmen')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buat Asesmen
            </Button>
          </div>
        </div>

        {/* Class Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Murid di Kelas"
            value="28 Siswa"
            subtitle="Kelas binaan aktif"
            icon={<Users className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Asesmen Aktif"
            value={activeAssessments.length}
            subtitle="Paket instrumen kelas"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="emerald"
          />
          <StatCard
            title="Rata-rata Nilai Kelas"
            value={`${avgClassScore}`}
            subtitle="Standar KKM: 70"
            icon={<TrendingUp className="w-5 h-5" />}
            colorScheme="indigo"
          />
          <StatCard
            title="Siswa Perlu Perhatian"
            value={studentsNeedingAttention.length}
            subtitle="Skor diagnostik < 70%"
            icon={<AlertTriangle className="w-5 h-5" />}
            colorScheme="rose"
          />
        </div>

        {/* Students Needing Attention (Score < 70%) & Active Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students Needing Attention */}
          <Card>
            <CardHeader
              title="Siswa Perlu Perhatian (Skor < 70%)"
              subtitle="Daftar murid yang membutuhkan tindak lanjut modul remedial"
              icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
            />
            <CardBody className="p-6">
              {studentsNeedingAttention.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Semua siswa saat ini telah mencapai nilai di atas ambang KKM 70.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentsNeedingAttention.map(sub => (
                    <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 bg-rose-50/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{sub.studentName}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Benar {sub.correctCount} dari {sub.totalQuestions} soal • Topik Numerasi Pecahan
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-rose-600">{sub.score} / 100</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/tuntas/hasil/${sub.id}`)}
                        >
                          Rapor
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Active Assessments */}
          <Card>
            <CardHeader
              title="Paket Asesmen Kelas Aktif"
              subtitle="Instrumen evaluasi berjalan yang dikerjakan siswa"
              icon={<FileCheck className="w-5 h-5 text-blue-600" />}
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/tuntas/asesmen')}>
                  Kelola Semua
                </Button>
              }
            />
            <CardBody className="p-6 space-y-3">
              {activeAssessments.map(asm => (
                <div key={asm.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant={asm.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                        {asm.domain}
                      </Badge>
                      <span className="text-[11px] text-slate-500">{asm.targetGrade}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{asm.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{asm.durationMinutes} Menit • {asm.questionIds.length} Soal</p>
                  </div>
                  <Badge variant="success" size="sm" dot>Aktif</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Recent Results Table */}
        <Card>
          <CardHeader
            title="Rekapitulasi Hasil Asesmen Murid Terkini"
            subtitle="Nilai otomatis terkoreksi dan status ketuntasan siswa"
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Nama Siswa</th>
                  <th className="px-6 py-3.5">Jumlah Benar</th>
                  <th className="px-6 py-3.5">Skor Akhir</th>
                  <th className="px-6 py-3.5">Status Ketuntasan</th>
                  <th className="px-6 py-3.5">Waktu Selesai</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Belum ada hasil asesmen yang masuk.
                    </td>
                  </tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {sub.studentName}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {sub.correctCount} dari {sub.totalQuestions} Soal
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {sub.score}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={sub.score >= 70 ? 'success' : 'danger'} size="sm" dot>
                          {sub.score >= 70 ? 'Tuntas' : 'Perlu Remedial'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(sub.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/tuntas/hasil/${sub.id}`)}
                        >
                          Lihat Rapor
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // ==========================================
  // 3. DASHBOARD KEPALA SEKOLAH
  // ==========================================
  if (role === 'kepala_sekolah') {
    const schoolAssessments = assessments;
    const completedSubmissions = submissions.filter(s => s.schoolId === mySchool.id || true);
    const completionRate = mySchool.studentCount > 0 
      ? Math.min(100, Math.round((completedSubmissions.length / (mySchool.studentCount * 0.3 || 1)) * 100))
      : 85;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dasbor Kepala Sekolah</h1>
            <Badge variant="primary" size="sm">
              {mySchool.name}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring mutu pembelajaran, kesiapan fasilitas penunjang 3T, dan efektivitas asesmen diagnostik sekolah.
          </p>
        </div>

        {/* School Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Peserta Didik"
            value={`${mySchool.studentCount} Siswa`}
            subtitle="Terbagi dalam 6 rombel"
            icon={<Users className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Guru & Tenaga Pendidik"
            value={`${mySchool.teacherCount} Guru`}
            subtitle="100% Aktif memanfaatkan JALIN"
            icon={<GraduationCap className="w-5 h-5" />}
            colorScheme="indigo"
          />
          <StatCard
            title="Tingkat Kelulusan Asesmen"
            value={`${completionRate}%`}
            subtitle="Penyelesaian siklus diagnostik"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="emerald"
          />
          <StatCard
            title="Perangkat Tablet/PC"
            value={`${mySchool.deviceCount} Unit`}
            subtitle="Rasio 1 : 23.6 siswa"
            icon={<Laptop className="w-5 h-5" />}
            colorScheme="amber"
          />
        </div>

        {/* Infrastructure Status & Teacher Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Infrastructure Status */}
          <Card>
            <CardHeader
              title="Kesiapan Fasilitas & Infrastruktur 3T"
              subtitle="Kondisi sarana penunjang pembelajaran di SDN 05 Air Rami"
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              action={
                <Button variant="outline" size="sm" onClick={() => navigate(`/peta/sekolah/${mySchool.id}`)}>
                  Detail Profil
                </Button>
              }
            />
            <CardBody className="p-6 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Pasokan Listrik</span>
                <span className="font-bold text-slate-800">{mySchool.electricStatus}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Koneksi Internet</span>
                <span className="font-bold text-slate-800">{mySchool.internetStatus}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Kategori Wilayah</span>
                <Badge variant="warning" size="sm">Daerah 3T Terpencil</Badge>
              </div>
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-blue-900 leading-relaxed">
                <strong>Catatan Kepala Sekolah:</strong> Pastikan seluruh materi literasi dan modul numerasi telah tersimpan di memori luring peramban agar kegiatan belajar tidak terhenti saat listrik padam berkala.
              </div>
            </CardBody>
          </Card>

          {/* Teacher Activity */}
          <Card>
            <CardHeader
              title="Aktivitas Guru & Supervisi Mutu"
              subtitle="Penyusunan instrumen dan catatan pendampingan berkala"
              icon={<Activity className="w-5 h-5 text-blue-600" />}
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/guru/pendampingan')}>
                  Log Supervisi
                </Button>
              }
            />
            <CardBody className="p-6 space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Siti Rahmawati, S.Pd. (Guru Kelas 5)</p>
                  <p className="text-slate-500 mt-0.5">Telah menyelesaikan 1 paket diagnostik numerasi dan mendampingi 4 siswa remedial.</p>
                </div>
                <Badge variant="success" size="sm">Aktif</Badge>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Ahmad Fauzi, M.Pd. (Guru Koordinator)</p>
                  <p className="text-slate-500 mt-0.5">Jadwal kunjungan pendampingan berkala berikutnya: Jumat, 10.00 WIB.</p>
                </div>
                <Badge variant="primary" size="sm">Terjadwal</Badge>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Budi Santoso, S.Pd. (Guru Matematika SMP)</p>
                  <p className="text-slate-500 mt-0.5">Mengunggah modul praktik baik media kartu konkret.</p>
                </div>
                <Badge variant="purple" size="sm">Inovatif</Badge>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. DASHBOARD GURU KOORDINATOR
  // ==========================================
  if (role === 'guru_koordinator') {
    const targetSchools = schools.slice(0, 4);
    const teacherList = users.filter(u => u.role === 'guru' || u.role === 'guru_koordinator');

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dasbor Guru Koordinator Wilayah</h1>
            <Badge variant="primary" size="sm">
              Penggerak 3T Mukomuko Selatan
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Koordinasi antar-sekolah sasaran, supervisi pendampingan guru kelas, dan penguatan implementasi Kurikulum Merdeka.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Sekolah Dampingan"
            value={`${targetSchools.length} Sekolah`}
            subtitle="Air Rami, Ipuh, Teramang"
            icon={<Building2 className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Guru Terbina"
            value={`${teacherList.length} Guru`}
            subtitle="Dalam wilayah koordinasi"
            icon={<Users className="w-5 h-5" />}
            colorScheme="indigo"
          />
          <StatCard
            title="Catatan Supervisi"
            value={`${mentoringNotes.length || 3} Log`}
            subtitle="Supervisi terdaftar"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="emerald"
          />
          <StatCard
            title="Antrean Sinkronisasi"
            value={`${syncQueueCount} Item`}
            subtitle="Data siap dipadankan"
            icon={<RotateCw className="w-5 h-5" />}
            colorScheme="amber"
          />
        </div>

        {/* Teacher Management & Mentoring Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teacher Management Table */}
          <Card>
            <CardHeader
              title="Manajemen Guru Wilayah Dampingan"
              subtitle="Daftar pendidik dalam lingkup koordinasi supervisi"
              icon={<Users className="w-5 h-5 text-blue-600" />}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Nama Guru</th>
                    <th className="px-4 py-3">Satuan Pendidikan</th>
                    <th className="px-4 py-3">Mata Pelajaran</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherList.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-900">{t.name}</td>
                      <td className="px-4 py-3 text-slate-500">{t.schoolName || 'SDN 05 Air Rami'}</td>
                      <td className="px-4 py-3 text-slate-500">{t.subject || 'Guru Kelas 5'}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="success" size="sm">Aktif</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mentoring Schedule */}
          <Card>
            <CardHeader
              title="Jadwal & Agenda Pendampingan"
              subtitle="Log supervisi dan pembinaan guru terencana"
              icon={<Calendar className="w-5 h-5 text-teal-600" />}
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/guru/pendampingan')}>
                  Buka Log
                </Button>
              }
            />
            <CardBody className="p-6 space-y-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Pendampingan Diagnostik Literasi Awal</p>
                  <p className="text-slate-500 mt-0.5">Lokasi: SDN 05 Air Rami • Guru: Siti Rahmawati, S.Pd.</p>
                  <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Jumat, 21 November 2026</span>
                </div>
                <Badge variant="primary" size="sm">Terjadwal</Badge>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Pelatihan Media Kartu Bilangan Konkret</p>
                  <p className="text-slate-500 mt-0.5">Lokasi: SDN 02 Teramang Jaya • Rombel Kelas 4 & 5</p>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Selesai Diverifikasi</span>
                </div>
                <Badge variant="success" size="sm">Tuntas</Badge>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  icon={<FileCheck className="w-4 h-4" />}
                  onClick={() => navigate('/guru/pendampingan')}
                >
                  Tambah Catatan Supervisi Baru
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Training Modules */}
        <Card>
          <CardHeader
            title="Modul Pelatihan & Panduan Pendidik 3T"
            subtitle="Sumber daya pedagogik Kurikulum Merdeka untuk guru di daerah terpencil"
            icon={<BookOpen className="w-5 h-5 text-blue-600" />}
            action={
              <Button variant="outline" size="sm" onClick={() => navigate('/guru/panduan')}>
                Lihat Panduan Lengkap
              </Button>
            }
          />
          <CardBody className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <Badge variant="primary" size="sm">Modul 1</Badge>
                <h4 className="font-bold text-slate-900 text-sm mt-2">Diferensiasi Pembelajaran Luring</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">Strategi mengajar anak bertingkat kemampuan berbeda tanpa internet di kelas.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <Badge variant="success" size="sm">Modul 2</Badge>
                <h4 className="font-bold text-slate-900 text-sm mt-2">Pemanfaatan Kartu Konkret Pecahan</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">Panduan membuat media ajar dari pelepah kelapa sawit dan kertas karton.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <Badge variant="purple" size="sm">Modul 3</Badge>
                <h4 className="font-bold text-slate-900 text-sm mt-2">Sinkronisasi Data USB Hub Luring</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">Prosedur pemindahan hasil asesmen siswa lewat media penyimpanan portabel.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ==========================================
  // 5. DASHBOARD DINAS PENDIDIKAN
  // ==========================================
  if (role === 'dinas_pendidikan') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dasbor Dinas Pendidikan Kabupaten Mukomuko</h1>
            <Badge variant="primary" size="sm">
              Pemantauan Mutu Daerah 3T
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Agregat data capaian literasi dan numerasi satuan pendidikan, analisis disparitas wilayah, dan penentuan prioritas bantuan infrastruktur digital.
          </p>
        </div>

        {/* Aggregate Stats Across Schools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Satuan Pendidikan"
            value={schools.length}
            subtitle={`${schools.filter(s => s.is3TArea).length} Sekolah di Wilayah 3T`}
            icon={<Building2 className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Total Peserta Didik"
            value={totalStudents}
            subtitle="Jenjang SD & SMP se-Kabupaten"
            icon={<Users className="w-5 h-5" />}
            colorScheme="emerald"
          />
          <StatCard
            title="Rerata Literasi Daerah"
            value={`${avgLitKabupaten}`}
            subtitle="Target SPM: 70.0"
            icon={<BookOpen className="w-5 h-5" />}
            colorScheme="indigo"
          />
          <StatCard
            title="Rerata Numerasi Daerah"
            value={`${avgNumKabupaten}`}
            subtitle="Prioritas intervensi 3T"
            icon={<TrendingUp className="w-5 h-5" />}
            colorScheme="amber"
          />
        </div>

        {/* Comparison Charts & Priority List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Charts (BarChart Comparing Schools) */}
          <div className="lg:col-span-8">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader
                title="Peta Capaian Literasi vs Numerasi Satuan Pendidikan"
                subtitle="Perbandingan capaian nilai rata-rata antar-sekolah se-Kabupaten Mukomuko"
                icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                action={
                  <Button variant="outline" size="sm" onClick={() => navigate('/peta/capaian')}>
                    Grafik Penuh
                  </Button>
                }
              />
              <CardBody className="p-6">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={schools.map(s => ({
                        name: s.name.replace(/^(SDN|SMPN)\s*/, ''),
                        lit: s.literacyScoreAvg,
                        num: s.numeracyScoreAvg
                      }))}
                      margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip />
                      <Bar dataKey="lit" fill="#2563EB" name="Literasi" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="num" fill="#10B981" name="Numerasi" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span> Literasi Membaca
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Numerasi Menalar
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Priority List (Schools Needing Urgent Intervention) */}
          <div className="lg:col-span-4">
            <Card className="h-full flex flex-col justify-between">
              <CardHeader
                title="Daftar Prioritas Intervensi"
                subtitle="Sekolah dengan kesenjangan fasilitas tinggi"
                icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
                action={
                  <Button variant="ghost" size="sm" onClick={() => navigate('/peta/sekolah')}>
                    Semua
                  </Button>
                }
              />
              <CardBody className="p-6 space-y-3">
                {schools
                  .filter(s => s.priorityLevel === 'Sangat Tinggi' || s.priorityLevel === 'Tinggi')
                  .slice(0, 4)
                  .map(s => (
                    <div key={s.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <Badge variant={s.priorityLevel === 'Sangat Tinggi' ? 'danger' : 'warning'} size="sm">
                          {s.priorityLevel}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Kec. {s.district} • {s.electricStatus} • {s.deviceCount} Unit
                      </p>
                    </div>
                  ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. DASHBOARD SUPER ADMIN
  // ==========================================
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dasbor Super Administrator</h1>
            <Badge variant="purple" size="sm">
              Basis Data JALIN BELAJAR
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen akun pengguna sistem, pemantauan kesehatan IndexedDB lokal, dan log sinkronisasi terpadu.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (confirm('Apakah Anda ingin me-reset basis data lokal ke data demonstrasi bawaan?')) {
              await db.resetToDefault();
              alert('Basis data berhasil direset ke pengaturan awal.');
              window.location.reload();
            }
          }}
        >
          Reset Data Demo Bawaan
        </Button>
      </div>

      {/* System Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pengguna Sistem"
          value={users.length}
          subtitle="6 Peran Akun Simulasi"
          icon={<Users className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Satuan Pendidikan"
          value={schools.length}
          subtitle="Data sekolah Kab. Mukomuko"
          icon={<Building2 className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Modul Pembelajaran"
          value={materials.length}
          subtitle="Tersedia luring & daring"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Antrean Sinkronisasi"
          value={syncQueueCount}
          subtitle="IndexedDB cache luring"
          icon={<RotateCw className="w-5 h-5" />}
          colorScheme="amber"
        />
      </div>

      {/* User Accounts Table */}
      <Card>
        <CardHeader
          title="Tabel Akun Pengguna Sistem"
          subtitle="Daftar profil akun peran untuk pengujian dan demonstrasi simulasi sistem"
          icon={<ShieldCheck className="w-5 h-5 text-purple-600" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Pengguna</th>
                <th className="px-6 py-3.5">Username</th>
                <th className="px-6 py-3.5">Peran Sistem</th>
                <th className="px-6 py-3.5">Satuan Pendidikan</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.nipNisn || 'NIP/NISN: -'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {u.username}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="purple" size="sm">
                      {u.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {u.schoolName || 'Dinas Pendidikan Kab. Mukomuko'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="success" size="sm" dot>Aktif</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity Log (Sync History & System Events) */}
      <Card>
        <CardHeader
          title="Log Aktivitas & Riwayat Sinkronisasi Terpadu"
          subtitle="Pemantauan pertukaran data luring-ke-daring (USB Hub & Jaringan Terbatas)"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
        />
        <CardBody className="p-6">
          <div className="space-y-3">
            {syncHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat sinkronisasi.</p>
            ) : (
              syncHistory.map(sh => (
                <div key={sh.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <RotateCw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Sinkronisasi Data Paket: {sh.connectionType}</p>
                      <p className="text-slate-400 mt-0.5">
                        {new Date(sh.syncedAt).toLocaleString('id-ID')} • {sh.itemsSynced} Entri Dipadankan
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {sh.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
