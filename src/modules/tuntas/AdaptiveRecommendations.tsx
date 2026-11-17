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
  GraduationCap
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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Rekomendasi Adaptif</h1>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
            Algoritma Pembelajaran Preskriptif
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {isSiswa
            ? 'Daftar materi pembelajaran yang dirancang khusus untuk memperkuat pemahaman Anda pada topik yang belum tuntas.'
            : 'Pemantauan rekomendasi tindak lanjut hasil asesmen diagnostik siswa di SDN 05 Air Rami.'}
        </p>
      </div>

      {!latestSub ? (
        <Card>
          <CardBody className="p-8 text-center text-slate-500">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Riwayat Asesmen</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Rekomendasi adaptif akan otomatis terbentuk segera setelah siswa menyelesaikan paket asesmen diagnostik.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={<PlayCircle className="w-4 h-4" />}
              className="mt-4"
              onClick={() => navigate('/tuntas/asesmen')}
            >
              Mulai Asesmen Diagnostik
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Latest Assessment Diagnostic Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold bg-white/20 text-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                Hasil Diagnostik Terakhir
              </span>
              <h2 className="text-xl font-bold mt-1.5">{latestSub.studentName}</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Skor: <strong className="text-white text-sm">{latestSub.score} / 100</strong> ({latestSub.correctCount} dari {latestSub.totalQuestions} Soal Benar)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate(`/tuntas/hasil/${latestSub.id}`)}
            >
              Lihat Ulasan Lengkap
            </Button>
          </div>

          {/* Recommended Materials Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Modul Pembelajaran yang Diresepkan Sistem
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials
                .filter(m => latestSub.recommendedMaterialIds.includes(m.id))
                .map(mat => (
                  <Card key={mat.id} className="border-amber-200/80 shadow-2xs">
                    <CardBody className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="warning" size="sm">
                            Penguatan Terarah
                          </Badge>
                          <span className="text-xs text-slate-500 font-medium">
                            {mat.domain}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base leading-snug">{mat.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{mat.readingTimeMinutes} Menit Belajar</span>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<BookOpen className="w-4 h-4" />}
                          onClick={() => navigate(`/tuntas/materi/${mat.id}`)}
                        >
                          Pelajari Modul Ini
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

