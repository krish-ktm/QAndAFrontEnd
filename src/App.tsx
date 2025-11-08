import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Workspace } from './components/workspace/Workspace';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/ui/AnimatedPage';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <AnimatedPage key="auth-page">
          <AuthPage />
        </AnimatedPage>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AnimatePresence mode="wait">
        {selectedProductId ? (
          <AnimatedPage key={`workspace-${selectedProductId}`}>
            <Workspace productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
          </AnimatedPage>
        ) : (
          <AnimatedPage key="dashboard">
            <Dashboard onSelectProduct={setSelectedProductId} />
          </AnimatedPage>
        )}
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
