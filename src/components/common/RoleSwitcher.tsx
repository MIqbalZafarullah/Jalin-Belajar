import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  BookOpen, 
  Check, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, role, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const rolesConfig: { role: UserRole; label: string; sub: string; icon: any; color: string }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      sub: 'Bambang Irawan (IT Administrator)',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      role: 'dinas_pendidikan',
      label: 'Dinas Pendidikan',
      sub: 'Drs. H. Ruslan Effendi (Disdik Mukomuko)',
      icon: Building2,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      role: 'kepala_sekolah',
      label: 'Kepala Sekolah',
      sub: 'Sri Wahyuni (SDN 05 Air Rami)',
      icon: GraduationCap,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      role: 'guru_koordinator',
      label: 'Guru Koordinator',
      sub: 'Ahmad Fauzi (Penggerak 3T)',
      icon: Users,
      color: 'text-teal-600 bg-teal-50'
    },
    {
      role: 'guru',
      label: 'Guru Kelas 5',
      sub: 'Siti Rahmawati (Guru Pengajar)',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      role: 'siswa',
      label: 'Peserta Didik (Siswa)',
      sub: 'Rizky Pratama (Kelas 5 SD)',
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  const currentConfig = rolesConfig.find(r => r.role === role) || rolesConfig[4];

  const handleSelectRole = (targetRole: UserRole) => {
    loginAs(targetRole);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-left text-xs shadow-xs"
        title="Ganti Peran Demonstrasi"
      >
        <div className={`p-1.5 rounded-md ${currentConfig.color}`}>
          <currentConfig.icon className="w-3.5 h-3.5" />
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">{currentConfig.label}</span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-mono font-medium">Demo</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate max-w-[130px]">{currentUser?.name}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 z-50 py-2 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Simulasi 6 Akun Pengguna
                </p>
                <p className="text-[11px] text-slate-500">Pilih peran untuk menguji hak akses</p>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto py-1">
              {rolesConfig.map(item => {
                const isSelected = item.role === role;
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    onClick={() => handleSelectRole(item.role)}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
            
            <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              JALIN BELAJAR • Functional Prototype
            </div>
          </div>
        </>
      )}
    </div>
  );
};

