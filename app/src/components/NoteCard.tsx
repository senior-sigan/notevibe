import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 shadow-anime hover:shadow-anime-hover transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink-200 hover:border-purple-300">
      {/* Заголовок */}
      <h3 className="text-xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        {note.title}
      </h3>
      
      {/* Контент */}
      {note.content && (
        <div className="text-gray-700 mb-4 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {note.content}
        </div>
      )}
      
      {/* Метаданные */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${note.is_public ? 'bg-green-400' : 'bg-blue-400'}`}></span>
          {note.is_public ? 'Публичная заметка' : 'Приватная заметка'}
        </span>
        <span className="text-xs">
          {formatDate(note.created_at)}
        </span>
      </div>
      
      {/* Декоративная рамка при наведении */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-300 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};
