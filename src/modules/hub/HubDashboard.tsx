import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Material, SyncQueueItem, SyncHistoryItem } from '../../types';
import { useOffline } from '../../context/OfflineContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Database, 
  DownloadCloud, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HubDashboard: React.FC = () => {
  const { 
    isEffectiveOffline, 
    toggleOfflineSimulation, 
    syncQueueCount, 
    triggerSync, 
    isSyncing,
    lastSyncTime 
  } = useOffline();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [offlineCount, setOfflineCount] = useState(0);
  const [totalStorageBytes, setTotalStorageBytes] = useState(0);

  useEffect(() => {
    const loadHub = async () => {
      const all = await db.materials.toArray();
      setMaterials(all);
      const downloaded = all.filter(m => m.isDownloadedOffline);
      setOfflineCount(downloaded.length);
      const totalBytes = downloaded.reduce((acc, m) => acc + (m.fileSizeBytes || 0), 0);
      setTotalStorageBytes(totalBytes);
    };
    loadHub();
  }, []);

  const storageKB = (totalStorageBytes / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-HUB: Pusat Sumber Belajar & Offline-First</h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full">
              PWA & IndexedDB Ready
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen berkas materi luring dan mekanisme sinkronisasi data dua arah ketika sinyal telekomunikasi tersedia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isEffectiveOffline ? 'warning' : 'outline'}
            size="sm"
            icon={isEffectiveOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            onClick={toggleOfflineSimulation}
          >
            {isEffectiveOffline ? 'Kembali Daring' : 'Simulasi Offline 3T'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            disabled={isEffectiveOffline || isSyncing}
            onClick={async () => {
              try {
                await triggerSync();
                alert('Sinkronisasi data antrean lokal berhasil!');
              } catch (e: any) {
                alert(e.message);
              }
            }}
          >
            {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sumber Belajar"
          value={materials.length}
          subtitle="Modul Digital Terdaftar"
          icon={<Database className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Tersimpan Luring"
          value={offlineCount}
          subtitle="Siap Diakses Tanpa Internet"
          icon={<DownloadCloud className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Kapasitas Penyimpanan"
          value={`${storageKB} KB`}
          subtitle="IndexedDB Peramban"
          icon={<HardDrive className="w-5 h-5" />}
          colorScheme="indigo"
        />
        <StatCard
          title="Antrean Sinkronisasi"
          value={syncQueueCount}
          subtitle={syncQueueCount > 0 ? "Menunggu Sinyal / Hub" : "Semua Data Tersinkron"}
          icon={<RotateCw className="w-5 h-5" />}
          colorScheme={syncQueueCount > 0 ? 'amber' : 'teal'}
        />
      </div>

      {/* Offline Architecture Explainer */}
      <Card className="border-indigo-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <CardBody className="p-6 sm:p-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-white/10 px-3 py-1 rounded-full">
              Inovasi Arsitektur Wilayah 3T
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2.5">
              Teknologi Offline-First: Belajar Tetap Jalan Saat Sinyal Padam
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Di sekolah terpencil seperti <strong>SDN 08 Malin Deman</strong> atau <strong>SDN 05 Air Rami</strong>, listrik dan jaringan internet sering terputus berhari-hari. JALIN-HUB menyimpan modul pelajaran dan lembar asesmen langsung di IndexedDB peramban tablet. Murid tetap bisa belajar, mengisi tes, dan hasilnya disimpan lokal hingga guru koordinator melakukan sinkronisasi USB/Hub berkala.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable onClick={() => navigate('/hub/offline')}>
          <CardHeader
            title="Koleksi Materi Luring (Tersimpan)"
            subtitle={`${offlineCount} materi siap dibuka luring tanpa kuota`}
            icon={<DownloadCloud className="w-5 h-5 text-emerald-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <p className="text-xs text-slate-500">
              Lihat seluruh daftar bacaan teks dan modul numerasi yang sudah di-cache ke dalam memori perangkat. Anda dapat menguji dengan mengaktifkan tombol simulasi offline.
            </p>
          </CardBody>
        </Card>

        <Card hoverable onClick={() => navigate('/hub/sinkronisasi')}>
          <CardHeader
            title="Pusat Antrean & Riwayat Sinkronisasi"
            subtitle={`${syncQueueCount} data dalam antrean lokal`}
            icon={<RotateCw className="w-5 h-5 text-blue-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody>
            <p className="text-xs text-slate-500">
              Pantau antrean pengiriman nilai asesmen, unduhan materi baru, dan riwayat sinkronisasi data ke pangkalan data terpadu dinas pendidikan.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

