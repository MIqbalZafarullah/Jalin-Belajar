import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Mail,
  Smartphone
} from 'lucide-react';

interface TeacherItem {
  id: string;
  name: string;
  nip: string;
  gradeAssigned: string;
  subject: string;
  assessmentStatus: 'Aktif Menjalankan' | 'Sudah Koreksi' | 'Belum Mulai';
  offlineSyncReady: boolean;
  trainingCompleted: boolean;
}

export const KoordinatorKelolaGuru: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([
    {
      id: 'tch-1',
      name: 'Siti Rahmawati, S.Pd.',
      nip: '19920410 201802 2 003',
      gradeAssigned: 'Kelas 5 SD',
      subject: 'Guru Kelas / Wali Kelas 5',
      assessmentStatus: 'Aktif Menjalankan',
      offlineSyncReady: true,
      trainingCompleted: true
    },
    {
      id: 'tch-2',
      name: 'Budi Santoso, S.Pd.',
      nip: '19870115 201001 1 005',
      gradeAssigned: 'Kelas 4 SD',
      subject: 'Guru Kelas / Wali Kelas 4',
      assessmentStatus: 'Sudah Koreksi',
      offlineSyncReady: true,
      trainingCompleted: true
    },
    {
      id: 'tch-3',
      name: 'Dewi Lestari, S.Pd.',
      nip: '19940622 201903 2 007',
      gradeAssigned: 'Kelas 6 SD',
      subject: 'Guru Kelas / Wali Kelas 6',
      assessmentStatus: 'Aktif Menjalankan',
      offlineSyncReady: false,
      trainingCompleted: true
    },
    {
      id: 'tch-4',
      name: 'Rahmat Hidayat, S.Pd.I.',
      nip: '19901103 201602 1 004',
      gradeAssigned: 'Kelas 1 - 3 SD',
      subject: 'Guru Pendamping Literasi Awal',
      assessmentStatus: 'Belum Mulai',
      offlineSyncReady: true,
      trainingCompleted: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherNip, setNewTeacherNip] = useState('');
  const [newTeacherGrade, setNewTeacherGrade] = useState('Kelas 3 SD');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Guru Kelas');

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.gradeAssigned.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const newTch: TeacherItem = {
      id: `tch-${Date.now()}`,
      name: newTeacherName.trim(),
      nip: newTeacherNip.trim() || 'Pegawai Baru',
      gradeAssigned: newTeacherGrade,
      subject: newTeacherSubject,
      assessmentStatus: 'Belum Mulai',
      offlineSyncReady: true,
      trainingCompleted: false
    };

    setTeachers(prev => [newTch, ...prev]);
    setIsAddModalOpen(false);
    setNewTeacherName('');
    setNewTeacherNip('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Pengelolaan Guru & Penugasan Kelas</h1>
            <Badge variant="teal" size="sm">Operasional SDN 05 Air Rami</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Koordinasi kesiapan guru pelaksana, penugasan rombel, dan verifikasi modul pembelajaran luring.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Tambah Akun Guru
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guru Terdaftar</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{teachers.length} Pendidik</p>
          <span className="text-xs text-slate-500 mt-0.5 block">SDN 05 Air Rami</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pelatihan Kurikulum Adaptif</span>
          <p className="text-2xl font-extrabold text-teal-600 mt-1">
            {teachers.filter(t => t.trainingCompleted).length} / {teachers.length}
          </p>
          <span className="text-xs text-teal-600 font-medium mt-0.5 block">Telah tersertifikasi TOT</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kesiapan USB Sinkron Luring</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {teachers.filter(t => t.offlineSyncReady).length} Guru Siap
          </p>
          <span className="text-xs text-blue-600 font-medium mt-0.5 block">Cache materi offline aktif</span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari guru atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Menampilkan {filteredTeachers.length} dari {teachers.length} pendidik
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Nama Guru</th>
                <th className="px-5 py-3">Penugasan Rombel</th>
                <th className="px-5 py-3">Status Asesmen</th>
                <th className="px-5 py-3">Pelatihan Adaptif</th>
                <th className="px-5 py-3">Modul Offline</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTeachers.map((tch) => (
                <tr key={tch.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{tch.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{tch.nip}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">{tch.gradeAssigned}</span>
                    <p className="text-[11px] text-slate-500">{tch.subject}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {tch.assessmentStatus === 'Aktif Menjalankan' ? (
                      <Badge variant="blue" size="sm">Aktif Menjalankan</Badge>
                    ) : tch.assessmentStatus === 'Sudah Koreksi' ? (
                      <Badge variant="green" size="sm">Sudah Koreksi</Badge>
                    ) : (
                      <Badge variant="slate" size="sm">Belum Mulai</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {tch.trainingCompleted ? (
                      <span className="inline-flex items-center gap-1 text-teal-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lulus TOT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Belum Mengikuti
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {tch.offlineSyncReady ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan di Tablet
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Perlu Unduh Ulang
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setTeachers(prev =>
                          prev.map(t =>
                            t.id === tch.id ? { ...t, offlineSyncReady: !t.offlineSyncReady } : t
                          )
                        );
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-teal-700 hover:bg-teal-50 border border-teal-200 transition"
                    >
                      Sinkronkan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Teacher */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Akun Guru Pelaksana"
      >
        <form onSubmit={handleAddTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
            <input
              type="text"
              required
              placeholder="Contoh: Hendra Saputra, S.Pd."
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
            <input
              type="text"
              placeholder="Contoh: 19930812 201902 1 003"
              value={newTeacherNip}
              onChange={(e) => setNewTeacherNip(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
              <select
                value={newTeacherGrade}
                onChange={(e) => setNewTeacherGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Kelas 1 SD">Kelas 1 SD</option>
                <option value="Kelas 2 SD">Kelas 2 SD</option>
                <option value="Kelas 3 SD">Kelas 3 SD</option>
                <option value="Kelas 4 SD">Kelas 4 SD</option>
                <option value="Kelas 5 SD">Kelas 5 SD</option>
                <option value="Kelas 6 SD">Kelas 6 SD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peran Mengajar</label>
              <select
                value={newTeacherSubject}
                onChange={(e) => setNewTeacherSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Guru Kelas">Guru Kelas</option>
                <option value="Wali Kelas">Wali Kelas</option>
                <option value="Guru Numerasi">Guru Numerasi</option>
                <option value="Guru Literasi">Guru Literasi</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
            >
              Simpan Akun Guru
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};