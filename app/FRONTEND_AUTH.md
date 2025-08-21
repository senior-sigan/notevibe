# Аутентификация во фронтенде

## Обзор

Фронтенд приложение использует JWT токены для аутентификации пользователей. Все API запросы автоматически включают токен в заголовок `Authorization`.

## Архитектура

### 1. API Клиент (`src/api/auth.ts`)

Основной модуль для работы с аутентификацией:

```typescript
// Функции для работы с токенами
export const saveToken = (token: string): void
export const getToken = (): string | null
export const removeToken = (): void
export const isTokenValid = (token: string): boolean

// API клиент
export const authApiClient = {
  register: async (data: RegisterRequest): Promise<AuthResponse>
  login: async (data: LoginRequest): Promise<AuthResponse>
  validateToken: async (): Promise<User>
}
```

### 2. Контекст аутентификации (`src/contexts/AuthContext.tsx`)

React Context для управления состоянием аутентификации:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}
```

### 3. API Интерцепторы (`src/api/notes.ts`)

Автоматическое добавление токена к запросам:

```typescript
// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок аутентификации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек - очищаем данные и редиректим
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

## Поток аутентификации

### 1. Регистрация

```typescript
import { authApiClient } from '../api/auth';

const handleRegister = async (userData) => {
  try {
    const response = await authApiClient.register({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123'
    });
    
    // Сохраняем пользователя и токен
    login(response.user, response.token);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
};
```

### 2. Вход в систему

```typescript
const handleLogin = async (credentials) => {
  try {
    const response = await authApiClient.login({
      email: 'john@example.com',
      password: 'password123'
    });
    
    // Сохраняем пользователя и токен
    login(response.user, response.token);
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

### 3. Автоматическая проверка токена

При загрузке приложения автоматически проверяется валидность сохраненного токена:

```typescript
useEffect(() => {
  const initializeAuth = () => {
    const token = getToken();
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser && isTokenValid(token)) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } else {
      // Очищаем недействительные данные
      removeToken();
      localStorage.removeItem('user');
    }
    
    setIsLoading(false);
  };

  initializeAuth();
}, []);
```

## Компоненты

### LoginModal

Модальное окно для входа и регистрации:

```typescript
<LoginModal
  isOpen={isLoginModalOpen}
  onClose={() => setIsLoginModalOpen(false)}
/>
```

### Header

Заголовок с информацией о пользователе:

```typescript
// Показывает имя пользователя и кнопку выхода
{isAuthenticated ? (
  <>
    <span>Привет, {user?.username}!</span>
    <button onClick={handleLogout}>Выйти</button>
  </>
) : (
  <button onClick={() => setIsLoginModalOpen(true)}>Войти</button>
)}
```

### Защищенные компоненты

Компоненты, которые требуют аутентификации:

```typescript
// CreateNoteForm
if (!isAuthenticated) {
  return (
    <div className="auth-required">
      <h3>🔐 Войдите в систему</h3>
      <p>Чтобы создавать заметки, необходимо войти в систему</p>
      <button onClick={() => window.location.href = '/'}>Войти</button>
    </div>
  );
}

// MyNotesPage
if (!isAuthenticated) {
  return (
    <div className="auth-required">
      <h1>🔐 Доступ ограничен</h1>
      <p>Для просмотра ваших заметок необходимо войти в систему</p>
      <button onClick={() => window.location.href = '/'}>Войти в систему</button>
    </div>
  );
}
```

## Хранение данных

### localStorage

- `token` - JWT токен пользователя
- `user` - Данные пользователя (JSON строка)

### Автоматическая очистка

Данные автоматически очищаются при:
- Выходе из системы
- Истечении токена
- Получении ошибки 401 от API

## Безопасность

### Валидация токена

```typescript
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};
```

### Обработка ошибок

- Автоматический редирект при истечении токена
- Очистка данных при ошибках аутентификации
- Показ понятных сообщений об ошибках

## Тестирование

### HTML тест

Файл `test-frontend-auth.html` содержит интерактивный тест для проверки:

- Регистрации пользователя
- Входа в систему
- Создания заметок с токеном
- Получения заметок пользователя
- Получения публичных заметок

### Использование

1. Откройте `test-frontend-auth.html` в браузере
2. Убедитесь, что API сервер запущен на `http://localhost:4000`
3. Протестируйте все функции аутентификации

## Переменные окружения

```env
# URL API сервера
VITE_API_URL=http://localhost:4000/api
```

## Примеры использования

### Полный цикл аутентификации

```typescript
import { useAuth } from '../contexts/AuthContext';
import { authApiClient } from '../api/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await authApiClient.login({
        email: 'user@example.com',
        password: 'password'
      });
      
      login(response.user, response.token);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Привет, {user?.username}!</p>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Войти</button>
      )}
    </div>
  );
}
```

### Защищенный API запрос

```typescript
import { notesApi } from '../api/notes';

// Токен автоматически добавляется к запросу
const createNote = async () => {
  try {
    const response = await notesApi.createNote({
      title: 'Моя заметка',
      content: 'Содержание',
      is_public: false
    });
    
    console.log('Заметка создана:', response.note);
  } catch (error) {
    if (error.response?.status === 401) {
      // Пользователь не аутентифицирован
      console.log('Необходимо войти в систему');
    }
  }
};
```
