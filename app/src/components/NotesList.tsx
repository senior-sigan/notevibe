import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { NoteCard } from './NoteCard';

export const NotesList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-notes'],
    queryFn: notesApi.getPublicNotes,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-gray-600 font-medium">Загружаем заметки...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">😿</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600">Не удалось загрузить заметки. Попробуйте позже.</p>
        </div>
      </div>
    );
  }

  if (!data?.notes || data.notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Пока нет заметок</h3>
          <p className="text-gray-600">Будьте первым, кто поделится своими мыслями!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};
