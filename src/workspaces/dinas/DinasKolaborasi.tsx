import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  HeartHandshake, 
  GraduationCap, 
  Users, 
  Building, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const DinasKolaborasi: React.FC = () => {
  const universityPartners = [
    {
      name: 'Fakultas Keguruan & Ilmu Pendidikan (FKIP) Universitas Bengkulu',
      role: 'Mitra Akademik & Validasi Instrumen Asesmen',
      status: 'Kerja Sama Aktif',
      period: '2025 - 2027',
      focus: 'Validasi bank soal literasi-numerasi, standardisasi rubrik diagnostik, dan riset evaluasi dampak pendidikan wilayah 3T.',
      coordinator: 'Dr. Irwan Setiawan, M.Pd.',
      lastActivity: 'Lokakarya Standardisasi Butir Soal Diagnostik SD Kelas 5'
    },
    {
      name: 'Universitas Terbuka (UPBJJ Bengkulu)',
      role: 'Penyedia Infrastruktur Modul Mandiri & Kuliah Lapangan',
      status: 'Tahap Implementasi',
      period: '2025 - 2026',
      focus: 'Distribusi materi ajar digital terbuka luring dan pelibatan mahasiswa KKN Tematik Literasi di pedalaman Mukomuko.',
      coordinator: 'Dra. Endang Sulastri, M.Si.',
      lastActivity: 'Pengiriman 12 Mahasiswa Pendamping Belajar ke Kec. Air Rami'
    }
  ];

  const communityPartners = [
    {
      name: 'Komunitas Guru Penggerak Kabupaten Mukomuko',
      role: 'Diseminasi Praktik Baik Pembelajaran Adaptif',
      members: '142 Guru SD & SMP',
      focus: 'Pertemuan rutin bulanan berbagi modul remedial, ice breaking literasi pedalaman, dan strategi kelas rangkap.',
      recentPost: 'Strategi Mengajarkan Pecahan Menggunakan Daun Sawit & Pasir Pesisir'
    },
    {
      name: 'Forum Sahabat Literasi Pesisir Mukomuko',
      role: 'Penyediaan Pojok Baca & Gerobak Buku Keliling',
      members: '28 Relawan Pemuda',
      focus: 'Penguatan minat baca anak nelayan dan penyediaan bahan bacaan berjenjang yang selaras dengan JALIN-HUB.',
      recentPost: 'Pojok Baca Luring di Balai Desa Rami Mulya'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
            Ruang Dinas Pendidikan
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Jejaring Mitra Strategis</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kolaborasi Perguruan Tinggi & Komunitas Pendidikan
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Sinergi pentahelix antara Dinas Pendidikan, kampus pembina, dan komunitas lokal untuk menjamin keberlanjutan program di wilayah 3T.
        </p>
      </div>

      {/* Program Role Note from Essay */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold block text-sm text-blue-950 mb-0.5">
            Prinsip Tata Kelola Kolaborasi JALIN BELAJAR
          </span>
          Sesuai rancangan program, perguruan tinggi bertindak sebagai mitra validasi ilmiah dan pendampingan instrumen, sedangkan komunitas guru bertindak sebagai motor penggerak pertukaran praktik baik. Keduanya diintegrasikan secara terpadu melalui ruang koordinasi Dinas Pendidikan.
        </div>
      </div>

      {/* University Partners */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Mitra Perguruan Tinggi (Lembaga Pendidikan Tenaga Kependidikan)
            </h2>
          </div>
          <Badge variant="blue">2 Institusi Terafiliasi</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universityPartners.map((partner, idx) => (
            <Card key={idx}>
              <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {partner.role}
                    </span>
                    <Badge variant="green">{partner.status}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {partner.focus}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-medium text-slate-700">{partner.coordinator}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Aktivitas Terakhir:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[200px]">{partner.lastActivity}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Partners */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              Komunitas Pendidik & Penggerak Literasi Lokal
            </h2>
          </div>
          <Badge variant="blue">Jejaring Lapangan</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityPartners.map((comm, idx) => (
            <Card key={idx}>
              <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {comm.role}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{comm.members}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {comm.focus}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Praktik Baik Unggulan:
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    "{comm.recentPost}"
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

