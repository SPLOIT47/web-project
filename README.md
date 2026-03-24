# Web frontend

## Docker

Сборка и запуск статики (nginx, порт по умолчанию **5173**):

```bash
docker compose up --build
```

Откройте `http://localhost:5173`. `VITE_*` подставляются **на этапе сборки** — API должен быть доступен из **вашего браузера** по тому же URL, что в переменных.

Переменные (файл `.env` рядом с `docker-compose.yml` или экспорт в shell):

| Переменная | По умолчанию | Описание |
|------------|----------------|----------|
| `VITE_API_BASE_URL` | `http://localhost:4000` | Gateway (без слеша в конце) |
| `VITE_USE_MOCK_BACKEND` | `false` | `true` — mock вместо реального API |
| `WEB_PORT` | `5173` | Порт хоста для контейнера |

Пример с другим портом и URL:

```bash
WEB_PORT=8080 VITE_API_BASE_URL=http://192.168.1.10:4000 docker compose up --build
```

Сначала поднимите бэкенд (Gateway на `4000`), затем фронт — иначе сборка пройдёт, но запросы с браузера не достигнут API.

## Backend integration (Gateway)

1. Запустите Gateway и сервисы из `web-backend` (см. `docker/docker-compose.full.yml` или локально).
2. Скопируйте `.env.example` в `.env` и задайте:
   - `VITE_API_BASE_URL` — URL Gateway, например `http://localhost:4000`
   - `VITE_USE_MOCK_BACKEND=false`
3. `npm run dev` — UI ходит в Gateway по `/api/...` с `Authorization: Bearer <token>` и `credentials: include` (refresh cookie).
4. На Gateway и AuthService задайте одинаковый **`GATEWAY_SECRET`** — тогда в ответах `/api/profiles/*` (batch, search, по id, me) BFF подмешивает поле **`login`** из Auth, и на UI не нужны placeholder-ники для чужих пользователей.

**Messenger / чат** по-прежнему не подключён к бэку: используется `MockChatService` в обоих режимах.

## Локальная разработка без бэка

В `.env` установите `VITE_USE_MOCK_BACKEND=true` — включится прежний in-memory mock + сид БД.
