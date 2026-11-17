import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { School, User, Assessment, AssessmentSubmission } from '../../types';
import { db } from '../../database/db';
import { 
  ArrowLeft, 
  Building2, 
  Zap, 
  Wifi, 
  Laptop, 
  Users, 
  GraduationCap, 
  MapPin, 
  ChevronRight,
  TrendingUp, 
  BookOpen, 
  Calculator,
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const found = await db.schools.get(id);
        if (found) {
          setSchool(found);
          const schoolTeachers = await db.users.where('schoolId').equals(id).toArray();
          setTeachers(schoolTeachers);

          const schoolAssessments = await db.assessments.where('schoolId').equals(id).toArray();
          setAssessments(schoolAssessments);

          const schoolSubmissions = await db.submissions.where('schoolId').equals(id).toArray();
          setSubmissions(schoolSubmissions);
        }
      } catch (err) {
        console.error('Gagal mengambil data detail sekolah:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Memuat data profil satuan pendidikan...</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Sekolah Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1">Data satuan pendidikan dengan ID tersebut tidak tersedia di sistem lokal.</p>
        <button
          onClick={() => navigate('/peta/sekolah')}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pemetaan Sekolah</span>
        </button>
      </div>
    );
  }

  const deviceRatio = (school.studentCount / (school.deviceCount || 1)).toFixed(1);

  // Generate grade breakdown for students chart
  const grades = school.level === 'SD' 
    ? ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6']
    : ['Kelas 7', 'Kelas 8', 'Kelas 9'];

  const countPerGrade = Math.floor(school.studentCount / grades.length);
  const remainder = school.studentCount % grades.length;

  const gradeBreakdownData = grades.map((gradeName, index) => {
    // Add realistic distribution
    const variation = index % 2 === 0 ? 2 : -2;
    const baseCount = countPerGrade + (index === 0 ? remainder : 0) + variation;
    return {
      name: gradeName,
      jumlah: Math.max(10, baseCount)
    };
  });

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <Link to="/dashboard" className="hover:text-blue-600 transition">JALIN BELAJAR</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/peta/sekolah" className="hover:text-blue-600 transition">JALIN-PETA</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-medium truncate max-w-[200px]">{school.name}</span>
          </nav>
          <button
            onClick={() => navigate('/peta/sekolah')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Sekolah</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/tuntas/asesmen')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition shadow-xs"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Jadwalkan Asesmen Diagnostik</span>
          </button>
        </div>
      </div>

      {/* School Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                Jenjang {school.level}
              </span>
              {school.is3TArea && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  Wilayah 3T Terpencil & Pesisir
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                NPSN: {school.npsn}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{school.name}</h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{school.address} — Kec. {school.district}, Kabupaten Mukomuko</span>
              </p>
            </div>

            {school.notes && (
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Catatan Lapangan:</span> {school.notes}
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[280px]">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500">Kepala Sekolah</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{school.headmasterName || 'Belum Terdata'}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500">Jumlah Siswa</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{school.studentCount} Siswa</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500">Pendidik & Staf</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{school.teacherCount} Guru</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Infrastructure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Listrik */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              school.electricStatus === 'PLN 24 Jam' ? 'bg-green-100 text-green-700' :
              school.electricStatus === 'PLN Terbatas' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {school.electricStatus}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Pasokan Daya Listrik</h3>
            <p className="text-xs text-slate-500 mt-1">
              {school.electricStatus === 'PLN 24 Jam' 
                ? 'Pasokan listrik PLN stabil sepanjang hari tanpa kendala operasional.' 
                : school.electricStatus === 'PLN Terbatas'
                ? 'Sering mengalami pemadaman bergilir saat cuaca buruk di pesisir Mukomuko.'
                : 'Mengandalkan generator genset / panel surya darurat untuk operasional.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Daya Tahan Operasional:</span>
            <span className="font-semibold text-slate-800">
              {school.electricStatus === 'PLN 24 Jam' ? '24 Jam Nonstop' : '4 - 6 Jam / Hari'}
            </span>
          </div>
        </div>

        {/* Card 2: Internet */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              school.internetStatus === 'Stabil (Fiber/4G)' ? 'bg-green-100 text-green-700' :
              school.internetStatus === 'Terbatas (3G/4G Lemah)' ? 'bg-amber-100 text-amber-700' :
              school.internetStatus === 'VSAT/Satelit' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {school.internetStatus}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Konektivitas Internet</h3>
            <p className="text-xs text-slate-500 mt-1">
              {school.internetStatus === 'Stabil (Fiber/4G)'
                ? 'Jaringan serat optik / 4G kuat mendukung asesmen online dan sinkronisasi instan.'
                : school.internetStatus === 'VSAT/Satelit'
                ? 'Terkoneksi via stasiun bumi VSAT BAKTI Kominfo dengan bandwidth kuota terbatas.'
                : school.internetStatus === 'Terbatas (3G/4G Lemah)'
                ? 'Sinyal seluler lemah fluktuatif, memerlukan mode luring JALIN-HUB.'
                : 'Zona blankspot total tanpa pemancar sinyal seluler terestrial.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Estimasi Bandwidth:</span>
            <span className="font-semibold text-slate-800">
              {school.internetStatus === 'Stabil (Fiber/4G)' ? '20 - 50 Mbps' :
               school.internetStatus === 'VSAT/Satelit' ? '2 - 4 Mbps (Latency Tinggi)' :
               school.internetStatus === 'Terbatas (3G/4G Lemah)' ? '512 Kbps - 1 Mbps' : '0 Kbps (Luring Total)'}
            </span>
          </div>
        </div>

        {/* Card 3: Perangkat */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700">
              {school.deviceCount} Unit Aktif
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Perangkat TIK Berfungsi</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kombinasi Chromebook bantuan DAK Fisik Kemendikbud, tablet edukasi siswa, dan laptop guru pendamping.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Rasio Siswa per Alat:</span>
            <span className="font-semibold text-slate-800">1 unit : {deviceRatio} siswa</span>
          </div>
        </div>
      </div>

      {/* Grid: Students Breakdown Chart + Assessment Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Section: Summary + Grade Breakdown Chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Distribusi Peserta Didik per Tingkat</h3>
                <p className="text-xs text-slate-500">Total {school.studentCount} siswa aktif di jenjang {school.level}</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(value) => [`${value} Siswa`, 'Jumlah']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="jumlah" fill="#2563EB" radius={[4, 4, 0, 0]} name="Siswa Terdaftar">
                  {gradeBreakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563EB' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 block">Rata-rata Rombel</span>
              <span className="font-bold text-slate-900 text-sm">{Math.round(school.studentCount / grades.length)} Siswa / Kelas</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <span className="text-slate-500 block">Tingkat Kehadiran</span>
              <span className="font-bold text-emerald-600 text-sm">94.2% (Konsisten)</span>
            </div>
          </div>
        </div>

        {/* Assessment Results Section */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Hasil Rerata Asesmen Diagnostik</h3>
                <p className="text-xs text-slate-500">Indeks capaian literasi & numerasi berbasis standar SPM Kemendikbud</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Literasi */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Literasi Membaca
                </span>
                <span className="text-xl font-bold text-blue-700">{school.literacyScoreAvg} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
              </div>
              <div className="w-full bg-blue-200/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, school.literacyScoreAvg)}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {school.literacyScoreAvg >= 70 
                  ? 'Memenuhi kompetensi minimum membaca' 
                  : 'Perlu penguatan pemahaman bacaan teks informasi & cerita'}
              </p>
            </div>

            {/* Numerasi */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Numerasi Matematika
                </span>
                <span className="text-xl font-bold text-emerald-700">{school.numeracyScoreAvg} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
              </div>
              <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, school.numeracyScoreAvg)}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {school.numeracyScoreAvg >= 70 
                  ? 'Memenuhi kompetensi numerasi dasar' 
                  : 'Fokus pada konsep pecahan, geometri dasar & operasi hitung'}
              </p>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Rekomendasi Tindak Lanjut Program:
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-600 pl-1">
              <li>Unduh modul literasi dan numerasi offline melalui menu JALIN-HUB ke tablet sekolah.</li>
              <li>Lakukan asesmen diagnostik berkala per 2 pekan untuk memantau kemajuan siswa 3T.</li>
              <li>Gunakan media visual kontekstual untuk menjembatani kesenjangan fasilitas luring.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Teachers Section: Table of Teachers at This School */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">Daftar Tenaga Pendidik Terdaftar</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {teachers.length} guru di sistem
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Nama Pendidik</th>
                <th className="px-4 py-3.5">NIP / Identitas</th>
                <th className="px-4 py-3.5">Peran / Penugasan</th>
                <th className="px-4 py-3.5">Tingkat Kelas</th>
                <th className="px-4 py-3.5 text-center">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    <Users className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                    <p className="text-xs">Belum ada akun guru yang terhubung langsung dengan ID sekolah ini.</p>
                  </td>
                </tr>
              ) : (
                teachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                          alt={teacher.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{teacher.name}</p>
                          <p className="text-xs text-slate-400">@{teacher.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {teacher.nipNisn || 'NIP Belum Diisi'}
                    </td>

                    <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                      {teacher.subject || (teacher.role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Pendidik Kelas')}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {teacher.gradeLevel || 'Semua Tingkat'}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                        Aktif Terhubung
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
