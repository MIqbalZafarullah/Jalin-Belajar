import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { 
  Calendar, 
  Clock, 
  FileCheck, 
  Plus, 
  Users, 
  CheckCircle2, 
  Sparkles,
  DownloadCloud
} from 'lucide-react';

interface AssessmentSchedule {
  id: string;
  title: string;
  domain: 'Literasi' | 'Numerasi';
  targetGrade: string;
  startDate: string;
  endDate: string;
  proctor: string;
  mode: 'Luring Terbimbing' | 'Mandiri Luring';
  status: 'Aktif' | 'Terjadwal' | 'Selesai';
}

export const KoordinatorJadwalAsesmen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<AssessmentSchedule[]>([
    {
      id: 'sch-01',
      title: 'Asesmen Diagnostik Awal Literasi Membaca Kelas 5',
      domain: 'Literasi',
      targetGrade: 'Kelas 5 SD',
      startDate: '2026-03-01',
      endDate: '2026-03-05',
      proctor: 'Siti Rahmawati, S.Pd.',
      mode: 'Luring Terbimbing',
      status: 'Selesai'
    },
    {
      id: 'sch-02',
      title: 'Asesmen Diagnostik Numerasi: Operasi Bilangan & Pecahan',
      domain: 'Numerasi',
      targetGrade: 'Kelas 5 SD',
      startDate: '2026-03-08',
      endDate: '2026-03-12',
      proctor: 'Siti Rahmawati, S.Pd.',
      mode: 'Luring Terbimbing',
      status: 'Selesai'
    },
    {
      id: 'sch-03',
      title: 'Tes Formatif Adaptif Remedial Pecahan Dasar',
      domain: 'Numerasi',
      targetGrade: 'Kelas 5 SD (Kelompok Intervensi)',
      startDate: '2026-03-16',
      endDate: '2026-03-20',
      proctor: 'Ahmad Fauzi, M.Pd.',
      mode: 'Mandiri Luring',
      status: 'Aktif'
    },
    {
      id: 'sch-04',
      title: 'Asesmen Diagnostik Membaca Pemahaman & Menulis Cerita',
      domain: 'Literasi',
      targetGrade: 'Kelas 4 SD',
      startDate: '2026-03-24',
      endDate: '2026-03-28',
      proctor: 'Budi Santoso, S.Pd.',
      mode: 'Luring Terbimbing',
      status: 'Terjadwal'
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    title: '',
    domain: 'Literasi',
    targetGrade: 'Kelas 5 SD',
    startDate: '',
    endDate: '',
    proctor: 'Siti Rahmawati, S.Pd.',
    mode: 'Luring Terbimbing'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.title || !newSchedule.startDate) return;
    const item: AssessmentSchedule = {
      id: `sch-${Date.now()}`,
      title: newSchedule.title,
      domain: newSchedule.domain as 'Literasi' | 'Numerasi',
      targetGrade: newSchedule.targetGrade,
      startDate: newSchedule.startDate,
      endDate: newSchedule.endDate || newSchedule.startDate,
      proctor: newSchedule.proctor,
      mode: newSchedule.mode as 'Luring Terbimbing' | 'Mandiri Luring',
      status: 'Terjadwal'
    };
    setSchedules([...schedules, item]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200 uppercase tracking-wide">
              Ruang Guru Koordinator
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Pengelolaan Evaluasi Sekolah</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal & Penugasan Asesmen Diagnostik
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengaturan kalender evaluasi belajar diagnostik, penetapan rombel sasaran, dan alokasi perangkat luring.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Asesmen Baru</span>
        </Button>
      </div>

      {/* Info Card on Coordination Role */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="text-xs text-teal-950 leading-relaxed">
          <span className="font-bold block text-sm text-teal-950 mb-0.5">
            Tugas Guru Koordinator dalam Penjadwalan
          </span>
          Guru Koordinator memastikan paket butir soal telah disinkronkan ke memori lokal peramban (IndexedDB) sebelum pelaksanaan asesmen diagnostik, terutama bagi rombel yang beroperasi secara luring penuh tanpa koneksi internet.
        </div>
      </div>

      {/* Main Schedule List */}
      <div className="space-y-3">
        {schedules.map((item) => (
          <Card key={item.id}>
            <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.domain === 'Literasi' ? 'indigo' : 'amber'}>
                    {item.domain}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {item.targetGrade}
                  </span>
                  <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-medium">
                    {item.mode}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.startDate} s/d {item.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Penguji: {item.proctor}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                <Badge 
                  variant={item.status === 'Selesai' ? 'green' : item.status === 'Aktif' ? 'blue' : 'slate'}
                  className="px-2.5 py-1"
                >
                  {item.status}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal Jadwal Asesmen */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Jadwalkan Asesmen Diagnostik"
        size="md"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Asesmen</label>
            <input
              type="text"
              required
              value={newSchedule.title}
              onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
              placeholder="Contoh: Asesmen Diagnostik Numerasi Kelas 5"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
              <select
                value={newSchedule.domain}
                onChange={(e) => setNewSchedule({ ...newSchedule, domain: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value="Literasi">Literasi</option>
                <option value="Numerasi">Numerasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sasaran Rombel</label>
              <select
                value={newSchedule.targetGrade}
                onChange={(e) => setNewSchedule({ ...newSchedule, targetGrade: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value="Kelas 4 SD">Kelas 4 SD</option>
                <option value="Kelas 5 SD">Kelas 5 SD</option>
                <option value="Kelas 6 SD">Kelas 6 SD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={newSchedule.startDate}
                onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={newSchedule.endDate}
                onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
              </input>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Jadwal Asesmen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

