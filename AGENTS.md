# Ажлын хуваарилалт, гүйцэтгэл шалгах систем — Техникийн зураглал

## 1. Системийн зорилго

Алба/хэлтэс тус бүрт ажил (даалгавар) хуваарилаж, ажилтан гүйцэтгээд "дууссан" гэж тэмдэглэх, харин эцсийн баталгаажуулалтыг admin/менежер хийдэг workflow-той дотоод веб систем.

**Гол ойлголтууд:**
- **Алба/Хэлтэс (Department)** — систем, сүлжээ, программ хангамж гэх мэт байгууллагын нэгжүүд
- **Ажилтан (Employee)** — тодорхой нэг албанд харьяалагдаж, ажил хүлээн авдаг хэрэглэгч
- **Admin/Менежер** — ажил үүсгэдэг, хуваарилдаг, гүйцэтгэлийг батлагддаг (approve/reject)
- **Ажил (Task)** — гарчиг, тайлбар, хугацаа, эрэмбэ, статустай нэгж

## 2. Хэрэглэгчийн дүрүүд (Roles)

| Дүр | Эрх |
|---|---|
| **Super Admin** | Бүх алба, бүх ажлыг харах, удирдах, хэрэглэгч/алба нэмэх/устгах |
| **Department Manager** | Зөвхөн өөрийн албаны ажлуудыг үүсгэх, хуваарилах, approve/reject хийх |
| **Employee** | Зөвхөн өөрт оноогдсон ажлуудыг харах, "дуусгасан" гэж тэмдэглэх |

## 3. Статусын урсгал (Task Status Workflow)

```
TODO (Хийгдээгүй)
  → IN_PROGRESS (Хийгдэж байгаа)
    → SUBMITTED (Ажилтан дуусгасан, шалгуулахаар илгээсэн)
      → APPROVED (Батлагдсан) ✅  [эцсийн төлөв]
      → REJECTED (Буцаагдсан, шалтгаантай) ↩️ → буцаад IN_PROGRESS руу орно
```

**Дүрэм:**
- Employee зөвхөн `TODO → IN_PROGRESS → SUBMITTED` хүртэл шилжүүлж чадна
- `SUBMITTED` төлөвт орсны дараа Employee засварлах эрхгүй болно (admin reject хийх хүртэл)
- Зөвхөн Manager/Admin `SUBMITTED → APPROVED` эсвэл `SUBMITTED → REJECTED` хийж чадна
- `REJECTED` үед заавал шалтгаан (`rejection_reason`) бичих ёстой
- Хугацаа хэтэрсэн боловч `TODO`/`IN_PROGRESS` төлөвтэй ажлыг `OVERDUE` гэж тусад нь тэмдэглэдэг (backend-д тооцоолсон талбар, DB статус биш)

## 4. Өгөгдлийн сангийн загвар (PostgreSQL)

```sql
-- Алба/хэлтэс
CREATE TABLE departments (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,        -- "Систем хэлтэс", "Сүлжээний алба"...
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Хэрэглэгч
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  full_name       VARCHAR(150) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20) NOT NULL CHECK (role IN ('super_admin','manager','employee')),
  department_id   INTEGER REFERENCES departments(id),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Ажил/даалгавар
CREATE TABLE tasks (
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(200) NOT NULL,
  description        TEXT,
  department_id      INTEGER NOT NULL REFERENCES departments(id),
  assignee_id        INTEGER REFERENCES users(id),      -- хариуцах ажилтан
  created_by_id      INTEGER NOT NULL REFERENCES users(id),
  priority           VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('urgent','normal','low')),
  status             VARCHAR(20) DEFAULT 'todo' CHECK (
                        status IN ('todo','in_progress','submitted','approved','rejected')
                      ),
  due_date           DATE,
  submitted_at       TIMESTAMPTZ,           -- ажилтан "дуусгасан" гэж дарсан цаг
  reviewed_at        TIMESTAMPTZ,           -- admin шалгасан цаг
  reviewed_by_id     INTEGER REFERENCES users(id),
  rejection_reason   TEXT,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

-- Ажлын түүх/audit log (статус солигдох бүрд бичигдэнэ)
CREATE TABLE task_status_history (
  id            SERIAL PRIMARY KEY,
  task_id       INTEGER NOT NULL REFERENCES tasks(id),
  from_status   VARCHAR(20),
  to_status     VARCHAR(20) NOT NULL,
  changed_by_id INTEGER NOT NULL REFERENCES users(id),
  comment       TEXT,
  changed_at    TIMESTAMPTZ DEFAULT now()
);

-- Ажилд бичсэн тайлбар/comment (сонголтоор)
CREATE TABLE task_comments (
  id          SERIAL PRIMARY KEY,
  task_id     INTEGER NOT NULL REFERENCES tasks(id),
  user_id     INTEGER NOT NULL REFERENCES users(id),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

## 5. API дизайн (REST, Node.js/TypeScript + Express/Fastify таамаглаж)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Departments
- `GET /api/departments` — жагсаалт (admin бүгдийг, manager зөвхөн өөрийнхөө)
- `POST /api/departments` — шинээр үүсгэх (super_admin)
- `PUT /api/departments/:id`

### Tasks
- `GET /api/tasks?department_id=&status=&from=&to=&assignee_id=` — шүүлтүүртэй жагсаалт (7/14 хоног/сар = `from`/`to` параметрээр)
- `POST /api/tasks` — шинэ ажил үүсгэх (manager/admin)
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id` — засах (зөвхөн эзэмшигч/эрхтэй хүн)
- `POST /api/tasks/:id/submit` — Employee: `SUBMITTED` рүү шилжүүлэх
- `POST /api/tasks/:id/approve` — Manager/Admin: `APPROVED` рүү шилжүүлэх
- `POST /api/tasks/:id/reject` — Manager/Admin: body-д `reason` заавал, `REJECTED` рүү шилжүүлэх
- `GET /api/tasks/:id/history` — статусын түүх
- `POST /api/tasks/:id/comments`

### Dashboard / Тайлан
- `GET /api/dashboard/summary?department_id=&period=week|biweekly|month` — тухайн хугацаанд хэдэн ажил todo/in_progress/submitted/approved/overdue байгаа тоо
- `GET /api/dashboard/export?department_id=&period=` — Excel/PDF экспорт (сонголтоор)

## 6. UI хуудсууд

### Ажилтны талд
1. **Нэвтрэх хуудас**
2. **"Миний ажлууд"** — assignee = өөрөө; статусаар шүүх боломжтой; "Дуусгасан" товч дарахад `submit` дуудагдана

### Manager/Admin талд
1. **Dashboard** — алба сонгох dropdown + хугацааны сонголт (7 хоног/14 хоног/сар/custom), доор статусаар бүлэглэсэн тоо + жагсаалт
2. **Ажил үүсгэх/засах форм** — гарчиг, тайлбар, алба, ажилтан, хугацаа, эрэмбэ
3. **Шалгах хуудас (Review queue)** — `SUBMITTED` төлөвтэй бүх ажлын жагсаалт, Approve/Reject товч, reject үед шалтгаан бичих modal
4. **Алба/хэрэглэгч удирдах** (super_admin)

### Статусын өнгөний код (санал)
- Саарал = TODO
- Цэнхэр = IN_PROGRESS
- Шар = SUBMITTED (хүлээгдэж байгаа)
- Ногоон = APPROVED
- Улаан = REJECTED / OVERDUE

## 7. Санал болгож буй технологийн stack (танай одоогийн стектэй нийцүүлсэн)

- **Backend:** Node.js + TypeScript + Express (эсвэл NestJS, хэрэв ERP-connect NestJS ашигладаг бол тэрийг мөрдөх)
- **DB:** PostgreSQL (дээрх schema)
- **ORM:** Prisma эсвэл TypeORM
- **Frontend:** React + TypeScript (эсвэл ERP-connect-тай ижил frontend stack)
- **Auth:** JWT эсвэл session-based (одоогийн ERP/bank_api дээр ашигладаг арга барилтай ижилхэн байвал өөр систем сурах шаардлагагүй)
- **Notification (сонголтоор):** cron job + email/Telegram bot — хугацаа ойртсон/хэтэрсэн ажлын сануулга

## 8. Кодын архитектур, файлын бүтэц (Codex-д заавал дагуулах дүрэм)

Codex/AI кодчин ихэвчлэн зааж өгөөгүй бол бүх логикийг нэг файлд (жишээ нь `index.ts`, `app.js`, `server.ts`) шахаж бичдэг. Үүнээс сэргийлж дараах бүтэц, дүрмийг **тодорхой** зааж өгөх хэрэгтэй:

### Дагаж мөрдөх folder бүтэц (backend)

```
src/
  config/            # env, db connection тохиргоо
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.routes.ts
      auth.types.ts
    departments/
      departments.controller.ts
      departments.service.ts
      departments.repository.ts
      departments.routes.ts
      departments.types.ts
    tasks/
      tasks.controller.ts     # HTTP request/response л барина
      tasks.service.ts        # бизнес логик (status transition дүрэм гэх мэт)
      tasks.repository.ts     # зөвхөн DB query
      tasks.routes.ts
      tasks.types.ts
      tasks.validators.ts     # input validation (zod/joi)
  middleware/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
  common/
    errors.ts
    logger.ts
  app.ts                       # Express/Fastify app угсрах, route холбох
  server.ts                    # эхлүүлэх цэг л (10 мөрөөс хэтрэхгүй)
```

### Давхарга тус бүрийн үүрэг (заавал ялгах)

| Давхарга | Үүрэг | ЗӨВШӨӨРӨХГҮЙ зүйл |
|---|---|---|
| `*.routes.ts` | зөвхөн endpoint → controller холбох | бизнес логик, DB query бичихгүй |
| `*.controller.ts` | request parse хийх, service дуудах, response буцаах | SQL query, статус шилжилтийн дүрэм бичихгүй |
| `*.service.ts` | бизнес логик (жишээ: "SUBMITTED → APPROVED зөвхөн manager хийж чадна") | HTTP req/res объект шууд хэрэглэхгүй |
| `*.repository.ts` | зөвхөн DB-тэй харилцах (Prisma/TypeORM query) | бизнес дүрэм бичихгүй |
| `*.types.ts` | interface/type тодорхойлолт | логик функц бичихгүй |

### Codex-д өгөх заавал (prompt-доо шууд оруулах)

> "Файл бүрийг 200-300 мөрөөс хэтрүүлэхгүй. Route, controller, service, repository давхаргуудыг тусдаа файлд ялга. Нэг файлд DB query, бизнес логик, HTTP handler-ийг хамт бичихийг хориглоно. Модуль бүрийг дээрх бүтэц дагуулан үүсгэ. Шинэ модуль эхлэхийн өмнө яг ямар файлууд үүсгэхээ жагсаа."

### Frontend талд мөн адил

```
src/
  features/
    tasks/
      components/        # TaskCard.tsx, TaskList.tsx гэх мэт жижиг компонентууд
      hooks/              # useTasks.ts, useTaskMutations.ts
      api.ts               # зөвхөн fetch/axios дуудлага
      types.ts
    dashboard/
      ...
  shared/
    components/           # Button, Modal гэх мэт нийтлэг UI
    hooks/
  App.tsx
```

**Гол дүрэм:** нэг React компонент = нэг файл, 150 мөрөөс хэтрэхгүй; state logic-ийг custom hook-д гаргах; API дуудлагыг компонент дотор шууд бичихгүй, `api.ts`-д тусгаарлах.

### Codex-той ажиллах практик зөвлөмж

1. **Модуль тус бүрийг тусад нь хийлгэ** — "бүх системийг нэг дор хийж өг" гэхийн оронд "эхлээд зөвхөн `departments` модулийг дээрх бүтцээр хийж өг" гэж алхам алхмаар ажиллуул
2. **Файл үүсгэхийн өмнө төлөвлөгөө асуу** — "эхлээд ямар файлууд үүсгэхээ жагсаагаад, дараа нь код бич" гэж заавар өг
3. **Одоо байгаа муу бүтэцтэй файлыг рефактор хийлгэхдээ** — "энэ файлыг дээрх давхаргын дүрмийн дагуу задал, логикийг өөрчлөхгүй" гэж тодорхой зааж өг
4. **Repo-д `AGENTS.md` эсвэл `CLAUDE.md`-тэй төстэй заавар файл нэм** — дээрх бүтэц, дүрмийг тэнд бичээд өгвөл Codex/Claude Code ажил бүрт дахин уншиж дагана

## 9. Хэрэгжүүлэлтийн дараалал (санал)

1. DB schema + миграци бичих
2. Auth + role-based middleware
3. Departments CRUD
4. Tasks CRUD (create/list/filter)
5. Status transition endpoints (submit/approve/reject) + history logging
6. Frontend: Employee "Миний ажлууд" хуудас
7. Frontend: Manager Dashboard + Review queue
8. (Сонголтоор) Export/тайлан, notification
