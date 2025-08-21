import { useAuth } from '../contexts/AuthContext';
import { MyNotesList } from './MyNotesList';

export const MyNotesPage: React.FC = () => {
  const { isAuthenticated, isLoading, openLoginModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-600">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🔐 Доступ ограничен
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Для просмотра ваших заметок необходимо войти в систему
          </p>
          <button
            onClick={openLoginModal}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Заголовок */}
      <header className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            ✨ Мои заметки ✨
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Здесь собраны все ваши личные заметки. Создавайте, редактируйте и делитесь своими мыслями!
          </p>
        </div>
      </header>

      {/* Список заметок */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <MyNotesList />
      </main>
    </div>
  );
};
