import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes';

export const CreateNoteForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Создать новую заметку</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Заголовок *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок заметки..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Содержание
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Введите содержание заметки..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Публичная заметка
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Создаем...' : 'Создать заметку'}
          </button>
        </div>
      </form>
    </div>
  );
};
