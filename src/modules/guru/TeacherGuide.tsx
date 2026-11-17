import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  FileCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const TeacherGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'panduan_asesmen' | 'interpretasi' | 'strategi_3t'>('panduan_asesmen');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">JALIN-GURU: Panduan & Pedoman Teknis</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pedoman praktis pelaksanaan asesmen diagnostik, interpretasi data capaian, dan strategi intervensi pedagogik 3T.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('panduan_asesmen')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'panduan_asesmen'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Panduan Asesmen Diagnostik
        </button>
        <button
          onClick={() => setActiveTab('interpretasi')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'interpretasi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Panduan Interpretasi Hasil Data
        </button>
        <button
          onClick={() => setActiveTab('strategi_3t')}
          className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'strategi_3t'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Strategi Pembelajaran Offline 3T
        </button>
      </div>

      {/* Tab 1: Panduan Asesmen */}
      {activeTab === 'panduan_asesmen' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Langkah Pelaksanaan Asesmen Diagnostik Berkala"
              subtitle="Mekanisme terstruktur tanpa membebani siswa di wilayah 3T"
              icon={<FileCheck className="w-5 h-5 text-blue-600" />}
            />
            <CardBody className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Persiapan Perangkat / Kertas Cadangan</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Pastikan tablet kelas telah menyinkronkan butir soal JALIN-TUNTAS saat tersedia sinyal di kantor desa. Bila listrik padam, manfaatkan mode daya baterai tablet secara bergiliran (shift).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Kondisi Pengujian Bebas Tekanan (Low Stakes)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Jelaskan kepada peserta didik bahwa asesmen diagnostik bukan untuk menentukan nilai rapor, melainkan untuk mengetahui bantuan materi apa yang paling mereka butuhkan.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Penyimpanan Otomatis di IndexedDB Lokal</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Seluruh jawaban siswa langsung tersimpan di basis data peramban tanpa memerlukan koneksi internet aktif. Data akan terunggah otomatis saat jaringan pulih.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tab 2: Interpretasi Hasil */}
      {activeTab === 'interpretasi' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Pedoman Pembacaan Matriks Penguasaan Kompetensi"
              subtitle="Bagaimana mengelompokkan siswa berdasarkan hasil diagnostik"
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            />
            <CardBody className="space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <Badge variant="danger" size="sm">Capaian &lt; 50%</Badge>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Perlu Bimbingan Khusus</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Siswa belum menguasai konsep dasar (misal: penyebut pecahan). Berikan modul remedial mandiri dan pendampingan 1-on-1 dengan benda konkret.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <Badge variant="warning" size="sm">Capaian 50% - 69%</Badge>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Cukup (Perlu Penguatan)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Siswa memahami sebagian konsep namun kerap keliru pada soal cerita kontekstual. Arahkan ke latihan mandiri JALIN-TUNTAS.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <Badge variant="success" size="sm">Capaian &ge; 70%</Badge>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Mahir / Tuntas</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Siswa menguasai kompetensi dasar. Berdayakan sebagai tutor sebaya bagi rekannya di kelas.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tab 3: Strategi 3T */}
      {activeTab === 'strategi_3t' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Tips Mengajar di Daerah Minim Listrik & Sinyal"
              subtitle="Praktik adaptasi nyata di Kabupaten Mukomuko"
              icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
            />
            <CardBody className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Rotasi Tablet Kelas:</strong> Bila sekolah hanya memiliki 5 unit tablet aktif untuk 25 siswa, gunakan metode stasiun rotasi (5 siswa mengerjakan latihan adaptif di tablet, 10 siswa membaca modul cetak/offline, 10 siswa diskusi bersama guru).
                </span>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Kontekstualisasi Pertanian & Pesisir:</strong> Hubungkan soal perbandingan rasio dengan timbangan tandan buah segar (TBS) kelapa sawit atau hasil tangkapan ikan nelayan Ipuh agar konsep abstrak matematika mudah dipahami siswa.
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

