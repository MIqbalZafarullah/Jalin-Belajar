import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ArrowUpRight,
  School,
  AlertCircle
} from 'lucide-react';

export const KepsekEvaluasi: React.FC = () => {
  const metrics = [
    { title: 'Capaian Literasi Sekolah', value: '72.0', baseline: '66.5', delta: '+5.5', status: 'Melampaui Target SPM (70.0)', trend: 'up' },
    { title: 'Capaian Numerasi Sekolah', value: '58.4', baseline: '52.0', delta: '+6.4', status: 'Meningkat, Masih di Bawah SPM', trend: 'warning' },
    { title: 'Keterlibatan Siswa Luring', value: '94%', baseline: '60%', delta: '+34%', status: 'Efisiensi Sangat Baik', trend: 'up' },
    { title: 'Penyelesaian Modul Guru', value: '100%', baseline: '40%', delta: '+60%', status: 'Seluruh Pendidik Tuntas', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wide">
              Ruang Kepala Sekolah
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Evaluasi & Refleksi Mutu</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Evaluasi Hasil & Kinerja Satuan Pendidikan
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Analisis efektivitas penerapan intervensi JALIN BELAJAR terhadap peningkatan literasi-numerasi di SDN 05 Air Rami.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Cetak Lembar Evaluasi</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 block truncate">{m.title}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-slate-900">{m.value}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {m.delta}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Baseline: {m.baseline}</p>
            <span className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
              m.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>

      {/* School vs District Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Komparasi Kinerja Satuan Pendidikan vs Rerata Kabupaten Mukomuko
              </h2>
              <p className="text-xs text-slate-500">
                Tolok ukur kemajuan belajar siswa terhadap sekolah lain di wilayah 3T dan non-3T
              </p>
            </div>
            <Badge variant="blue">Data Terverifikasi</Badge>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Kemampuan Literasi Membaca Siswa</span>
                <span className="text-indigo-600">Sekolah: 72.0 | Rerata Kab: 69.5</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">+2.5 poin di atas rata-rata kabupaten</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Kemampuan Numerasi & Logika Matematika</span>
                <span className="text-amber-600">Sekolah: 58.4 | Rerata Kab: 61.2</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '58.4%' }} />
              </div>
              <span className="text-[10px] text-amber-600 font-medium">Perlu penguatan lanjutan pada topik operasi pecahan dasar</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Headmaster Action Plan Note */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold text-slate-900">
            Rencana Tindak Lanjut Kepala Sekolah
          </h2>
        </CardHeader>
        <CardBody className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <h3 className="font-bold text-slate-900 mb-1">1. Alokasi Jam Bimbingan Tambahan Numerasi</h3>
            <p>
              Menginstruksikan wali kelas 5 dan guru matematika untuk menjadwalkan 2 jam pelajaran khusus setiap hari Kamis guna membahas modul remedial adaptif dari JALIN-TUNTAS secara luring.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <h3 className="font-bold text-slate-900 mb-1">2. Optimalisasi Sarana TIK Chromebook di Luar Jam Sekolah</h3>
            <p>
              Memberikan akses perpustakaan luring JALIN-HUB bagi peserta didik di sore hari agar materi cerita literasi dan permainan numerasi dapat diakses mandiri oleh siswa tanpa memerlukan paket data internet.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

