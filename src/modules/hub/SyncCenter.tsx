import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { SyncQueueItem, SyncHistoryItem } from '../../types';
import { useOffline } from '../../context/OfflineContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  RotateCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HardDrive, 
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

export const SyncCenter: React.FC = () => {
  const { 
    isEffectiveOffline, 
    toggleOfflineSimulation, 
    syncQueue, 
    syncQueueCount, 
    triggerSync, 
    isSyncing,
    lastSyncTime,
    refreshQueue 
  } = useOffline();

  const [history, setHistory] = useState<SyncHistoryItem[]>([]);

  const loadHistory = async () => {
    const list = await db.syncHistory.orderBy('syncedAt').reverse().toArray();
    setHistory(list);
  };

  useEffect(() => {
    loadHistory();
    refreshQueue();
  }, []);

  const handleSync = async () => {
    try {
      const count = await triggerSync();
      await loadHistory();
      alert(`Sinkronisasi berhasil! ${count} data lokal telah dipadankan.`);
    } catch (err: any) {
      alert(err.message || 'Gagal sinkronisasi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-HUB: Pusat Sinkronisasi Data</h1>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full">
              Simulasi Antrean Lokal
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Mekanisme antrean pengiriman data asesmen dan materi saat beralih antara kondisi tanpa sinyal (luring) dan tersambung jaringan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isEffectiveOffline ? 'warning' : 'outline'}
            size="sm"
            icon={isEffectiveOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            onClick={toggleOfflineSimulation}
          >
            {isEffectiveOffline ? 'Mode Luring Aktif (Klik untuk Online)' : 'Simulasi Offline 3T'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            disabled={isEffectiveOffline || isSyncing}
            onClick={handleSync}
          >
            {isSyncing ? 'Menyinkronkan...' : 'Proses Antrean Sinkronisasi'}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isEffectiveOffline 
          ? 'bg-amber-50 border-amber-300 text-amber-900' 
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="flex items-center gap-3">
          {isEffectiveOffline ? (
            <WifiOff className="w-6 h-6 text-amber-600 shrink-0" />
          ) : (
            <Wifi className="w-6 h-6 text-emerald-600 shrink-0" />
          )}
          <div>
            <h4 className="font-bold text-sm">
              Status Koneksi: {isEffectiveOffline ? 'Mode Luring (Offline Terisolir)' : 'Terhubung Daring'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isEffectiveOffline 
                ? 'Semua aktivitas dan hasil pengerjaan siswa disimpan ke antrean IndexedDB lokal.' 
                : 'Sistem siap melakukan sinkronisasi dengan pangkalan data pusat.'}
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-white/80 border border-current shadow-2xs">
          {syncQueueCount} Item Antrean Pending
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Sync Queue */}
        <Card>
          <CardHeader
            title="Antrean Data Belum Tersinkron (Pending)"
            subtitle={`${syncQueueCount} aksi perubahan data di peramban`}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
          />
          <CardBody>
            {syncQueue.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-slate-700">Antrean Kosong</p>
                <p className="text-slate-500 mt-0.5">Seluruh data hasil asesmen dan materi telah tersinkronisasi.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {syncQueue.map(item => (
                  <div key={item.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="uppercase text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                          {item.action}
                        </span>
                        <span>{item.entity.toUpperCase()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.payload?.studentName ? `Siswa: ${item.payload.studentName}` : item.payload?.title || item.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleTimeString('id-ID')}
                      </span>
                      <span className="block text-[10px] font-semibold text-amber-700">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Right: Sync History */}
        <Card>
          <CardHeader
            title="Riwayat Sinkronisasi Terakhir"
            subtitle="Pencatatan sesi pemadanan data peramban"
            icon={<Database className="w-5 h-5 text-blue-600" />}
          />
          <CardBody>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada riwayat sinkronisasi.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map(hist => (
                  <div key={hist.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-slate-800">{hist.connectionType}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(hist.syncedAt).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-700 font-bold">{hist.itemsSynced} Data</span>
                      <span className="block text-[10px] text-slate-400">Status: {hist.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

