import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { AssessmentSubmission, Assessment, Competency, Material } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Eye,
  Filter,
  Search,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GuruAnalisisHasil: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSub, setSelectedSub] = useState<AssessmentSubmission | null>(null);
  const [filterDomain, setFilterDomain] = useState<'Semua' | 'Tuntas' | 'Perlu Intervensi'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const subs = await db.submissions.toArray();
      const asms = await db.assessments.toArray();
      const comps = await db.competencies.toArray();
      const mats = await db.materials.toArray();

      setSubmissions(subs);
      setAssessments(asms);
      setCompetencies(comps);
      setMaterials(mats);
    };
    fetchData();
  }, []);

  // Filter submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterDomain === 'Tuntas') return s.score >= 70;
    if (filterDomain === 'Perlu Intervensi') return s.score < 70;
    return true;
  });

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions)
    : 0;
  const needInterventionCount = submissions.filter(s => s.score < 70).length;
  const masteryRate = totalSubmissions > 0
    ? Math.round(((totalSubmissions - needInterventionCount) / totalSubmissions) * 100)
    : 0;

  // Aggregate competency mastery
  const compStats: Record<string, { name: string; totalPct: number; count: number }> = {};
  submissions.forEach(sub => {
    sub.competencyMastery.forEach(cm => {
      if (!compStats[cm.competencyId]) {
        compStats[cm.competencyId] = {
          name: cm.competencyName,
          totalPct: 0,
          count: 0
        };
      }
      compStats[cm.competencyId].totalPct += cm.percentage;
      compStats[cm.competencyId].count += 1;
    });
  });

  const competencySummary = Object.entries(compStats).map(([id, data]) => ({
    id,
    name: data.name,
    avgPercentage: Math.round(data.totalPct / (data.count || 1))
  })).sort((a, b) => a.avgPercentage - b.avgPercentage);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Analisis Hasil Asesmen & Diagnostik</h1>
            <Badge variant="blue" size="sm">Kelas 5 SD</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pemetaan kelemahan kompetensi individual dan agregat kelas untuk menentukan intervensi pembelajaran terarah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/guru/rekomendasi')}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            Lihat Modul Rekomendasi
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Peserta Ujian</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalSubmissions} Siswa</p>
          <span className="text-xs text-slate-500 mt-0.5 block">Terkoreksi otomatis</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rata-Rata Nilai</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{avgScore} / 100</p>
          <span className="text-xs text-slate-500 mt-0.5 block">Skala penilaian 0-100</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perlu Intervensi</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{needInterventionCount} Siswa</p>
          <span className="text-xs text-rose-500 font-medium mt-0.5 block">Skor di bawah 70%</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tingkat Ketuntasan</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{masteryRate}%</p>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">Memenuhi standar ketuntasan</span>
        </div>
      </div>

      {/* Competency Gap Spotlight (Aturan Rekomendasi Transparan) */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Profil Penguasaan Kompetensi Kelas</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Diurutkan dari kompetensi yang paling mendesak butuh penguatan konsep dasar.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> &lt;60% Dasar
            </span>
            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 60-79% Lanjutan
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> &ge;80% Pengayaan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competencySummary.map((comp) => {
            const isCritical = comp.avgPercentage < 60;
            const isMedium = comp.avgPercentage >= 60 && comp.avgPercentage < 80;

            return (
              <div
                key={comp.id}
                className={`p-4 rounded-xl border ${
                  isCritical
                    ? 'bg-rose-50/50 border-rose-200'
                    : isMedium
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800 text-sm">{comp.name}</span>
                  <span
                    className={`font-black text-sm px-2 py-0.5 rounded-md ${
                      isCritical
                        ? 'bg-rose-100 text-rose-700'
                        : isMedium
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {comp.avgPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${comp.avgPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  {isCritical
                    ? 'Rekomendasi: Perlu penguatan konsep dasar & bimbingan terbimbing.'
                    : isMedium
                    ? 'Rekomendasi: Diberikan soal latihan kontekstual mandiri.'
                    : 'Rekomendasi: Siap diberikan materi tantangan pengayaan.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {(['Semua', 'Tuntas', 'Perlu Intervensi'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterDomain(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  filterDomain === filter
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Nama Siswa</th>
                <th className="px-5 py-3">Paket Asesmen</th>
                <th className="px-5 py-3">Nilai</th>
                <th className="px-5 py-3">Kelemahan Kritis</th>
                <th className="px-5 py-3">Status Ketuntasan</th>
                <th className="px-5 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan data hasil asesmen yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const weakComp = sub.competencyMastery.reduce((min, curr) => 
                    curr.percentage < min.percentage ? curr : min, 
                    sub.competencyMastery[0] || { competencyName: '-', percentage: 100 }
                  );
                  const isPassed = sub.score >= 70;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {sub.studentName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        Diagnostik Numerasi Kelas 5
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-black text-sm ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.score}
                        </span>
                        <span className="text-slate-400 text-[11px]"> / 100</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {weakComp && weakComp.percentage < 70 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-100">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            {weakComp.competencyName} ({weakComp.percentage}%)
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Seluruh Kompetensi Tuntas
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {sub.score >= 80 ? (
                          <Badge variant="green" size="sm">Pengayaan (&ge;80%)</Badge>
                        ) : sub.score >= 60 ? (
                          <Badge variant="amber" size="sm">Latihan Lanjutan (60-79%)</Badge>
                        ) : (
                          <Badge variant="rose" size="sm">Konsep Dasar (&lt;60%)</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => navigate(`/tuntas/hasil/${sub.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold transition"
                        >
                          <span>Rincian</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
