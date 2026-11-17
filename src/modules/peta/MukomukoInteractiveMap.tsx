import React from 'react';
import { School } from '../../types';
import { 
  MapPin, 
  Zap, 
  Wifi, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';

interface MukomukoInteractiveMapProps {
  schools: School[];
  selectedDistrict: string | null;
  onSelectDistrict: (district: string | null) => void;
}

interface DistrictMeta {
  name: string;
  zone: 'Utara' | 'Tengah' | 'Selatan' | 'Pedalaman';
  electricity: 'PLN Stabil' | 'PLN Terbatas' | 'Genset/Surya';
  signal: 'Fiber/4G' | '3G/4G Lemah' | 'VSAT' | 'Blankspot';
  desc: string;
}

export const MukomukoInteractiveMap: React.FC<MukomukoInteractiveMapProps> = ({
  schools,
  selectedDistrict,
  onSelectDistrict
}) => {
  const districtsData: DistrictMeta[] = [
    { name: 'Kota Mukomuko', zone: 'Utara', electricity: 'PLN Stabil', signal: 'Fiber/4G', desc: 'Pusat pemerintahan kabupaten & rujukan dinas' },
    { name: 'Lubuk Pinang', zone: 'Utara', electricity: 'PLN Stabil', signal: 'Fiber/4G', desc: 'Gerbang perbatasan Sumbar, jaringan stabil' },
    { name: 'XIV Koto', zone: 'Utara', electricity: 'PLN Stabil', signal: 'Fiber/4G', desc: 'Sentra persawahan irigasi Manjunto' },
    { name: 'Air Manjunto', zone: 'Utara', electricity: 'PLN Stabil', signal: 'Fiber/4G', desc: 'Kawasan pemukiman transmigrasi produktif' },
    { name: 'Penarik', zone: 'Tengah', electricity: 'PLN Stabil', signal: 'Fiber/4G', desc: 'Kawasan sentral perkebunan sawit & MGMP' },
    { name: 'Teras Terunjam', zone: 'Tengah', electricity: 'PLN Terbatas', signal: '3G/4G Lemah', desc: 'Daerah perbukitan dengan sinyal fluktuatif' },
    { name: 'Teramang Jaya', zone: 'Tengah', electricity: 'Genset/Surya', signal: 'VSAT', desc: 'Pesisir perkebunan terisolir (Wilayah 3T)' },
    { name: 'Selagan Raya', zone: 'Tengah', electricity: 'PLN Terbatas', signal: '3G/4G Lemah', desc: 'Lembah hulu sungai Selagan pegunungan' },
    { name: 'Pondok Suguh', zone: 'Selatan', electricity: 'PLN Terbatas', signal: '3G/4G Lemah', desc: 'Pesisir barat penghubung lintas barat' },
    { name: 'Ipuh', zone: 'Selatan', electricity: 'PLN Terbatas', signal: '3G/4G Lemah', desc: 'Pusat perekonomian pesisir selatan Mukomuko' },
    { name: 'Air Rami', zone: 'Selatan', electricity: 'PLN Terbatas', signal: '3G/4G Lemah', desc: 'Pesisir terluar batas Bengkulu Utara (Wilayah 3T)' },
    { name: 'Malin Deman', zone: 'Pedalaman', electricity: 'Genset/Surya', signal: 'Blankspot', desc: 'Pedalaman terpencil lingkar TNKS (Wilayah 3T)' }
  ];

  const getDistrictStats = (districtName: string) => {
    const matched = schools.filter(s => s.district.toLowerCase() === districtName.toLowerCase());
    const count = matched.length;
    const avgLit = count > 0 ? (matched.reduce((a, b) => a + b.literacyScoreAvg, 0) / count).toFixed(1) : '-';
    const avgNum = count > 0 ? (matched.reduce((a, b) => a + b.numeracyScoreAvg, 0) / count).toFixed(1) : '-';
    const totalStudents = matched.reduce((a, b) => a + b.studentCount, 0);
    return { count, avgLit, avgNum, totalStudents, has3T: matched.some(s => s.is3TArea) };
  };

  const getStatusColor = (signal: string) => {
    switch (signal) {
      case 'Fiber/4G': return 'bg-emerald-500';
      case '3G/4G Lemah': return 'bg-amber-500';
      case 'VSAT': return 'bg-sky-500';
      case 'Blankspot': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Peta Geospasial Kabupaten Mukomuko</h3>
              <p className="text-xs text-slate-500">
                Pilih kecamatan untuk menyaring satuan pendidikan dan melihat kesiapan konektivitas regional
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedDistrict ? (
            <button
              onClick={() => onSelectDistrict(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition border border-blue-200"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Tampilkan Semua Wilayah ({selectedDistrict})</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              12 Kecamatan Terdata
            </span>
          )}
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          Kondisi Jaringan:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Stabil (Fiber/4G Kota)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>3G/4G Lemah (Fluktuatif)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>VSAT Satelit BAKTI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Blankspot / Prioritas 3T</span>
        </div>
      </div>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {districtsData.map(dist => {
          const stats = getDistrictStats(dist.name);
          const isSelected = selectedDistrict === dist.name;

          return (
            <div
              key={dist.name}
              onClick={() => onSelectDistrict(isSelected ? null : dist.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200/80 bg-white hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(dist.signal)}`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Zona {dist.zone}
                    </span>
                  </div>
                  {stats.has3T && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700">
                      3T
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{dist.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{dist.desc}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-600">
                  {stats.count > 0 ? `${stats.count} Sekolah (${stats.totalStudents} Siswa)` : 'Belum Ada'}
                </span>
                {stats.count > 0 ? (
                  <span className="font-semibold text-blue-700 font-mono">
                    Lit: {stats.avgLit} | Num: {stats.avgNum}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
