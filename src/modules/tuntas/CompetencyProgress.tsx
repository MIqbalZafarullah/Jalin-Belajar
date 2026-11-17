import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { AssessmentSubmission, PracticeSession, Competency } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  BookOpen,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const CompetencyProgress: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
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
    { name: 'Tes Awal', skor: submissions.length > 0 ? submissions[0].score : 55 },
    ...practices.map((p, idx) => ({
      name: `Latihan #${idx + 1}`,
      skor: p.score
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Perkembangan Kompetensi Belajar</h1>
          <Badge variant="primary" size="sm">
            Kurva Belajar 3T
          </Badge>
        </div>
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
        <CardBody className="p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 30, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2.5 rounded-lg shadow-md border border-slate-100 text-xs">
                          <p className="font-semibold text-slate-900">{payload[0].payload.name}</p>
                          <p className="text-blue-600 font-bold mt-0.5">Skor: {payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target KKM 70', position: 'top', fill: '#EF4444', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="skor"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563EB', stroke: '#EFF6FF', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Competencies Status Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Status Penguasaan Kompetensi Dasar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competencies.map(comp => {
            const relatedPractice = practices.filter(p => p.competencyId === comp.id);
            const isPracticed = relatedPractice.length > 0;
            return (
              <div 
                key={comp.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {comp.code}
                    </span>
                    <Badge variant={isPracticed ? 'success' : 'neutral'} size="sm">
                      {isPracticed ? 'Sudah Dilatih' : 'Belum Latihan'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{comp.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{comp.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target KKM: <strong className="text-slate-700">{comp.minMasteryScore}%</strong></span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<PlayCircle className="w-3.5 h-3.5 text-blue-600" />}
                    onClick={() => navigate(`/tuntas/latihan/${comp.id}`)}
                  >
                    Latihan
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
