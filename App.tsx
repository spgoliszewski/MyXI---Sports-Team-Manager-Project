import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { getManager } from '@/lib/storage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PlayersPage from '@/pages/PlayersPage';
import PlayerProfilePage from '@/pages/PlayerProfilePage';
import CalendarPage from '@/pages/CalendarPage';
import TeamSettingsPage from '@/pages/TeamSettingsPage';
import TopScorersPage from '@/pages/TopScorersPage';
import TopAssistersPage from '@/pages/TopAssistersPage';
import MostMinutesPage from '@/pages/MostMinutesPage';
import LeastMinutesPage from '@/pages/LeastMinutesPage';
import DocumentationPage from '@/pages/DocumentationPage';
import DocumentationOverviewPage from '@/pages/DocumentationOverviewPage';
import DocumentationFeaturesPage from '@/pages/DocumentationFeaturesPage';
import DocumentationUsagePage from '@/pages/DocumentationUsagePage';
import DocumentationStoragePage from '@/pages/DocumentationStoragePage';
import DocumentationFuturePage from '@/pages/DocumentationFuturePage';
import DocumentationFaqPage from '@/pages/DocumentationFaqPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const manager = getManager();
  return manager ? <>{children}</> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/players" element={<ProtectedRoute><PlayersPage /></ProtectedRoute>} />
        <Route path="/player/:playerId" element={<ProtectedRoute><PlayerProfilePage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/team-settings" element={<ProtectedRoute><TeamSettingsPage /></ProtectedRoute>} />
        <Route path="/top-scorers" element={<ProtectedRoute><TopScorersPage /></ProtectedRoute>} />
        <Route path="/top-assisters" element={<ProtectedRoute><TopAssistersPage /></ProtectedRoute>} />
        <Route path="/most-minutes" element={<ProtectedRoute><MostMinutesPage /></ProtectedRoute>} />
        <Route path="/least-minutes" element={<ProtectedRoute><LeastMinutesPage /></ProtectedRoute>} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/documentation/overview" element={<DocumentationOverviewPage />} />
        <Route path="/documentation/features" element={<DocumentationFeaturesPage />} />
        <Route path="/documentation/usage" element={<DocumentationUsagePage />} />
        <Route path="/documentation/storage" element={<DocumentationStoragePage />} />
        <Route path="/documentation/future" element={<DocumentationFuturePage />} />
        <Route path="/documentation/faq" element={<DocumentationFaqPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
