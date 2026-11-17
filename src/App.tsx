import React from 'react';
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RoleDashboard } from './pages/RoleDashboard';
import { UserRole } from './types';
import { getWorkspaceHome } from './services/navigation';

// JALIN-PETA
import { SchoolList } from './modules/peta/SchoolList';
import { SchoolDetail } from './modules/peta/SchoolDetail';
import { InfrastructureMap } from './modules/peta/InfrastructureMap';
import { LiteracyNumeracyMap } from './modules/peta/LiteracyNumeracyMap';

// JALIN-TUNTAS
import { TuntasDashboard } from './modules/tuntas/TuntasDashboard';
import { MaterialList } from './modules/tuntas/MaterialList';
import { MaterialDetail } from './modules/tuntas/MaterialDetail';
import { QuestionBank } from './modules/tuntas/QuestionBank';
import { AssessmentList } from './modules/tuntas/AssessmentList';
import { AssessmentExam } from './modules/tuntas/AssessmentExam';
import { AssessmentResult } from './modules/tuntas/AssessmentResult';
import { AdaptiveRecommendations } from './modules/tuntas/AdaptiveRecommendations';
import { PracticeSessionPage } from './modules/tuntas/PracticeSession';
import { CompetencyProgress } from './modules/tuntas/CompetencyProgress';

// JALIN-GURU
import { GuruDashboard } from './modules/guru/GuruDashboard';
import { TeacherGuide } from './modules/guru/TeacherGuide';
import { MentoringNotes } from './modules/guru/MentoringNotes';
import { BestPracticesShare } from './modules/guru/BestPracticesShare';

// JALIN-HUB
import { HubDashboard } from './modules/hub/HubDashboard';
import { OfflineLibrary } from './modules/hub/OfflineLibrary';
import { SyncCenter } from './modules/hub/SyncCenter';

// WORKSPACE PAGES
import { DinasLaporan } from './workspaces/dinas/DinasLaporan';
import { DinasKolaborasi } from './workspaces/dinas/DinasKolaborasi';
import { KepsekGuruKelas } from './workspaces/kepsek/KepsekGuruKelas';
import { KepsekPerkembanganSiswa } from './workspaces/kepsek/KepsekPerkembanganSiswa';
import { KepsekPelaksanaan } from './workspaces/kepsek/KepsekPelaksanaan';
import { KepsekEvaluasi } from './workspaces/kepsek/KepsekEvaluasi';
import { KoordinatorKelasSiswa } from './workspaces/koordinator/KoordinatorKelasSiswa';
import { KoordinatorJadwalAsesmen } from './workspaces/koordinator/KoordinatorJadwalAsesmen';
import { KoordinatorKelolaGuru } from './workspaces/koordinator/KoordinatorKelolaGuru';
import { GuruKelasSaya } from './workspaces/guru/GuruKelasSaya';
import { GuruAnalisisHasil } from './workspaces/guru/GuruAnalisisHasil';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-sans">
        Memuat ruang kerja JALIN BELAJAR...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Workspace Role Guard: Enforces strict Role-Based Access Control
const RoleGuard: React.FC<{ allowedRoles: UserRole[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { role, currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role === 'super_admin') return <>{children}</>;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={getWorkspaceHome(role)} replace />;
  }
  return <>{children}</>;
};

// Dynamic Home Redirect based on user's active workspace
const WorkspaceHomeRedirect: React.FC = () => {
  const { role } = useAuth();
  return <Navigate to={getWorkspaceHome(role)} replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <OfflineProvider>
            <Routes>
              {/* Public Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Workspace Layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default Index & Dashboard redirect to user's assigned workspace */}
                <Route index element={<WorkspaceHomeRedirect />} />
                <Route path="dashboard" element={<WorkspaceHomeRedirect />} />

                {/* ========================================================= */}
                {/* RUANG A: DINAS PENDIDIKAN */}
                {/* ========================================================= */}
                <Route
                  path="dinas/ringkasan"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <RoleDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/peta-sekolah"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <SchoolList />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/peta-sekolah/:id"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <SchoolDetail />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/prioritas"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <InfrastructureMap />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/evaluasi"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <LiteracyNumeracyMap />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/laporan"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <DinasLaporan />
                    </RoleGuard>
                  }
                />
                <Route
                  path="dinas/kolaborasi"
                  element={
                    <RoleGuard allowedRoles={['dinas_pendidikan', 'super_admin']}>
                      <DinasKolaborasi />
                    </RoleGuard>
                  }
                />

                {/* ========================================================= */}
                {/* RUANG B: KEPALA SEKOLAH */}
                {/* ========================================================= */}
                <Route
                  path="kepsek/ringkasan"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <RoleDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="kepsek/guru-kelas"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <KepsekGuruKelas />
                    </RoleGuard>
                  }
                />
                <Route
                  path="kepsek/perkembangan-siswa"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <KepsekPerkembanganSiswa />
                    </RoleGuard>
                  }
                />
                <Route
                  path="kepsek/pelaksanaan"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <KepsekPelaksanaan />
                    </RoleGuard>
                  }
                />
                <Route
                  path="kepsek/evaluasi"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <KepsekEvaluasi />
                    </RoleGuard>
                  }
                />
                <Route
                  path="kepsek/pendampingan"
                  element={
                    <RoleGuard allowedRoles={['kepala_sekolah', 'super_admin']}>
                      <MentoringNotes />
                    </RoleGuard>
                  }
                />

                {/* ========================================================= */}
                {/* RUANG C: GURU KOORDINATOR */}
                {/* ========================================================= */}
                <Route
                  path="koordinator/ringkasan"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <RoleDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/kelas-siswa"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <KoordinatorKelasSiswa />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/kelola-guru"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <KoordinatorKelolaGuru />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/jadwal-asesmen"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <KoordinatorJadwalAsesmen />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/materi"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <MaterialList />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/sinkronisasi"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <SyncCenter />
                    </RoleGuard>
                  }
                />
                <Route
                  path="koordinator/pendampingan"
                  element={
                    <RoleGuard allowedRoles={['guru_koordinator', 'super_admin']}>
                      <TeacherGuide />
                    </RoleGuard>
                  }
                />

                {/* ========================================================= */}
                {/* RUANG D: GURU PELAKSANA */}
                {/* ========================================================= */}
                <Route
                  path="guru/beranda"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <RoleDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/kelas"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <GuruKelasSaya />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/asesmen"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <AssessmentList />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/analisis"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <GuruAnalisisHasil />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/rekomendasi"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <AdaptiveRecommendations />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/materi"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <MaterialList />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/perkembangan"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <CompetencyProgress />
                    </RoleGuard>
                  }
                />
                <Route
                  path="guru/pendampingan"
                  element={
                    <RoleGuard allowedRoles={['guru', 'guru_koordinator', 'super_admin']}>
                      <TeacherGuide />
                    </RoleGuard>
                  }
                />

                {/* ========================================================= */}
                {/* RUANG E: PESERTA DIDIK (MURID) */}
                {/* ========================================================= */}
                <Route
                  path="murid/beranda"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <RoleDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="murid/materi"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <AdaptiveRecommendations />
                    </RoleGuard>
                  }
                />
                <Route
                  path="murid/asesmen"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <AssessmentList />
                    </RoleGuard>
                  }
                />
                <Route
                  path="murid/latihan"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <PracticeSessionPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="murid/perkembangan"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <CompetencyProgress />
                    </RoleGuard>
                  }
                />
                <Route
                  path="murid/tersimpan"
                  element={
                    <RoleGuard allowedRoles={['siswa', 'super_admin']}>
                      <OfflineLibrary />
                    </RoleGuard>
                  }
                />

                {/* ========================================================= */}
                {/* SHARED DIRECT INTERACTIONS (Pengerjaan Asesmen & Detail) */}
                {/* ========================================================= */}
                <Route path="tuntas/materi/:id" element={<MaterialDetail />} />
                <Route path="tuntas/ujian/:id" element={<AssessmentExam />} />
                <Route path="tuntas/hasil/:id" element={<AssessmentResult />} />
                <Route path="tuntas/latihan/:competencyId" element={<PracticeSessionPage />} />
                <Route path="peta/sekolah/:id" element={<SchoolDetail />} />

                {/* BACKWARDS COMPATIBILITY REDIRECTS */}
                <Route path="peta/sekolah" element={<Navigate to="/dinas/peta-sekolah" replace />} />
                <Route path="peta/infrastruktur" element={<Navigate to="/dinas/prioritas" replace />} />
                <Route path="peta/capaian" element={<Navigate to="/dinas/evaluasi" replace />} />
                <Route path="tuntas/dashboard" element={<Navigate to="/guru/beranda" replace />} />
                <Route path="tuntas/materi" element={<Navigate to="/guru/materi" replace />} />
                <Route path="tuntas/bank-soal" element={<Navigate to="/guru/materi" replace />} />
                <Route path="tuntas/asesmen" element={<Navigate to="/guru/asesmen" replace />} />
                <Route path="tuntas/rekomendasi" element={<Navigate to="/guru/rekomendasi" replace />} />
                <Route path="tuntas/latihan" element={<Navigate to="/murid/latihan" replace />} />
                <Route path="tuntas/progress" element={<Navigate to="/guru/perkembangan" replace />} />
                <Route path="guru/dashboard" element={<Navigate to="/guru/beranda" replace />} />
                <Route path="guru/panduan" element={<Navigate to="/guru/pendampingan" replace />} />
                <Route path="guru/praktik-baik" element={<Navigate to="/guru/pendampingan" replace />} />
                <Route path="hub/dashboard" element={<Navigate to="/koordinator/sinkronisasi" replace />} />
                <Route path="hub/offline" element={<Navigate to="/murid/tersimpan" replace />} />
                <Route path="hub/sinkronisasi" element={<Navigate to="/koordinator/sinkronisasi" replace />} />
              </Route>

              {/* Universal Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </OfflineProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
