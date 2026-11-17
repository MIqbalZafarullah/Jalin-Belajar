import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { MentoringNote, BestPracticePost, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  GraduationCap, 
  Share2, 
  FileText, 
  Users, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Heart,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GuruDashboard: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<MentoringNote[]>([]);
  const [posts, setPosts] = useState<BestPracticePost[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const nList = await db.mentoringNotes.toArray();
      const pList = await db.bestPractices.toArray();
      setNotes(nList);
      setPosts(pList);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">JALIN-GURU: Pendampingan & Kolaborasi Pendidik</h1>
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
              Kemitraan Guru 3T Mukomuko
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pusat bimbingan teknis asesmen diagnostik, konsultasi pengawas/guru koordinator, dan pertukaran strategi mengajar luring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => navigate('/guru/panduan')}
          >
            Panduan Asesmen
          </Button>
          <Button
            variant="primary"
            icon={<Share2 className="w-4 h-4" />}
            onClick={() => navigate('/guru/praktik-baik')}
          >
            Bagikan Praktik Baik
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Catatan Pendampingan"
          value={notes.length}
          subtitle="Kunjungan & Evaluasi Terdata"
          icon={<FileText className="w-5 h-5" />}
          colorScheme="teal"
        />
        <StatCard
          title="Praktik Baik Dibagikan"
          value={posts.length}
          subtitle="Inovasi Kontekstual 3T"
          icon={<Share2 className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          title="Modul Pendampingan"
          value="4 Panduan"
          subtitle="Pedoman Diagnostik & Intervensi"
          icon={<GraduationCap className="w-5 h-5" />}
          colorScheme="emerald"
        />
      </div>

      {/* Quick Navigation to Mentoring Notes & Community Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mentoring Notes */}
        <Card hoverable onClick={() => navigate('/guru/pendampingan')}>
          <CardHeader
            title="Catatan Pendampingan Terakhir"
            subtitle="Hasil supervisi Guru Koordinator & Pengawas Sekolah"
            icon={<FileText className="w-5 h-5 text-teal-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{note.teacherName}</span>
                  <span className="text-slate-400">{note.date}</span>
                </div>
                <p className="text-xs font-semibold text-teal-700">{note.focusArea}</p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong>Tindak Lanjut:</strong> {note.actionPlan}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Right: Best Practice Posts */}
        <Card hoverable onClick={() => navigate('/guru/praktik-baik')}>
          <CardHeader
            title="Berbagi Praktik Baik (Kearifan Lokal 3T)"
            subtitle="Pengalaman inspiratif sesama pendidik di Kab. Mukomuko"
            icon={<Share2 className="w-5 h-5 text-blue-600" />}
            action={<ArrowRight className="w-4 h-4 text-slate-400" />}
          />
          <CardBody className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">{post.category}</Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    {post.likes}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{post.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                <p className="text-[11px] text-slate-400 pt-1">Oleh: {post.authorName} ({post.schoolName})</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

