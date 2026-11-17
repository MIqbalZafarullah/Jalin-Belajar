import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { getWorkspaceHome } from '../services/navigation';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  User as UserIcon,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Laptop
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { loginAs, loginWithUsername, allUsers } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('demo123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('Silakan masukkan nama pengguna.');
      return;
    }
    setErrorMsg('');
    setIsLoggingIn(true);
    const success = await loginWithUsername(usernameInput.trim());
    setIsLoggingIn(false);
    if (success) {
      // Find the logged-in user to determine workspace home
      const matched = allUsers.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
      const destination = getWorkspaceHome(matched ? matched.role : 'guru');
      navigate(destination);
    } else {
      setErrorMsg('Nama pengguna tidak ditemukan. Gunakan tombol "Masuk sebagai Akun Demo" di bawah.');
    }
  };

  const handleRoleQuickSelect = async (role: UserRole) => {
    await loginAs(role);
    setIsDemoModalOpen(false);
    navigate(getWorkspaceHome(role));
  };

  const demoAccounts = [
    {
      role: 'dinas_pendidikan' as UserRole,
      title: 'Ruang Dinas Pendidikan',
      name: 'Drs. H. Ruslan Effendi, M.Pd',
      scope: 'Dinas Pendidikan Kabupaten Mukomuko',
      desc: 'Koordinasi, pemetaan 3T, prioritas intervensi & evaluasi agregat daerah',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      role: 'kepala_sekolah' as UserRole,
      title: 'Ruang Kepala Sekolah',
      name: 'Sri Wahyuni, S.Pd., M.M.',
      scope: 'SDN 05 Air Rami (3T Pesisir)',
      desc: 'Pengawasan pelaksanaan program, pemantauan guru & capaian sekolah',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      role: 'guru_koordinator' as UserRole,
      title: 'Ruang Guru Koordinator',
      name: 'Ahmad Fauzi, M.Pd.',
      scope: 'SDN 05 Air Rami (3T Pesisir)',
      desc: 'Operasional sekolah, penjadwalan asesmen, materi & sinkronisasi luring',
      icon: Users,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      role: 'guru' as UserRole,
      title: 'Ruang Guru Pelaksana',
      name: 'Siti Rahmawati, S.Pd.',
      scope: 'Kelas 5 SD • SDN 05 Air Rami',
      desc: 'Pembuatan asesmen diagnostik, analisis kompetensi & materi adaptif',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      role: 'siswa' as UserRole,
      title: 'Ruang Belajar Murid',
      name: 'Rizky Pratama Mukomuko',
      scope: 'Murid Kelas 5 SD',
      desc: 'Materi adaptif personal, pengerjaan asesmen, latihan & perpustakaan luring',
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Left 55%: Editorial Branding Banner */}
      <div className="w-full lg:w-[55%] bg-gradient-to-br from-[#1e3a5f] via-[#1a3455] to-[#2563eb] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 rounded-full bg-blue-400/10 pointer-events-none" />

        {/* Top: 3T Region Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>Wilayah Sasaran: Kab. Mukomuko, Bengkulu</span>
          </div>
        </div>

        {/* Center: Brand identity & Value Proposition */}
        <div className="relative z-10 my-auto py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white text-blue-700 flex items-center justify-center font-black text-2xl shadow-lg">
              JB
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-sky-200 uppercase">
                Ekosistem EdTech 3T
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                JALIN BELAJAR
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-200 mb-6 max-w-xl leading-relaxed">
            Jejaring Aksi Literasi dan Numerasi Berbasis Data untuk Mengatasi Kesenjangan Pendidikan di Daerah 3T.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-xs text-slate-200">
            <div className="p-3 rounded-lg bg-white/10 border border-white/15">
              <span className="font-bold text-white block mb-0.5">Satu Ekosistem, Lima Ruang Kerja</span>
              <span className="text-slate-300">Pengalaman pengguna terkurasi sesuai peran: Dinas, Kepsek, Koordinator, Guru, dan Murid.</span>
            </div>
            <div className="p-3 rounded-lg bg-white/10 border border-white/15">
              <span className="font-bold text-white block mb-0.5">Offline-First & Adaptif</span>
              <span className="text-slate-300">Beroperasi lancar dengan penyimpanan lokal IndexedDB tanpa ketergantungan sinyal internet.</span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
          <span>Inovasi Pendidikan Wilayah 3T</span>
          <span>Versi 1.0.0</span>
        </div>
      </div>

      {/* Right 45%: Clean Professional Login Card */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Masuk ke Ruang Kerja
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Gunakan akun Anda untuk mengakses sistem JALIN BELAJAR sesuai hak akses.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Contoh: guru, dinas, kepsek, koordinator, siswa"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Bawaan: demo123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold py-2.5 text-sm"
              isLoading={isLoggingIn}
            >
              Masuk ke Ruang Kerja
            </Button>
          </form>

          {/* Quick Demo Selector Button */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100/80">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-blue-950">
                    Mode Demonstrasi & Pengujian
                  </h3>
                  <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                    Uji langsung lima ruang kerja tanpa perlu mengetik kredensial satu per satu.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsDemoModalOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
                  >
                    <span>Pilih Akun Demo Ruang Kerja</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Simulasi lokal (Local-First Prototype) • Data sintetis terstruktur untuk Kabupaten Mukomuko
          </p>
        </div>
      </div>

      {/* Modal Demo Selection */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Pilih Ruang Kerja Demonstrasi"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Setiap akun terhubung ke ruang kerja khusus dengan hak akses, navigasi, dan data yang disesuaikan dengan tanggung jawab peran:
          </p>

          <div className="space-y-2.5">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleRoleQuickSelect(account.role)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg border shrink-0 ${account.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          {account.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({account.scope})</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {account.desc}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Peran teknis prototipe:</span>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('super_admin')}
              className="text-slate-600 hover:text-blue-600 font-medium underline"
            >
              Masuk sebagai Super Admin (Teknis)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
