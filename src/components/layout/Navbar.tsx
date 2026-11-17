import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SyncIndicator } from '../common/SyncIndicator';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { 
  Menu, 
  Bell, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  ShieldAlert,
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Regional Location Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-medium border border-blue-100">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Wilayah Fokus: <strong>Kab. Mukomuko, Bengkulu</strong></span>
            </div>
            {currentUser?.schoolName && (
              <span className="hidden xl:inline-block text-xs text-slate-500 font-medium border-l border-slate-200 pl-2.5">
                {currentUser.schoolName}
              </span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Offline & Sync Status */}
          <SyncIndicator />

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Role Switcher (For FISION Jury & Testing) */}
          <RoleSwitcher />

          {/* User Profile Avatar & Logout */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <button
              onClick={logout}
              title="Keluar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

