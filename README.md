# ليبيا بلس | Libya Plus

منصة إعلامية عربية احترافية للفيديو والبث المباشر — مبنية بـ Next.js 15، Prisma، PostgreSQL.

## التقنيات

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Server Actions, API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth v5 (Admin / Editor)
- **Player:** Video.js + HLS.js

## البدء السريع

### 1. المتطلبات

- Node.js 20+
- Docker (لقاعدة PostgreSQL)

### 2. التثبيت

```bash
npm install
```

### 3. قاعدة البيانات

**التطوير المحلي (SQLite — افتراضي):**

```bash
npm run db:push
npm run db:seed
```

يُنشئ ملف `prisma/dev.db` تلقائياً — لا حاجة لـ Docker.

**الإنتاج (PostgreSQL):**

1. غيّر `provider` في `prisma/schema.prisma` إلى `postgresql`
2. غيّر `tags` إلى `String[]` إن رغبت بمصفوفات Postgres
3. عيّن `DATABASE_URL` في `.env` ثم شغّل `docker compose up -d` و `npm run db:push && npm run db:seed`

### 4. التشغيل

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## لوحة التحكم

الرابط: [http://localhost:3000/admin](http://localhost:3000/admin)

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@libyaplus.ly | admin123 |
| Editor | editor@libyaplus.ly | editor123 |

## هيكل المشروع

```
src/
├── app/              # صفحات Next.js (عامة + admin)
├── components/       # مكونات UI والصفحات
├── lib/              # prisma, auth, data, validations
└── actions/          # Server Actions للإدارة
prisma/
├── schema.prisma     # نموذج قاعدة البيانات
└── seed.ts           # بيانات تجريبية
```

## الصفحات الرئيسية

| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/videos` | جميع الفيديوهات |
| `/videos/[slug]` | صفحة الفيديو |
| `/channels` | القنوات |
| `/channel/[slug]` | صفحة القناة |
| `/live` | البث المباشر |
| `/programs` | البرامج |
| `/admin` | لوحة التحكم |

## متغيرات البيئة

انسخ `.env.example` إلى `.env`:

```env
DATABASE_URL="postgresql://libyaplus:libyaplus123@localhost:5432/libyaplus?schema=public"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## الإنتاج

```bash
npm run build
npm start
```

## الهوية البصرية

- اللون الرئيسي: `#C1121F`
- اللون الثانوي: `#780000`
- لون التمييز: `#E5383B`
- الخطوط: Cairo, IBM Plex Sans Arabic
- الاتجاه: RTL كامل

---

© 2026 ليبيا بلس — جميع الحقوق محفوظة
