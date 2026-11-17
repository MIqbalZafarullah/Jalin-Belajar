import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { School, User } from '../../types';
import { db } from '../../database/db';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  ArrowLeft, 
  Building2, 
  Zap, 
  Wifi, 
  Laptop, 
  Users, 
  GraduationCap, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

export const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSchool = async () => {
      if (id) {
        const found = await db.schools.get(id);
        if (found) {
          setSchool(found);
          const relatedUsers = await db.users.where('schoolId').equals(id).toArray();
          setTeachers(relatedUsers);
        }
      }
    };
    fetchSchool();
  }, [id]);

  if (!school) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Memuat data satuan pendidikan...</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/peta/sekolah')}>
          Kembali ke Daftar Sekolah
        </Button>
      </div>
    );
  }

  const deviceRatio = (school.studentCount / (school.deviceCount || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/peta/sekolah')}
        >
          Kembali ke Daftar Sekolah
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<PlayCircle className="w-4 h-4" />}
            onClick={() => navigate('/tuntas/asesmen')}
          >
            Mulai Asesmen Diagnostik
          </Button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10">
          <Building2 className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {school.level}
            </span>
            {school.is3TArea && (
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full">
                Wilayah 3T Pesisir/Pedalaman
              </span>
            )}
            <span className="bg-white/10 text-white/90 text-xs px-3 py-1 rounded-full border border-white/20">
              NPSN: {school.npsn}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{school.name}</h1>
          <p className="text-blue-200 text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            {school.address}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-blue-300">Kepala Sekolah</p>
              <p className="text-sm font-semibold mt-0.5">{school.headmasterName || 'Belum diisi'}</p>
            </div>
            <div>
              <p className="text-xs text-blue-300">Jumlah Peserta Didik</p>
              <p className="text-sm font-semibold mt-0.5">{school.studentCount} Siswa</p>
            </div>
            <div>
              <p className="text-xs text-blue-300">Pendidik & Tenaga Kerja</p>
              <p className="text-sm font-semibold mt-0.5">{school.teacherCount} Guru</p>
            </div>
            <div>
              <p className="text-xs text-blue-300">Prioritas Pendampingan</p>
              <p className="text-sm font-semibold mt-0.5 text-amber-300">{school.priorityLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Infrastructure Profile vs Learning Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Infrastructure & Diagnostic */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Profil Kesiapan Infrastruktur & TIK 3T"
              subtitle="Evaluasi faktor penghambat dan pendukung pembelajaran digital"
              icon={<Zap className="w-5 h-5" />}
            />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Pasokan Listrik</span>
                  </div>
                  <p className="text-base font-bold text-slate-800">{school.electricStatus}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {school.electricStatus === 'PLN Terbatas' ? 'Sering mati lampu saat cuaca buruk.' : 'Tersedia sumber tenaga.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">Akses Sinyal Internet</span>
                  </div>
                  <p className="text-base font-bold text-slate-800">{school.internetStatus}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Membutuhkan materi luring JALIN-HUB.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Laptop className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold">Rasio Perangkat Siswa</span>
                  </div>
                  <p className="text-base font-bold text-slate-800">1 : {deviceRatio}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {school.deviceCount} unit komputer/tablet aktif.
                  </p>
                </div>
              </div>

              {school.notes && (
                <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
                  <strong>Catatan Khusus Lapangan:</strong> {school.notes}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Diagnostic Literacy & Numeracy Progress */}
          <Card>
            <CardHeader
              title="Indeks Capaian Literasi & Numerasi Sekolah"
              subtitle="Hasil asesmen diagnostik agregat siswa SDN 05 Air Rami"
              icon={<GraduationCap className="w-5 h-5" />}
            />
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Skor Literasi</span>
                    <span className="text-2xl font-black text-blue-700">{school.literacyScoreAvg} / 100</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${school.literacyScoreAvg}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Status: <strong>{school.literacyScoreAvg >= 70 ? 'Mencapai Kompetensi Minimum' : 'Perlu Intervensi Khusus (Teks Cerita)'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Skor Numerasi</span>
                    <span className="text-2xl font-black text-emerald-700">{school.numeracyScoreAvg} / 100</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${school.numeracyScoreAvg}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Status: <strong>{school.numeracyScoreAvg >= 70 ? 'Mencapai Kompetensi' : 'Perlu Penguatan Konsep Pecahan'}</strong>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col: Staff & Action Recommendations */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Pendidik Terdaftar"
              subtitle={`${teachers.length} Guru / Staf di database`}
              icon={<Users className="w-5 h-5" />}
            />
            <CardBody className="p-4">
              <div className="space-y-3">
                {teachers.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada akun guru yang terhubung ke sekolah ini.</p>
                ) : (
                  teachers.map(teacher => (
                    <div key={teacher.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/70">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{teacher.name}</p>
                        <p className="text-[11px] text-slate-500">{teacher.subject || teacher.gradeLevel || 'Pendidik'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader
              title="Rekomendasi Dinas Pendidikan"
              subtitle="Berdasarkan algoritma JALIN-PETA"
              icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
            />
            <CardBody className="p-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Unduh paket modul numerasi pecahan luring ke perangkat tablet sekolah via JALIN-HUB.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Jadwalkan pendampingan guru oleh Guru Koordinator Wilayah Mukomuko Selatan setiap 2 pekan.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Gunakan asesmen diagnostik singkat berkala 10 soal untuk memantau pemahaman siswa.</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

