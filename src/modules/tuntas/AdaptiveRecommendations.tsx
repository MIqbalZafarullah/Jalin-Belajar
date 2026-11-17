import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { AssessmentSubmission, Material, Competency } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdaptiveRecommendations: React.FC = () => {
  const { role, currentUser } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  const isSiswa = role === 'siswa';

  useEffect(() => {
    const loadData = async () => {
      const subs = isSiswa && currentUser
        ? await db.submissions.where('studentId').equals(currentUser.id).toArray()
        : await db.submissions.toArray();
      const mats = await db.materials.toArray();
      const comps = await db.competencies.toArray();
      setSubmissions(subs);
      setMaterials(mats);
      setCompetencies(comps);
    };
    loadData();
  }, [isSiswa, currentUser]);

  const latestSub = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  // Filter recommended materials
  const prescribedMaterials = latestSub
    ? materials.filter(m => latestSub.recommendedMaterialIds?.includes(m.id))
    : materials.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Rekomendasi Belajar Adaptif</h1>
            <Badge variant="primary" size="sm">
              Algoritma Preskriptif 3T
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isSiswa
              ? 'Daftar materi pembelajaran yang dirancang khusus untuk memperkuat pemahaman topik yang belum tuntas berdasarkan hasil asesmen diagnostik Anda.'
              : 'Pemantauan rekomendasi tindak lanjut hasil asesmen diagnostik siswa untuk intervensi kelas yang tepat sasaran.'}
          </p>
        </div>
      </div>

      {!latestSub ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">Belum Ada Riwayat Asesmen</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Rekomendasi materi adaptif akan dirumuskan otomatis segera setelah Anda menyelesaikan paket tes diagnostik.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<PlayCircle className="w-4 h-4" />}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/tuntas/asesmen')}
          >
            Mulai Asesmen Diagnostik
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Latest Assessment Diagnostic Summary Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="primary" size="sm">
                    Hasil Diagnostik Terakhir
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(latestSub.submittedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{latestSub.studentName}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Skor Perolehan: <strong className="text-blue-600 font-bold text-sm">{latestSub.score} / 100</strong> • {latestSub.correctCount} dari {latestSub.totalQuestions} Soal Benar
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(`/tuntas/hasil/${latestSub.id}`)}
              >
                Lihat Rapor Lengkap
              </Button>
            </div>

            {/* Competency Mastery Quick Overview */}
            {latestSub.competencyMastery && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
                {latestSub.competencyMastery.map(cm => (
                  <div key={cm.competencyId} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">{cm.competencyName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Skor: {cm.percentage}%</div>
                    </div>
                    <Badge variant={cm.percentage >= 80 ? 'success' : cm.percentage >= 60 ? 'warning' : 'danger'} size="sm">
                      {cm.percentage >= 80 ? 'Tuntas' : cm.percentage >= 60 ? 'Cukup' : 'Perlu Penguatan'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Materials Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Modul Pembelajaran yang Diresepkan Sistem
              </h3>
              <span className="text-xs text-slate-500">
                {prescribedMaterials.length} Modul Rekomendasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {prescribedMaterials.map(mat => (
                <div 
                  key={mat.id} 
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={mat.domain === 'Numerasi' ? 'success' : 'primary'} size="sm">
                          {mat.domain}
                        </Badge>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          Jenjang {mat.level}
                        </span>
                      </div>
                      <Badge variant="warning" size="sm">
                        Penguatan Terarah
                      </Badge>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base leading-snug">{mat.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{mat.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{mat.readingTimeMinutes} Menit Belajar
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<BookOpen className="w-4 h-4" />}
                      onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Pelajari Modul Ini
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
