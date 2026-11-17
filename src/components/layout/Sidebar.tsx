import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Target, 
  GraduationCap, 
  Database, 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  DownloadCloud, 
  RotateCw, 
  X,
  Layers,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isSiswa = role === 'siswa';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
    badge?: string;
  }

  interface NavSection {
    title: string;
    visible?: boolean;
    items: NavItem[];
  }

  // Navigation schema categorized by 4 modules
  const navSections: NavSection[] = [
    {
      title: 'UTAMA',
      items: [
        {
          name: 'Dashboard Saya',
          path: '/dashboard',
          icon: LayoutDashboard,
          visible: true
        }
      ]
    },
    {
      title: 'MODUL A: JALIN-PETA',
      visible: !isSiswa,
      items: [
        {
          name: 'Pemetaan Sekolah & 3T',
          path: '/peta/sekolah',
          icon: Compass,
          visible: !isSiswa
        },
        {
          name: 'Kondisi Infrastruktur',
          path: '/peta/infrastruktur',
          icon: Layers,
          visible: !isSiswa
        },
        {
          name: 'Sebaran Capaian Lit-Num',
          path: '/peta/capaian',
          icon: TrendingUp,
          visible: !isSiswa
        }
      ]
    },
    {
      title: 'MODUL B: JALIN-TUNTAS',
      visible: true,
      items: isSiswa ? [
        {
          name: 'Materi Rekomendasi',
          path: '/tuntas/rekomendasi',
          icon: Sparkles,
          visible: true,
          badge: 'Adaptif'
        },
        {
          name: 'Asesmen Diagnostik',
          path: '/tuntas/asesmen',
          icon: FileCheck,
          visible: true
        },
        {
          name: 'Latihan Mandiri',
          path: '/tuntas/latihan',
          icon: BookOpen,
          visible: true
        },
        {
          name: 'Perkembangan Saya',
          path: '/tuntas/progress',
          icon: TrendingUp,
          visible: true
        }
      ] : [
        {
          name: 'Overview Pembelajaran',
          path: '/tuntas/dashboard',
          icon: Target,
          visible: true
        },
        {
          name: 'Bank Materi SD/SMP',
          path: '/tuntas/materi',
          icon: BookOpen,
          visible: true
        },
        {
          name: 'Bank Soal Diagnostik',
          path: '/tuntas/bank-soal',
          icon: Layers,
          visible: true
        },
        {
          name: 'Asesmen Diagnostik',
          path: '/tuntas/asesmen',
          icon: FileCheck,
          visible: true
        },
        {
          name: 'Analisis & Rekomendasi',
          path: '/tuntas/rekomendasi',
          icon: Sparkles,
          visible: true
        }
      ]
    },
    {
      title: 'MODUL C: JALIN-GURU',
      visible: !isSiswa,
      items: [
        {
          name: 'Komunitas & Panduan',
          path: '/guru/dashboard',
          icon: GraduationCap,
          visible: !isSiswa
        },
        {
          name: 'Catatan Pendampingan',
          path: '/guru/pendampingan',
          icon: FileCheck,
          visible: !isSiswa
        },
        {
          name: 'Berbagi Praktik Baik',
          path: '/guru/praktik-baik',
          icon: Share2,
          visible: !isSiswa
        }
      ]
    },
    {
      title: 'MODUL D: JALIN-HUB',
      visible: true,
      items: [
        {
          name: 'Pusat Sumber Belajar',
          path: '/hub/dashboard',
          icon: Database,
          visible: true
        },
        {
          name: 'Materi Tersimpan Luring',
          path: '/hub/offline',
          icon: DownloadCloud,
          visible: true,
          badge: 'Offline'
        },
        {
          name: 'Pusat Sinkronisasi',
          path: '/hub/sinkronisasi',
          icon: RotateCw,
          visible: !isSiswa
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: White background, 256px (w-64) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200/90 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center font-extrabold text-white text-base tracking-wider shadow-sm">
              JB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900">JALIN BELAJAR</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                  3T
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Jejaring Lit-Num Data</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-3 border-b border-slate-100 shrink-0">
          <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-blue-600 font-medium capitalize truncate">
                {role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.filter(s => s.visible !== false).map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.filter(item => item.visible !== false).map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 ml-1">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Clean Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 text-[11px]">JALIN BELAJAR</span>
            <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar dari akun"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
