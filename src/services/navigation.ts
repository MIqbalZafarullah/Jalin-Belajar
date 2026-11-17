import { UserRole } from '../types';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  BookOpen, 
  Compass, 
  Layers, 
  TrendingUp, 
  FileCheck, 
  Sparkles, 
  Share2, 
  DownloadCloud, 
  RotateCw, 
  Calendar,
  Award,
  FileText,
  HeartHandshake,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import React from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface WorkspaceConfig {
  id: string;
  title: string;
  subtitle: string;
  homePath: string;
  allowedRoles: UserRole[];
  navItems: NavItem[];
}

export const WORKSPACE_CONFIGS: Record<UserRole, WorkspaceConfig> = {
  dinas_pendidikan: {
    id: 'dinas',
    title: 'Ruang Dinas Pendidikan',
    subtitle: 'Koordinasi, Pemetaan & Evaluasi Kabupaten Mukomuko',
    homePath: '/dinas/ringkasan',
    allowedRoles: ['dinas_pendidikan', 'super_admin'],
    navItems: [
      { name: 'Ringkasan Daerah', path: '/dinas/ringkasan', icon: Building2 },
      { name: 'Peta Sekolah', path: '/dinas/peta-sekolah', icon: Compass },
      { name: 'Prioritas Intervensi', path: '/dinas/prioritas', icon: Layers },
      { name: 'Evaluasi Program', path: '/dinas/evaluasi', icon: TrendingUp },
      { name: 'Laporan', path: '/dinas/laporan', icon: FileText },
      { name: 'Kolaborasi', path: '/dinas/kolaborasi', icon: HeartHandshake, badge: 'Mitra 3T' }
    ]
  },
  kepala_sekolah: {
    id: 'kepsek',
    title: 'Ruang Kepala Sekolah',
    subtitle: 'Pengawasan & Pelaksanaan Program Satuan Pendidikan',
    homePath: '/kepsek/ringkasan',
    allowedRoles: ['kepala_sekolah', 'super_admin'],
    navItems: [
      { name: 'Ringkasan Sekolah', path: '/kepsek/ringkasan', icon: GraduationCap },
      { name: 'Data Guru dan Kelas', path: '/kepsek/guru-kelas', icon: Users },
      { name: 'Perkembangan Siswa', path: '/kepsek/perkembangan-siswa', icon: TrendingUp },
      { name: 'Pelaksanaan Program', path: '/kepsek/pelaksanaan', icon: CheckCircle2 },
      { name: 'Evaluasi Sekolah', path: '/kepsek/evaluasi', icon: Award },
      { name: 'Pendampingan', path: '/kepsek/pendampingan', icon: HeartHandshake }
    ]
  },
  guru_koordinator: {
    id: 'koordinator',
    title: 'Ruang Guru Koordinator',
    subtitle: 'Operasional, Penjadwalan & Sinkronisasi Luring Sekolah',
    homePath: '/koordinator/ringkasan',
    allowedRoles: ['guru_koordinator', 'super_admin'],
    navItems: [
      { name: 'Ringkasan Operasional', path: '/koordinator/ringkasan', icon: Layers },
      { name: 'Data Kelas dan Siswa', path: '/koordinator/kelas-siswa', icon: Users },
      { name: 'Pengelolaan Guru', path: '/koordinator/kelola-guru', icon: UserCheck },
      { name: 'Jadwal Asesmen', path: '/koordinator/jadwal-asesmen', icon: Calendar },
      { name: 'Materi Pembelajaran', path: '/koordinator/materi', icon: BookOpen },
      { name: 'Sinkronisasi', path: '/koordinator/sinkronisasi', icon: RotateCw, badge: 'Luring' },
      { name: 'Pendampingan Guru', path: '/koordinator/pendampingan', icon: Share2 }
    ]
  },
  guru: {
    id: 'guru',
    title: 'Ruang Guru Pelaksana',
    subtitle: 'Asesmen Diagnostik & Pembelajaran Adaptif Kelas',
    homePath: '/guru/beranda',
    allowedRoles: ['guru', 'guru_koordinator', 'super_admin'],
    navItems: [
      { name: 'Beranda', path: '/guru/beranda', icon: BookOpen },
      { name: 'Kelas Saya', path: '/guru/kelas', icon: Users },
      { name: 'Asesmen', path: '/guru/asesmen', icon: FileCheck },
      { name: 'Analisis Hasil', path: '/guru/analisis', icon: TrendingUp },
      { name: 'Rekomendasi Belajar', path: '/guru/rekomendasi', icon: Sparkles, badge: 'Adaptif' },
      { name: 'Materi dan Latihan', path: '/guru/materi', icon: FolderOpen },
      { name: 'Perkembangan Siswa', path: '/guru/perkembangan', icon: Award },
      { name: 'Pendampingan', path: '/guru/pendampingan', icon: Share2 }
    ]
  },
  siswa: {
    id: 'murid',
    title: 'Ruang Belajar Murid',
    subtitle: 'Pembelajaran Personalisasi & Asesmen Mandiri',
    homePath: '/murid/beranda',
    allowedRoles: ['siswa', 'super_admin'],
    navItems: [
      { name: 'Beranda', path: '/murid/beranda', icon: BookOpen },
      { name: 'Materi Saya', path: '/murid/materi', icon: Sparkles, badge: 'Rekomendasi' },
      { name: 'Asesmen dan Tugas', path: '/murid/asesmen', icon: FileCheck },
      { name: 'Latihan', path: '/murid/latihan', icon: Award },
      { name: 'Perkembangan Saya', path: '/murid/perkembangan', icon: TrendingUp },
      { name: 'Materi Tersimpan', path: '/murid/tersimpan', icon: DownloadCloud, badge: 'Offline' }
    ]
  },
  super_admin: {
    id: 'admin',
    title: 'Ruang Administrator Sistem',
    subtitle: 'Manajemen Data dan Konfigurasi Sistem',
    homePath: '/dinas/ringkasan',
    allowedRoles: ['super_admin'],
    navItems: [
      { name: 'Ringkasan Daerah', path: '/dinas/ringkasan', icon: Building2 },
      { name: 'Peta Sekolah', path: '/dinas/peta-sekolah', icon: Compass },
      { name: 'Prioritas Intervensi', path: '/dinas/prioritas', icon: Layers },
      { name: 'Evaluasi Program', path: '/dinas/evaluasi', icon: TrendingUp },
      { name: 'Laporan', path: '/dinas/laporan', icon: FileText },
      { name: 'Kolaborasi', path: '/dinas/kolaborasi', icon: HeartHandshake }
    ]
  }
};

export function getWorkspaceHome(role: UserRole | null): string {
  if (!role) return '/login';
  return WORKSPACE_CONFIGS[role]?.homePath || '/dinas/ringkasan';
}

export function getWorkspaceConfig(role: UserRole | null): WorkspaceConfig {
  if (!role || !WORKSPACE_CONFIGS[role]) {
    return WORKSPACE_CONFIGS.guru;
  }
  return WORKSPACE_CONFIGS[role];
}

export function isPathAllowedForRole(path: string, role: UserRole | null): boolean {
  if (!role) return false;
  if (role === 'super_admin') return true;

  // Exact home & dashboard redirects
  if (path === '/' || path === '/dashboard') return true;

  // Prefix check per workspace
  if (path.startsWith('/dinas')) {
    return role === 'dinas_pendidikan';
  }
  if (path.startsWith('/kepsek')) {
    return role === 'kepala_sekolah';
  }
  if (path.startsWith('/koordinator')) {
    return role === 'guru_koordinator';
  }
  if (path.startsWith('/guru')) {
    return role === 'guru' || role === 'guru_koordinator';
  }
  if (path.startsWith('/murid')) {
    return role === 'siswa';
  }

  // Common shared subroutes (exam taking, material details, practice)
  if (
    path.startsWith('/tuntas/ujian') || 
    path.startsWith('/tuntas/hasil') || 
    path.startsWith('/tuntas/materi/') || 
    path.startsWith('/tuntas/latihan/')
  ) {
    return true;
  }
  if (path.startsWith('/peta/sekolah/')) {
    return role === 'dinas_pendidikan' || role === 'kepala_sekolah' || role === 'guru_koordinator';
  }

  // Strict default: Disallow unknown or legacy unmapped routes
  return false;
}

