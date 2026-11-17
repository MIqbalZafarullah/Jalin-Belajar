import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { WifiOff, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isEffectiveOffline, isOfflineSimulated, syncQueueCount } = useOffline();
  const { currentUser, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Notice if in Simulated Offline Mode */}
      {isEffectiveOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between z-50 shadow-xs">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-950" />
            <span>
              <strong>Simulasi Mode Luring (Offline 3T) Aktif:</strong> Aplikasi beroperasi penuh menggunakan Dexie IndexedDB lokal. {syncQueueCount > 0 ? `${syncQueueCount} aksi menunggu antrean sinkronisasi.` : 'Data tersimpan aman di peramban.'}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Clean Footer */}
          <footer className="border-t border-slate-200/80 bg-white px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">JALIN BELAJAR</span>
              <span>— Jejaring Aksi Literasi dan Numerasi Berbasis Data</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>Inovasi Pendidikan Wilayah 3T Kab. Mukomuko</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Terhubung
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

