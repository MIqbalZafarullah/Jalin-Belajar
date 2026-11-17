import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { db } from '../database/db';
import { School, Material, Assessment, AssessmentSubmission, User } from '../types';
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
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

export const RoleDashboard: React.FC = () => {
  const { role, currentUser } = useAuth();
  const { isEffectiveOffline, syncQueueCount, triggerSync } = useOffline();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<School[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      const s = await db.schools.toArray();
      const m = await db.materials.toArray();
      const a = await db.assessments.toArray();
      const sub = await db.submissions.toArray();
      const u = await db.users.toArray();
      setSchools(s);
      setMaterials(m);
      setAssessments(a);
      setSubmissions(sub);
      setUsers(u);
    };
    loadAllData();
  }, []);

  // Common aggregates
  const totalStudents = schools.reduce((acc, s) => acc + s.studentCount, 0);
  const totalTeachers = schools.reduce((acc, s) => acc + s.teacherCount, 0);
  const avgLitKabupaten = (schools.reduce((acc, s) => acc + s.literacyScoreAvg, 0) / (schools.length || 1)).toFixed(1);
  const avgNumKabupaten = (schools.reduce((acc, s) => acc + s.numeracyScoreAvg, 0) / (schools.length || 1)).toFixed(1);

  // Current School (for Kepala Sekolah / Guru / Siswa)
  const mySchool = schools.find(s => s.id === currentUser?.schoolId) || schools[0];

  // ==========================================
  // 1. DASHBOARD SISWA
  // ==========================================
  if (role === 'siswa') {
    const mySubmissions = submissions.filter(s => s.studentId === currentUser?.id);
    const latestSub = mySubmissions.length > 0 ? mySubmissions[mySubmissions.length - 1] : null;

    return (
      <div className="space-y-6">
        {/* Siswa Hero Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-blue-100 px-3 py-1 rounded-full">
              Ruang Belajar Mandiri Siswa
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Halo, {currentUser?.name}! 👋
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              {currentUser?.schoolName} • {currentUser?.gradeLevel}
            </p>
            <p className="text-xs text-blue-200 mt-3 leading-relaxed">
              JALIN-TUNTAS membantumu menguasai materi berhitung dan membaca cerita dengan modul latihan yang disesuaikan dengan kemampuanmu.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                icon={<PlayCircle className="w-4 h-4 text-amber-400" />}
                onClick={() => navigate('/tuntas/asesmen')}
              >
                Kerjakan Asesmen Diagnostik
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/tuntas/rekomendasi')}
              >
                Lihat Rekomendasi
              </Button>
            </div>
          </div>
        </div>

        {/* Siswa Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Asesmen Dikerjakan"
            value={mySubmissions.length}
            subtitle="Tes diagnostik awal"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Skor Terakhir"
            value={latestSub ? `${latestSub.score} / 100` : 'Belum Ada'}
            subtitle={latestSub ? `${latestSub.correctCount} benar` : 'Mulai tes pertama'}
            icon={<Award className="w-5 h-5" />}
            colorScheme={latestSub && latestSub.score >= 70 ? 'emerald' : 'amber'}
          />
          <StatCard
            title="Materi Tersimpan Luring"
            value={materials.filter(m => m.isDownloadedOffline).length}
            subtitle="Bisa dibaca tanpa kuota"
            icon={<BookOpen className="w-5 h-5" />}
            colorScheme="teal"
          />
        </div>

        {/* Siswa: Gamification Badges */}
        <StudentAchievements
          scoreAvg={latestSub ? latestSub.score : 0}
          completedTests={mySubmissions.length}
          completedPractices={1}
          offlineReadsCount={materials.filter(m => m.isDownloadedOffline).length}
        />

        {/* Siswa: Recommended Modules */}
        <Card className="border-amber-200/80">
          <CardHeader
            title="Materi Belajar yang Direkomendasikan Untukmu"
            subtitle="Disesuaikan otomatis berdasarkan hasil asesmen diagnostik"
            icon={<Sparkles className="w-5 h-5 text-amber-500" />}
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/tuntas/rekomendasi')}>
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.slice(0, 2).map(mat => (
                <div key={mat.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                      {mat.domain} SD
                    </Badge>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{mat.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{mat.readingTimeMinutes} Menit</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                    >
                      Buka Modul
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ==========================================
  // 2. DASHBOARD GURU
  // ==========================================
  if (role === 'guru') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Guru Pengajar</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {currentUser?.schoolName}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pantau kelas binaan ({currentUser?.gradeLevel}), hasil asesmen diagnostik murid, dan modul penguatan kompetensi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Murid di Kelas"
            value="28 Siswa"
            subtitle="Kelas 5 SDN 05 Air Rami"
            icon={<Users className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Asesmen Aktif"
            value={assessments.length}
            subtitle="Paket Diagnostik Berjalan"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="emerald"
          />
          <StatCard
            title="Pengerjaan Siswa"
            value={submissions.length}
            subtitle="Hasil Diagnostik Masuk"
            icon={<TrendingUp className="w-5 h-5" />}
            colorScheme="amber"
          />
          <StatCard
            title="Siswa Perlu Penguatan"
            value={submissions.filter(s => s.score < 70).length}
            subtitle="Topik Pecahan Dasar"
            icon={<AlertTriangle className="w-5 h-5" />}
            colorScheme="rose"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Aktivitas Pengerjaan Siswa Terkini"
              subtitle="Nilai otomatis dan kompetensi yang belum tuntas"
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/tuntas/rekomendasi')}>Lihat Semua</Button>}
            />
            <CardBody className="space-y-3">
              {submissions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada pengerjaan siswa.</p>
              ) : (
                submissions.map(sub => (
                  <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-500">{sub.correctCount} dari {sub.totalQuestions} Benar • {new Date(sub.submittedAt).toLocaleTimeString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-black ${sub.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {sub.score}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {sub.score >= 70 ? 'Tuntas' : 'Perlu Remedial'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Tindakan Cepat Pembelajaran"
              subtitle="Rekomendasi guru untuk perbaikan mutu kelas"
              icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
            />
            <CardBody className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Sebanyak 4 siswa masih keliru menyamakan penyebut pecahan. Buka modul remedial <strong>Operasi Pecahan Dasar</strong> di tablet kelas.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Simpan 2 modul cerita kearifan lokal Bengkulu ke penyimpanan luring untuk jam pojok baca pagi.</span>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/tuntas/asesmen')}
                >
                  Kelola Paket Asesmen Kelas
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. DASHBOARD KEPALA SEKOLAH
  // ==========================================
  if (role === 'kepala_sekolah') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Kepala Sekolah</h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full">
              {mySchool.name}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring kondisi satuan pendidikan, kesiapan infrastruktur 3T, dan efektivitas asesmen diagnostik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Peserta Didik"
            value={`${mySchool.studentCount} Siswa`}
            subtitle="Terbagi dalam 6 rombel"
            icon={<Users className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Kesiapan Perangkat"
            value={`${mySchool.deviceCount} Unit`}
            subtitle="Rasio 1 : 23.6 siswa"
            icon={<Laptop className="w-5 h-5" />}
            colorScheme="amber"
          />
          <StatCard
            title="Capaian Literasi"
            value={`${mySchool.literacyScoreAvg} / 100`}
            subtitle="Asesmen diagnostik sekolah"
            icon={<BookOpen className="w-5 h-5" />}
            colorScheme="teal"
          />
          <StatCard
            title="Capaian Numerasi"
            value={`${mySchool.numeracyScoreAvg} / 100`}
            subtitle="Perlu intervensi intensif"
            icon={<TrendingUp className="w-5 h-5" />}
            colorScheme="rose"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Profil Kesiapan Infrastruktur Sekolah"
              subtitle="Kondisi sarana pendukung digital di SDN 05 Air Rami"
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              action={<Button variant="outline" size="sm" onClick={() => navigate(`/peta/sekolah/${mySchool.id}`)}>Detail Profil</Button>}
            />
            <CardBody className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Pasokan Listrik</span>
                <span className="font-bold text-amber-700">{mySchool.electricStatus}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Akses Jaringan Internet</span>
                <span className="font-bold text-amber-700">{mySchool.internetStatus}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Kategori Wilayah</span>
                <Badge variant="warning" size="sm">Wilayah 3T Pesisir</Badge>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 mt-2">
                <strong>Catatan Kepala Sekolah:</strong> Prioritaskan pengunduhan seluruh bank materi ke penyimpanan luring agar proses asesmen tidak terganggu pemadaman listrik berkala.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Aktivitas Guru & Supervisi"
              subtitle="Keaktifan penyusunan asesmen dan modul penguatan"
              icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/guru/pendampingan')}>Log Supervisi</Button>}
            />
            <CardBody className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-800">Siti Rahmawati, S.Pd. (Guru Kelas 5)</p>
                  <p className="text-slate-500 mt-0.5">Telah menyelesaikan 1 paket asesmen numerasi pecahan.</p>
                </div>
                <Badge variant="success" size="sm">Aktif</Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-800">Ahmad Fauzi, M.Pd. (Koordinator Wilayah)</p>
                  <p className="text-slate-500 mt-0.5">Jadwal kunjungan pendampingan berkala berikutnya: Jumat.</p>
                </div>
                <Badge variant="info" size="sm">Terjadwal</Badge>
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
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Guru Koordinator Wilayah</h1>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
              Penggerak 3T Mukomuko Selatan
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Mengkoordinasikan sekolah-sekolah sasaran pendampingan, perbaikan mutu guru, dan kelancaran sinkronisasi hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Sekolah Dampingan"
            value="4 Sekolah"
            subtitle="Air Rami, Ipuh, Teramang"
            icon={<Building2 className="w-5 h-5" />}
            colorScheme="teal"
          />
          <StatCard
            title="Catatan Pendampingan"
            value="3 Log"
            subtitle="Supervisi terdaftar"
            icon={<FileCheck className="w-5 h-5" />}
            colorScheme="blue"
          />
          <StatCard
            title="Praktik Baik Dibagikan"
            value="2 Inovasi"
            subtitle="Media kartu konkret"
            icon={<Sparkles className="w-5 h-5" />}
            colorScheme="amber"
          />
          <StatCard
            title="Antrean Sinkronisasi"
            value={`${syncQueueCount} Item`}
            subtitle="Data siap dipadankan"
            icon={<RotateCw className="w-5 h-5" />}
            colorScheme="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Daftar Sekolah Sasaran Intervensi 3T"
              subtitle="Prioritas pendampingan literasi & numerasi luring"
              icon={<Building2 className="w-5 h-5 text-teal-600" />}
              action={<Button variant="outline" size="sm" onClick={() => navigate('/peta/sekolah')}>Lihat Peta</Button>}
            />
            <CardBody className="space-y-3">
              {schools.slice(0, 3).map(s => (
                <div key={s.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-slate-500">Kec. {s.district} • Lit: {s.literacyScoreAvg} | Num: {s.numeracyScoreAvg}</p>
                  </div>
                  <Badge variant={s.priorityLevel === 'Sangat Tinggi' ? 'danger' : 'warning'} size="sm">
                    {s.priorityLevel}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Aksi Pendampingan Guru"
              subtitle="Alur bimbingan tindak lanjut diagnostik"
              icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
            />
            <CardBody className="space-y-3 text-xs text-slate-700">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-start"
                icon={<FileCheck className="w-4 h-4" />}
                onClick={() => navigate('/guru/pendampingan')}
              >
                Buat Catatan Supervisi Guru Baru
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={() => navigate('/guru/praktik-baik')}
              >
                Tulis Artikel Praktik Baik 3T
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                icon={<RotateCw className="w-4 h-4" />}
                onClick={() => navigate('/hub/sinkronisasi')}
              >
                Buka Hub Sinkronisasi Data Luring
              </Button>
            </CardBody>
          </Card>
        </div>
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
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Dinas Pendidikan Kabupaten Mukomuko</h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
              Pemantauan Mutu Daerah 3T
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dasbor agregat pembuat kebijakan: memetakan disparitas capaian antar-kecamatan dan alokasi bantuan digital.
          </p>
        </div>

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
            value={`${avgLitKabupaten} / 100`}
            subtitle="Target SPM: 70.0"
            icon={<BookOpen className="w-5 h-5" />}
            colorScheme="teal"
          />
          <StatCard
            title="Rerata Numerasi Daerah"
            value={`${avgNumKabupaten} / 100`}
            subtitle="Prioritas penguatan"
            icon={<TrendingUp className="w-5 h-5" />}
            colorScheme="amber"
          />
        </div>

        {/* Chart Comparison of Schools in Mukomuko */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                title="Peta Capaian Literasi vs Numerasi Satuan Pendidikan"
                subtitle="Identifikasi disparitas capaian sekolah pusat vs terpencil"
                icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                action={<Button variant="outline" size="sm" onClick={() => navigate('/peta/capaian')}>Grafik Penuh</Button>}
              />
              <CardBody>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schools.map(s => ({ name: s.name.replace(/^(SDN|SMPN)\s*/, ''), lit: s.literacyScoreAvg, num: s.numeracyScoreAvg }))} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" interval={0} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="lit" fill="#2563EB" name="Literasi" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="num" fill="#10B981" name="Numerasi" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader
                title="Prioritas Intervensi Dinas"
                subtitle="Sekolah yang butuh paket luring darurat"
                icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
                action={<Button variant="ghost" size="sm" onClick={() => navigate('/peta/sekolah')}>Daftar</Button>}
              />
              <CardBody className="space-y-3">
                {schools.filter(s => s.priorityLevel === 'Sangat Tinggi' || s.priorityLevel === 'Tinggi').map(s => (
                  <div key={s.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <Badge variant={s.priorityLevel === 'Sangat Tinggi' ? 'danger' : 'warning'} size="sm">
                        {s.priorityLevel}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kec. {s.district} • {s.electricStatus} • {s.deviceCount} Perangkat
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
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Super Admin</h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full">
              Sistem JALIN BELAJAR
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Status basis data Dexie IndexedDB, pengelolaan 6 akun simulasi, dan kesehatan sistem offline-first.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (confirm('Apakah Anda ingin me-reset basis data ke data simulasi bawaan?')) {
              await db.resetToDefault();
              alert('Basis data berhasil direset ke pengaturan awal.');
              window.location.reload();
            }
          }}
        >
          Reset Data Demo Bawaan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna Sistem"
          value={users.length}
          subtitle="6 Peran Akun Demonstrasi"
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
          subtitle="Konten Literasi & Numerasi"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Antrean Sinkronisasi"
          value={syncQueueCount}
          subtitle="IndexedDB local cache"
          icon={<RotateCw className="w-5 h-5" />}
          colorScheme="amber"
        />
      </div>

      {/* 6 Demo User Directory */}
      <Card>
        <CardHeader
          title="Direktori Akun Pengguna Sistem"
          subtitle="Gunakan tombol cepat pada bilah atas atau pilih akun di bawah ini untuk beralih profil pengguna"
          icon={<ShieldCheck className="w-5 h-5 text-purple-600" />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs truncate">{u.name}</span>
                  </div>
                  <Badge variant="purple" size="sm" className="mt-1">
                    {u.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    User: <strong className="text-slate-700">{u.username}</strong>
                  </p>
                  {u.schoolName && (
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.schoolName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

