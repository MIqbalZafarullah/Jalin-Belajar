import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { Button } from './Button';

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
      // small alert or toast
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
        title={isOfflineSimulated ? "Klik untuk kembali ke Mode Online" : "Klik untuk simulasi Mode Offline (Sinyal 3T Padam)"}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
          isEffectiveOffline 
            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        }`}
      >
        {isEffectiveOffline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Mode Luring (3T)</span>
          </>
        ) : (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
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
              ? 'bg-slate-200 text-slate-700 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
          title={isEffectiveOffline ? "Koneksi offline: Data tersimpan di memori lokal" : "Klik untuk sinkronisasi antrean ke server"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          <span>{syncQueueCount} Antrean</span>
        </button>
      ) : (
        <span 
          className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400"
          title={`Terakhir sinkron: ${lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('id-ID') : 'Aman'}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Tersinkron</span>
        </span>
      )}
    </div>
  );
};

