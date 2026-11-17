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
  Sparkles, 
  ArrowRight,
  MapPin,
  Lock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { loginAs, loginWithUsername, allUsers } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoggingIn(true);
    const success = await loginWithUsername(usernameInput);
    setIsLoggingIn(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Nama pengguna tidak ditemukan. Silakan gunakan salah satu dari 6 akun simulasi demo.');
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
      desc: 'Pemantauan peta mutu & infrastruktur seluruh sekolah di Kab. Mukomuko',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400'
    },
    {
      role: 'kepala_sekolah' as UserRole,
      title: 'Kepala Sekolah',
      name: 'Sri Wahyuni, S.Pd., M.M.',
      desc: 'SDN 05 Air Rami (3T Pesisir) — Evaluasi rasio TIK & capaian asesmen',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400'
    },
    {
      role: 'guru_koordinator' as UserRole,
      title: 'Guru Koordinator',
      name: 'Ahmad Fauzi, M.Pd.',
      desc: 'Penggerak 3T — Supervisi pendampingan guru & kurasi praktik baik',
      icon: Users,
      color: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400'
    },
    {
      role: 'guru' as UserRole,
      title: 'Guru Kelas 5',
      name: 'Siti Rahmawati, S.Pd.',
      desc: 'Wali Kelas 5 — Penyusunan asesmen numerasi pecahan & tindak lanjut',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400'
    },
    {
      role: 'siswa' as UserRole,
      title: 'Peserta Didik (Siswa)',
      name: 'Rizky Pratama Mukomuko',
      desc: 'Siswa Kelas 5 SD — Pengerjaan tes diagnostik & modul remedial adaptif',
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
    },
    {
      role: 'super_admin' as UserRole,
      title: 'Super Admin',
      name: 'Bambang Irawan, M.Kom',
      desc: 'Administrator sistem, basis data IndexedDB & pengujian offline',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kabupaten Mukomuko, Provinsi Bengkulu</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-blue-500/30">
              JB
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              JALIN BELAJAR
            </h1>
          </div>
          <p className="text-base text-slate-600 font-medium">
            Jejaring Aksi Literasi dan Numerasi Berbasis Data untuk Wilayah 3T
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Platform digital terintegrasi untuk pemetaan infrastruktur, pembelajaran adaptif terarah, dan kolaborasi pendidik di daerah 3T.
          </p>
        </div>

        {/* 1-Click Role Switcher Demo Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pilih Akun Simulasi Demonstrasi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik salah satu dari 6 peran di bawah untuk langsung masuk dan melihat antarmuka serta hak akses masing-masing pengguna.
              </p>
            </div>
            <span className="text-xs bg-slate-100 font-mono text-slate-600 px-2.5 py-1 rounded-md font-semibold hidden sm:inline">
              6 Peran Siap Uji
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {demoAccounts.map(account => {
              const Icon = account.icon;
              return (
                <div
                  key={account.role}
                  onClick={() => handleRoleQuickSelect(account.role)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${account.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">{account.title}</span>
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{account.name}</h3>
                    <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{account.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span>Masuk sebagai {account.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Username Login form as secondary option */}
          <div className="pt-6 border-t border-slate-100">
            <form onSubmit={handleManualLogin} className="max-w-md mx-auto space-y-3">
              <p className="text-xs font-bold text-slate-700 text-center uppercase tracking-wider">
                Atau Masuk dengan Nama Pengguna
              </p>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="Ketik: admin, dinas, kepsek, koordinator, guru, atau siswa"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 text-center font-medium">{errorMsg}</p>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="w-full"
                isLoading={isLoggingIn}
              >
                Masuk
              </Button>
            </form>
          </div>
        </div>

        {/* Prototype note */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>Sistem ini merupakan prototipe fungsional lokal (Local-First Prototype).</p>
          <p>Autentikasi disimulasikan melalui penyimpanan IndexedDB peramban dan tidak memerlukan sambungan peladen daring.</p>
        </div>
      </div>
    </div>
  );
};

