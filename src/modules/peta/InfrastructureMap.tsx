import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { School } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Zap, Wifi, Laptop, Layers, AlertCircle } from 'lucide-react';

export const InfrastructureMap: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    db.schools.toArray().then(setSchools);
  }, []);

  // Data breakdown: Electricity
  const electricCounts: Record<string, number> = {};
  schools.forEach(s => {
    electricCounts[s.electricStatus] = (electricCounts[s.electricStatus] || 0) + 1;
  });
  const electricChartData = Object.keys(electricCounts).map(status => ({
    name: status,
    jumlah: electricCounts[status]
  }));

  // Data breakdown: Internet
  const internetCounts: Record<string, number> = {};
  schools.forEach(s => {
    internetCounts[s.internetStatus] = (internetCounts[s.internetStatus] || 0) + 1;
  });
  const internetChartData = Object.keys(internetCounts).map(status => ({
    name: status,
    jumlah: internetCounts[status]
  }));

  // Device comparison per school
  const deviceChartData = schools.map(s => ({
    name: s.name.replace(/^(SDN|SMPN)\s*/, ''),
    perangkat: s.deviceCount,
    siswa: s.studentCount
  }));

  const COLORS = ['#2563EB', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">JALIN-PETA: Profil Infrastruktur 3T</h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualisasi kesiapan daya listrik, konektivitas telekomunikasi, dan rasio perangkat TIK di Kabupaten Mukomuko.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Listrik */}
        <Card>
          <CardHeader
            title="Ketersediaan Pasokan Listrik"
            subtitle="Distribusi sumber listrik di satuan pendidikan"
            icon={<Zap className="w-5 h-5 text-amber-500" />}
          />
          <CardBody>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={electricChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Jumlah Sekolah" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Sebagian besar sekolah 3T di Mukomuko masih mengalami pemadaman listrik berkala (PLN Terbatas/Genset).
            </p>
          </CardBody>
        </Card>

        {/* Chart 2: Internet */}
        <Card>
          <CardHeader
            title="Konektivitas Internet & Jaringan"
            subtitle="Tingkat sinyal telekomunikasi di area sekolah"
            icon={<Wifi className="w-5 h-5 text-blue-500" />}
          />
          <CardBody>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={internetChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="jumlah"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {internetChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Tingkat blankspot dan sinyal lemah menuntut solusi <strong>Offline-First Cache</strong> JALIN BELAJAR.
            </p>
          </CardBody>
        </Card>

        {/* Chart 3: Device vs Students */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Ketersediaan Perangkat Komputer/Tablet vs Jumlah Siswa"
              subtitle="Data per satuan pendidikan di Kab. Mukomuko"
              icon={<Laptop className="w-5 h-5 text-emerald-500" />}
            />
            <CardBody>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceChartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="perangkat" fill="#10B981" name="Perangkat TIK (Unit)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="siswa" fill="#3B82F6" name="Total Siswa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

