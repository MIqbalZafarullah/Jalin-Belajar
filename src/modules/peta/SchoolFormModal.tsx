import React, { useState, useEffect } from 'react';
import { School, SchoolLevel, ElectricStatus, InternetStatus, PriorityLevel } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const districtsMukomuko = [
    'Air Rami',
    'Ipuh',
    'Teramang Jaya',
    'Penarik',
    'Kota Mukomuko',
    'Malin Deman',
    'Lubuk Pinang',
    'Teras Terunjam',
    'Pondok Suguh',
    'Selagan Raya'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Ubah Data Satuan Pendidikan' : 'Tambah Satuan Pendidikan (Data Simulasi)'}
      subtitle="Input data kondisi infrastruktur dan capaian sekolah di Kabupaten Mukomuko"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN Sekolah *</label>
            <input
              type="text"
              required
              value={formData.npsn}
              onChange={e => setFormData({ ...formData, npsn: e.target.value })}
              placeholder="Contoh: 10701928"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: SDN 09 Pondok Suguh"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang Pendidikan *</label>
            <select
              value={formData.level}
              onChange={e => setFormData({ ...formData, level: e.target.value as SchoolLevel })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="SD">Sekolah Dasar (SD)</option>
              <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan di Mukomuko *</label>
            <select
              value={formData.district}
              onChange={e => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
              placeholder="Contoh: Drs. M. Yusuf, M.Pd."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Alamat desa / jalan"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <p className="text-xs font-bold text-slate-900 mb-2">Kondisi Infrastruktur 3T & Perangkat</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi Listrik</label>
              <select
                value={formData.electricStatus}
                onChange={e => setFormData({ ...formData, electricStatus: e.target.value as ElectricStatus })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="PLN 24 Jam">PLN 24 Jam</option>
                <option value="PLN Terbatas">PLN Terbatas (Padam Rutin)</option>
                <option value="Genset/Surya">Genset / Panel Surya</option>
                <option value="Belum Ada">Belum Ada Listrik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Konektivitas Internet</label>
              <select
                value={formData.internetStatus}
                onChange={e => setFormData({ ...formData, internetStatus: e.target.value as InternetStatus })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Stabil (Fiber/4G)">Stabil (Fiber/4G Cepat)</option>
                <option value="Terbatas (3G/4G Lemah)">Terbatas (3G/4G Lemah)</option>
                <option value="VSAT/Satelit">VSAT / Satelit</option>
                <option value="Tidak Ada Sinyal">Tidak Ada Sinyal (Blankspot)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Perangkat TIK Berfungsi</label>
              <input
                type="number"
                min="0"
                value={formData.deviceCount}
                onChange={e => setFormData({ ...formData, deviceCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <p className="text-xs font-bold text-slate-900 mb-2">Statistik Warga Sekolah & Hasil Asesmen</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peserta Didik</label>
              <input
                type="number"
                min="1"
                value={formData.studentCount}
                onChange={e => setFormData({ ...formData, studentCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Guru</label>
              <input
                type="number"
                min="1"
                value={formData.teacherCount}
                onChange={e => setFormData({ ...formData, teacherCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rerata Literasi (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.literacyScoreAvg}
                onChange={e => setFormData({ ...formData, literacyScoreAvg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rerata Numerasi (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.numeracyScoreAvg}
                onChange={e => setFormData({ ...formData, numeracyScoreAvg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas Pendampingan</label>
              <select
                value={formData.priorityLevel}
                onChange={e => setFormData({ ...formData, priorityLevel: e.target.value as PriorityLevel })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="Sangat Tinggi">Sangat Tinggi (Butuh Intervensi Luring Segera)</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah (Mandiri)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.is3TArea}
                  onChange={e => setFormData({ ...formData, is3TArea: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Kategori Wilayah 3T / Terpencil</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {initialData ? 'Simpan Perubahan' : 'Tambahkan Sekolah'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

