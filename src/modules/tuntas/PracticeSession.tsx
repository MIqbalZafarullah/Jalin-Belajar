import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { Question, Competency, PracticeSession } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Award,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticeSessionPage: React.FC = () => {
  const { competencyId } = useParams<{ competencyId?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isEffectiveOffline, addToSyncQueue } = useOffline();

  const [competency, setCompetency] = useState<Competency | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadPractice = async () => {
      const allComps = await db.competencies.toArray();
      const targetComp = competencyId 
        ? allComps.find(c => c.id === competencyId) || allComps[0]
        : allComps[0];
      setCompetency(targetComp);

      const qList = await db.questions.where('competencyId').equals(targetComp.id).toArray();
      setQuestions(qList.length > 0 ? qList : await db.questions.limit(3).toArray());
    };
    loadPractice();
  }, [competencyId]);

  if (!competency || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto">
        <Sparkles className="w-10 h-10 text-blue-600 animate-pulse mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">Menyiapkan Latihan Penguatan...</h3>
        <p className="text-xs text-slate-500 mt-1">Mengambil butir latihan kontekstual dari penyimpanan lokal.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed!
      const totalScore = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
      const session: PracticeSession = {
        id: 'prac-' + Date.now(),
        studentId: currentUser?.id || 'usr-siswa',
        materialId: 'mat-num-01',
        competencyId: competency.id,
        score: totalScore,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
        isSynced: !isEffectiveOffline
      };

      await db.practiceSessions.add(session);
      if (isEffectiveOffline) {
        await addToSyncQueue('CREATE', 'practice', session);
      }

      setIsCompleted(true);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }
  };

  if (isCompleted) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto space-y-6 text-center py-8">
        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Latihan Penguatan Selesai!</h2>
          <p className="text-sm text-slate-500">
            Topik: <strong className="text-slate-800">{competency.title}</strong>
          </p>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 max-w-xs mx-auto">
            <p className="text-xs text-slate-400 font-medium">Skor Latihan Mandiri</p>
            <p className="text-4xl font-extrabold text-blue-600 mt-1">{finalScore} / 100</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Benar {correctCount} dari {questions.length} soal
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tuntas/rekomendasi')}
            >
              Rekomendasi Lain
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/tuntas/progress')}
            >
              Lihat Progres Belajar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/tuntas/rekomendasi')}
        >
          Kembali ke Rekomendasi
        </Button>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Soal {currentIndex + 1} dari {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="primary" size="sm">Latihan Penguatan</Badge>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {competency.code}
          </span>
        </div>

        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-6 whitespace-pre-line">
          {currentQ.questionText}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map(opt => {
            const isSelected = selectedOption === opt.key;
            let styleClass = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700';

            if (isAnswerSubmitted) {
              if (opt.key === currentQ.correctAnswer) {
                styleClass = 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-900 font-semibold';
              } else if (isSelected) {
                styleClass = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
              } else {
                styleClass = 'bg-slate-50 border-slate-200 opacity-50';
              }
            } else if (isSelected) {
              styleClass = 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600 text-blue-950 font-semibold';
            }

            return (
              <div
                key={opt.key}
                onClick={() => !isAnswerSubmitted && setSelectedOption(opt.key)}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  !isAnswerSubmitted ? 'cursor-pointer' : ''
                } ${styleClass}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {opt.key}
                </span>
                <span className="text-sm pt-0.5">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Instant feedback box */}
        {isAnswerSubmitted && (
          <div className={`mt-5 p-4 rounded-xl border text-xs ${
            isCorrect 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hebat! Jawaban Anda Benar.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Kurang Tepat. Kunci Jawaban: Pilihan {currentQ.correctAnswer}</span>
                </>
              )}
            </div>
            <p className="mt-1 leading-relaxed text-slate-600">{currentQ.explanation}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
          {!isAnswerSubmitted ? (
            <Button
              variant="primary"
              size="md"
              disabled={!selectedOption}
              onClick={handleCheckAnswer}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Periksa Jawaban
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <span>{currentIndex === questions.length - 1 ? 'Selesai Latihan' : 'Soal Berikutnya'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
