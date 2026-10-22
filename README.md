## 🚀 Запуск

### Вариант 1: Docker (рекомендуется)

**Требования:** Docker Desktop (или Docker Engine + Compose v2).

```bash
# Собрать и запустить оба сервиса (backend + frontend)
docker compose up --build

# Запустить в фоне
docker compose up --build -d

# Остановить и удалить контейнеры
docker compose down

# Остановить + удалить контейнеры и volume'ы
docker compose down -v
```

**После запуска:**

| Сервис               | URL                                 |
| -------------------- | ----------------------------------- |
| Frontend             | http://localhost:3000               |
| Backend (Swagger UI) | http://localhost:8000/docs          |
| Backend (ReDoc)      | http://localhost:8000/redoc         |
| Health-check         | http://localhost:8000/api/v1/health |

**Проверка, что всё поднялось:**

```bash
docker compose ps
curl http://localhost:8000/api/v1/health
# {"status":"ok"}
```

**Остановка:**

```bash
docker compose down
```

---

### Вариант 2: Локально, без Docker

**Требования:**

- Python **3.13** (или 3.14 с `pydantic>=2.12` и `email-validator`)
- Node.js **20+**
- npm 10+

#### 2.1. Backend (FastAPI)

```powershell
# Из корня проекта
cd backend

# Создать и активировать виртуальное окружение
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Установить зависимости
pip install -r requirements.txt

# (Опционально) прогнать тесты — должно быть 13 passed
pytest -v

# Запустить сервер с авто-перезагрузкой
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Для **bash / Git Bash / WSL**:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest -v
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Проверка:

```powershell
curl http://localhost:8000/api/v1/health
# {"status":"ok"}
```

Swagger: http://localhost:8000/docs

#### 2.2. Frontend (Next.js)

**В отдельном терминале** (бэкенд должен уже работать на `:8000`):

```powershell
cd frontend

# Скопировать env-файл
Copy-Item .env.local.example .env.local
# (или вручную создать .env.local с содержимым:
#  NEXT_PUBLIC_API_URL=http://localhost:8000)

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Для **bash / Git Bash / WSL**:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Открыть: http://localhost:3000

#### 2.3. Production-сборка фронтенда (локально)

```powershell
cd frontend
npm run build
npm run start
```

Открыть: http://localhost:3000

---

### Порты (по умолчанию)

| Сервис   | Порт   | Переменная окружения      |
| -------- | ------ | ------------------------- |
| Backend  | `8000` | `UVICORN_PORT` / `--port` |
| Frontend | `3000` | `PORT` (для `next start`) |

Чтобы поменять, например, порт бэкенда на `8080`:

```powershell
uvicorn app.main:app --reload --port 8080
```

И обновить `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> ⚠️ В Docker `NEXT_PUBLIC_API_URL` вшивается в бандл **на этапе `next build`**, поэтому при смене URL нужен `docker compose build --no-cache frontend`. Локально (`npm run dev`) env подхватывается на лету.

---

### Полный чек-лист «всё работает»

1. `docker compose up --build` (или локально: backend + `npm run dev`)
2. http://localhost:8000/docs открывается, виден Swagger.
3. http://localhost:3000 открывается, форма рендерится.
4. Ввести email `user@example.com`, добавить участников: Иван (30) + Миша (8).
5. Сайдбар показывает **2250 ₽**, кнопка «Оформить» активна.
6. Нажать «Оформить» → редирект на `/success?order=…&total=2250&email=…`.
7. Вернуться назад, ввести email `not-an-email` → поле краснеет.
8. Добавить только ребёнка (10) → красный блок «Ребёнок не может быть без сопровождающего взрослого».
9. (Опционально) Заполнить зал: 100 запросов к `/order` → следующий вернёт **409 SOLD_OUT** и красный баннер с кодом.
