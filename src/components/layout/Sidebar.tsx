import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWorkspaceConfig } from '../../services/navigation';
import { 
  X,
  LogOut,
  MapPin,
  Sparkles,
  School as SchoolIcon,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const workspace = getWorkspaceConfig(role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Light Professional Modern Design */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200 shadow-xs transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-xs">
              JB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">JALIN BELAJAR</span>
                <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1 py-0.2 rounded border border-blue-100">
                  3T
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Kabupaten Mukomuko</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Workspace Banner */}
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <p className="text-[10px] font-bold tracking-wider uppercase text-blue-700 truncate">
              {workspace.title}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
            {currentUser?.schoolName || workspace.subtitle}
          </p>
        </div>

        {/* User Card inside Sidebar */}
        <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-white border border-slate-100 flex items-center gap-2.5 shadow-2xs">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
            alt={currentUser?.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser?.gradeLevel || currentUser?.subject || currentUser?.nipNisn || 'Pengguna Terverifikasi'}
            </p>
          </div>
        </div>

        {/* Workspace Dedicated Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <div>
            <p className="px-3 mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Navigasi Ruang Kerja
            </p>
            <div className="space-y-0.5">
              {workspace.navItems.map((item) => {
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
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0 opacity-70" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-blue-100 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Special secondary link for Guru Koordinator if they also teach */}
          {role === 'guru_koordinator' && (
            <div className="pt-2 border-t border-slate-100">
              <p className="px-3 mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Peran Tambahan
              </p>
              <NavLink
                to="/guru/beranda"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-2 border-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Ruang Pembelajaran Guru</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-700">
                  Guru
                </span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Clean Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-slate-500">Lokal / Terhubung</span>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar dari akun"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
