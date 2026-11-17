import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';
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
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { loginAs, loginWithUsername } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('demo123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
      navigate('/dashboard');
    } else {
      setErrorMsg('Nama pengguna tidak ditemukan. Silakan gunakan peran demonstrasi di bawah.');
    }
  };

  const handleRoleQuickSelect = async (role: UserRole) => {
    await loginAs(role);
    navigate('/dashboard');
  };

  const demoAccounts = [
    {
      role: 'dinas_pendidikan' as UserRole,
      title: 'Dinas Pendidikan',
      name: 'Drs. H. Ruslan Effendi, M.Pd',
      icon: Building2
    },
    {
      role: 'kepala_sekolah' as UserRole,
      title: 'Kepala Sekolah',
      name: 'Sri Wahyuni, S.Pd., M.M.',
      icon: GraduationCap
    },
    {
      role: 'guru_koordinator' as UserRole,
      title: 'Guru Koordinator',
      name: 'Ahmad Fauzi, M.Pd.',
      icon: Users
    },
    {
      role: 'guru' as UserRole,
      title: 'Guru Kelas 5',
      name: 'Siti Rahmawati, S.Pd.',
      icon: UserCheck
    },
    {
      role: 'siswa' as UserRole,
      title: 'Peserta Didik',
      name: 'Rizky Pratama Mukomuko',
      icon: BookOpen
    },
    {
      role: 'super_admin' as UserRole,
      title: 'Super Admin',
      name: 'Bambang Irawan, M.Kom',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Left 60%: Navy gradient background */}
      <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 rounded-full bg-blue-400/10 pointer-events-none" />

        {/* Top: 3T Region Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>Kabupaten Mukomuko, Bengkulu</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/30 text-white font-medium border border-blue-400/30">
            Wilayah 3T
          </span>
        </div>

        {/* Center: Brand & Tagline */}
        <div className="relative z-10 my-12 lg:my-auto max-w-xl">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center font-extrabold text-2xl text-white mb-6 shadow-md">
            JB
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            JALIN BELAJAR
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-medium text-sky-100">
            Jejaring Aksi Literasi dan Numerasi Berbasis Data
          </p>
          <p className="mt-5 text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
            Platform ekosistem pendidikan cerdas yang memadukan pemetaan infrastruktur sekolah 3T, asesmen diagnostik adaptif berkala, pembinaan komunitas guru, dan sinkronisasi data local-first tanpa hambatan keterbatasan internet.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-xs">
            <div>
              <p className="text-sky-200 font-semibold">4 Modul Terpadu</p>
              <p className="text-slate-300 text-[11px] mt-0.5">PETA • TUNTAS • GURU • HUB</p>
            </div>
            <div>
              <p className="text-sky-200 font-semibold">Local-First Ready</p>
              <p className="text-slate-300 text-[11px] mt-0.5">Operasional luring Dexie IDB</p>
            </div>
            <div>
              <p className="text-sky-200 font-semibold">Berbasis Bukti</p>
              <p className="text-slate-300 text-[11px] mt-0.5">Diagnostik capaian per siswa</p>
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-10 text-xs text-slate-300/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Sistem Siap Operasi — Arsitektur Local-First Wilayah 3T</span>
        </div>
      </div>

      {/* Right 40%: White Panel */}
      <div className="w-full lg:w-[40%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Masuk ke Sistem
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Masukkan kredensial Anda atau pilih peran demonstrasi di bawah.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Pengguna
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Contoh: guru, dinas, kepsek, siswa"
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold"
              isLoading={isLoggingIn}
            >
              Masuk
            </Button>
          </form>

          {/* Demonstration Quick Roles (2x3 Grid) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Atau pilih peran demonstrasi:
              </span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                1-Klik Masuk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleRoleQuickSelect(account.role)}
                    className="p-3 text-left rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-blue-700 truncate">
                          {account.title}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-900 truncate">
                        {account.name}
                      </p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-blue-600 font-medium">
                      <span>Pilih peran</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Data simulasi — bukan data resmi
          </p>
        </div>
      </div>
    </div>
  );
};
