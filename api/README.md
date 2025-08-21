# Notes API

Backend API для приложения заметок, построенный на Express 5 с TypeScript.

## Технологии

- Node.js 24+
- Express 5
- TypeScript
- PostgreSQL
- pg (PostgreSQL client)
- ESLint

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Разработка

```bash
npm run dev
```

### Сборка

```bash
npm run build
```

### Запуск в продакшене

```bash
npm start
```

### Линтинг

```bash
npm run lint
npm run lint:fix
```

## Структура проекта

```text
src/
├── index.ts              # Точка входа приложения
├── config/               # Конфигурация (база данных)
├── database/             # Миграции и схемы БД
├── repositories/         # Репозитории для работы с БД
├── routes/               # Маршруты API
├── types/                # TypeScript типы
├── middleware/           # Middleware функции
└── utils/                # Утилитарные функции
```

## API Endpoints

### Основные

- `GET /health` - Проверка здоровья сервера
- `GET /api` - Информация об API

### Аутентификация

- `POST /api/users/register` - Регистрация пользователя
- `POST /api/users/login` - Вход в систему (возвращает JWT токен)

### Пользователи

- `GET /api/users/:id` - Получить пользователя по ID
- `GET /api/users` - Получить всех пользователей
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Заметки

- `POST /api/notes` - Создать заметку (требует аутентификации)
- `GET /api/notes/my` - Получить заметки пользователя (требует аутентификации)
- `GET /api/notes/public` - Получить публичные заметки
- `GET /api/notes/:id` - Получить заметку по ID (требует аутентификации)
- `PUT /api/notes/:id` - Обновить заметку (требует аутентификации)
- `DELETE /api/notes/:id` - Удалить заметку (требует аутентификации)
- `GET /api/notes/search/:query` - Поиск заметок (требует аутентификации)

## Аутентификация

API использует JWT токены для аутентификации. Подробная документация доступна в [AUTHENTICATION.md](./AUTHENTICATION.md).

### Быстрый старт:

1. Зарегистрируйтесь: `POST /api/users/register`
2. Войдите в систему: `POST /api/users/login` (получите JWT токен)
3. Используйте токен в заголовке: `Authorization: Bearer <token>`

## Переменные окружения

Скопируйте `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```
