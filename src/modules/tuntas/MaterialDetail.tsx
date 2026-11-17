import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { Material, Competency } from '../../types';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useOffline } from '../../context/OfflineContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  DownloadCloud, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  PlayCircle, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronRight,
  FileCheck,
  Share2,
  HardDriveDownload,
  Check
} from 'lucide-react';

export const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [competency, setCompetency] = useState<Competency | null>(null);
  const { addToSyncQueue } = useOffline();
  const { showToast } = useToast();
  const { role } = useAuth();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      if (id) {
        const m = await db.materials.get(id);
        if (m) {
          setMaterial(m);
          if (m.competencyId) {
            const c = await db.competencies.get(m.competencyId);
            if (c) setCompetency(c);
          }
        }
      }
    };
    loadDetail();

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  if (!material) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Materi Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1">Materi pembelajaran yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(role === 'siswa' ? '/murid/materi' : '/guru/materi')}>
          Kembali ke Modul Materi
        </Button>
      </div>
    );
  }

  const handleToggleOffline = async () => {
    const newStatus = !material.isDownloadedOffline;
    await db.materials.update(material.id, {
      isDownloadedOffline: newStatus,
      downloadedAt: newStatus ? new Date().toISOString() : undefined
    });
    await addToSyncQueue(newStatus ? 'CREATE' : 'DELETE', 'material_download', { 
      id: material.id, 
      title: material.title 
    });
    setMaterial({
      ...material,
      isDownloadedOffline: newStatus,
      downloadedAt: newStatus ? new Date().toISOString() : undefined
    });
    showToast(
      newStatus ? 'Materi berhasil disimpan ke memori luring peramban (IndexedDB).' : 'Materi dihapus dari simpanan luring.',
      newStatus ? 'success' : 'info'
    );
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Peramban Anda tidak mendukung text-to-speech audio.', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Pembacaan audio dihentikan.', 'info');
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown characters for pleasant speech synthesis
      const cleanText = material.content
        .replace(/[#*`_$>]/g, ' ')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .substring(0, 1000);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Memutar audio narasi materi pembelajaran (TTS)...', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb: Bank Materi > Judul Materi */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button 
          onClick={() => navigate(role === 'siswa' ? '/murid/materi' : '/guru/materi')}
          className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {role === 'siswa' ? 'Materi Saya' : 'Katalog Materi'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
          {material.title}
        </span>
      </nav>

      {/* Material Header Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            {/* Badges: Subject, Grade, Type, Duration */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={material.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                {material.domain}
              </Badge>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Jenjang {material.level}
              </span>
              <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Teks Kontekstual & Latihan
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {material.readingTimeMinutes} Menit Membaca
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {material.title}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              {material.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-center gap-2.5 shrink-0">
            {/* Download for offline button */}
            <Button
              variant={material.isDownloadedOffline ? 'outline' : 'primary'}
              size="sm"
              icon={material.isDownloadedOffline ? <Check className="w-4 h-4 text-emerald-600" /> : <HardDriveDownload className="w-4 h-4" />}
              onClick={handleToggleOffline}
              className={material.isDownloadedOffline ? 'w-full text-emerald-700 border-emerald-200 bg-emerald-50/50' : 'w-full'}
            >
              {material.isDownloadedOffline ? 'Tersimpan Luring' : 'Simpan Luring'}
            </Button>

            {/* TTS Audio Button */}
            <Button
              variant={isSpeaking ? 'danger' : 'outline'}
              size="sm"
              icon={isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              onClick={handleToggleAudio}
              className="w-full"
            >
              {isSpeaking ? 'Hentikan Suara' : 'Dengar Audio (TTS)'}
            </Button>

            {/* Mulai Latihan Button */}
            <Button
              variant="primary"
              size="sm"
              icon={<PlayCircle className="w-4 h-4" />}
              onClick={() => navigate(`/tuntas/latihan/${material.competencyId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Mulai Latihan
            </Button>
          </div>
        </div>

        {/* Offline status alert */}
        {material.isDownloadedOffline && (
          <div className="mt-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Materi ini telah tersimpan di memori luring peramban lokal. Anda dapat mempelajarinya tanpa koneksi internet.</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Isi Modul Pembelajaran
        </h2>

        <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {material.content}
        </div>
      </div>

      {/* Related Competencies List */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          Kompetensi Terkait (Kurikulum Merdeka)
        </h3>

        <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {competency?.code || 'COMP-01'}
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                {material.competencyName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {competency?.description || 'Penguasaan konsep dasar dan penerapan literasi atau numerasi dalam kehidupan kontekstual sehari-hari.'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<PlayCircle className="w-3.5 h-3.5 text-blue-600" />}
            onClick={() => navigate(`/tuntas/latihan/${material.competencyId}`)}
            className="shrink-0"
          >
            Latihan Kompetensi
          </Button>
        </div>
      </div>
    </div>
  );
};
