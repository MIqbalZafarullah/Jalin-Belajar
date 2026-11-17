import React, { useState, useEffect } from 'react';
import { db } from '../../database/db';
import { School, AssessmentSubmission } from '../../types';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  FileText, 
  Download, 
  Printer, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Filter,
  Layers,
  MapPin
} from 'lucide-react';

export const DinasLaporan: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('Semua');

  useEffect(() => {
    const loadData = async () => {
      const sch = await db.schools.toArray();
      const sub = await db.submissions.toArray();
      setSchools(sch);
      setSubmissions(sub);
    };
    loadData();
  }, []);

  const filteredSchools = schools.filter(s => {
    const matchKec = selectedKecamatan === 'Semua' || s.district === selectedKecamatan;
    const matchJenjang = selectedJenjang === 'Semua' || s.level === selectedJenjang;
    return matchKec && matchJenjang;
  });

  const totalSiswa = filteredSchools.reduce((acc, s) => acc + s.studentCount, 0);
  const totalGuru = filteredSchools.reduce((acc, s) => acc + s.teacherCount, 0);
  const avgLit = filteredSchools.length > 0 
    ? Math.round(filteredSchools.reduce((acc, s) => acc + s.literacyScoreAvg, 0) / filteredSchools.length) 
    : 0;
  const avgNum = filteredSchools.length > 0 
    ? Math.round(filteredSchools.reduce((acc, s) => acc + s.numeracyScoreAvg, 0) / filteredSchools.length) 
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wide">
              Ruang Dinas Pendidikan
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Kabupaten Mukomuko</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Evaluasi Pelaksanaan Program JALIN BELAJAR
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rekapitulasi berkala kondisi infrastruktur 3T, capaian literasi-numerasi, dan rekomendasi intervensi daerah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Dokumen</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan PDF</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardBody className="py-3 px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter Laporan:</span>
              </div>
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Semua">Semua Kecamatan</option>
                <option value="Air Rami">Air Rami</option>
                <option value="Ipuh">Ipuh</option>
                <option value="Pondok Suguh">Pondok Suguh</option>
                <option value="Teras Terunjam">Teras Terunjam</option>
                <option value="Kota Mukomuko">Kota Mukomuko</option>
                <option value="Selagan Raya">Selagan Raya</option>
              </select>

              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Semua">Semua Jenjang</option>
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Periode: Semester Genap TA 2025/2026</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sekolah Sasaran</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{filteredSchools.length} Sekolah</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Wilayah 3T & Pesisir Mukomuko</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Warga Sekolah</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{totalSiswa} Siswa</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Didampingi {totalGuru} Guru</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rerata Literasi Kab.</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{avgLit} / 100</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">+4.2 poin dari baseline</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rerata Numerasi Kab.</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{avgNum} / 100</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Perlu fokus pada pecahan</p>
        </div>
      </div>

      {/* Main Table of Schools & Evaluation Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Matriks Evaluasi Kinerja Satuan Pendidikan
              </h2>
              <p className="text-xs text-slate-500">
                Status kesiapan infrastruktur, capaian asesmen diagnostik, dan kebutuhan pendampingan lanjutan
              </p>
            </div>
            <Badge variant="blue">{filteredSchools.length} Sekolah Terdata</Badge>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Sekolah & NPSN</th>
                <th className="py-3 px-4">Kecamatan</th>
                <th className="py-3 px-4">Infrastruktur Listrik</th>
                <th className="py-3 px-4">Koneksi Internet</th>
                <th className="py-3 px-4 text-center">Capaian Lit.</th>
                <th className="py-3 px-4 text-center">Capaian Num.</th>
                <th className="py-3 px-4">Prioritas Intervensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSchools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NPSN: {s.npsn} • {s.level}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{s.district}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-700">{s.electricStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-700">{s.internetStatus}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-bold ${s.literacyScoreAvg >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {s.literacyScoreAvg}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-bold ${s.numeracyScoreAvg >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {s.numeracyScoreAvg}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {s.priorityLevel === 'Sangat Tinggi' && (
                      <Badge variant="rose">Prioritas 1 (Kritis)</Badge>
                    )}
                    {s.priorityLevel === 'Tinggi' && (
                      <Badge variant="amber">Prioritas 2 (Tinggi)</Badge>
                    )}
                    {s.priorityLevel === 'Sedang' && (
                      <Badge variant="blue">Prioritas 3 (Sedang)</Badge>
                    )}
                    {s.priorityLevel === 'Rendah' && (
                      <Badge variant="green">Terpantau Baik</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Strategic Policy Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Rekomendasi Kebijakan Dinas Pendidikan Kabupaten Mukomuko
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
            <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1. Distribusi Perangkat Penyimpanan Offline (JALIN-HUB Box)
            </h3>
            <p>
              Sekolah dengan status internet <em>Tidak Ada Sinyal</em> atau <em>Terbatas</em> (seperti SDN 05 Air Rami dan SMPN 03 Selagan Raya) direkomendasikan menerima distribusi media penyimpanan luring dan materi tercetak hasil cetak lokal untuk memitigasi kendala konektivitas.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80">
            <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              2. Penguatan Guru dalam Modul Diagnostik Pecahan & Pengukuran
            </h3>
            <p>
              Capaian numerasi di tingkat SD masih terkonsentrasi pada skor 40-55 di kompetensi operasi pecahan. Dinas mengagendakan lokakarya guru koordinator dan pelatihan pendampingan kelas bertahap dengan mitra perguruan tinggi.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
