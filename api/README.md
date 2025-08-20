# Notes API

Backend API для приложения заметок, построенный на Express 5 с TypeScript.

## Технологии

- Node.js 24+
- Express
- TypeScript
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
├── index.ts          # Точка входа приложения
├── types/            # TypeScript типы
├── routes/           # Маршруты API
├── middleware/       # Middleware функции
└── utils/            # Утилитарные функции
```

## API Endpoints

- `GET /health` - Проверка здоровья сервера
- `GET /api` - Информация об API

## Переменные окружения

Скопируйте `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```
