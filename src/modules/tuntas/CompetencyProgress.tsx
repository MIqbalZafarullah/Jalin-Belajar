import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { AssessmentSubmission, PracticeSession, Competency } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export const CompetencyProgress: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [practices, setPractices] = useState<PracticeSession[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      const subs = await db.submissions.toArray();
      const pracs = await db.practiceSessions.toArray();
      const comps = await db.competencies.toArray();
      setSubmissions(subs);
      setPractices(pracs);
      setCompetencies(comps);
    };
    loadProgress();
  }, []);

  // Compute progress trajectory data
  const historyData = [
    { name: 'Tes Awal (Diagnostik)', skor: submissions.length > 0 ? submissions[0].score : 50 },
    ...practices.map((p, idx) => ({
      name: `Latihan #${idx + 1}`,
      skor: p.score
    }))
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">JALIN-TUNTAS: Perkembangan Belajar Siswa</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantauan grafik penguasaan kompetensi dasar secara berkala dan rekapitulasi sesi latihan mandiri.
        </p>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader
          title="Tren Peningkatan Skor Penguasaan Kompetensi"
          subtitle="Progres dari asesmen diagnostik awal hingga latihan penguatan mandiri"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <CardBody>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="skor"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#2563EB' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Competencies Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competencies.map(comp => {
          // Check if practiced
          const relatedPractice = practices.filter(p => p.competencyId === comp.id);
          const isPracticed = relatedPractice.length > 0;
          return (
            <Card key={comp.id}>
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {comp.code}
                  </span>
                  <Badge variant={isPracticed ? 'success' : 'neutral'} size="sm">
                    {isPracticed ? 'Sudah Dilatih' : 'Belum Latihan'}
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{comp.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{comp.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Target Tuntas: {comp.minMasteryScore}%</span>
                  <span>{relatedPractice.length} Sesi Latihan</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

