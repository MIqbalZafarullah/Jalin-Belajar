import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { 
  Users, 
  Search, 
  Plus, 
  Printer, 
  BookOpen, 
  CheckCircle2, 
  Filter,
  Check
} from 'lucide-react';

interface StudentData {
  id: string;
  nisn: string;
  name: string;
  grade: string;
  gender: 'L' | 'P';
  waliKelas: string;
  statusLuring: boolean;
  statusAsesmen: 'Sudah Mengerjakan' | 'Belum Mengerjakan';
}

export const KoordinatorKelasSiswa: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', nisn: '', grade: 'Kelas 5 SD', gender: 'L' });

  const [students, setStudents] = useState<StudentData[]>([
    { id: 'st-01', nisn: '0129481923', name: 'Rizky Pratama Mukomuko', grade: 'Kelas 5 SD', gender: 'L', waliKelas: 'Siti Rahmawati, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-02', nisn: '0129481924', name: 'Dinda Ayu Lestari', grade: 'Kelas 5 SD', gender: 'P', waliKelas: 'Siti Rahmawati, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-03', nisn: '0129481925', name: 'Fajar Kurniawan', grade: 'Kelas 5 SD', gender: 'L', waliKelas: 'Siti Rahmawati, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-04', nisn: '0129481926', name: 'Bayu Saputra', grade: 'Kelas 5 SD', gender: 'L', waliKelas: 'Siti Rahmawati, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-05', nisn: '0129481927', name: 'Siti Nurhaliza', grade: 'Kelas 5 SD', gender: 'P', waliKelas: 'Siti Rahmawati, S.Pd.', statusLuring: false, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-06', nisn: '0129481930', name: 'Andi Saputra', grade: 'Kelas 4 SD', gender: 'L', waliKelas: 'Budi Santoso, S.Pd.', statusLuring: true, statusAsesmen: 'Belum Mengerjakan' },
    { id: 'st-07', nisn: '0129481931', name: 'Tiara Anggraini', grade: 'Kelas 4 SD', gender: 'P', waliKelas: 'Budi Santoso, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' },
    { id: 'st-08', nisn: '0129481940', name: 'Rahmat Hidayat', grade: 'Kelas 6 SD', gender: 'L', waliKelas: 'Nurhayati, S.Pd.', statusLuring: true, statusAsesmen: 'Sudah Mengerjakan' }
  ]);

  const filteredStudents = students.filter(s => {
    const matchGrade = selectedGrade === 'Semua' || s.grade === selectedGrade;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm);
    return matchGrade && matchSearch;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nisn) return;
    const added: StudentData = {
      id: `st-${Date.now()}`,
      nisn: newStudent.nisn,
      name: newStudent.name,
      grade: newStudent.grade,
      gender: newStudent.gender as 'L' | 'P',
      waliKelas: 'Siti Rahmawati, S.Pd.',
      statusLuring: true,
      statusAsesmen: 'Belum Mengerjakan'
    };
    setStudents([...students, added]);
    setIsAddModalOpen(false);
    setNewStudent({ name: '', nisn: '', grade: 'Kelas 5 SD', gender: 'L' });
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
            <span className="text-xs text-slate-500 font-medium">Manajemen Operasional Sekolah</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Rombongan Belajar & Peserta Didik
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengelolaan peserta didik sasaran program intervensi 3T, sinkronisasi akun, dan pemetaan kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Pilih Kelas:</span>
              </div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="Kelas 4 SD">Kelas 4 SD</option>
                <option value="Kelas 5 SD">Kelas 5 SD</option>
                <option value="Kelas 6 SD">Kelas 6 SD</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama atau NISN siswa..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Student Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Peserta Didik SDN 05 Air Rami
              </h2>
              <p className="text-xs text-slate-500">
                Menampilkan {filteredStudents.length} siswa sesuai filter kelas aktif
              </p>
            </div>
            <Badge variant="teal">{filteredStudents.length} Siswa Terdaftar</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NISN</th>
                <th className="py-3 px-4">Tingkat Kelas</th>
                <th className="py-3 px-4">Jenis Kelamin</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4 text-center">Akses Luring (Hub)</th>
                <th className="py-3 px-4">Status Asesmen Diagnostik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{s.grade}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.waliKelas}</td>
                  <td className="py-3.5 px-4 text-center">
                    {s.statusLuring ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Tersimpan Lokal
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Belum Unduh</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.statusAsesmen === 'Sudah Mengerjakan' ? (
                      <Badge variant="green">Sudah Mengerjakan</Badge>
                    ) : (
                      <Badge variant="amber">Menunggu Pengerjaan</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tambah Siswa */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Peserta Didik Baru"
        size="md"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
            <input
              type="text"
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="Contoh: Muhammad Akbar"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Induk Siswa Nasional (NISN)</label>
            <input
              type="text"
              required
              value={newStudent.nisn}
              onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
              placeholder="10 digit nomor NISN"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
              <select
                value={newStudent.grade}
                onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="Kelas 4 SD">Kelas 4 SD</option>
                <option value="Kelas 5 SD">Kelas 5 SD</option>
                <option value="Kelas 6 SD">Kelas 6 SD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={newStudent.gender}
                onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Data Siswa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

