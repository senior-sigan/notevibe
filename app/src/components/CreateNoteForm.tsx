import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { useAuth } from '../contexts/AuthContext';

export const CreateNoteForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const createNoteMutation = useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      // Очищаем форму
      setTitle('');
      setContent('');
      setIsPublic(true);
      // Обновляем кеш заметок
      queryClient.invalidateQueries({ queryKey: ['public-notes'] });
      queryClient.invalidateQueries({ queryKey: ['my-notes'] });
    },
    onError: (error) => {
      console.error('Ошибка создания заметки:', error);
      alert('Не удалось создать заметку. Попробуйте еще раз.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Пожалуйста, введите заголовок заметки');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createNoteMutation.mutateAsync({
        title: title.trim(),
        content: content.trim() || undefined,
        is_public: isPublic,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 shadow-anime border-2 border-pink-200 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            🔐 Войдите в систему
          </h3>
          <p className="text-gray-600 mb-4">
            Чтобы создавать заметки, необходимо войти в систему
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-md hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 shadow-anime hover:shadow-anime-hover transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink-200 hover:border-purple-300 mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок заметки..."
          className="w-full px-3 py-2 text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent placeholder-gray-400 focus:outline-none"
          required
          disabled={isSubmitting}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Содержание заметки..."
          rows={3}
          className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-pink-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-500">
              Публичная заметка
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm rounded-md hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? 'Создаем...' : 'Создать'}
          </button>
        </div>
      </form>
      
      {/* Декоративная рамка при наведении */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-300 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};
