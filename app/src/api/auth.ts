import axios from 'axios';
import { API_CONFIG } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Создаем axios инстанс для аутентификации
const authApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для сохранения токена
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Функция для получения токена
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Функция для удаления токена
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Функция для проверки валидности токена
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Простая проверка - можно расширить для проверки срока действия
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const authApiClient = {
  // Регистрация пользователя
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authApi.post(API_CONFIG.endpoints.register, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Ошибка регистрации');
      }
      throw new Error('Ошибка сети');
    }
  },

  // Вход в систему
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authApi.post(API_CONFIG.endpoints.login, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Ошибка входа');
      }
      throw new Error('Ошибка сети');
    }
  },

  // Проверка токена (опционально, для валидации на клиенте)
  validateToken: async (): Promise<User> => {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
      throw new Error('Недействительный токен');
    }

    // Здесь можно добавить запрос к API для валидации токена
    // Пока просто декодируем токен
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } catch {
      throw new Error('Недействительный токен');
    }
  },
};
