import React from 'react';
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RoleDashboard } from './pages/RoleDashboard';

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

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Memuat data JALIN BELAJAR...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Siswa Restriction Guard: Prevents Siswa from accessing teacher/admin dashboards
const RestrictedForSiswa: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  if (role === 'siswa') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
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

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<RoleDashboard />} />

                {/* MODUL A: JALIN-PETA (Admin/Guru/Dinas Only) */}
                <Route
                  path="peta/sekolah"
                  element={
                    <RestrictedForSiswa>
                      <SchoolList />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="peta/sekolah/:id"
                  element={
                    <RestrictedForSiswa>
                      <SchoolDetail />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="peta/infrastruktur"
                  element={
                    <RestrictedForSiswa>
                      <InfrastructureMap />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="peta/capaian"
                  element={
                    <RestrictedForSiswa>
                      <LiteracyNumeracyMap />
                    </RestrictedForSiswa>
                  }
                />

                {/* MODUL B: JALIN-TUNTAS */}
                <Route path="tuntas/dashboard" element={<TuntasDashboard />} />
                <Route path="tuntas/materi" element={<MaterialList />} />
                <Route path="tuntas/materi/:id" element={<MaterialDetail />} />
                <Route
                  path="tuntas/bank-soal"
                  element={
                    <RestrictedForSiswa>
                      <QuestionBank />
                    </RestrictedForSiswa>
                  }
                />
                <Route path="tuntas/asesmen" element={<AssessmentList />} />
                <Route path="tuntas/ujian/:id" element={<AssessmentExam />} />
                <Route path="tuntas/hasil/:id" element={<AssessmentResult />} />
                <Route path="tuntas/rekomendasi" element={<AdaptiveRecommendations />} />
                <Route path="tuntas/latihan" element={<PracticeSessionPage />} />
                <Route path="tuntas/latihan/:competencyId" element={<PracticeSessionPage />} />
                <Route path="tuntas/progress" element={<CompetencyProgress />} />

                {/* MODUL C: JALIN-GURU (Guru/Admin/Dinas Only) */}
                <Route
                  path="guru/dashboard"
                  element={
                    <RestrictedForSiswa>
                      <GuruDashboard />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="guru/panduan"
                  element={
                    <RestrictedForSiswa>
                      <TeacherGuide />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="guru/pendampingan"
                  element={
                    <RestrictedForSiswa>
                      <MentoringNotes />
                    </RestrictedForSiswa>
                  }
                />
                <Route
                  path="guru/praktik-baik"
                  element={
                    <RestrictedForSiswa>
                      <BestPracticesShare />
                    </RestrictedForSiswa>
                  }
                />

                {/* MODUL D: JALIN-HUB */}
                <Route path="hub/dashboard" element={<HubDashboard />} />
                <Route path="hub/offline" element={<OfflineLibrary />} />
                <Route
                  path="hub/sinkronisasi"
                  element={
                    <RestrictedForSiswa>
                      <SyncCenter />
                    </RestrictedForSiswa>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </OfflineProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

