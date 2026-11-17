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
      color: 'from-amber-400 to-amber-600 text-white'
    },
    {
      id: 'bdg-2',
      title: 'Detektif ADiKSiMBa',
      category: 'Literasi',
      desc: 'Menemukan informasi tersurat dalam cerita rakyat Bengkulu',
      icon: BookOpen,
      isUnlocked: completedTests > 0,
      color: 'from-blue-500 to-blue-700 text-white'
    },
    {
      id: 'bdg-3',
      title: 'Pejuang Belajar Luring',
      category: 'Offline-First',
      desc: 'Membaca modul pembelajaran saat listrik & sinyal padam',
      icon: Zap,
      isUnlocked: offlineReadsCount > 0,
      color: 'from-emerald-500 to-teal-600 text-white'
    },
    {
      id: 'bdg-4',
      title: 'Disiplin Latihan Mandiri',
      category: 'Konsistensi',
      desc: 'Menyelesaikan minimal 1 sesi latihan penguatan kompetensi',
      icon: Award,
      isUnlocked: completedPractices > 0,
      color: 'from-indigo-500 to-purple-600 text-white'
    }
  ];

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Lencana Prestasi & Gamifikasi Belajar</h3>
            <p className="text-xs text-slate-500 mt-0.5">{unlockedCount} dari {badges.length} lencana berhasil diraih</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
          Level 2: Pelajar Tangguh 3T
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map(b => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                b.isUnlocked
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${b.color} flex items-center justify-center shadow-xs ${
                      b.isUnlocked ? '' : 'grayscale'
                    }`}
                  >
                    {b.isUnlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4 text-white" />}
                  </div>
                  <Badge variant={b.isUnlocked ? 'warning' : 'neutral'} size="sm">
                    {b.category}
                  </Badge>
                </div>

                <h4 className="font-bold text-slate-900 text-xs">{b.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {b.isUnlocked ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">Terkunci</span>
                )}
                <span className="text-amber-600 font-semibold">+100 Poin</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
