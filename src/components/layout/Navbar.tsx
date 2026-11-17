import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SyncIndicator } from '../common/SyncIndicator';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { Avatar } from '../common/Avatar';
import { 
  Menu, 
  MapPin, 
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm h-16">
      <div className="px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Regional Location Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-medium border border-blue-100">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Wilayah Fokus: <strong>Kab. Mukomuko, Bengkulu</strong></span>
            </div>
            {currentUser?.schoolName && (
              <span className="hidden md:inline-block text-xs text-slate-500 font-medium border-l border-slate-200 pl-2.5 truncate max-w-xs">
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

          {/* Quick Role Switcher */}
          <RoleSwitcher />

          {/* User Profile Avatar & Logout */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="relative">
              <Avatar
                name={currentUser?.name}
                src={currentUser?.avatar}
                size="sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <button
              onClick={handleLogout}
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
