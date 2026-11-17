import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { School } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid 
} from 'recharts';
import { TrendingUp, BookOpen, Calculator, Award } from 'lucide-react';

export const LiteracyNumeracyMap: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    db.schools.toArray().then(setSchools);
  }, []);

  const chartData = schools.map(s => ({
    name: s.name.replace(/^(SDN|SMPN)\s*/, ''),
    Literasi: s.literacyScoreAvg,
    Numerasi: s.numeracyScoreAvg,
    district: s.district
  }));

  // Average overall
  const avgLit = (schools.reduce((acc, s) => acc + s.literacyScoreAvg, 0) / (schools.length || 1)).toFixed(1);
  const avgNum = (schools.reduce((acc, s) => acc + s.numeracyScoreAvg, 0) / (schools.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">JALIN-PETA: Sebaran Capaian Literasi & Numerasi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Analisis komparatif kemampuan dasar membaca-menalar dan berhitung di Kabupaten Mukomuko.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Rerata Literasi Kabupaten</span>
          </div>
          <p className="text-3xl font-black text-blue-900">{avgLit} <span className="text-sm font-normal text-slate-500">/ 100</span></p>
          <p className="text-xs text-slate-500 mt-1">Target SPM Nasional: Minimal 70.0</p>
        </div>

        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
            <Calculator className="w-4 h-4" />
            <span>Rerata Numerasi Kabupaten</span>
          </div>
          <p className="text-3xl font-black text-emerald-900">{avgNum} <span className="text-sm font-normal text-slate-500">/ 100</span></p>
          <p className="text-xs text-slate-500 mt-1">Area perhatian utama di SD wilayah pesisir & 3T</p>
        </div>

        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>Kesenjangan Pusat vs 3T</span>
          </div>
          <p className="text-3xl font-black text-amber-900">43.1 poin</p>
          <p className="text-xs text-slate-500 mt-1">Selisih skor SDN 01 Kota Mukomuko vs SDN 08 Malin Deman</p>
        </div>
      </div>

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader
          title="Perbandingan Capaian Literasi vs Numerasi per Sekolah"
          subtitle="Data asesmen diagnostik tahun berjalan (Skor 0 - 100)"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
        <CardBody>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Literasi" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Numerasi" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

