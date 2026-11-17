import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { useAuth } from '../../context/AuthContext';
import { User, Assessment } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  Search,
  School as SchoolIcon
} from 'lucide-react';

export const KepsekGuruKelas: React.FC = () => {
  const { currentUser } = useAuth();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const allUsers = await db.users.toArray();
      const allAssessments = await db.assessments.toArray();
      
      // Filter teachers at this school
      const schoolTeachers = allUsers.filter(u => 
        (u.role === 'guru' || u.role === 'guru_koordinator') &&
        (!u.schoolId || u.schoolId === currentUser?.schoolId || currentUser?.schoolId === 'sch-01')
      );
      setTeachers(schoolTeachers);
      setAssessments(allAssessments);
    };
    loadData();
  }, [currentUser]);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.gradeLevel && t.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <span className="text-xs text-slate-500 font-medium">SDN 05 Air Rami (3T Pesisir)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Pendidik & Kelas Pengampu
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar penugasan guru, kelas sasaran intervensi 3T, dan status pelaksanaan asesmen diagnostik di sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue" className="px-3 py-1 text-xs">
            {teachers.length} Tenaga Pendidik Aktif
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Rombel / Kelas</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">6 Kelas</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Kelas 1 s/d Kelas 6 SD</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Guru Koordinator 3T</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700 mt-2">Ahmad Fauzi, M.Pd.</p>
          <p className="text-[11px] text-teal-600 mt-0.5">Penanggung Jawab Operasional & Sync</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Asesmen Terjadwal</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-700 mt-2">{assessments.length} Paket Soal</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Literasi & Numerasi Terverifikasi</p>
        </div>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Tenaga Pendidik & Penugasan
              </h2>
              <p className="text-xs text-slate-500">
                Kewenangan kepala sekolah mencakup pemantauan pelaksanaan tanpa mengubah rekaman jawaban asesmen
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama guru / kelas..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Pendidik & NIP</th>
                <th className="py-3 px-4">Peran / Jabatan</th>
                <th className="py-3 px-4">Tugas / Kelas Ampuan</th>
                <th className="py-3 px-4">Status Asesmen Diagnostik</th>
                <th className="py-3 px-4">Sinkronisasi Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={teacher.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80'}
                        alt={teacher.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{teacher.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NIP: {teacher.nipNisn || 'Non-PNS'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {teacher.role === 'guru_koordinator' ? (
                      <Badge variant="teal">Guru Koordinator</Badge>
                    ) : (
                      <Badge variant="blue">Guru Pelaksana</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {teacher.gradeLevel || teacher.subject || 'Guru Kelas'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Asesmen Dilaksanakan
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Hari ini, 08:30 WIB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
