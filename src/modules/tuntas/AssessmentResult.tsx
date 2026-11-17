import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import { AssessmentSubmission, Assessment, Question, Material, Competency } from '../../types';
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
  Printer,
  Share2,
  Check,
  ChevronRight,
  Award
} from 'lucide-react';
import { PrintDiagnosticReport } from '../../components/common/PrintDiagnosticReport';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { role } = useAuth();

  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      if (id) {
        const sub = await db.submissions.get(id);
        if (sub) {
          setSubmission(sub);
          const asm = await db.assessments.get(sub.assessmentId);
          if (asm) setAssessment(asm);

          const qIds = sub.answers.map(a => a.questionId);
          const qList = await db.questions.bulkGet(qIds);
          setQuestions(qList.filter((q): q is Question => q !== undefined));

          const mats = await db.materials.toArray();
          setAllMaterials(mats);

          const comps = await db.competencies.toArray();
          setCompetencies(comps);
        }
      }
    };
    loadResult();
  }, [id]);

  if (!submission) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
        <Sparkles className="w-10 h-10 text-blue-600 animate-pulse mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Memuat Rekap Hasil Asesmen...</h2>
        <p className="text-xs text-slate-500 mt-1">Mengambil analisis capaian diagnostik dari database lokal.</p>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hasil Asesmen JALIN BELAJAR: ${submission.studentName}`,
        text: `Hasil asesmen diagnostik ${submission.studentName} memperoleh skor ${submission.score}/100 (${submission.correctCount} dari ${submission.totalQuestions} soal benar).`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan hasil asesmen berhasil disalin ke papan klip.', 'success');
    }
  };

  // Build recommendation engine per competency:
  // - Score < 60% per competency -> "Perlu Penguatan" -> recommend basic materials for that competency
  // - Score 60-79% -> "Cukup Baik" -> recommend practice exercises
  // - Score >= 80% -> "Sudah Menguasai" -> recommend enrichment
  const analyzedCompetencies = (submission.competencyMastery || []).map(cm => {
    let statusText: 'Perlu Penguatan' | 'Cukup Baik' | 'Sudah Menguasai' = 'Cukup Baik';
    let badgeVariant: 'danger' | 'warning' | 'success' = 'warning';
    let recommendationType: 'dasar' | 'latihan' | 'pengayaan' = 'latihan';

    if (cm.percentage < 60) {
      statusText = 'Perlu Penguatan';
      badgeVariant = 'danger';
      recommendationType = 'dasar';
    } else if (cm.percentage >= 80) {
      statusText = 'Sudah Menguasai';
      badgeVariant = 'success';
      recommendationType = 'pengayaan';
    } else {
      statusText = 'Cukup Baik';
      badgeVariant = 'warning';
      recommendationType = 'latihan';
    }

    // Related questions count
    const relAnswers = submission.answers.filter(a => a.competencyId === cm.competencyId);
    const correctCount = relAnswers.filter(a => a.isCorrect).length;
    const totalCount = relAnswers.length || 1;

    // Find recommended materials for this competency
    const matchingMaterials = allMaterials.filter(m => m.competencyId === cm.competencyId);

    return {
      ...cm,
      statusText,
      badgeVariant,
      recommendationType,
      correctCount,
      totalCount,
      materials: matchingMaterials
    };
  });

  // Recommended materials list
  const recommendedMaterialsList = allMaterials.filter(m => 
    submission.recommendedMaterialIds?.includes(m.id) ||
    analyzedCompetencies.some(ac => ac.statusText === 'Perlu Penguatan' && ac.competencyId === m.competencyId)
  ).slice(0, 4);

  // Score state for celebration header
  const isHighPerformance = submission.score >= 80;
  const isModeratePerformance = submission.score >= 60 && submission.score < 80;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(role === 'siswa' ? '/murid/asesmen' : '/guru/analisis')}
        >
          {role === 'siswa' ? 'Kembali ke Asesmen Saya' : 'Kembali ke Analisis Hasil'}
        </Button>

        {/* Print / Share Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            Bagikan
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4 text-blue-600" />}
            onClick={() => setIsPrintModalOpen(true)}
          >
            Cetak / Unduh Rapor PDF
          </Button>
        </div>
      </div>

      {/* Celebration Header with Large Circular Badge */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Large Circular Badge */}
          <div className="relative shrink-0">
            <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${
              isHighPerformance
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-700'
                : isModeratePerformance
                ? 'border-blue-500 bg-blue-50/60 text-blue-700'
                : 'border-amber-500 bg-amber-50/60 text-amber-700'
            }`}>
              <span className="text-4xl font-extrabold tracking-tight">
                {submission.score}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 text-slate-500">
                Skor Akhir
              </span>
            </div>

            {/* Floating trophy / sparkles icon */}
            <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-amber-500">
              {isHighPerformance ? <Award className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-amber-500" />}
            </div>
          </div>

          {/* Celebration Text & Score Breakdown */}
          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Diagnostik Berhasil Diselesaikan</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {isHighPerformance 
                ? `Luar Biasa, ${submission.studentName}! 🎉` 
                : isModeratePerformance
                ? `Kerja Bagus, ${submission.studentName}! 👍`
                : `Semangat Terus, ${submission.studentName}! 💪`}
            </h1>

            {/* Score Breakdown: Benar X dari Y soal */}
            <p className="text-sm text-slate-600">
              Hasil pengerjaan Anda: <strong className="font-bold text-slate-900">Benar {submission.correctCount} dari {submission.totalQuestions} soal</strong> ({submission.score}%).
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500">
              <span>Paket: <strong className="text-slate-700">{assessment?.title || 'Asesmen Diagnostik'}</strong></span>
              <span>•</span>
              <span>Waktu Selesai: <strong className="text-slate-700">{new Date(submission.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Analysis Table */}
      <Card>
        <CardHeader
          title="Tabel Analisis Penguasaan Kompetensi"
          subtitle="Pemetaan capaian butir soal ke kode kompetensi dasar Kurikulum Merdeka"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Kompetensi Dasar</th>
                <th className="px-6 py-3.5">Rincian Jawaban Benar</th>
                <th className="px-6 py-3.5">Persentase</th>
                <th className="px-6 py-3.5">Status Penguasaan</th>
                <th className="px-6 py-3.5 text-right">Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analyzedCompetencies.map(comp => (
                <tr key={comp.competencyId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{comp.competencyName}</div>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">{comp.competencyId}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {comp.correctCount} / {comp.totalCount} Soal Benar
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            comp.percentage >= 80 ? 'bg-emerald-500' : comp.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${comp.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{comp.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={comp.badgeVariant} size="sm" dot>
                      {comp.statusText}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/tuntas/latihan/${comp.competencyId}`)}
                    >
                      {comp.recommendationType === 'dasar' ? 'Buka Remedial' : 'Latihan Lagi'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RECOMMENDATION ENGINE: Prescriptive Materials List with Direct Links */}
      <Card>
        <CardHeader
          title="Rekomendasi Materi & Latihan Preskriptif"
          subtitle="Modul pembelajaran yang disarankan sistem secara otomatis berdasarkan kelemahan spesifik Anda"
          icon={<Sparkles className="w-5 h-5 text-amber-500" />}
        />
        <CardBody className="p-6">
          {recommendedMaterialsList.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">Semua Kompetensi Telah Dikuasai Dengan Baik!</p>
              <p className="text-xs text-slate-400 mt-1">Anda dapat melanjutkan ke paket asesmen berikutnya atau membaca modul pengayaan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMaterialsList.map(mat => (
                <div
                  key={mat.id}
                  onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                  className="p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                        {mat.domain} {mat.level}
                      </Badge>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Rekomendasi Adaptif
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                      {mat.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {mat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">~{mat.readingTimeMinutes} Menit Belajar</span>
                    <span className="font-semibold text-blue-600 flex items-center gap-1">
                      Pelajari Sekarang <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Print Diagnostic Modal */}
      <PrintDiagnosticReport
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        submission={submission}
        assessment={assessment}
      />
    </div>
  );
};
