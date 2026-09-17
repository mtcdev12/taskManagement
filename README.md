# AJIL — Ажлын хуваарилалт, гүйцэтгэлийн систем

MySQL, Node.js/Express, Prisma болон React (JavaScript/JSX) дээр хийсэн дотоод ажлын удирдлагын MVP.

## Боломжууд

- Super admin, department manager, employee дүрийн эрхийн хяналт
- `TODO → IN_PROGRESS → SUBMITTED → APPROVED/REJECTED` workflow
- Буцаах шалтгаан болон төлөвийн audit history
- Хугацаа хэтэрсэн ажлын тооцоолсон тэмдэглэгээ
- Алба, хэрэглэгч, ажил үүсгэх болон удирдах
- Dashboard, хугацаа/алба/төлвийн шүүлтүүр, review queue
- Responsive Монгол UI

## Технологи

- Backend: Node.js, Express, JavaScript, JWT, Zod
- Database: MySQL 8.4, Prisma ORM
- Frontend: React, JavaScript/JSX, Vite

## Ажиллуулах

Node.js 20+ болон локал MySQL 5.7+ шаардлагатай. Laragon, XAMPP эсвэл тусдаа MySQL Server ашиглаж болно.

```bash
npm install
```

MySQL дээр `ajil` өгөгдлийн сан үүсгэнэ:

```sql
CREATE DATABASE ajil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

`apps/api/.env.example`-ийг `apps/api/.env` нэрээр хуулна:

```env
DATABASE_URL="mysql://root@localhost:3306/ajil"
JWT_SECRET="local-development-secret"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

Дараа нь schema, demo өгөгдөл үүсгээд системийг асаана:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000/api
- Health: http://localhost:4000/api/health

## Демо хэрэглэгчид

Бүх хэрэглэгчийн нууц үг: `Demo123!`

| Дүр | И-мэйл |
|---|---|
| Super admin | `admin@ajil.mn` |
| Manager | `manager@ajil.mn` |
| Employee | `employee@ajil.mn` |

## Төслийн бүтэц

Backend модуль бүр route, controller, service, repository давхаргад тусгаарлагдсан. Frontend нь feature бүрээр API, hook, page, component хэсгүүдэд задарсан.

```text
apps/
  api/
    prisma/                 # MySQL schema, migration, seed
    src/modules/            # auth, departments, users, tasks, dashboard
    src/middleware/
  web/
    src/features/           # feature бүрийн UI ба data access
    src/shared/             # нийтлэг component, constants
```

Production build шалгах:

```bash
npm run build
```
