import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { 
  Assessment, 
  Question, 
  StudentAnswer, 
  AssessmentSubmission, 
  Competency, 
  Material 
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Send,
  HelpCircle,
  Sparkles,
  Keyboard,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentExam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isEffectiveOffline, addToSyncQueue } = useOffline();
  const { showToast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      if (id) {
        const asm = await db.assessments.get(id);
        if (asm) {
          setAssessment(asm);
          setTimeLeft(asm.durationMinutes * 60);
          const qList = await db.questions.bulkGet(asm.questionIds);
          setQuestions(qList.filter((q): q is Question => q !== undefined));
        }
      }
    };
    fetchExam();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Keyboard Navigation: A, B, C, D to answer, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmModal || isSubmitting) return;
      if (!questions || questions.length === 0) return;
      
      const key = e.key.toUpperCase();
      const currentQId = questions[currentIndex]?.id;

      if (['A', 'B', 'C', 'D'].includes(key) && currentQId) {
        e.preventDefault();
        handleSelectOption(currentQId, key as 'A' | 'B' | 'C' | 'D');
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        e.preventDefault();
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, showConfirmModal, isSubmitting]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmitExam = async () => {
    if (!assessment || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Calculate question results
      let correctCount = 0;
      const answers: StudentAnswer[] = questions.map(q => {
        const selected = selectedAnswers[q.id] || null;
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          selectedOption: selected,
          isCorrect,
          competencyId: q.competencyId
        };
      });

      const totalScore = Math.round((correctCount / questions.length) * 100);

      // 2. Calculate competency mastery
      const compMap: Record<string, { total: number; correct: number }> = {};
      answers.forEach(a => {
        if (!compMap[a.competencyId]) {
          compMap[a.competencyId] = { total: 0, correct: 0 };
        }
        compMap[a.competencyId].total += 1;
        if (a.isCorrect) {
          compMap[a.competencyId].correct += 1;
        }
      });

      const allComps = await db.competencies.toArray();
      const compDict = Object.fromEntries(allComps.map(c => [c.id, c]));

      const competencyMastery = Object.entries(compMap).map(([compId, data]) => {
        const pct = Math.round((data.correct / data.total) * 100);
        const compInfo = compDict[compId];
        return {
          competencyId: compId,
          competencyName: compInfo?.title || 'Kompetensi Belajar',
          percentage: pct,
          isMastered: pct >= 70
        };
      });

      // 3. Find recommended materials for weak competencies (< 70%)
      const weakCompIds = competencyMastery
        .filter(cm => cm.percentage < 70)
        .map(cm => cm.competencyId);

      const allMaterials = await db.materials.toArray();
      const recMaterials = allMaterials.filter(m => 
        weakCompIds.includes(m.competencyId) || m.recommendedForWeakCompetency
      );

      // 4. Build submission record
      const submissionId = 'sub-' + Date.now();
      const submission: AssessmentSubmission = {
        id: submissionId,
        assessmentId: assessment.id,
        studentId: currentUser?.id || 'usr-siswa',
        studentName: currentUser?.name || 'Ahmad Fauzan',
        schoolId: currentUser?.schoolId || assessment.schoolId || 'sch-01',
        score: totalScore,
        totalQuestions: questions.length,
        correctCount,
        submittedAt: new Date().toISOString(),
        answers,
        competencyMastery,
        recommendedMaterialIds: recMaterials.map(m => m.id),
        isSynced: !isEffectiveOffline
      };

      await db.submissions.add(submission);

      if (isEffectiveOffline) {
        await addToSyncQueue('CREATE', 'submission', submission);
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      showToast('Asesmen berhasil diselesaikan dan dihitung secara otomatis.', 'success');
      navigate(`/tuntas/hasil/${submissionId}`);
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan hasil asesmen.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center max-w-sm">
          <Clock className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800">Menyiapkan Lembar Asesmen...</h2>
          <p className="text-xs text-slate-500 mt-1">Mengambil butir soal dari bank data IndexedDB lokal.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeCritical = timeLeft < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Fixed Bar */}
      <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin keluar dari lembar ujian? Progres saat ini belum tersimpan.')) {
                  navigate('/tuntas/asesmen');
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Keluar dari ujian"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {assessment.title}
              </h1>
              <p className="text-xs text-slate-500">
                {assessment.targetGrade} • {assessment.domain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Keyboard shortcut hint */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100/70 px-2.5 py-1 rounded-md">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Tekan A/B/C/D & Panah</span>
            </div>

            {/* Timer countdown */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              isTimeCritical 
                ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' 
                : 'bg-blue-50 text-blue-700 border border-blue-100'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Submit header button on desktop */}
            <Button
              variant="primary"
              size="sm"
              icon={<Send className="w-4 h-4" />}
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700"
            >
              Selesai Asesmen
            </Button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Assessment Experience */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Question Navigation Panel */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Navigasi Soal</h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {answeredCount} / {questions.length} Terjawab
              </span>
            </div>

            {/* Question numbers grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!selectedAnswers[q.id];

                let buttonStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200'; // unanswered=gray
                if (isCurrent) {
                  buttonStyle = 'bg-blue-600 text-white font-bold ring-2 ring-blue-300 ring-offset-1'; // current=blue-600
                } else if (isAnswered) {
                  buttonStyle = 'bg-blue-100 text-blue-800 font-semibold border border-blue-200'; // answered=blue
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg text-sm transition-all flex items-center justify-center ${buttonStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block"></span>
                <span>Sedang Dikerjakan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-blue-100 border border-blue-200 inline-block"></span>
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-100 inline-block"></span>
                <span>Belum Dijawab</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main: Question & Clickable Options Cards */}
        <section className="flex-1 flex flex-col justify-between">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {/* Question Meta */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Soal Nomor {currentIndex + 1} dari {questions.length}
              </span>
              <span className="text-xs text-slate-400">
                Tingkat: <strong className="text-slate-600 font-medium">{currentQ.difficulty}</strong>
              </span>
            </div>

            {/* Question Text Large */}
            <div className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed mb-8">
              {currentQ.questionText}
            </div>

            {/* 4 Options as Clickable Cards */}
            <div className="space-y-3.5">
              {currentQ.options.map(opt => {
                const isSelected = selectedAnswers[currentQ.id] === opt.key;

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Key badge (A, B, C, D) */}
                      <span
                        className={`w-9 h-9 rounded-lg font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className={`text-sm sm:text-base ${isSelected ? 'font-semibold text-blue-950' : 'text-slate-800'}`}>
                        {opt.text}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Prev / Next / Selesai Asesmen */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Sebelumnya
            </Button>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon={<Send className="w-4 h-4" />}
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Selesai Asesmen
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900">Kumpulkan Jawaban Asesmen?</h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Anda telah menjawab <strong className="text-slate-800">{answeredCount} dari {questions.length}</strong> pertanyaan.
              {answeredCount < questions.length && (
                <span className="text-amber-600 font-semibold block mt-1">
                  Peringatan: Masih ada {questions.length - answeredCount} butir soal yang belum Anda jawab.
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                className="w-1/2"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                Periksa Lagi
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-1/2 bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmitExam}
                isLoading={isSubmitting}
              >
                Ya, Kumpulkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
