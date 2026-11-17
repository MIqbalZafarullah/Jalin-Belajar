import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Assessment, Material, AssessmentSubmission } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Target, 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TuntasDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const mats = await db.materials.toArray();
      const asms = await db.assessments.toArray();
      const subs = await db.submissions.toArray();
      setMaterials(mats);
      setAssessments(asms);
      setSubmissions(subs);
    };
    loadData();
  }, []);

  const totalAssessed = submissions.length;
  const avgScore = totalAssessed > 0 
    ? (submissions.reduce((acc, s) => acc + s.score, 0) / totalAssessed).toFixed(1)
    : 'Belum Ada';

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Pembelajaran Adaptif</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Siklus Diagnostik Berbasis Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Mendiagnosis kesenjangan belajar, menghitung penguasaan kompetensi, dan memberikan rekomendasi materi preskriptif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<BookOpen className="w-4 h-4" />}
            onClick={() => navigate('/tuntas/materi')}
          >
            Bank Materi
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/tuntas/asesmen')}
          >
            Buat Asesmen Diagnostik
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bank Materi Pembelajaran"
          value={materials.length}
          subtitle="Modul Literasi & Numerasi SD/SMP"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Paket Asesmen Aktif"
          value={assessments.length}
          subtitle="Asesmen Diagnostik Terdaftar"
          icon={<FileCheck className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Siswa Telah Dinilai"
          value={totalAssessed}
          subtitle="Pengerjaan Tersimpan di Database"
          icon={<Users className="w-5 h-5" />}
          colorScheme="amber"
        />
        <StatCard
          title="Rerata Skor Diagnostik"
          value={avgScore}
          subtitle="Skala Penilaian 0 - 100"
          icon={<TrendingUp className="w-5 h-5" />}
          colorScheme="indigo"
        />
      </div>

      {/* Adaptive Learning Workflow Illustration */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Alur Kerja Sistem Pembelajaran Adaptif JALIN-TUNTAS (3T Ready)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold inline-flex items-center justify-center mb-2">1</span>
              <h4 className="font-bold text-slate-800 text-sm">Asesmen Awal</h4>
              <p className="text-slate-500 mt-1">Siswa mengerjakan tes diagnostik secara daring atau luring di tablet kelas.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold inline-flex items-center justify-center mb-2">2</span>
              <h4 className="font-bold text-slate-800 text-sm">Analisis Kompetensi</h4>
              <p className="text-slate-500 mt-1">Sistem memetakan butir soal salah ke kode kompetensi dasar (misal: Pecahan / ADiKSiMBa).</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold inline-flex items-center justify-center mb-2">3</span>
              <h4 className="font-bold text-slate-800 text-sm">Rekomendasi Preskriptif</h4>
              <p className="text-slate-500 mt-1">Modul remedial spesifik otomatis disarankan ke beranda belajar murid tanpa campur tangan manual.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold inline-flex items-center justify-center mb-2">4</span>
              <h4 className="font-bold text-slate-800 text-sm">Latihan & Penguasaan</h4>
              <p className="text-slate-500 mt-1">Siswa menuntaskan latihan penguatan, skor meningkat, dan guru menerima rekap kemajuan.</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable onClick={() => navigate('/tuntas/asesmen')}>
          <CardHeader
            title="Daftar Paket Asesmen Diagnostik"
            subtitle="Lihat asesmen yang dapat dikerjakan siswa sekarang"
            icon={<FileCheck className="w-5 h-5 text-blue-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <div className="space-y-2.5">
              {assessments.map(a => (
                <div key={a.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{a.title}</p>
                    <p className="text-[11px] text-slate-500">{a.targetGrade} • {a.questionIds.length} Soal • Waktu {a.durationMinutes} Menit</p>
                  </div>
                  <Badge variant="success" size="sm">{a.status}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card hoverable onClick={() => navigate('/tuntas/rekomendasi')}>
          <CardHeader
            title="Hasil Asesmen & Riwayat Rekomendasi"
            subtitle="Daftar pengerjaan siswa dan analisis penguasaan"
            icon={<Sparkles className="w-5 h-5 text-amber-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            {submissions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada pengerjaan asesmen siswa. Beralih ke peran Siswa dan kerjakan tes untuk melihat demonstrasi perhitungan otomatis!
              </div>
            ) : (
              <div className="space-y-2.5">
                {submissions.slice(-3).reverse().map(sub => (
                  <div key={sub.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-500">{new Date(sub.submittedAt).toLocaleTimeString('id-ID')} • {sub.correctCount} dari {sub.totalQuestions} Benar</p>
                    </div>
                    <span className="text-base font-black text-blue-600">{sub.score}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

