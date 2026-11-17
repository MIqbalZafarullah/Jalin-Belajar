import React, { useState, useEffect } from 'react';
import { School, SchoolLevel, ElectricStatus, InternetStatus, PriorityLevel } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Building2, Zap, Wifi, Users, Laptop, GraduationCap } from 'lucide-react';

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schoolData: Omit<School, 'id' | 'updatedAt'> | School) => Promise<void>;
  initialData?: School | null;
}

export const SchoolFormModal: React.FC<SchoolFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    npsn: '',
    name: '',
    level: 'SD' as SchoolLevel,
    district: 'Air Rami',
    address: '',
    headmasterName: '',
    electricStatus: 'PLN Terbatas' as ElectricStatus,
    internetStatus: 'Terbatas (3G/4G Lemah)' as InternetStatus,
    deviceCount: 5,
    studentCount: 120,
    teacherCount: 8,
    literacyScoreAvg: 55,
    numeracyScoreAvg: 50,
    priorityLevel: 'Tinggi' as PriorityLevel,
    is3TArea: true,
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        npsn: initialData.npsn,
        name: initialData.name,
        level: initialData.level,
        district: initialData.district,
        address: initialData.address,
        headmasterName: initialData.headmasterName,
        electricStatus: initialData.electricStatus,
        internetStatus: initialData.internetStatus,
        deviceCount: initialData.deviceCount,
        studentCount: initialData.studentCount,
        teacherCount: initialData.teacherCount,
        literacyScoreAvg: initialData.literacyScoreAvg,
        numeracyScoreAvg: initialData.numeracyScoreAvg,
        priorityLevel: initialData.priorityLevel,
        is3TArea: initialData.is3TArea,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        npsn: '',
        name: '',
        level: 'SD',
        district: 'Air Rami',
        address: '',
        headmasterName: '',
        electricStatus: 'PLN Terbatas',
        internetStatus: 'Terbatas (3G/4G Lemah)',
        deviceCount: 5,
        studentCount: 120,
        teacherCount: 8,
        literacyScoreAvg: 55,
        numeracyScoreAvg: 50,
        priorityLevel: 'Tinggi',
        is3TArea: true,
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (initialData) {
        await onSubmit({
          ...initialData,
          ...formData,
          updatedAt: new Date().toISOString().split('T')[0]
        });
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan data sekolah:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const districtsMukomuko = [
    'Kota Mukomuko',
    'Lubuk Pinang',
    'XIV Koto',
    'Air Manjunto',
    'Penarik',
    'Teras Terunjam',
    'Teramang Jaya',
    'Selagan Raya',
    'Pondok Suguh',
    'Ipuh',
    'Air Rami',
    'Malin Deman'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Ubah Data Satuan Pendidikan' : 'Tambah Satuan Pendidikan Baru'}
      subtitle="Pendataan kondisi profil sekolah, kesiapan infrastruktur, dan asesmen di Kabupaten Mukomuko"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Profil Dasar */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Identitas Satuan Pendidikan</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NPSN Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                placeholder="Contoh: 10701823"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: SDN 05 Air Rami (3T Pesisir)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenjang Pendidikan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value as SchoolLevel })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kecamatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                {districtsMukomuko.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.headmasterName}
                onChange={e => setFormData({ ...formData, headmasterName: e.target.value })}
                placeholder="Contoh: Sri Wahyuni, S.Pd., M.M."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap / Desa</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Desa, Jalan, RT/RW, Kabupaten Mukomuko"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Infrastruktur Listrik & Internet */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kondisi Infrastruktur & TIK</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi Listrik</label>
              <select
                value={formData.electricStatus}
                onChange={e => setFormData({ ...formData, electricStatus: e.target.value as ElectricStatus })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="PLN 24 Jam">PLN 24 Jam</option>
                <option value="PLN Terbatas">PLN Terbatas</option>
                <option value="Genset/Surya">Genset / Surya</option>
                <option value="Belum Ada">Belum Ada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi Internet</label>
              <select
                value={formData.internetStatus}
                onChange={e => setFormData({ ...formData, internetStatus: e.target.value as InternetStatus })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Stabil (Fiber/4G)">Stabil (Fiber/4G)</option>
                <option value="Terbatas (3G/4G Lemah)">Terbatas (3G/4G Lemah)</option>
                <option value="VSAT/Satelit">VSAT / Satelit</option>
                <option value="Tidak Ada Sinyal">Tidak Ada Sinyal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Perangkat TIK Aktif (Unit)</label>
              <input
                type="number"
                min="0"
                value={formData.deviceCount}
                onChange={e => setFormData({ ...formData, deviceCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Warga Sekolah & Asesmen */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statistik & Capaian Asesmen</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Siswa</label>
              <input
                type="number"
                min="1"
                value={formData.studentCount}
                onChange={e => setFormData({ ...formData, studentCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Guru</label>
              <input
                type="number"
                min="1"
                value={formData.teacherCount}
                onChange={e => setFormData({ ...formData, teacherCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rerata Literasi (0-100)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.literacyScoreAvg}
                onChange={e => setFormData({ ...formData, literacyScoreAvg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rerata Numerasi (0-100)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.numeracyScoreAvg}
                onChange={e => setFormData({ ...formData, numeracyScoreAvg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Klasifikasi & Catatan */}
        <div className="border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Prioritas Intervensi</label>
              <select
                value={formData.priorityLevel}
                onChange={e => setFormData({ ...formData, priorityLevel: e.target.value as PriorityLevel })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Sangat Tinggi">Sangat Tinggi (Intervensi Khusus 3T)</option>
                <option value="Tinggi">Tinggi (Perlu Pendampingan Berkala)</option>
                <option value="Sedang">Sedang (Pemantauan Reguler)</option>
                <option value="Rendah">Rendah (Mandiri)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={formData.is3TArea}
                  onChange={e => setFormData({ ...formData, is3TArea: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                />
                <span>Kategori Wilayah 3T / Terpencil / Pesisir</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan Lapangan</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Misal: Sering mati lampu saat cuaca buruk, butuh modul cetak atau flash disk offline."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {initialData ? 'Simpan Perubahan' : 'Tambahkan Satuan Pendidikan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
