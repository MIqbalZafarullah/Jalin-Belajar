import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { School, SchoolLevel } from '../../types';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Award, 
  Search, 
  Filter, 
  ChevronRight,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Building2,
  GraduationCap
} from 'lucide-react';

export const LiteracyNumeracyMap: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [jenjangFilter, setJenjangFilter] = useState<'Semua' | SchoolLevel>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    db.schools.toArray().then(setSchools);
  }, []);

  // Filtered schools
  const filteredSchools = schools.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.npsn.includes(searchQuery);

    const matchesJenjang = jenjangFilter === 'Semua' || s.level === jenjangFilter;

    return matchesSearch && matchesJenjang;
  });

  // Calculate county averages
  const avgLit = schools.length > 0
    ? (schools.reduce((acc, s) => acc + s.literacyScoreAvg, 0) / schools.length).toFixed(1)
    : '0';

  const avgNum = schools.length > 0
    ? (schools.reduce((acc, s) => acc + s.numeracyScoreAvg, 0) / schools.length).toFixed(1)
    : '0';

  // Schools needing special intervention (both scores < 60)
  const schoolsNeedIntervention = schools.filter(
    s => s.literacyScoreAvg < 60 || s.numeracyScoreAvg < 60
  ).length;

  // Chart data per school
  const chartData = filteredSchools.map(s => ({
    name: s.name.replace(/^(SDN|SMPN)\s*/, ''),
    Literasi: Number(s.literacyScoreAvg.toFixed(1)),
    Numerasi: Number(s.numeracyScoreAvg.toFixed(1)),
    jenjang: s.level,
    district: s.district
  }));

  // Trend indicator helper based on scores
  const getTrendIndicator = (school: School) => {
    const avg = (school.literacyScoreAvg + school.numeracyScoreAvg) / 2;
    if (avg >= 70) {
      return {
        label: 'Meningkat',
        icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />,
        badgeClass: 'bg-green-100 text-green-700'
      };
    } else if (avg >= 55) {
      return {
        label: 'Stabil',
        icon: <Minus className="w-3.5 h-3.5 text-amber-600" />,
        badgeClass: 'bg-amber-100 text-amber-700'
      };
    } else {
      return {
        label: 'Perlu Intervensi',
        icon: <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />,
        badgeClass: 'bg-rose-100 text-rose-700'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link to="/dashboard" className="hover:text-blue-600 transition">JALIN BELAJAR</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">JALIN-PETA</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-medium">Capaian Literasi & Numerasi</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900">Sebaran Capaian Literasi & Numerasi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Analisis perbandingan kemampuan dasar membaca-menalar dan berhitung di Kabupaten Mukomuko.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Literasi */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Rerata Literasi Kabupaten</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {avgLit} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Target SPM: Min. 70.0</p>
          </div>
        </div>

        {/* Numerasi */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Rerata Numerasi Kabupaten</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {avgNum} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Perlu perhatian di SD 3T</p>
          </div>
        </div>

        {/* Kesenjangan 3T */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Kesenjangan Kota vs 3T</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">43.1 <span className="text-xs font-normal text-slate-400">poin</span></h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kota Mukomuko vs Malin Deman</p>
          </div>
        </div>

        {/* Butuh Intervensi */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Sekolah Prioritas Intervensi</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {schoolsNeedIntervention} <span className="text-xs font-normal text-slate-400">Sekolah</span>
            </h3>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Skor di bawah 60.0</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari sekolah atau kecamatan..."
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={jenjangFilter}
              onChange={e => setJenjangFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="Semua">Semua Jenjang (SD & SMP)</option>
              <option value="SD">Jenjang SD Saja</option>
              <option value="SMP">Jenjang SMP Saja</option>
            </select>
          </div>

          {(searchQuery || jenjangFilter !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setJenjangFilter('Semua');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Perbandingan Capaian Literasi vs Numerasi per Sekolah</h3>
              <p className="text-xs text-slate-500">Skor rata-rata asesmen diagnostik (Rentang Nilai 0 - 100)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600" />
              <span className="text-slate-600 font-medium">Literasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span className="text-slate-600 font-medium">Numerasi</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} angle={-25} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                formatter={(value: any) => [`${value} Poin`, '']}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Literasi" fill="#2563EB" radius={[4, 4, 0, 0]} name="Capaian Literasi" />
              <Bar dataKey="Numerasi" fill="#10B981" radius={[4, 4, 0, 0]} name="Capaian Numerasi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table: School Name, Avg Literacy, Avg Numeracy, Trend Indicator */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Tabel Rincian Capaian Satuan Pendidikan</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {filteredSchools.length} sekolah
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">No</th>
                <th className="px-5 py-3.5">Nama Satuan Pendidikan</th>
                <th className="px-4 py-3.5">Jenjang</th>
                <th className="px-4 py-3.5">Kecamatan</th>
                <th className="px-4 py-3.5 text-center">Skor Literasi</th>
                <th className="px-4 py-3.5 text-center">Skor Numerasi</th>
                <th className="px-4 py-3.5 text-center">Indikator Tren</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                    Tidak ditemukan data capaian sekolah.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, index) => {
                  const trend = getTrendIndicator(school);
                  return (
                    <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 text-center text-xs text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span 
                            onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                            className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {school.name}
                          </span>
                          {school.is3TArea && (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700">
                              3T
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">NPSN: {school.npsn}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          school.level === 'SD' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {school.level}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-700">
                        Kec. {school.district}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold text-xs ${
                          school.literacyScoreAvg >= 70 ? 'text-blue-600' : 'text-slate-800'
                        }`}>
                          {school.literacyScoreAvg.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`font-bold text-xs ${
                          school.numeracyScoreAvg >= 70 ? 'text-emerald-600' : 'text-slate-800'
                        }`}>
                          {school.numeracyScoreAvg.toFixed(1)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trend.badgeClass}`}>
                          {trend.icon}
                          <span>{trend.label}</span>
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profil</span>
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
