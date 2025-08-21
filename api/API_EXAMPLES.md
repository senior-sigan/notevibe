# Примеры использования API

## Аутентификация

### 1. Регистрация пользователя

```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Ответ:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Вход в систему

```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Ответ:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Работа с заметками

### 3. Создание заметки (требует аутентификации)

```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Моя первая заметка",
    "content": "Содержание заметки",
    "is_public": false
  }'
```

**Ответ:**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "Моя первая заметка",
    "content": "Содержание заметки",
    "is_public": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Получение заметок пользователя (требует аутентификации)

```bash
curl -X GET http://localhost:4000/api/notes/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Ответ:**
```json
{
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Моя первая заметка",
      "content": "Содержание заметки",
      "is_public": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Получение публичных заметок (не требует аутентификации)

```bash
curl -X GET http://localhost:4000/api/notes/public
```

**Ответ:**
```json
{
  "notes": [
    {
      "id": 2,
      "user_id": 1,
      "title": "Публичная заметка",
      "content": "Эта заметка видна всем",
      "is_public": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6. Обновление заметки (требует аутентификации)

```bash
curl -X PUT http://localhost:4000/api/notes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Обновленный заголовок",
    "content": "Обновленное содержание"
  }'
```

**Ответ:**
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "Обновленный заголовок",
    "content": "Обновленное содержание",
    "is_public": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Удаление заметки (требует аутентификации)

```bash
curl -X DELETE http://localhost:4000/api/notes/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Ответ:**
```json
{
  "message": "Note deleted successfully"
}
```

### 8. Поиск заметок (требует аутентификации)

```bash
curl -X GET http://localhost:4000/api/notes/search/заметка \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Ответ:**
```json
{
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Моя первая заметка",
      "content": "Содержание заметки",
      "is_public": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Обработка ошибок

### Ошибка аутентификации

```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Заметка без токена"}'
```

**Ответ:**
```json
{
  "error": "Authentication Error",
  "message": "Authorization header is required"
}
```

### Ошибка валидации

```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content": "Заметка без заголовка"}'
```

**Ответ:**
```json
{
  "error": "Validation Error",
  "message": "Title is required"
}
```

## JavaScript/Node.js примеры

### Использование с fetch

```javascript
// Регистрация
const registerResponse = await fetch('http://localhost:4000/api/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const { user } = await registerResponse.json();

// Вход
const loginResponse = await fetch('http://localhost:4000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const { token } = await loginResponse.json();

// Создание заметки
const createNoteResponse = await fetch('http://localhost:4000/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Моя заметка',
    content: 'Содержание',
    is_public: false
  })
});

const { note } = await createNoteResponse.json();
```

### Использование с axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Добавление токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Регистрация
const { data: { user } } = await api.post('/users/register', {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword123'
});

// Вход
const { data: { token } } = await api.post('/users/login', {
  email: 'john@example.com',
  password: 'securepassword123'
});

// Сохранение токена
localStorage.setItem('token', token);

// Создание заметки
const { data: { note } } = await api.post('/notes', {
  title: 'Моя заметка',
  content: 'Содержание',
  is_public: false
});
```
