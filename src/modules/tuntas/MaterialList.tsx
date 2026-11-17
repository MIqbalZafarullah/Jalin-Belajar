import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Material } from '../../types';
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
  ArrowRight,
  HardDriveDownload,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import { useToast } from '../../context/ToastContext';

type FilterTab = 'Semua' | 'Literasi SD' | 'Numerasi SD' | 'Literasi SMP' | 'Numerasi SMP';

export const MaterialList: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Semua');
  const navigate = useNavigate();
  const { addToSyncQueue } = useOffline();
  const { showToast } = useToast();

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
    await addToSyncQueue(newStatus ? 'CREATE' : 'DELETE', 'material_download', { 
      id: material.id, 
      title: material.title 
    });
    await loadMaterials();
    showToast(
      newStatus 
        ? `"${material.title}" berhasil disimpan di memori luring (dapat dibuka tanpa sinyal).`
        : `"${material.title}" dihapus dari simpanan luring.`,
      newStatus ? 'success' : 'info'
    );
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'Literasi SD') {
      matchesTab = m.domain === 'Literasi' && m.level === 'SD';
    } else if (activeTab === 'Numerasi SD') {
      matchesTab = m.domain === 'Numerasi' && m.level === 'SD';
    } else if (activeTab === 'Literasi SMP') {
      matchesTab = m.domain === 'Literasi' && m.level === 'SMP';
    } else if (activeTab === 'Numerasi SMP') {
      matchesTab = m.domain === 'Numerasi' && m.level === 'SMP';
    }

    return matchesSearch && matchesTab;
  });

  const tabs: FilterTab[] = ['Semua', 'Literasi SD', 'Numerasi SD', 'Literasi SMP', 'Numerasi SMP'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Bank Materi Pembelajaran</h1>
            <Badge variant="primary" size="sm">
              Kurikulum Merdeka 3T
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modul pembelajaran kontekstual berbasis kearifan lokal Bengkulu yang siap diunduh untuk pembelajaran luring (offline-first).
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul materi atau topik..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Material Grid: 3 col desktop, 2 col tablet, 1 col mobile */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Materi Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Coba sesuaikan kata kunci pencarian atau pilih tab filter yang lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(mat => {
            // Determine material type (Teks / Video / Latihan)
            const typeBadge = mat.readingTimeMinutes > 15 ? 'Modul Interaktif' : 'Teks Kontekstual';

            return (
              <div
                key={mat.id}
                onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between p-6 group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge 
                        variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} 
                        size="sm"
                      >
                        {mat.domain}
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        Jenjang {mat.level}
                      </span>
                      <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {typeBadge}
                      </span>
                    </div>

                    {/* Offline Indicator if downloaded */}
                    {mat.isDownloadedOffline && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Luring
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Competency target */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[11px] text-slate-600 truncate font-medium">
                      {mat.competencyName}
                    </span>
                  </div>
                </div>

                {/* Bottom meta & action button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{mat.readingTimeMinutes} Menit</span>
                  </div>

                  <Button
                    variant={mat.isDownloadedOffline ? 'outline' : 'primary'}
                    size="sm"
                    icon={mat.isDownloadedOffline ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <HardDriveDownload className="w-3.5 h-3.5" />}
                    onClick={(e) => handleToggleOffline(e, mat)}
                    className={mat.isDownloadedOffline ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50' : ''}
                  >
                    {mat.isDownloadedOffline ? 'Tersimpan' : 'Simpan Luring'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
