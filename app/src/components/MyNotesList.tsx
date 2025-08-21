import { useQuery } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { NoteCard } from './NoteCard';
import { CreateNoteForm } from './CreateNoteForm';

export const MyNotesList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-notes'],
    queryFn: notesApi.getMyNotes,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-gray-600 font-medium">Загружаем ваши заметки...</div>
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
          <p className="text-gray-600">Не удалось загрузить ваши заметки. Попробуйте позже.</p>
        </div>
      </div>
    );
  }

  const notes = data?.notes || [];

  return (
    <div className="flex flex-col gap-6">
      <CreateNoteForm />
      
      {notes.length === 0 ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">У вас пока нет заметок</h3>
            <p className="text-gray-600">Создайте свою первую заметку!</p>
          </div>
        </div>
      ) : (
        notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))
      )}
    </div>
  );
};
