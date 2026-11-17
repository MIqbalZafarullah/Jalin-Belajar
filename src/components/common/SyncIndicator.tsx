import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export const SyncIndicator: React.FC = () => {
  const { 
    isEffectiveOffline, 
    isOfflineSimulated, 
    toggleOfflineSimulation, 
    syncQueueCount, 
    triggerSync, 
    isSyncing,
    lastSyncTime 
  } = useOffline();

  const handleManualSync = async () => {
    try {
      const count = await triggerSync();
      console.log(`Berhasil sinkronisasi ${count} data!`);
    } catch (err: any) {
      alert(err.message || 'Gagal sinkronisasi');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Simulation Toggle Button */}
      <button
        onClick={toggleOfflineSimulation}
        title={isOfflineSimulated ? "Klik untuk kembali ke Mode Daring" : "Klik untuk simulasi Mode Luring (Sinyal 3T)"}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
          isEffectiveOffline 
            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        }`}
      >
        {isEffectiveOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
            <span>Mode Luring (3T)</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Terhubung Daring</span>
          </>
        )}
      </button>

      {/* Sync Queue Badge & Trigger */}
      {syncQueueCount > 0 ? (
        <button
          onClick={handleManualSync}
          disabled={isEffectiveOffline || isSyncing}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
            isEffectiveOffline 
              ? 'bg-slate-100 text-slate-600 cursor-not-allowed border border-slate-200'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
          }`}
          title={isEffectiveOffline ? "Koneksi luring: Data tersimpan di memori lokal" : "Klik untuk sinkronisasi antrean ke server"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          <span>{syncQueueCount} Antrean</span>
        </button>
      ) : (
        <span 
          className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400"
          title={`Terakhir sinkron: ${lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('id-ID') : 'Aman'}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tersinkron</span>
        </span>
      )}
    </div>
  );
};
