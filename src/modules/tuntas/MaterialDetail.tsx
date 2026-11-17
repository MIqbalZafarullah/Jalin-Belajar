import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { Material } from '../../types';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useOffline } from '../../context/OfflineContext';
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
  WifiOff
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const { isEffectiveOffline, addToSyncQueue } = useOffline();
  const { showToast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (id) {
      db.materials.get(id).then(m => setMaterial(m || null));
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  if (!material) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Materi tidak ditemukan.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/tuntas/materi')}>
          Kembali ke Bank Materi
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
    await addToSyncQueue(newStatus ? 'CREATE' : 'DELETE', 'material_download', { id: material.id, title: material.title });
    setMaterial({
      ...material,
      isDownloadedOffline: newStatus,
      downloadedAt: newStatus ? new Date().toISOString() : undefined
    });
    showToast(
      newStatus ? 'Materi berhasil disimpan ke memori luring IndexedDB.' : 'Materi dihapus dari simpanan luring.',
      newStatus ? 'success' : 'info'
    );
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Peramban tidak mendukung sintesis audio.', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Narasi audio dihentikan.', 'info');
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleanText = material.content
        .replace(/[#*`_$>]/g, '')
        .replace(/\[.*?\]/g, '')
        .substring(0, 500); // Read first section

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Memutar audio narasi teks literasi...', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/tuntas/materi')}
        >
          Kembali ke Bank Materi
        </Button>

        <div className="flex items-center gap-2">
          {/* Audio Narration Toggle (Edge innovation for 3T students) */}
          <Button
            variant={isSpeaking ? 'danger' : 'outline'}
            size="sm"
            icon={isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            onClick={handleToggleAudio}
          >
            {isSpeaking ? 'Hentikan Audio' : 'Dengarkan Narasi (TTS)'}
          </Button>

          <Button
            variant={material.isDownloadedOffline ? 'outline' : 'secondary'}
            size="sm"
            icon={material.isDownloadedOffline ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <DownloadCloud className="w-4 h-4" />}
            onClick={handleToggleOffline}
          >
            {material.isDownloadedOffline ? 'Tersimpan di Memori Luring' : 'Simpan Luring (Offline)'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlayCircle className="w-4 h-4" />}
            onClick={() => navigate(`/tuntas/latihan/${material.competencyId}`)}
          >
            Mulai Latihan Pemahaman
          </Button>
        </div>
      </div>

      {/* Offline Availability Banner */}
      {material.isDownloadedOffline && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Materi ini telah tersimpan di IndexedDB peramban dan dapat dipelajari meski listrik padam atau tanpa jaringan internet 3T.</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono hidden sm:inline">
            Ukuran: {(material.fileSizeBytes / 1024).toFixed(0)} KB
          </span>
        </div>
      )}

      {/* Content Article Card */}
      <Card>
        <CardBody className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={material.domain === 'Numerasi' ? 'success' : 'primary'}>
              Domain {material.domain}
            </Badge>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              Tingkat {material.level}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Kompetensi: {material.competencyName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {material.title}
          </h1>

          <div className="flex items-center gap-4 py-4 my-4 border-y border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              Estimasi Waktu: {material.readingTimeMinutes} Menit
            </span>
            <span>•</span>
            <span>Kurikulum Merdeka 3T Bengkulu</span>
          </div>

          {/* Reading Body */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 pt-2">
            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {material.content}
            </div>
          </div>

          {/* Bottom Action Section */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Siap menguji pemahaman materi ini?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Kerjakan 3 latihan soal kontekstual untuk mengukur penguasaan kompetensi ini.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<PlayCircle className="w-4 h-4" />}
              onClick={() => navigate(`/tuntas/latihan/${material.competencyId}`)}
            >
              Kerjakan Latihan Mandiri
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

