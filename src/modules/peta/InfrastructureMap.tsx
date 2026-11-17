import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { School } from '../../types';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  CartesianGrid 
} from 'recharts';
import { 
  Zap, 
  Wifi, 
  Laptop, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ChevronRight,
  Eye,
  Building2,
  MapPin
} from 'lucide-react';

export const InfrastructureMap: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [infraFilter, setInfraFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    db.schools.toArray().then(setSchools);
  }, []);

  // Categorize each school's infrastructure status:
  // - Lengkap (Full): PLN 24 Jam AND Stabil (Fiber/4G)
  // - Kritis/Nol (None): Belum Ada Listrik OR Tidak Ada Sinyal
  // - Parsial (Partial): other combinations (PLN Terbatas, Genset/Surya, VSAT, 3G/4G Lemah)
  const getInfraCategory = (s: School): 'Lengkap' | 'Parsial' | 'Kritis' => {
    const isElectricNone = s.electricStatus === 'Belum Ada';
    const isInternetNone = s.internetStatus === 'Tidak Ada Sinyal';
    if (isElectricNone || isInternetNone) {
      return 'Kritis';
    }
    const isElectricFull = s.electricStatus === 'PLN 24 Jam';
    const isInternetFull = s.internetStatus === 'Stabil (Fiber/4G)';
    if (isElectricFull && isInternetFull) {
      return 'Lengkap';
    }
    return 'Parsial';
  };

  // 3 Summary Counts
  const fullInfraSchools = schools.filter(s => getInfraCategory(s) === 'Lengkap');
  const partialInfraSchools = schools.filter(s => getInfraCategory(s) === 'Parsial');
  const noInfraSchools = schools.filter(s => getInfraCategory(s) === 'Kritis');

  // Chart data: Electricity Breakdown
  const electricCounts: Record<string, number> = {};
  schools.forEach(s => {
    electricCounts[s.electricStatus] = (electricCounts[s.electricStatus] || 0) + 1;
  });
  const electricChartData = Object.keys(electricCounts).map(status => ({
    name: status,
    jumlah: electricCounts[status]
  }));

  // Chart data: Internet Breakdown
  const internetCounts: Record<string, number> = {};
  schools.forEach(s => {
    internetCounts[s.internetStatus] = (internetCounts[s.internetStatus] || 0) + 1;
  });
  const internetChartData = Object.keys(internetCounts).map(status => ({
    name: status,
    jumlah: internetCounts[status]
  }));

  const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  // Filter schools for table
  const filteredSchools = schools.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.npsn.includes(searchQuery);

    const category = getInfraCategory(s);

    if (infraFilter === 'Lengkap') return matchesSearch && category === 'Lengkap';
    if (infraFilter === 'Parsial') return matchesSearch && category === 'Parsial';
    if (infraFilter === 'Kritis') return matchesSearch && category === 'Kritis';
    if (infraFilter === 'PLN 24 Jam') return matchesSearch && s.electricStatus === 'PLN 24 Jam';
    if (infraFilter === 'Internet Stabil') return matchesSearch && s.internetStatus === 'Stabil (Fiber/4G)';
    if (infraFilter === 'VSAT Satelit') return matchesSearch && s.internetStatus === 'VSAT/Satelit';

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link to="/dashboard" className="hover:text-blue-600 transition">JALIN BELAJAR</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">JALIN-PETA</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-medium">Kesiapan Infrastruktur</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900">Profil Infrastruktur 3T — Kab. Mukomuko</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pemantauan ketersediaan daya listrik, jaringan komunikasi data, serta rasio ketersediaan perangkat TIK.
        </p>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Infrastruktur Lengkap */}
        <div 
          onClick={() => setInfraFilter(infraFilter === 'Lengkap' ? 'Semua' : 'Lengkap')}
          className={`bg-white rounded-xl border p-6 shadow-sm cursor-pointer transition-all ${
            infraFilter === 'Lengkap' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
              Optimal
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastruktur Lengkap</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {fullInfraSchools.length} <span className="text-sm font-normal text-slate-400">Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              PLN 24 jam & koneksi internet fiber/4G stabil. Siap asesmen daring penuh.
            </p>
          </div>
        </div>

        {/* Card 2: Infrastruktur Terbatas / Parsial */}
        <div 
          onClick={() => setInfraFilter(infraFilter === 'Parsial' ? 'Semua' : 'Parsial')}
          className={`bg-white rounded-xl border p-6 shadow-sm cursor-pointer transition-all ${
            infraFilter === 'Parsial' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">
              Parsial / Terbatas
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastruktur Parsial</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {partialInfraSchools.length} <span className="text-sm font-normal text-slate-400">Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              PLN padam berkala, genset, atau sinyal 3G lemah. Membutuhkan sinkronisasi berkala.
            </p>
          </div>
        </div>

        {/* Card 3: Tanpa Infrastruktur / Kritis */}
        <div 
          onClick={() => setInfraFilter(infraFilter === 'Kritis' ? 'Semua' : 'Kritis')}
          className={`bg-white rounded-xl border p-6 shadow-sm cursor-pointer transition-all ${
            infraFilter === 'Kritis' ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700">
              Prioritas 1 (Kritis)
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanpa Sinyal / Listrik</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {noInfraSchools.length} <span className="text-sm font-normal text-slate-400">Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Zona blankspot murni atau belum tersambung listrik. Wajib modul luring JALIN-HUB.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Electric Distribution */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Distribusi Pasokan Listrik</h3>
                <p className="text-xs text-slate-500">Ketersediaan sumber daya di satuan pendidikan</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={electricChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="jumlah" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Jumlah Sekolah" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Internet Distribution */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Konektivitas Jaringan Internet</h3>
                <p className="text-xs text-slate-500">Karakteristik sinyal telekomunikasi di area sekolah</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={internetChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="jumlah"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {internetChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
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
              placeholder="Cari sekolah, kecamatan, atau NPSN..."
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="w-full md:w-72">
            <select
              value={infraFilter}
              onChange={e => setInfraFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="Semua">Semua Kategori Infrastruktur</option>
              <option value="Lengkap">Infrastruktur Lengkap (Optimal)</option>
              <option value="Parsial">Infrastruktur Terbatas / Parsial</option>
              <option value="Kritis">Tanpa Sinyal / Blankspot (Kritis)</option>
              <option value="PLN 24 Jam">Khusus Listrik PLN 24 Jam</option>
              <option value="Internet Stabil">Khusus Internet Fiber / 4G</option>
              <option value="VSAT Satelit">Khusus VSAT Satelit BAKTI</option>
            </select>
          </div>

          {(searchQuery || infraFilter !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setInfraFilter('Semua');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table of all schools with infrastructure status columns */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Status Kesiapan Fasilitas Sekolah</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {filteredSchools.length} data
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">No</th>
                <th className="px-5 py-3.5">Nama Satuan Pendidikan</th>
                <th className="px-4 py-3.5">Kecamatan</th>
                <th className="px-4 py-3.5">Sumber Listrik</th>
                <th className="px-4 py-3.5">Konektivitas Internet</th>
                <th className="px-4 py-3.5 text-center">Perangkat TIK</th>
                <th className="px-4 py-3.5 text-center">Kategori Kesiapan</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                    Tidak ditemukan sekolah yang sesuai dengan filter infrastruktur.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, index) => {
                  const category = getInfraCategory(school);
                  
                  // Color-coded row styling based on status
                  const rowBg = 
                    category === 'Lengkap' ? 'hover:bg-emerald-50/30' :
                    category === 'Parsial' ? 'hover:bg-amber-50/30' : 'hover:bg-rose-50/30 bg-rose-50/10';

                  return (
                    <tr key={school.id} className={`${rowBg} transition-colors`}>
                      <td className="px-4 py-4 text-center text-xs text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div>
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
                          <p className="text-xs text-slate-400 mt-0.5">NPSN: {school.npsn} • {school.level}</p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-slate-700">
                        Kec. {school.district}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Zap className={`w-3.5 h-3.5 shrink-0 ${
                            school.electricStatus === 'PLN 24 Jam' ? 'text-emerald-500' :
                            school.electricStatus === 'PLN Terbatas' ? 'text-amber-500' : 'text-rose-500'
                          }`} />
                          <span className="font-medium text-slate-800">{school.electricStatus}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Wifi className={`w-3.5 h-3.5 shrink-0 ${
                            school.internetStatus === 'Stabil (Fiber/4G)' ? 'text-emerald-500' :
                            school.internetStatus === 'Terbatas (3G/4G Lemah)' ? 'text-amber-500' :
                            school.internetStatus === 'VSAT/Satelit' ? 'text-sky-500' : 'text-rose-500'
                          }`} />
                          <span className="font-medium text-slate-800">{school.internetStatus}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-slate-900 text-xs">
                          {school.deviceCount} Unit
                        </span>
                        <p className="text-[10px] text-slate-400">1 : {Math.round(school.studentCount / (school.deviceCount || 1))} siswa</p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {category === 'Lengkap' && (
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                            Lengkap
                          </span>
                        )}
                        {category === 'Parsial' && (
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">
                            Parsial
                          </span>
                        )}
                        {category === 'Kritis' && (
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700">
                            Kritis / 3T
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
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
