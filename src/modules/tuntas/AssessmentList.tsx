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
  ArrowRight,
  Search,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';

export const AssessmentList: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<'ALL' | DomainCategory>('ALL');
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

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.targetGrade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'ALL' || a.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Daftar Paket Asesmen</h1>
            <Badge variant="primary" size="sm">
              {isSiswa ? 'Ruang Ujian Siswa' : 'Manajemen Diagnostik'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isSiswa 
              ? 'Pilih paket tes diagnostik untuk mengukur kemampuan literasi dan numerasi Anda secara berkala.'
              : 'Susun instrumen asesmen diagnostik berkala untuk mendeteksi kesenjangan belajar siswa.'}
          </p>
        </div>

        {!isSiswa && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Buat Asesmen Baru
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama paket asesmen..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setDomainFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              domainFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setDomainFilter('Numerasi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              domainFilter === 'Numerasi' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Numerasi
          </button>
          <button
            onClick={() => setDomainFilter('Literasi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              domainFilter === 'Literasi' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Literasi
          </button>
        </div>
      </div>

      {/* List of Assessments Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak Ada Paket Asesmen</h3>
          <p className="text-xs text-slate-500 mt-1">Belum ada asesmen yang sesuai dengan filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAssessments.map(asm => (
            <div 
              key={asm.id} 
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={asm.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                      {asm.domain}
                    </Badge>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {asm.targetGrade}
                    </span>
                  </div>
                  <Badge 
                    variant={asm.status === 'Aktif' ? 'success' : asm.status === 'Selesai' ? 'neutral' : 'warning'} 
                    size="sm"
                    dot
                  >
                    {asm.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {asm.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Waktu: <strong className="text-slate-700">{asm.durationMinutes} Menit</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jumlah: <strong className="text-slate-700">{asm.questionIds?.length || 0} Soal</strong></span>
                  </div>
                  <div className="col-span-2 text-[11px] text-slate-400 mt-1">
                    Penyusun: {asm.teacherName}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {asm.competencyIds?.length || 1} Kompetensi Dipetakan
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<PlayCircle className="w-4 h-4" />}
                  onClick={() => navigate(`/tuntas/ujian/${asm.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSiswa ? 'Mulai Kerjakan' : 'Simulasi Ujian'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat Asesmen Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Paket Asesmen Diagnostik Baru"
        subtitle="Sistem akan otomatis mengaitkan butir soal dari Bank Soal lokal sesuai jenjang"
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
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Pembelajaran</label>
              <select
                value={newDomain}
                onChange={e => setNewDomain(e.target.value as DomainCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
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
                  const lvl = e.target.value as EducationLevel;
                  setNewLevel(lvl);
                  setTargetGrade(lvl === 'SD' ? 'Kelas 5 SD' : 'Kelas 8 SMP');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <strong>Keterangan Diagnostik:</strong> Soal otomatis dihimpun dari Bank Soal terverifikasi Kurikulum Merdeka. Skor dan rekomendasi modul remedial akan langsung dihitung saat asesmen dikumpulkan.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Buat Paket Asesmen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
