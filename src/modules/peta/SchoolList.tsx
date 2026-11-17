import React, { useState, useEffect } from 'react';
import { School, SchoolLevel, PriorityLevel } from '../../types';
import { db } from '../../database/db';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SchoolFormModal } from './SchoolFormModal';
import { MukomukoInteractiveMap } from './MukomukoInteractiveMap';
import { useToast } from '../../context/ToastContext';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Wifi, 
  Laptop, 
  Users, 
  Edit, 
  Trash2, 
  ExternalLink,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchoolList: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | SchoolLevel>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | PriorityLevel>('ALL');
  const [only3T, setOnly3T] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
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
      showToast(`Data sekolah "${schoolData.name}" berhasil diperbarui!`, 'success');
    } else {
      const newSchool: School = {
        ...schoolData,
        id: 'sch-' + Date.now(),
        updatedAt: new Date().toISOString().split('T')[0]
      };
      await db.schools.add(newSchool);
      showToast(`Sekolah baru "${newSchool.name}" berhasil ditambahkan!`, 'success');
    }
    await loadSchools();
    setEditingSchool(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data sekolah "${name}"?`)) {
      await db.schools.delete(id);
      showToast(`Data sekolah "${name}" telah dihapus.`, 'info');
      await loadSchools();
    }
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.npsn.includes(searchQuery);
    const matchesLevel = levelFilter === 'ALL' || s.level === levelFilter;
    const matchesPriority = priorityFilter === 'ALL' || s.priorityLevel === priorityFilter;
    const matches3T = !only3T || s.is3TArea;
    const matchesDistrict = !selectedDistrict || s.district.toLowerCase() === selectedDistrict.toLowerCase();
    return matchesSearch && matchesLevel && matchesPriority && matches3T && matchesDistrict;
  });

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'Sangat Tinggi': return <Badge variant="danger" dot>Prioritas Sangat Tinggi</Badge>;
      case 'Tinggi': return <Badge variant="warning" dot>Prioritas Tinggi</Badge>;
      case 'Sedang': return <Badge variant="info">Prioritas Sedang</Badge>;
      case 'Rendah': return <Badge variant="success">Mandiri / Rendah</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-PETA: Pemetaan Sekolah</h1>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">
              Kab. Mukomuko
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Basis data kondisi satuan pendidikan, kesiapan infrastruktur 3T, dan rerata capaian asesmen.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingSchool(null);
            setIsModalOpen(true);
          }}
        >
          Tambah Satuan Pendidikan
        </Button>
      </div>

      {/* Geospasial Mukomuko Interactive Map */}
      <MukomukoInteractiveMap
        schools={schools}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari sekolah, kecamatan, NPSN..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">Semua Jenjang (SD & SMP)</option>
                <option value="SD">Jenjang SD</option>
                <option value="SMP">Jenjang SMP</option>
              </select>
            </div>

            <div>
              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">Semua Tingkat Prioritas</option>
                <option value="Sangat Tinggi">Prioritas Sangat Tinggi</option>
                <option value="Tinggi">Prioritas Tinggi</option>
                <option value="Sedang">Prioritas Sedang</option>
                <option value="Rendah">Prioritas Rendah</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={only3T}
                  onChange={e => setOnly3T(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Hanya Wilayah 3T / Terisolir</span>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Satuan Pendidikan</th>
                <th className="px-5 py-3.5">Kondisi Listrik</th>
                <th className="px-5 py-3.5">Jaringan Internet</th>
                <th className="px-5 py-3.5">Perangkat TIK</th>
                <th className="px-5 py-3.5">Rerata Asesmen</th>
                <th className="px-5 py-3.5">Status Prioritas</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Tidak ditemukan data sekolah yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSchools.map(school => (
                  <tr key={school.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/peta/sekolah/${school.id}`)}>
                            {school.name}
                          </span>
                          {school.is3TArea && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                              3T
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>NPSN: {school.npsn}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            Kec. {school.district}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-slate-700">{school.level}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Zap className={`w-3.5 h-3.5 ${
                          school.electricStatus === 'PLN 24 Jam' ? 'text-emerald-500' :
                          school.electricStatus === 'PLN Terbatas' ? 'text-amber-500' : 'text-rose-500'
                        }`} />
                        <span>{school.electricStatus}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Wifi className={`w-3.5 h-3.5 ${
                          school.internetStatus === 'Stabil (Fiber/4G)' ? 'text-emerald-500' :
                          school.internetStatus === 'Terbatas (3G/4G Lemah)' ? 'text-amber-500' : 'text-rose-500'
                        }`} />
                        <span>{school.internetStatus}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{school.deviceCount} Unit</span>
                        <span className="text-slate-400">({school.studentCount} murid)</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">Lit:</span>
                          <span className="font-bold text-slate-800">{school.literacyScoreAvg}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">Num:</span>
                          <span className="font-bold text-slate-800">{school.numeracyScoreAvg}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {getPriorityBadge(school.priorityLevel)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/peta/sekolah/${school.id}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Lihat Detail Profil Sekolah"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSchool(school);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Ubah Data"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(school.id, school.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSchool}
      />
    </div>
  );
};

