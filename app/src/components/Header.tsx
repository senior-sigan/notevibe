import { Link } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

export default function Header() {
  const { user, isAuthenticated, logout, isLoading, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <header className="p-2 flex gap-2 bg-white text-black justify-between">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link to="/">Home</Link>
          </div>
        </nav>
        <div className="px-2 text-gray-500">
          Загрузка...
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="p-2 flex gap-2 bg-white text-black justify-between">
        <nav className="flex flex-row">
          <div className="px-2 font-bold">
            <Link to="/">Home</Link>
          </div>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                Привет, {user?.username}!
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-3 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
            >
              Войти
            </button>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  );
}
