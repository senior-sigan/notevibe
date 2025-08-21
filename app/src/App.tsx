import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { NotesList } from './components/NotesList';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Тулбар */}
      <Sidebar 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Основной контент */}
      <div className="ml-64 relative z-10">
        {/* Заголовок */}
        <header className="text-center py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ✨ Заметки ✨
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Делитесь своими мыслями с миром! Здесь собраны все публичные заметки наших пользователей.
            </p>
          </div>
        </header>

        {/* Список заметок */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <NotesList />
        </main>
      </div>

      {/* Модальное окно входа */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
