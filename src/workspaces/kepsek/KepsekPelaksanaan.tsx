import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Zap, 
  Wifi, 
  BookOpen, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const KepsekPelaksanaan: React.FC = () => {
  const pillars = [
    {
      code: 'JALIN-PETA',
      title: 'Pemetaan Infrastruktur & Kebutuhan Sekolah',
      status: 'Terlaksana Penuh',
      badge: 'green',
      metrics: 'Data kelistrikan (PLN Terbatas), sinyal 3G lemah, dan 8 unit Chromebook tercatat.',
      pic: 'Kepala Sekolah & Operator Dapodik'
    },
    {
      code: 'JALIN-TUNTAS',
      title: 'Asesmen Diagnostik & Pembelajaran Adaptif',
      status: 'Berjalan Aktif',
      badge: 'blue',
      metrics: 'Asesmen awal Kelas 5 tuntas. 4 siswa masuk jalur penguatan konsep pecahan.',
      pic: 'Siti Rahmawati, S.Pd. (Guru Kelas)'
    },
    {
      code: 'JALIN-GURU',
      title: 'Pendampingan Pendidik & Berbagi Praktik',
      status: 'Terjadwal Rutin',
      badge: 'teal',
      metrics: '3 sesi pendampingan telah diselenggarakan mengenai rubrik asesmen mandiri.',
      pic: 'Ahmad Fauzi, M.Pd. (Guru Koordinator)'
    },
    {
      code: 'JALIN-HUB',
      title: 'Pusat Sumber Belajar Luring (Offline Hub)',
      status: 'Aktif di Perangkat',
      badge: 'amber',
      metrics: '12 paket materi literasi & numerasi tersimpan luring di IndexedDB sekolah.',
      pic: 'Tim Teknis Sekolah'
    }
  ];

  const milestones = [
    { date: '10 Feb 2026', title: 'Sosialisasi & Pemetaan Sarana Prasarana 3T', status: 'Selesai', pic: 'Dinas Pendidikan & Kepala Sekolah' },
    { date: '25 Feb 2026', title: 'Penyelenggaraan Asesmen Diagnostik Awal Siswa Kelas 5', status: 'Selesai', pic: 'Guru Pelaksana' },
    { date: '05 Mar 2026', title: 'Analisis Hasil Diagnostik & Rencana Intervensi Pecahan', status: 'Selesai', pic: 'Guru Pelaksana & Koordinator' },
    { date: '15 Mar 2026', title: 'Penyaluran Materi Pembelajaran Adaptif Mandiri (Luring)', status: 'Sedang Berjalan', pic: 'Guru Koordinator' },
    { date: '30 Apr 2026', title: 'Asesmen Akhir (Post-Test) & Evaluasi Capaian', status: 'Mendatang', pic: 'Kepala Sekolah & Dinas' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wide">
            Ruang Kepala Sekolah
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Monitoring & Evaluasi Lapangan</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Status Pelaksanaan Program JALIN BELAJAR di Sekolah
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Pemantauan operasionalisasi empat pilar inovasi pembelajaran di SDN 05 Air Rami (3T Pesisir Mukomuko).
        </p>
      </div>

      {/* 4 Pillars Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p, idx) => (
          <Card key={idx}>
            <CardBody className="p-5 flex flex-col justify-between h-full space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {p.code}
                  </span>
                  <Badge variant={p.badge as any}>{p.status}</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {p.metrics}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Penanggung Jawab:</span>
                <span className="font-semibold text-slate-700">{p.pic}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Implementation Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Linimasa Pelaksanaan Program Satuan Pendidikan
              </h2>
              <p className="text-xs text-slate-500">
                Tahapan sistematis dari asesmen awal diagnostik hingga evaluasi capaian akhir
              </p>
            </div>
            <Badge variant="blue">TA 2025/2026</Badge>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 text-xs">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 transition">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {m.status === 'Selesai' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : m.status === 'Sedang Berjalan' ? (
                      <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{m.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Pelaksana: {m.pic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">{m.date}</span>
                  <Badge variant={m.status === 'Selesai' ? 'green' : m.status === 'Sedang Berjalan' ? 'blue' : 'slate'}>
                    {m.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
