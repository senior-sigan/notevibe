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

### Пользователи

- `POST /api/users/register` - Регистрация пользователя
- `GET /api/users/:id` - Получить пользователя по ID
- `GET /api/users` - Получить всех пользователей
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

### Заметки

- `POST /api/notes` - Создать заметку
- `GET /api/notes/my` - Получить заметки пользователя
- `GET /api/notes/public` - Получить публичные заметки
- `GET /api/notes/:id` - Получить заметку по ID
- `PUT /api/notes/:id` - Обновить заметку
- `DELETE /api/notes/:id` - Удалить заметку
- `GET /api/notes/search/:query` - Поиск заметок

## Переменные окружения

Скопируйте `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```
