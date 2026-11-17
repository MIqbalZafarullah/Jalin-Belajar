import React from 'react';
import { Award, Sparkles, BookOpen, CheckCircle2, Lock, Star, Zap } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface StudentAchievementsProps {
  scoreAvg: number;
  completedTests: number;
  completedPractices: number;
  offlineReadsCount: number;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  scoreAvg,
  completedTests,
  completedPractices,
  offlineReadsCount
}) => {
  const badges = [
    {
      id: 'bdg-1',
      title: 'Pahlawan Pecahan 3T',
      category: 'Numerasi',
      desc: 'Mencapai skor tuntas dalam asesmen diagnostik numerasi',
      icon: Star,
      isUnlocked: scoreAvg >= 60 || completedTests > 0,
      color: 'from-amber-400 to-amber-600 text-amber-950 ring-amber-300'
    },
    {
      id: 'bdg-2',
      title: 'Detektif ADiKSiMBa',
      category: 'Literasi',
      desc: 'Menemukan informasi tersurat dalam cerita rakyat Bengkulu',
      icon: BookOpen,
      isUnlocked: completedTests > 0,
      color: 'from-blue-400 to-blue-600 text-white ring-blue-300'
    },
    {
      id: 'bdg-3',
      title: 'Pejuang Belajar Luring',
      category: 'Offline-First',
      desc: 'Membaca modul pembelajaran saat listrik & sinyal padam',
      icon: Zap,
      isUnlocked: offlineReadsCount > 0,
      color: 'from-emerald-400 to-teal-600 text-white ring-emerald-300'
    },
    {
      id: 'bdg-4',
      title: 'Disiplin Latihan Mandiri',
      category: 'Konsistensi',
      desc: 'Menyelesaikan minimal 1 sesi latihan penguatan kompetensi',
      icon: Award,
      isUnlocked: completedPractices > 0,
      color: 'from-purple-400 to-indigo-600 text-white ring-purple-300'
    }
  ];

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <Card className="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white shadow-sm">
      <CardHeader
        title="Lencana Prestasi & Gamifikasi Belajar"
        subtitle={`${unlockedCount} dari ${badges.length} lencana berhasil diraih`}
        icon={<Award className="w-5 h-5 text-amber-500" />}
        action={
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
            Level 2: Pelajar Tangguh 3T
          </span>
        }
      />
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map(b => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  b.isUnlocked
                    ? 'bg-white border-amber-200 shadow-xs hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${b.color} flex items-center justify-center shadow-md ring-2 ${
                        b.isUnlocked ? '' : 'grayscale'
                      }`}
                    >
                      {b.isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5 text-white" />}
                    </div>
                    <Badge variant={b.isUnlocked ? 'warning' : 'neutral'} size="sm">
                      {b.category}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{b.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  {b.isUnlocked ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">Terkunci</span>
                  )}
                  <span className="text-amber-600 font-bold">+100 Poin</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

