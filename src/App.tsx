import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Workspace } from './components/workspace/Workspace';
import { RoadmapView } from './components/roadmaps/RoadmapView';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/ui/AnimatedPage';
import { useIsMobile } from './hooks/useIsMobile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// Wrapper to extract params for Workspace if it expects a prop
const WorkspaceWrapper = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  if (!productId) return <Navigate to="/" />;
  return <Workspace productId={productId} onBack={() => navigate('/')} />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Only show global header on desktop
  // On mobile, Dashboard has its own header inside AnimatedPage, and Workspace has its own header
  const showHeader = !isMobile && isAuthenticated;

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/auth" element={
            isAuthenticated ? <Navigate to="/" replace /> : (
              <AnimatedPage key="auth-page">
                <AuthPage />
              </AnimatedPage>
            )
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <AnimatedPage key="dashboard">
                {isMobile && <Header />}
                <Dashboard onSelectProduct={(id) => navigate(`/workspace/${id}`)} />
              </AnimatedPage>
            </ProtectedRoute>
          } />

          <Route path="/workspace/:productId" element={
            <ProtectedRoute>
              <AnimatedPage key="workspace">
                <WorkspaceWrapper />
              </AnimatedPage>
            </ProtectedRoute>
          } />

          <Route path="/roadmap/:roadmapId" element={
            <ProtectedRoute>
              <AnimatedPage key="roadmap">
                <RoadmapView />
              </AnimatedPage>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
