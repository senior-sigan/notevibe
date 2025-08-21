# Аутентификация API

## Обзор

API использует JWT (JSON Web Tokens) для аутентификации пользователей. Все защищенные эндпоинты требуют валидный JWT токен в заголовке `Authorization`.

## Регистрация пользователя

### POST /api/users/register

Регистрирует нового пользователя в системе.

**Запрос:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
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

## Вход в систему

### POST /api/users/login

Аутентифицирует пользователя и возвращает JWT токен.

**Запрос:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
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

## Использование JWT токена

После получения токена, включите его в заголовок `Authorization` для всех защищенных запросов:

```
Authorization: Bearer <your-jwt-token>
```

### Пример с curl:

```bash
# Создание заметки с аутентификацией
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "My Note",
    "content": "Note content",
    "is_public": false
  }'

# Получение заметок пользователя
curl -X GET http://localhost:4000/api/notes/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Защищенные эндпоинты

Следующие эндпоинты требуют аутентификации:

- `POST /api/notes` - Создание заметки
- `GET /api/notes/my` - Получение заметок пользователя
- `GET /api/notes/:id` - Получение конкретной заметки
- `PUT /api/notes/:id` - Обновление заметки
- `DELETE /api/notes/:id` - Удаление заметки
- `GET /api/notes/search/:query` - Поиск заметок

## Публичные эндпоинты

Следующие эндпоинты не требуют аутентификации:

- `GET /api/notes/public` - Получение публичных заметок
- `POST /api/users/register` - Регистрация пользователя
- `POST /api/users/login` - Вход в систему

## Обработка ошибок аутентификации

При отсутствии или невалидности токена API возвращает:

```json
{
  "error": "Authentication Error",
  "message": "Authorization header is required"
}
```

или

```json
{
  "error": "Authentication Error", 
  "message": "Invalid or expired authentication token"
}
```

## Конфигурация JWT

JWT токены настраиваются через переменные окружения:

- `JWT_SECRET` - Секретный ключ для подписи токенов
- `JWT_EXPIRES_IN` - Время жизни токена (по умолчанию: 24h)

## Безопасность

- Все пароли хешируются с использованием bcrypt
- JWT токены имеют ограниченное время жизни
- Используется HTTPS в продакшене
- Реализована защита от CSRF атак
