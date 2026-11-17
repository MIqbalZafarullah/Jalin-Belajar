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
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Send,
  HelpCircle,
  Sparkles,
  Keyboard
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
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Keyboard Navigation: A, B, C, D to answer, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!questions || questions.length === 0) return;
      const key = e.key.toUpperCase();
      const currentQId = questions[currentIndex]?.id;

      if (['A', 'B', 'C', 'D'].includes(key) && currentQId) {
        handleSelectOption(currentQId, key as 'A' | 'B' | 'C' | 'D');
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions]);

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
    if (!assessment || questions.length === 0) return;

    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = confirm(`Masih ada ${unansweredCount} soal yang belum Anda jawab. Tetap ingin mengumpulkan?`);
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      // 1. Calculate correct answers
      const studentAnswers: StudentAnswer[] = [];
      let correctCount = 0;

      // Map to calculate score per competency
      const competencyStats: Record<string, { total: number; correct: number }> = {};

      questions.forEach(q => {
        const chosen = selectedAnswers[q.id] || null;
        const isCorrect = chosen === q.correctAnswer;
        if (isCorrect) correctCount++;

        studentAnswers.push({
          questionId: q.id,
          selectedOption: chosen,
          isCorrect,
          competencyId: q.competencyId
        });

        if (!competencyStats[q.competencyId]) {
          competencyStats[q.competencyId] = { total: 0, correct: 0 };
        }
        competencyStats[q.competencyId].total += 1;
        if (isCorrect) {
          competencyStats[q.competencyId].correct += 1;
        }
      });

      const totalQuestions = questions.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // 2. Determine competency mastery
      const allCompetencies = await db.competencies.toArray();
      const allMaterials = await db.materials.toArray();

      const competencyMastery = Object.keys(competencyStats).map(compId => {
        const stats = competencyStats[compId];
        const pct = Math.round((stats.correct / stats.total) * 100);
        const compInfo = allCompetencies.find(c => c.id === compId);
        const minScore = compInfo?.minMasteryScore || 70;
        return {
          competencyId: compId,
          competencyName: compInfo?.title || compId,
          percentage: pct,
          isMastered: pct >= minScore
        };
      });

      // 3. Rule-based Prescriptive Recommendations
      // Find unmastered competencies (< 70%) and recommend matching materials
      const unmasteredIds = competencyMastery.filter(c => !c.isMastered).map(c => c.competencyId);
      const recommendedMaterials = allMaterials.filter(m => unmasteredIds.includes(m.competencyId));
      const recommendedMaterialIds = recommendedMaterials.map(m => m.id);

      // If all mastered, recommend enrichment material
      if (recommendedMaterialIds.length === 0 && allMaterials.length > 0) {
        recommendedMaterialIds.push(allMaterials[0].id);
      }

      // 4. Create Submission Object
      const submissionId = 'sub-' + Date.now();
      const submission: AssessmentSubmission = {
        id: submissionId,
        assessmentId: assessment.id,
        studentId: currentUser?.id || 'usr-siswa',
        studentName: currentUser?.name || 'Rizky Pratama Mukomuko',
        schoolId: currentUser?.schoolId || 'sch-01',
        score,
        totalQuestions,
        correctCount,
        submittedAt: new Date().toISOString(),
        answers: studentAnswers,
        competencyMastery,
        recommendedMaterialIds,
        isSynced: !isEffectiveOffline
      };

      // 5. Store in Dexie IndexedDB
      await db.submissions.add(submission);

      // If offline, add to sync queue
      if (isEffectiveOffline) {
        await addToSyncQueue('SUBMISSION', 'submission', submission);
      }

      // Celebration effect if good score
      if (score >= 70) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }

      showToast('Asesmen diagnostik berhasil diselesaikan!', 'success', 'Nilai Terhitung');
      // Navigate to detailed result
      navigate(`/tuntas/hasil/${submissionId}`);
    } catch (err) {
      console.error(err);
      showToast('Terjadi kendala saat menyimpan hasil.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessment || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Memuat lembar pengerjaan asesmen...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Top Test Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">{assessment.title}</h2>
          <p className="text-xs text-slate-500">{currentUser?.name} • {assessment.targetGrade}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
            timeLeft < 300 
              ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
              : 'bg-slate-50 text-slate-800 border-slate-200'
          }`}>
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <Button
            variant="success"
            size="sm"
            icon={<Send className="w-4 h-4" />}
            onClick={handleSubmitExam}
            isLoading={isSubmitting}
          >
            Kumpulkan Ujian
          </Button>
        </div>
      </div>

      {/* Main Question & Navigation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Question Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-500">
                <span className="font-bold text-blue-600">
                  Nomor Soal {currentIndex + 1} dari {questions.length}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  Tingkat: {currentQ.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line mb-6">
                {currentQ.questionText}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(currentQ.id, opt.key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 font-medium'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm pt-0.5">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation prev/next */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowLeft className="w-4 h-4" />}
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                >
                  Sebelumnya
                </Button>

                {isLastQuestion ? (
                  <Button
                    variant="success"
                    size="sm"
                    icon={<Send className="w-4 h-4" />}
                    onClick={handleSubmitExam}
                    isLoading={isSubmitting}
                  >
                    Selesai & Kumpulkan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar Question Palette (1 Col) */}
        <div className="space-y-4">
          <Card>
            <CardBody className="p-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Nomor Soal
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs transition border flex items-center justify-center ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                  <span>Sudah Terjawab ({Object.keys(selectedAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
                  <span>Belum Terjawab ({questions.length - Object.keys(selectedAnswers).length})</span>
                </div>
              </div>

              {/* Keyboard Shortcut Tips */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[10px] text-slate-400">
                <Keyboard className="w-3.5 h-3.5 shrink-0 text-slate-500 mt-0.5" />
                <span>Pintasan keyboard aktif: tekan tombol A, B, C, D atau panah &larr; &rarr;</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

