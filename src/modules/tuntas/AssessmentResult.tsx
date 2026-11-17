import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { AssessmentSubmission, Assessment, Question, Material } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  PlayCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Printer
} from 'lucide-react';
import { PrintDiagnosticReport } from '../../components/common/PrintDiagnosticReport';

export const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [recommendedMaterials, setRecommendedMaterials] = useState<Material[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      if (id) {
        const sub = await db.submissions.get(id);
        if (sub) {
          setSubmission(sub);
          const asm = await db.assessments.get(sub.assessmentId);
          if (asm) setAssessment(asm);

          // Get questions
          const qIds = sub.answers.map(a => a.questionId);
          const qList = await db.questions.bulkGet(qIds);
          setQuestions(qList.filter((q): q is Question => q !== undefined));

          // Get recommended materials
          if (sub.recommendedMaterialIds.length > 0) {
            const mats = await db.materials.bulkGet(sub.recommendedMaterialIds);
            setRecommendedMaterials(mats.filter((m): m is Material => m !== undefined));
          }
        }
      }
    };
    loadResult();
  }, [id]);

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Memuat rekap hasil asesmen...</p>
      </div>
    );
  }

  const isPassed = submission.score >= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/tuntas/asesmen')}
        >
          Daftar Asesmen
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4 text-blue-600" />}
            onClick={() => setIsPrintModalOpen(true)}
          >
            Cetak / Ekspor Rapor PDF
          </Button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Diselesaikan: {new Date(submission.submittedAt).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-sm ${
        isPassed 
          ? 'bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white border-emerald-800'
          : 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-blue-900'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Hasil Asesmen Diagnostik Siswa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">{submission.studentName}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Paket: <strong>{assessment?.title || 'Asesmen Numerasi & Literasi'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <div>
              <p className="text-xs text-slate-300 font-medium">Skor Akhir</p>
              <p className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">{submission.score}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/20" />
            <div className="text-left text-xs text-slate-200 space-y-0.5">
              <p>Benar: <strong className="text-emerald-400">{submission.correctCount}</strong> / {submission.totalQuestions}</p>
              <p>Status: <strong className={isPassed ? 'text-emerald-400' : 'text-amber-300'}>{isPassed ? 'TUNTAS' : 'PERLU PENGUATAN'}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Mastery Breakdown */}
      <Card>
        <CardHeader
          title="Analisis Penguasaan Kompetensi Dasar"
          subtitle="Sistem otomatis mengidentifikasi kompetensi yang perlu penguatan"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.competencyMastery.map(comp => (
              <div 
                key={comp.competencyId}
                className={`p-4 rounded-xl border ${
                  comp.isMastered 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{comp.competencyName}</h4>
                  <Badge variant={comp.isMastered ? 'success' : 'warning'} size="sm">
                    {comp.isMastered ? 'Tuntas' : 'Perlu Penguatan'}
                  </Badge>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-2 rounded-full ${comp.isMastered ? 'bg-emerald-600' : 'bg-amber-500'}`}
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Capaian: <strong>{comp.percentage}%</strong></span>
                  <span>Ambang Tuntas: <strong>70%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Prescriptive Adaptive Recommendation Section */}
      <Card className="border-amber-200 bg-amber-50/20">
        <CardHeader
          title="Rekomendasi Pembelajaran Adaptif (JALIN-TUNTAS)"
          subtitle="Modul yang otomatis disarankan sistem berdasarkan jawaban salah siswa"
          icon={<Sparkles className="w-5 h-5 text-amber-600" />}
        />
        <CardBody>
          {recommendedMaterials.length === 0 ? (
            <p className="text-xs text-slate-500">Semua kompetensi telah tuntas! Siswa dapat membaca materi pengayaan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMaterials.map(mat => (
                <div 
                  key={mat.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="warning" size="sm">
                        Rekomendasi Remedial
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">{mat.domain}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{mat.readingTimeMinutes} Menit</span>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<BookOpen className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                    >
                      Buka Modul Ini
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Question by Question Review */}
      <Card>
        <CardHeader
          title="Ulasan Butir Soal & Pembahasan Konseptual"
          subtitle="Pelajari letak kekeliruan jawaban untuk perbaikan pemahaman"
          icon={<HelpCircle className="w-5 h-5 text-slate-600" />}
        />
        <CardBody className="space-y-4">
          {questions.map((q, idx) => {
            const ans = submission.answers.find(a => a.questionId === q.id);
            const isCorrect = ans?.isCorrect ?? false;
            return (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-700">Soal #{idx + 1}</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isCorrect ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Jawaban Benar
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Jawaban Salah
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-800 font-medium mb-3 whitespace-pre-line">
                  {q.questionText}
                </p>

                <div className="text-xs text-slate-600 space-y-1 mb-3">
                  <p>Jawaban Anda: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>Pilihan {ans?.selectedOption || 'Kosong'}</strong></p>
                  {!isCorrect && (
                    <p>Kunci Benar: <strong className="text-emerald-700">Pilihan {q.correctAnswer}</strong></p>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900">
                  <strong>Pembahasan:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Official Printable Report Modal */}
      <PrintDiagnosticReport
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        submission={submission}
        assessment={assessment}
      />
    </div>
  );
};

