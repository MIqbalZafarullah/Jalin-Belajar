import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Material } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  DownloadCloud, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Trash2, 
  ArrowRight,
  WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';

export const OfflineLibrary: React.FC = () => {
  const [offlineMaterials, setOfflineMaterials] = useState<Material[]>([]);
  const navigate = useNavigate();
  const { isEffectiveOffline, addToSyncQueue } = useOffline();
  const { role } = useAuth();

  const loadOffline = async () => {
    const list = await db.materials.where('isDownloadedOffline').equals(1 as any).toArray();
    // Also fallback if boolean indexing is different
    if (list.length === 0) {
      const all = await db.materials.toArray();
      setOfflineMaterials(all.filter(m => m.isDownloadedOffline));
    } else {
      setOfflineMaterials(list);
    }
  };

  useEffect(() => {
    loadOffline();
  }, []);

  const handleRemoveOffline = async (material: Material) => {
    await db.materials.update(material.id, {
      isDownloadedOffline: false,
      downloadedAt: undefined
    });
    await addToSyncQueue('DELETE', 'material_download', { id: material.id, title: material.title });
    await loadOffline();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-HUB: Materi Tersimpan Luring</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Bisa Dibuka Tanpa Kuota / Sinyal
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modul pembelajaran yang telah disalin ke IndexedDB peramban lokal perangkat.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<BookOpen className="w-4 h-4" />}
          onClick={() => navigate('/tuntas/materi')}
        >
          Jelajahi Bank Materi
        </Button>
      </div>

      {isEffectiveOffline && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 text-xs">
          <WifiOff className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Mode Luring Aktif!</p>
            <p className="text-amber-700 mt-0.5">
              Anda tetap dapat membaca materi di bawah ini secara penuh karena berkas telah tersimpan di memori lokal.
            </p>
          </div>
        </div>
      )}

      {offlineMaterials.length === 0 ? (
        <Card>
          <CardBody className="p-10 text-center text-slate-500">
            <DownloadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Materi yang Diunduh</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Buka Bank Materi dan klik tombol "Simpan Luring" agar materi dapat dipelajari saat tidak ada koneksi.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => navigate(role === 'siswa' ? '/murid/materi' : '/guru/materi')}
            >
              {role === 'siswa' ? 'Pilih Materi Rekomendasi' : 'Ke Bank Materi'}
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineMaterials.map(mat => (
            <Card key={mat.id} className="border-emerald-200/80 shadow-2xs flex flex-col justify-between">
              <CardBody className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                    {mat.domain} {mat.level}
                  </Badge>
                  <span className="text-[11px] text-emerald-700 font-mono font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tersimpan ({(mat.fileSizeBytes / 1024).toFixed(0)} KB)
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{mat.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRemoveOffline(mat)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                    title="Hapus dari cache luring"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Simpanan</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<BookOpen className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                  >
                    Baca Materi
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

