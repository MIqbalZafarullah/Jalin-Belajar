import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Assessment, Material, AssessmentSubmission, Competency } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Clock
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
  ReferenceLine,
  Cell
} from 'recharts';

export const TuntasDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const mats = await db.materials.toArray();
        const asms = await db.assessments.toArray();
        const subs = await db.submissions.toArray();
        const comps = await db.competencies.toArray();
        setMaterials(mats);
        setAssessments(asms);
        setSubmissions(subs);
        setCompetencies(comps);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalAssessed = submissions.length;
  const avgScore = totalAssessed > 0 
    ? Math.round((submissions.reduce((acc, s) => acc + s.score, 0) / totalAssessed))
    : 72; // Baseline default if no submissions yet

  const studentsBelowThreshold = submissions.filter(s => s.score < 70).length;

  // Calculate competency gap data for Recharts BarChart
  const competencyGapData = competencies.map(comp => {
    // Find all mastery records for this competency
    const masteryRecords = submissions.flatMap(s => 
      s.competencyMastery ? s.competencyMastery.filter(m => m.competencyId === comp.id) : []
    );

    let avg = 0;
    if (masteryRecords.length > 0) {
      avg = Math.round(masteryRecords.reduce((acc, m) => acc + m.percentage, 0) / masteryRecords.length);
    } else {
      // Default initial baseline based on domain
      avg = comp.domain === 'Numerasi' ? 58 : 74;
    }

    return {
      name: comp.code,
      title: comp.title,
      domain: comp.domain,
      rerata: avg,
      threshold: comp.minMasteryScore || 70,
      gap: (comp.minMasteryScore || 70) - avg
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Dasbor Pembelajaran</h1>
            <Badge variant="primary" size="sm">
              Siklus Diagnostik & Tuntas 3T
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Mendiagnosis kesenjangan belajar, menghitung ketuntasan kompetensi, dan merekomendasikan intervensi materi kontekstual.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={<BookOpen className="w-4 h-4 text-blue-600" />}
            onClick={() => navigate('/tuntas/materi')}
          >
            Lihat Bank Materi
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/tuntas/asesmen')}
          >
            Buat Asesmen
          </Button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Modul Materi"
          value={materials.length}
          subtitle="Tersedia luring & daring"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Paket Asesmen"
          value={assessments.length}
          subtitle="Instrumen diagnostik aktif"
          icon={<FileCheck className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Rata-rata Skor Diagnostik"
          value={`${avgScore}`}
          subtitle="Standar KKM: 70"
          icon={<TrendingUp className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Siswa Perlu Penguatan"
          value={studentsBelowThreshold}
          subtitle="Skor diagnostik < 70%"
          icon={<AlertTriangle className="w-5 h-5" />}
          colorScheme="amber"
        />
      </div>

      {/* Competency Gap Chart */}
      <Card>
        <CardHeader
          title="Analisis Kesenjangan Kompetensi (Competency Gap Chart)"
          subtitle="Rerata capaian siswa per kode kompetensi dibandingkan batas ketuntasan minimum (KKM: 70)"
          icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
          action={
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
                Tuntas (≥ 70%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                Perlu Intervensi (&lt; 70%)
              </span>
            </div>
          }
        />
        <CardBody className="p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competencyGapData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                  interval={0}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12, fill: '#64748B' }} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-xs space-y-1">
                          <p className="font-bold text-slate-900">{data.name} - {data.title}</p>
                          <p className="text-slate-500">Domain: <span className="font-medium text-slate-700">{data.domain}</span></p>
                          <p className="text-slate-500">Rerata Skor: <span className={`font-bold ${data.rerata >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{data.rerata}%</span></p>
                          <p className="text-slate-500">Status: <span className="font-medium">{data.rerata >= 70 ? 'Sudah Menguasai' : 'Perlu Penguatan Modul'}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Ambang KKM 70', position: 'top', fill: '#EF4444', fontSize: 11 }} />
                <Bar dataKey="rerata" radius={[6, 6, 0, 0]}>
                  {competencyGapData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rerata >= 70 ? '#2563EB' : '#F59E0B'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Recent Assessments Table */}
      <Card>
        <CardHeader
          title="Daftar Paket Asesmen Terkini"
          subtitle="Instrumen asesmen diagnostik yang dapat diakses oleh siswa di wilayah Mukomuko"
          icon={<FileCheck className="w-5 h-5 text-blue-600" />}
          action={
            <Button 
              variant="outline" 
              size="sm" 
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/tuntas/asesmen')}
            >
              Lihat Semua Asesmen
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Judul Asesmen</th>
                <th className="px-6 py-3.5">Domain & Jenjang</th>
                <th className="px-6 py-3.5">Jumlah Soal</th>
                <th className="px-6 py-3.5">Durasi Waktu</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Belum ada paket asesmen diagnostik yang terdaftar.
                  </td>
                </tr>
              ) : (
                assessments.slice(0, 5).map(asm => (
                  <tr key={asm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{asm.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Dibuat oleh: {asm.teacherName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={asm.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                          {asm.domain}
                        </Badge>
                        <span className="text-xs text-slate-500">{asm.targetGrade}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {asm.questionIds?.length || 0} Butir
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {asm.durationMinutes} Menit
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={asm.status === 'Aktif' ? 'success' : asm.status === 'Selesai' ? 'neutral' : 'warning'}
                        size="sm"
                        dot
                      >
                        {asm.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/tuntas/ujian/${asm.id}`)}
                      >
                        Mulai Tes
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
};
