import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { Question, Competency, DomainCategory, EducationLevel } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Layers, 
  Search, 
  Plus, 
  CheckCircle, 
  HelpCircle, 
  Filter,
  Check,
  BookOpen
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<'ALL' | DomainCategory>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | EducationLevel>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    competencyId: 'comp-num-sd-01',
    domain: 'Numerasi' as DomainCategory,
    level: 'SD' as EducationLevel,
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    difficulty: 'Sedang' as 'Mudah' | 'Sedang' | 'Tantangan'
  });

  const loadData = async () => {
    const qList = await db.questions.toArray();
    const cList = await db.competencies.toArray();
    setQuestions(qList);
    setCompetencies(cList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: Question = {
      id: 'q-' + Date.now(),
      competencyId: newQuestion.competencyId,
      domain: newQuestion.domain,
      level: newQuestion.level,
      questionText: newQuestion.questionText,
      options: [
        { key: 'A', text: newQuestion.optionA },
        { key: 'B', text: newQuestion.optionB },
        { key: 'C', text: newQuestion.optionC },
        { key: 'D', text: newQuestion.optionD }
      ],
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
      difficulty: newQuestion.difficulty
    };
    await db.questions.add(created);
    await loadData();
    setIsAddModalOpen(false);
    setNewQuestion({
      competencyId: 'comp-num-sd-01',
      domain: 'Numerasi',
      level: 'SD',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
      difficulty: 'Sedang'
    });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'ALL' || q.domain === domainFilter;
    const matchesLevel = levelFilter === 'ALL' || q.level === levelFilter;
    return matchesSearch && matchesDomain && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Bank Soal Diagnostik</h1>
            <Badge variant="primary" size="sm">
              Kurikulum Merdeka 3T
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Kumpulan butir instrumen soal pilihan ganda kontekstual yang terhubung ke kode capaian kompetensi dasar literasi dan numerasi.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Tambah Butir Soal
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari teks soal, kata kunci konsep..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <select
              value={domainFilter}
              onChange={e => setDomainFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Semua Domain</option>
              <option value="Literasi">Literasi Membaca</option>
              <option value="Numerasi">Numerasi Menalar</option>
            </select>
          </div>

          <div>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="SD">Sekolah Dasar (SD)</option>
              <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Soal Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba atur ulang filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const comp = competencies.find(c => c.id === q.competencyId);
            return (
              <div 
                key={q.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <Badge variant={q.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                      {q.domain}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Jenjang {q.level}
                    </span>
                    <span className="text-xs text-slate-500">
                      Kode: <strong className="font-mono text-slate-700">{comp?.code || q.competencyId}</strong>
                    </span>
                  </div>

                  <Badge 
                    variant={q.difficulty === 'Mudah' ? 'success' : q.difficulty === 'Sedang' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    Tingkat: {q.difficulty}
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed mb-4">
                  {q.questionText}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {q.options.map(opt => {
                    const isCorrect = opt.key === q.correctAnswer;
                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                          isCorrect 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {opt.key}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">Kunci Jawaban ({q.correctAnswer}):</span> {q.explanation}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Question */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Butir Soal Diagnostik Baru"
        subtitle="Soal akan otomatis dipetakan ke kode kompetensi dasar Kurikulum Merdeka"
        size="lg"
      >
        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
              <select
                value={newQuestion.domain}
                onChange={e => setNewQuestion({ ...newQuestion, domain: e.target.value as DomainCategory })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="Numerasi">Numerasi</option>
                <option value="Literasi">Literasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang</label>
              <select
                value={newQuestion.level}
                onChange={e => setNewQuestion({ ...newQuestion, level: e.target.value as EducationLevel })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
              <select
                value={newQuestion.difficulty}
                onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tantangan">Tantangan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Kompetensi Dasar</label>
            <select
              value={newQuestion.competencyId}
              onChange={e => setNewQuestion({ ...newQuestion, competencyId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
            >
              {competencies.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.code}] {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Pertanyaan / Soal Cerita *</label>
            <textarea
              required
              rows={3}
              value={newQuestion.questionText}
              onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              placeholder="Tuliskan pertanyaan kontekstual..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan A</label>
              <input
                type="text"
                required
                value={newQuestion.optionA}
                onChange={e => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan B</label>
              <input
                type="text"
                required
                value={newQuestion.optionB}
                onChange={e => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan C</label>
              <input
                type="text"
                required
                value={newQuestion.optionC}
                onChange={e => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan D</label>
              <input
                type="text"
                required
                value={newQuestion.optionD}
                onChange={e => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kunci Jawaban Benar</label>
              <select
                value={newQuestion.correctAnswer}
                onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-bold text-emerald-700"
              >
                <option value="A">Pilihan A</option>
                <option value="B">Pilihan B</option>
                <option value="C">Pilihan C</option>
                <option value="D">Pilihan D</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pembahasan & Penjelasan</label>
              <input
                type="text"
                required
                value={newQuestion.explanation}
                onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Cara penyelesaian konsep..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Simpan ke Bank Soal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
