import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { AssessmentSubmission, Competency } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const KepsekPerkembanganSiswa: React.FC = () => {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const subs = await db.submissions.toArray();
      const comps = await db.competencies.toArray();
      setSubmissions(subs);
      setCompetencies(comps);
    };
    loadData();
  }, []);

  const competencyData = [
    { name: 'Operasi Pecahan Dasar', skor: 38, kkm: 70, status: 'Kritis (Perlu Intervensi)' },
    { name: 'Pengukuran Panjang & Luas', skor: 55, kkm: 70, status: 'Cukup (Perlu Penguatan)' },
    { name: 'Operasi Bilangan Bulat', skor: 72, kkm: 70, status: 'Menguasai' },
    { name: 'Pemahaman Teks Narasi', skor: 78, kkm: 70, status: 'Menguasai' },
    { name: 'Kosakata & Makna Kata', skor: 84, kkm: 70, status: 'Sangat Baik' }
  ];

  const studentsAtRisk = [
    { name: 'Rizky Pratama Mukomuko', kelas: 'Kelas 5 SD', skorLit: 75, skorNum: 40, statusNum: 'Kendala pada Pecahan Biasa & Campuran', waliKelas: 'Siti Rahmawati, S.Pd.' },
    { name: 'Dinda Ayu Lestari', kelas: 'Kelas 5 SD', skorLit: 80, skorNum: 45, statusNum: 'Kendala Penjumlahan Beda Penyebut', waliKelas: 'Siti Rahmawati, S.Pd.' },
    { name: 'Fajar Kurniawan', kelas: 'Kelas 5 SD', skorLit: 60, skorNum: 50, statusNum: 'Konsep Pecahan Senilai', waliKelas: 'Siti Rahmawati, S.Pd.' },
    { name: 'Bayu Saputra', kelas: 'Kelas 5 SD', skorLit: 65, skorNum: 50, statusNum: 'Penyederhanaan Pecahan', waliKelas: 'Siti Rahmawati, S.Pd.' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wide">
            Ruang Kepala Sekolah
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Monitoring Capaian Satuan Pendidikan</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Perkembangan Penguasaan Kompetensi Peserta Didik
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Pemantauan hasil asesmen diagnostik berkala untuk mengidentifikasi gap kompetensi dan mengoordinasikan intervensi pembelajaran bersama guru.
        </p>
      </div>

      {/* Critical Alert Note matching Essay Scenario */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-950 leading-relaxed">
          <span className="font-bold block text-sm text-amber-950 mb-0.5">
            Temuan Diagnostik Kritis: Kesenjangan Pemahaman Pecahan di Kelas 5
          </span>
          Hasil agregat asesmen diagnostik menunjukkan bahwa 4 siswa di Kelas 5 SD masih mengalami kesulitan memahami konsep pecahan dasar (rerata skor 38/100, di bawah batas tuntas 70). Kepala sekolah disarankan berkoordinasi dengan Siti Rahmawati, S.Pd. untuk memverifikasi penugasan materi adaptif JALIN-TUNTAS.
        </div>
      </div>

      {/* Competency Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Peta Penguasaan Kompetensi Siswa Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Perbandingan rata-rata capaian terhadap Kriteria Ketuntasan Minimal (KKM 70.0)
              </p>
            </div>
            <Badge variant="blue">Hasil Diagnostik TA 2025/2026</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competencyData} layout="vertical" margin={{ top: 10, right: 30, left: 140, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip 
                  formatter={(val: number) => [`${val} / 100`, 'Rerata Capaian']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="skor" 
                  radius={[0, 6, 6, 0]} 
                  fill="#4f46e5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Students Requiring Intervention */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Siswa Sasaran Program Penguatan Pembelajaran Adaptif
              </h2>
              <p className="text-xs text-slate-500">
                Siswa dengan skor asesmen diagnostik di bawah ambang batas kompetensi
              </p>
            </div>
            <Badge variant="rose">4 Siswa Perlu Penguatan</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">Skor Literasi</th>
                <th className="py-3 px-4 text-center">Skor Numerasi</th>
                <th className="py-3 px-4">Area Prioritas Intervensi</th>
                <th className="py-3 px-4">Guru Kelas Pengampu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentsAtRisk.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{s.kelas}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{s.skorLit}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {s.skorNum}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      {s.statusNum}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{s.waliKelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
