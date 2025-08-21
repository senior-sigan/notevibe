import axios from 'axios';
import { API_CONFIG } from './config';
import { getToken } from './auth';
import type { NoteResponse, NotesResponse } from '../types/note';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для автоматического добавления токена
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем интерцептор для обработки ошибок аутентификации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Можно добавить редирект на страницу входа
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Моковые данные для демонстрации
const mockNotes = [
  {
    id: 1,
    user_id: 1,
    title: "Моя первая заметка ✨",
    content: "Это моя первая публичная заметка! Надеюсь, она понравится всем читателям. 🌸 Здесь я делюсь своими мыслями о прекрасном мире аниме и программирования.",
    is_public: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    user_id: 2,
    title: "Рецепт идеального дня 🌟",
    content: "Утро начинается с чашечки горячего чая и просмотра любимого аниме. Затем немного кодинга, прогулка в парке, и вечером встреча с друзьями!",
    is_public: true,
    created_at: "2024-01-14T15:45:00Z",
    updated_at: "2024-01-14T15:45:00Z"
  },
  {
    id: 3,
    user_id: 3,
    title: "Мысли о React и TypeScript 💻",
    content: "Сегодня изучал новые возможности React 19 и TypeScript. Потрясающе, как эти технологии развиваются! Особенно понравились новые хуки и улучшенная типизация.",
    is_public: true,
    created_at: "2024-01-13T09:20:00Z",
    updated_at: "2024-01-13T09:20:00Z"
  },
  {
    id: 4,
    user_id: 4,
    title: "Любимые аниме сезона 🎌",
    content: "В этом сезоне особенно понравились 'One Piece', 'Demon Slayer' и 'Jujutsu Kaisen'. Анимация становится все более впечатляющей с каждым годом!",
    is_public: true,
    created_at: "2024-01-12T18:15:00Z",
    updated_at: "2024-01-12T18:15:00Z"
  },
  {
    id: 5,
    user_id: 5,
    title: "Прогулка по городу 🌆",
    content: "Сегодня гулял по вечернему городу. Огни, звуки, атмосфера - все создает неповторимое настроение. Иногда нужно просто остановиться и насладиться моментом.",
    is_public: true,
    created_at: "2024-01-11T20:30:00Z",
    updated_at: "2024-01-11T20:30:00Z"
  },
  {
    id: 6,
    user_id: 6,
    title: "Новый проект на горизонте 🚀",
    content: "Начинаю работу над новым проектом! Это будет что-то особенное - веб-приложение в анимешном стиле с современными технологиями. Очень вдохновлен!",
    is_public: true,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-10T14:00:00Z"
  },
  // Дополнительные заметки для пользователя с ID 1
  {
    id: 7,
    user_id: 1,
    title: "Мои личные мысли 💭",
    content: "Это моя приватная заметка с личными размышлениями. Здесь я записываю то, что важно только для меня.",
    is_public: false,
    created_at: "2024-01-09T16:20:00Z",
    updated_at: "2024-01-09T16:20:00Z"
  },
  {
    id: 8,
    user_id: 1,
    title: "Планы на выходные 🎯",
    content: "В эти выходные планирую: 1) Посмотреть новое аниме, 2) Поработать над проектом, 3) Встретиться с друзьями, 4) Отдохнуть и расслабиться.",
    is_public: false,
    created_at: "2024-01-08T12:15:00Z",
    updated_at: "2024-01-08T12:15:00Z"
  },
  {
    id: 9,
    user_id: 1,
    title: "Изучение новых технологий 📚",
    content: "Сегодня изучал TanStack Router и React Query. Очень впечатлен тем, как эти библиотеки упрощают разработку! Особенно понравилась простота настройки роутинга.",
    is_public: true,
    created_at: "2024-01-07T14:30:00Z",
    updated_at: "2024-01-07T14:30:00Z"
  }
];

export const notesApi = {
  getPublicNotes: async (): Promise<NotesResponse> => {
    try {
      const response = await api.get('/notes/public');
      return response.data;
    } catch (error) {
      // Возвращаем моковые данные если API недоступен
      console.log('API недоступен, используем моковые данные');
      return { notes: mockNotes };
    }
  },

  getMyNotes: async (): Promise<NotesResponse> => {
    try {
      const response = await api.get('/notes/my');
      return response.data;
    } catch (error) {
      // Возвращаем заметки только для пользователя с ID 1 (текущий пользователь)
      const userNotes = mockNotes.filter(note => note.user_id === 1);
      return { notes: userNotes };
    }
  },

  getNoteById: async (id: number): Promise<NoteResponse> => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      const note = mockNotes.find(n => n.id === id);
      if (!note) throw new Error('Note not found');
      return { note };
    }
  },

  createNote: async (data: { title: string; content?: string; is_public?: boolean }) => {
    try {
      const response = await api.post('/notes', data);
      return response.data;
    } catch (error) {
      throw new Error('API недоступен');
    }
  },

  updateNote: async (id: number, data: { title?: string; content?: string; is_public?: boolean }) => {
    try {
      const response = await api.put(`/notes/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('API недоступен');
    }
  },

  deleteNote: async (id: number) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('API недоступен');
    }
  },
};
