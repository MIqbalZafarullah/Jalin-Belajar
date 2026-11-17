import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Material, DomainCategory, EducationLevel } from '../../types';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  BookOpen, 
  Search, 
  DownloadCloud, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';

export const MaterialList: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<'ALL' | DomainCategory>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | EducationLevel>('ALL');
  const navigate = useNavigate();
  const { addToSyncQueue } = useOffline();

  const loadMaterials = async () => {
    const list = await db.materials.toArray();
    setMaterials(list);
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleToggleOffline = async (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    const newStatus = !material.isDownloadedOffline;
    await db.materials.update(material.id, {
      isDownloadedOffline: newStatus,
      downloadedAt: newStatus ? new Date().toISOString() : undefined
    });
    await addToSyncQueue(newStatus ? 'CREATE' : 'DELETE', 'material_download', { id: material.id, title: material.title });
    await loadMaterials();
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'ALL' || m.domain === domainFilter;
    const matchesLevel = levelFilter === 'ALL' || m.level === levelFilter;
    return matchesSearch && matchesDomain && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Bank Materi Pembelajaran</h1>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">
              Literasi & Numerasi 3T
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modul pembelajaran kontekstual berbasis kearifan lokal Bengkulu dan Kurikulum Merdeka yang dapat diunduh untuk penggunaan luring tanpa kuota.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari judul materi, pecahan, cerita..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">Semua Domain (Literasi & Numerasi)</option>
                <option value="Literasi">Literasi Membaca</option>
                <option value="Numerasi">Numerasi Menalar</option>
              </select>
            </div>

            <div>
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">Semua Jenjang (SD & SMP)</option>
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Material Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMaterials.map(mat => (
          <Card
            key={mat.id}
            hoverable
            onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
            className="flex flex-col justify-between"
          >
            <CardBody className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                    {mat.domain}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Jenjang {mat.level}
                  </span>
                  {mat.recommendedForWeakCompetency && (
                    <Badge variant="warning" size="sm">
                      <Sparkles className="w-3 h-3 text-amber-600 mr-1" />
                      Modul Remedial
                    </Badge>
                  )}
                </div>

                <button
                  onClick={e => handleToggleOffline(e, mat)}
                  title={mat.isDownloadedOffline ? "Hapus dari memori luring" : "Unduh ke memori luring (Dapat dibuka tanpa sinyal)"}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                    mat.isDownloadedOffline
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mat.isDownloadedOffline ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="hidden sm:inline">Tersimpan Luring</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-4 h-4 text-slate-500" />
                      <span className="hidden sm:inline">Simpan Luring</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 transition">
                {mat.title}
              </h3>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {mat.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {mat.readingTimeMinutes} Menit Baca
                  </span>
                  <span>•</span>
                  <span>{(mat.fileSizeBytes / 1024).toFixed(0)} KB</span>
                </div>

                <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Pelajari <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

