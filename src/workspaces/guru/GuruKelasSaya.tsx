import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentClassRecord {
  id: string;
  name: string;
  nisn: string;
  skorLit: number;
  skorNum: number;
  weakCompetency: string;
  rekomendasiStatus: 'Perlu Penguatan Konsep' | 'Latihan Lanjutan' | 'Pengayaan';
  rekomendasiMateri: string;
  catatanGuru: string;
}

export const GuruKelasSaya: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentClassRecord | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [tindakLanjutInput, setTindakLanjutInput] = useState('');

  const [students, setStudents] = useState<StudentClassRecord[]>([
    {
      id: 'st-01',
      name: 'Rizky Pratama Mukomuko',
      nisn: '0129481923',
      skorLit: 75,
      skorNum: 40,
      weakCompetency: 'Operasi Pecahan Dasar',
      rekomendasiStatus: 'Perlu Penguatan Konsep',
      rekomendasiMateri: 'Mengenal Pecahan Senilai & Peragaan Visual Daun Sawit',
      catatanGuru: 'Sering keliru menyamakan penyebut saat menjumlahkan pecahan tidak sejenis.'
    },
    {
      id: 'st-02',
      name: 'Dinda Ayu Lestari',
      nisn: '0129481924',
      skorLit: 82,
      skorNum: 55,
      weakCompetency: 'Pecahan Campuran',
      rekomendasiStatus: 'Perlu Penguatan Konsep',
      rekomendasiMateri: 'Konversi Pecahan Campuran ke Pecahan Biasa',
      catatanGuru: 'Literasi membaca sangat baik, perlu pendampingan visual pada pembagian pecahan.'
    },
    {
      id: 'st-03',
      name: 'Fajar Kurniawan',
      nisn: '0129481925',
      skorLit: 68,
      skorNum: 65,
      weakCompetency: 'Penaksiran Hasil Hitung',
      rekomendasiStatus: 'Latihan Lanjutan',
      rekomendasiMateri: 'Latihan Menaksir Hasil Kali dan Bagi Soal Cerita',
      catatanGuru: 'Mampu mengerjakan rumus dasar, butuh variasi soal kontekstual.'
    },
    {
      id: 'st-04',
      name: 'Bayu Saputra',
      nisn: '0129481926',
      skorLit: 70,
      skorNum: 60,
      weakCompetency: 'Penyederhanaan Pecahan',
      rekomendasiStatus: 'Latihan Lanjutan',
      rekomendasiMateri: 'Metode Pembagi Terbesar FPB untuk Pecahan',
      catatanGuru: 'Sudah menguasai konsep dasar pecahan senilai.'
    },
    {
      id: 'st-05',
      name: 'Siti Nurhaliza',
      nisn: '0129481927',
      skorLit: 88,
      skorNum: 85,
      weakCompetency: 'Tidak Ada (Tuntas)',
      rekomendasiStatus: 'Pengayaan',
      rekomendasiMateri: 'Eksplorasi Geometri Ruang & Volume Kubus',
      catatanGuru: 'Menguasai seluruh target materi kelas 5, siap untuk materi pengayaan.'
    }
  ]);

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nisn.includes(searchTerm)
  );

  const openIntervention = (student: StudentClassRecord) => {
    setSelectedStudent(student);
    setTindakLanjutInput(student.catatanGuru);
    setIsInterventionModalOpen(true);
  };

  const saveIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setStudents(students.map(s => 
      s.id === selectedStudent.id ? { ...s, catatanGuru: tindakLanjutInput } : s
    ));
    setIsInterventionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
              Ruang Guru Pelaksana
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Kelas 5 SD • Siti Rahmawati, S.Pd.</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelas Saya & Diagnosis Capaian Siswa
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar peserta didik di rombel kelas 5, status penguasaan kompetensi, dan penentuan intervensi pembelajaran adaptif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/guru/rekomendasi')}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lihat Mesin Rekomendasi Adaptif</span>
          </Button>
        </div>
      </div>

      {/* Roster & Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Siswa Kelas 5</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{students.length} Siswa</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Seluruhnya telah mengikuti asesmen awal</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-rose-600">Perlu Penguatan Konsep Dasar</span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">2 Siswa</p>
          <p className="text-[11px] text-rose-600 mt-0.5">Skor numerasi pecahan &lt; 60%</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-600">Sudah Tuntas / Pengayaan</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">3 Siswa</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Skor rata-rata melampaui KKM 70</p>
        </div>
      </div>

      {/* Main Student Roster Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Data Capaian Individu Peserta Didik
              </h2>
              <p className="text-xs text-slate-500">
                Guru merupakan penentu kebijakan pembelajaran; rekomendasi sistem berfungsi sebagai pendukung keputusan
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari siswa..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Peserta Didik</th>
                <th className="py-3 px-4 text-center">Skor Literasi</th>
                <th className="py-3 px-4 text-center">Skor Numerasi</th>
                <th className="py-3 px-4">Area Penguatan Teridentifikasi</th>
                <th className="py-3 px-4">Rekomendasi Adaptif Sistem</th>
                <th className="py-3 px-4 text-right">Tindakan Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-emerald-700">{s.skorLit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-bold ${s.skorNum < 60 ? 'text-rose-700' : 'text-slate-900'}`}>
                      {s.skorNum}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {s.weakCompetency}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <Badge variant={s.rekomendasiStatus === 'Perlu Penguatan Konsep' ? 'rose' : s.rekomendasiStatus === 'Latihan Lanjutan' ? 'amber' : 'green'}>
                        {s.rekomendasiStatus}
                      </Badge>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{s.rekomendasiMateri}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openIntervention(s)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                    >
                      Tentukan Intervensi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tindak Lanjut Guru */}
      {selectedStudent && (
        <Modal
          isOpen={isInterventionModalOpen}
          onClose={() => setIsInterventionModalOpen(false)}
          title={`Tindak Lanjut Pembelajaran: ${selectedStudent.name}`}
          size="md"
        >
          <form onSubmit={saveIntervention} className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">Hasil Asesmen Diagnostik Siswa:</p>
              <div className="flex gap-4 text-slate-600">
                <span>Literasi: <strong>{selectedStudent.skorLit} / 100</strong></span>
                <span>Numerasi: <strong className={selectedStudent.skorNum < 60 ? 'text-rose-600' : ''}>{selectedStudent.skorNum} / 100</strong></span>
              </div>
              <p className="text-slate-500 pt-1">
                Rekomendasi Otomatis: <Badge variant="rose">{selectedStudent.rekomendasiStatus}</Badge>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Intervensi & Rencana Remedial / Pengayaan Pendidik
              </label>
              <textarea
                rows={4}
                value={tindakLanjutInput}
                onChange={(e) => setTindakLanjutInput(e.target.value)}
                placeholder="Tuliskan catatan khusus, strategi pembelajaran kontekstual yang akan digunakan (misal: alat peraga konkret), atau penugasan latihan mandiri..."
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800">
              Perubahan catatan ini akan tersimpan di basis data lokal Dexie dan dapat dilihat dalam laporan perkembangan sekolah oleh Kepala Sekolah.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsInterventionModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Simpan Catatan Intervensi
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

