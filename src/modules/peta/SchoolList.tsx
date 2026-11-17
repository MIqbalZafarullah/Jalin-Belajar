import React, { useState, useEffect } from 'react';
import { School, SchoolLevel, InternetStatus } from '../../types';
import { db } from '../../database/db';
import { SchoolFormModal } from './SchoolFormModal';
import { MukomukoInteractiveMap } from './MukomukoInteractiveMap';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Wifi, 
  Users, 
  GraduationCap, 
  Edit2, 
  Trash2, 
  Eye, 
  MapPin, 
  ChevronRight,
  Globe2,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';

export const SchoolList: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<'Semua' | SchoolLevel>('Semua');
  const [internetFilter, setInternetFilter] = useState<'Semua' | InternetStatus>('Semua');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadSchools = async () => {
    const list = await db.schools.toArray();
    setSchools(list);
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleCreateOrUpdate = async (schoolData: any) => {
    if (editingSchool) {
      await db.schools.put(schoolData);
      showToast(`Data sekolah "${schoolData.name}" berhasil diperbarui.`, 'success');
    } else {
      const newSchool: School = {
        ...schoolData,
        id: 'sch-' + Date.now(),
        updatedAt: new Date().toISOString().split('T')[0]
      };
      await db.schools.add(newSchool);
      showToast(`Sekolah baru "${newSchool.name}" berhasil ditambahkan.`, 'success');
    }
    await loadSchools();
    setEditingSchool(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data sekolah "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      await db.schools.delete(id);
      showToast(`Data sekolah "${name}" berhasil dihapus.`, 'info');
      await loadSchools();
    }
  };

  // Client-side filtering
  const filteredSchools = schools.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.npsn.includes(searchQuery);
    
    const matchesJenjang = jenjangFilter === 'Semua' || s.level === jenjangFilter;
    const matchesInternet = internetFilter === 'Semua' || s.internetStatus === internetFilter;
    const matchesDistrict = !selectedDistrict || s.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesJenjang && matchesInternet && matchesDistrict;
  });

  // Calculate stats from Dexie
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((acc, s) => acc + (s.studentCount || 0), 0);
  const totalTeachers = schools.reduce((acc, s) => acc + (s.teacherCount || 0), 0);
  const schoolsWithInternet = schools.filter(s => s.internetStatus !== 'Tidak Ada Sinyal').length;

  // Calculate priority badge based on requirements:
  // if internet=none AND electricity=none → "Prioritas 1"
  // if one missing → "Prioritas 2"
  // else → "Terpantau"
  const getPriorityInfo = (school: School) => {
    const isInternetNone = school.internetStatus === 'Tidak Ada Sinyal';
    const isElectricNone = school.electricStatus === 'Belum Ada';
    const isInternetWeak = isInternetNone || school.internetStatus === 'VSAT/Satelit' || school.internetStatus === 'Terbatas (3G/4G Lemah)';
    const isElectricWeak = isElectricNone || school.electricStatus === 'PLN Terbatas' || school.electricStatus === 'Genset/Surya';

    if (isInternetNone && isElectricNone) {
      return {
        label: 'Prioritas 1',
        className: 'bg-rose-100 text-rose-700'
      };
    } else if (isInternetNone || isElectricNone || school.priorityLevel === 'Sangat Tinggi' || (isInternetWeak && isElectricWeak)) {
      return {
        label: 'Prioritas 2',
        className: 'bg-amber-100 text-amber-700'
      };
    } else {
      return {
        label: 'Terpantau',
        className: 'bg-green-100 text-green-700'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Link to="/dashboard" className="hover:text-blue-600 transition">JALIN BELAJAR</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">JALIN-PETA</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-medium">Pemetaan Sekolah</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Pemetaan Sekolah — Kabupaten Mukomuko</h1>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Data Simulasi
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Direktori satuan pendidikan dasar, status jaringan 3T, serta profil kesiapan fasilitas pembelajaran.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-xs"
            >
              <MapIcon className="w-4 h-4 text-slate-500" />
              <span>{showMap ? 'Sembunyikan Peta' : 'Buka Peta Wilayah'}</span>
            </button>

            <button
              onClick={() => {
                setEditingSchool(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sekolah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Satuan Pendidikan</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalSchools}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kab. Mukomuko</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Peserta Didik</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalStudents.toLocaleString('id-ID')}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Siswa terdaftar</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Tenaga Pendidik</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalTeachers}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Guru & staf sekolah</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Sekolah Berakses Internet</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{schoolsWithInternet} <span className="text-xs font-normal text-slate-400">/ {totalSchools}</span></h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{((schoolsWithInternet / (totalSchools || 1)) * 100).toFixed(0)}% terkoneksi</p>
          </div>
        </div>
      </div>

      {/* Interactive Geospasial Map Section */}
      {showMap && (
        <MukomukoInteractiveMap
          schools={schools}
          selectedDistrict={selectedDistrict}
          onSelectDistrict={setSelectedDistrict}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama sekolah, kecamatan, desa, atau NPSN..."
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Jenjang Filter */}
          <div className="w-full md:w-56">
            <select
              value={jenjangFilter}
              onChange={e => setJenjangFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="Semua">Semua Jenjang (SD & SMP)</option>
              <option value="SD">Jenjang SD</option>
              <option value="SMP">Jenjang SMP</option>
            </select>
          </div>

          {/* Kondisi Internet Filter */}
          <div className="w-full md:w-64">
            <select
              value={internetFilter}
              onChange={e => setInternetFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="Semua">Semua Kondisi Internet</option>
              <option value="Stabil (Fiber/4G)">Stabil (Fiber/4G)</option>
              <option value="Terbatas (3G/4G Lemah)">Terbatas (3G/4G Lemah)</option>
              <option value="VSAT/Satelit">VSAT / Satelit</option>
              <option value="Tidak Ada Sinyal">Tidak Ada Sinyal</option>
            </select>
          </div>

          {/* Reset button if filtered */}
          {(searchQuery || jenjangFilter !== 'Semua' || internetFilter !== 'Semua' || selectedDistrict) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setJenjangFilter('Semua');
                setInternetFilter('Semua');
                setSelectedDistrict(null);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-800">Daftar Satuan Pendidikan</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
              {filteredSchools.length} sekolah ditemukan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">No</th>
                <th className="px-5 py-3.5">Nama Sekolah</th>
                <th className="px-4 py-3.5">Jenjang</th>
                <th className="px-4 py-3.5">Desa / Kecamatan</th>
                <th className="px-4 py-3.5 text-right">Jumlah Siswa</th>
                <th className="px-4 py-3.5 text-right">Jumlah Guru</th>
                <th className="px-4 py-3.5">Kondisi Internet</th>
                <th className="px-4 py-3.5">Kondisi Listrik</th>
                <th className="px-4 py-3.5 text-center">Prioritas</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm">Tidak ditemukan data sekolah yang sesuai kriteria pencarian.</p>
                    <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci atau setelan filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, index) => {
                  const priority = getPriorityInfo(school);
                  return (
                    <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* No */}
                      <td className="px-4 py-4 text-center text-xs text-slate-400 font-medium">
                        {index + 1}
                      </td>

                      {/* Nama Sekolah */}
                      <td className="px-5 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                              className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition"
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
                        </div>
                      </td>

                      {/* Jenjang */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          school.level === 'SD' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {school.level}
                        </span>
                      </td>

                      {/* Desa / Kecamatan */}
                      <td className="px-4 py-4">
                        <div className="text-xs">
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            Kec. {school.district}
                          </p>
                          <p className="text-slate-400 truncate max-w-[200px]" title={school.address}>
                            {school.address || '-'}
                          </p>
                        </div>
                      </td>

                      {/* Jumlah Siswa */}
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-slate-900 text-xs">
                          {school.studentCount}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">anak</span>
                      </td>

                      {/* Jumlah Guru */}
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-slate-900 text-xs">
                          {school.teacherCount}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">guru</span>
                      </td>

                      {/* Kondisi Internet */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Wifi className={`w-3.5 h-3.5 shrink-0 ${
                            school.internetStatus === 'Stabil (Fiber/4G)' ? 'text-emerald-500' :
                            school.internetStatus === 'Terbatas (3G/4G Lemah)' ? 'text-amber-500' :
                            school.internetStatus === 'VSAT/Satelit' ? 'text-sky-500' : 'text-rose-500'
                          }`} />
                          <span className="truncate max-w-[150px]">{school.internetStatus}</span>
                        </div>
                      </td>

                      {/* Kondisi Listrik */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Zap className={`w-3.5 h-3.5 shrink-0 ${
                            school.electricStatus === 'PLN 24 Jam' ? 'text-emerald-500' :
                            school.electricStatus === 'PLN Terbatas' ? 'text-amber-500' :
                            school.electricStatus === 'Genset/Surya' ? 'text-sky-500' : 'text-rose-500'
                          }`} />
                          <span className="truncate max-w-[130px]">{school.electricStatus}</span>
                        </div>
                      </td>

                      {/* Prioritas Badge */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.className}`}>
                          {priority.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                            title="Lihat Detail Profil Sekolah"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingSchool(school);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Ubah Data Sekolah"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(school.id, school.name)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus Data Sekolah"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSchool}
      />
    </div>
  );
};
