import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { BestPracticePost } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { 
  Share2, 
  Heart, 
  Plus, 
  Calendar, 
  MessageCircle, 
  School, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const BestPracticesShare: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BestPracticePost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New post form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BestPracticePost['category']>('Numerasi Kontekstual');
  const [content, setContent] = useState('');

  const loadPosts = async () => {
    const list = await db.bestPractices.toArray();
    setPosts(list);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = async (post: BestPracticePost) => {
    const newLikes = post.likes + 1;
    await db.bestPractices.update(post.id, { likes: newLikes });
    await loadPosts();
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BestPracticePost = {
      id: 'bp-' + Date.now(),
      authorName: currentUser?.name || 'Siti Rahmawati, S.Pd.',
      authorRole: currentUser?.subject || 'Guru Pengajar',
      schoolName: currentUser?.schoolName || 'SDN 05 Air Rami',
      title,
      category,
      content,
      likes: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    await db.bestPractices.add(newPost);
    await loadPosts();
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">JALIN-GURU: Berbagi Praktik Baik</h1>
          <p className="text-sm text-slate-500 mt-1">
            Wadah kolaborasi antarpendidik di Kabupaten Mukomuko untuk saling berbagi inovasi media pembelajaran ramah 3T.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Bagikan Pengalaman
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardBody className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{post.authorName}</h4>
                    <p className="text-xs text-slate-500">{post.authorRole} • {post.schoolName}</p>
                  </div>
                </div>

                <Badge variant="purple" size="sm">
                  {post.category}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">{post.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.createdAt}
                </span>

                <button
                  onClick={() => handleLike(post)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{post.likes} Mengapresiasi</span>
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Bagikan Praktik Baik Pembelajaran 3T"
        subtitle="Tulisan Anda dapat menginspirasi guru lain di pelosok Mukomuko"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Strategi / Praktik *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Media Kartu Berhitung Berbasis Biji Sawit"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Praktik</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="Numerasi Kontekstual">Numerasi Kontekstual</option>
              <option value="Literasi Kelas Rendah">Literasi Kelas Rendah</option>
              <option value="Strategi 3T">Strategi Mengajar 3T</option>
              <option value="Media Offline">Media Pembelajaran Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Langkah & Dampak *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Jelaskan tantangan di lapangan, solusi kontekstual yang diterapkan, dan bagaimana peningkatan respon siswa..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publikasikan Praktik Baik
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

