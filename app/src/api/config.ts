// Конфигурация API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  endpoints: {
    // Users endpoints
    login: '/users/login',
    register: '/users/register',
    
    // Notes endpoints
    publicNotes: '/notes/public',
    myNotes: '/notes/my',
    noteById: (id: number) => `/notes/${id}`,
    createNote: '/notes',
    updateNote: (id: number) => `/notes/${id}`,
    deleteNote: (id: number) => `/notes/${id}`,
  },
} as const;

// Функция для создания полного URL
export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Функция для создания URL с параметрами
export const createApiUrlWithParams = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(`${API_CONFIG.baseURL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};
