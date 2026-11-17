import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Assessment, DomainCategory, EducationLevel } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCheck, 
  Plus, 
  Clock, 
  HelpCircle, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';

export const AssessmentList: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, currentUser } = useAuth();
  const navigate = useNavigate();

  const isSiswa = role === 'siswa';

  // New assessment form state
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<DomainCategory>('Numerasi');
  const [newLevel, setNewLevel] = useState<EducationLevel>('SD');
  const [targetGrade, setTargetGrade] = useState('Kelas 5 SD');
  const [duration, setDuration] = useState(20);

  const loadAssessments = async () => {
    const list = await db.assessments.toArray();
    setAssessments(list);
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    const questions = await db.questions.where('level').equals(newLevel).toArray();
    const questionIds = questions.map(q => q.id);
    const competencyIds = Array.from(new Set(questions.map(q => q.competencyId)));

    const created: Assessment = {
      id: 'asm-' + Date.now(),
      title: newTitle,
      domain: newDomain,
      level: newLevel,
      targetGrade,
      teacherId: currentUser?.id || 'usr-guru',
      teacherName: currentUser?.name || 'Siti Rahmawati, S.Pd.',
      schoolId: currentUser?.schoolId || 'sch-01',
      durationMinutes: duration,
      questionIds: questionIds.length > 0 ? questionIds : ['q-num-sd-01', 'q-num-sd-02'],
      competencyIds: competencyIds.length > 0 ? competencyIds : ['comp-num-sd-01'],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Aktif'
    };

    await db.assessments.add(created);
    await loadAssessments();
    setIsModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Asesmen Diagnostik</h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {isSiswa ? 'Ruang Ujian Siswa' : 'Manajemen Asesmen'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isSiswa 
              ? 'Pilih paket tes diagnostik untuk mengukur kemampuan literasi dan numerasi Anda.'
              : 'Susun instrumen asesmen berkala untuk mendeteksi kelemahan kompetensi siswa secara otomatis.'}
          </p>
        </div>

        {!isSiswa && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Buat Paket Asesmen
          </Button>
        )}
      </div>

      {/* List of Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map(asm => (
          <Card key={asm.id} className="flex flex-col justify-between border-slate-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant={asm.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                  {asm.domain}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {asm.targetGrade}
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {asm.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {asm.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Waktu: <strong>{asm.durationMinutes} Menit</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jumlah: <strong>{asm.questionIds.length} Soal</strong></span>
                </div>
                <div className="col-span-2 text-[11px] text-slate-400 mt-1">
                  Penyusun: {asm.teacherName}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {asm.competencyIds.length} Kompetensi Dipetakan
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<PlayCircle className="w-4 h-4" />}
                  onClick={() => navigate(`/tuntas/ujian/${asm.id}`)}
                >
                  {isSiswa ? 'Mulai Kerjakan Soal' : 'Simulasi Ujian Siswa'}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal Buat Asesmen Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Paket Asesmen Diagnostik Baru"
        subtitle="Sistem akan otomatis mengambil butir soal dari Bank Soal sesuai jenjang"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Asesmen *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Contoh: Asesmen Diagnostik Numerasi Tengah Semester"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Pembelajaran</label>
              <select
                value={newDomain}
                onChange={e => setNewDomain(e.target.value as DomainCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="Numerasi">Numerasi</option>
                <option value="Literasi">Literasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang Pendidikan</label>
              <select
                value={newLevel}
                onChange={e => {
                  setNewLevel(e.target.value as EducationLevel);
                  setTargetGrade(e.target.value === 'SD' ? 'Kelas 5 SD' : 'Kelas 8 SMP');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Kelas</label>
              <input
                type="text"
                value={targetGrade}
                onChange={e => setTargetGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi Waktu (Menit)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <strong>Informasi Otomasi:</strong> Sistem akan mengaitkan butir soal yang relevan di bank soal lokal. Setelah siswa submit, nilai langsung dihitung dan kompetensi yang belum tuntas akan dirujuk ke materi remedial.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Buat Asesmen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

