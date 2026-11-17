import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { MentoringNote } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Plus, FileText, Calendar, School, User, CheckCircle2 } from 'lucide-react';

export const MentoringNotes: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [notes, setNotes] = useState<MentoringNote[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [teacherName, setTeacherName] = useState('Siti Rahmawati, S.Pd.');
  const [schoolName, setSchoolName] = useState('SDN 05 Air Rami');
  const [focusArea, setFocusArea] = useState('');
  const [progress, setProgress] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  const loadNotes = async () => {
    const list = await db.mentoringNotes.toArray();
    setNotes(list);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: MentoringNote = {
      id: 'mn-' + Date.now(),
      teacherId: 'usr-guru',
      teacherName,
      schoolName,
      date: new Date().toISOString().split('T')[0],
      focusArea,
      studentProgressObserved: progress,
      actionPlan
    };

    await db.mentoringNotes.add(created);
    await loadNotes();
    setIsModalOpen(false);
    setFocusArea('');
    setProgress('');
    setActionPlan('');
  };

  const canAdd = role === 'guru_koordinator' || role === 'kepala_sekolah' || role === 'dinas_pendidikan' || role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">JALIN-GURU: Catatan Pendampingan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Log supervisi dan tindak lanjut pendampingan guru oleh Guru Koordinator dan Kepala Sekolah.
          </p>
        </div>

        {canAdd && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Catatan Pendampingan
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notes.map(n => (
          <Card key={n.id}>
            <CardBody className="p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {n.teacherName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{n.teacherName}</h4>
                    <p className="text-xs text-slate-500">{n.schoolName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{n.date}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Fokus Bimbingan
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-1.5">{n.focusArea}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Kemajuan Siswa Teramati:</p>
                  <p className="text-slate-600 leading-relaxed">{n.studentProgressObserved}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut:</p>
                  <p className="text-slate-600 leading-relaxed">{n.actionPlan}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Input Catatan Pendampingan Pendidik"
        subtitle="Dokumentasikan hasil observasi dan arahan tindak lanjut"
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Guru Didampingi</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan Pendidikan</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fokus Area Pendampingan *</label>
            <input
              type="text"
              required
              value={focusArea}
              onChange={e => setFocusArea(e.target.value)}
              placeholder="Contoh: Intervensi Siswa Belum Tuntas Operasi Pecahan"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kemajuan Siswa Teramati</label>
            <textarea
              required
              rows={2}
              value={progress}
              onChange={e => setProgress(e.target.value)}
              placeholder="Deskripsi respons siswa..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rencana Tindak Lanjut Pedagogik</label>
            <textarea
              required
              rows={2}
              value={actionPlan}
              onChange={e => setActionPlan(e.target.value)}
              placeholder="Arahan kegiatan selanjutnya..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Catatan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

