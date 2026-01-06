# لِمّ المنهج - دليل إعداد الخادم الخلفي (Backend Setup Guide)

## 📋 المتطلبات الأساسية (Prerequisites)

1. **Node.js** - الإصدار 18.x أو أحدث
2. **npm** أو **yarn** - مدير الحزم
3. **PostgreSQL** - الإصدار 14.x أو أحدث
4. **Git** - للتحكم بالإصدارات

---

## 🚀 خطوات الإعداد (Setup Steps)

### 1. إنشاء قاعدة البيانات (Create Database)

```sql
-- تشغيل في PostgreSQL
CREATE DATABASE limm_db;
```

### 2. إعداد ملف البيئة (Environment Setup)

```bash
# نسخ ملف البيئة النموذجي
cp .env.example .env
```

قم بتعديل `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/limm_db?schema=public"

# JWT
JWT_ACCESS_SECRET="your-super-secret-access-key-here-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Server
PORT=3000
NODE_ENV=development
```

### 3. تثبيت الحزم (Install Dependencies)

```bash
cd backend
npm install
```

### 4. تهيئة Prisma وقاعدة البيانات (Initialize Prisma)

```bash
# إنشاء الجداول في قاعدة البيانات
npx prisma migrate dev --name init

# توليد عميل Prisma
npx prisma generate

# تشغيل البذور (بيانات تجريبية)
npx prisma db seed
```

### 5. تشغيل الخادم (Run Server)

```bash
# وضع التطوير
npm run start:dev

# وضع الإنتاج
npm run build
npm run start:prod
```

---

## 🔐 حسابات الاختبار (Test Accounts)

بعد تشغيل البذور، ستتوفر الحسابات التالية:

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|------------------|-------------|
| طالب (Student) | student@limm.test | Test@123456 |
| مدرس (Doctor) | doctor@limm.test | Test@123456 |
| مدير (Admin) | admin@limm.test | Test@123456 |

---

## 📚 توثيق API (API Documentation)

بعد تشغيل الخادم، يمكنك الوصول إلى:

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000

---

## 🛣️ نقاط النهاية الرئيسية (Main Endpoints)

### المصادقة (Authentication)
```
POST   /auth/register          - تسجيل مستخدم جديد
POST   /auth/login             - تسجيل الدخول
POST   /auth/refresh           - تجديد التوكن
POST   /auth/logout            - تسجيل الخروج
```

### المستخدمين (Users)
```
GET    /users/profile          - الملف الشخصي
PUT    /users/profile          - تحديث الملف الشخصي
PUT    /users/change-password  - تغيير كلمة المرور
GET    /users/student/stats    - إحصائيات الطالب
GET    /users/doctor/stats     - إحصائيات المدرس
```

### الدورات (Courses)
```
GET    /courses                - جميع الدورات (عام)
GET    /courses/:id            - تفاصيل دورة (عام)
POST   /courses/doctor         - إنشاء دورة (مدرس)
PUT    /courses/doctor/:id     - تحديث دورة (مدرس)
DELETE /courses/doctor/:id     - حذف دورة (مدرس)
GET    /courses/doctor/my-courses - دوراتي (مدرس)
```

### الدروس (Lessons)
```
GET    /lessons/course/:courseId/modules       - وحدات الدورة
POST   /lessons/doctor/module                  - إنشاء وحدة (مدرس)
POST   /lessons/doctor/lesson                  - إنشاء درس (مدرس)
GET    /lessons/student/:lessonId              - محتوى الدرس (طالب)
```

### الاختبارات (Quizzes)
```
GET    /quizzes/course/:courseId               - اختبارات الدورة
POST   /quizzes/doctor                         - إنشاء اختبار (مدرس)
POST   /quizzes/student/:quizId/submit         - تقديم إجابات (طالب)
GET    /quizzes/student/results                - نتائجي (طالب)
```

### التسجيل (Enrollments)
```
POST   /enrollments/student/:courseId          - التسجيل في دورة (طالب)
DELETE /enrollments/student/:courseId          - إلغاء التسجيل (طالب)
GET    /enrollments/student                    - دوراتي المسجلة (طالب)
GET    /enrollments/doctor/:courseId/students  - طلاب الدورة (مدرس)
```

### التقدم (Progress)
```
PUT    /progress/student/lesson/:lessonId      - تحديث تقدم الدرس (طالب)
POST   /progress/student/lesson/:lessonId/complete - إكمال الدرس (طالب)
GET    /progress/student/course/:courseId      - تقدم الدورة (طالب)
GET    /progress/student/dashboard             - لوحة التحكم (طالب)
```

---

## 🔒 نظام الصلاحيات (Authorization System)

### الأدوار (Roles)
- **STUDENT**: طالب - يمكنه التسجيل والتعلم وحل الاختبارات
- **DOCTOR**: مدرس - يمكنه إنشاء وإدارة الدورات والدروس والاختبارات
- **ADMIN**: مدير - صلاحيات إدارية (للتوسع المستقبلي)

### التوكنات (Tokens)
- **Access Token**: صالح لمدة 15 دقيقة
- **Refresh Token**: صالح لمدة 7 أيام، يُخزن في قاعدة البيانات

### استخدام التوكن
```bash
# إضافة في Header
Authorization: Bearer <access_token>
```

---

## 🧪 اختبار API مع curl

### تسجيل الدخول
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@limm.test","password":"Test@123456"}'
```

### الوصول لمورد محمي
```bash
curl http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your_access_token>"
```

---

## 🔧 أوامر مفيدة (Useful Commands)

```bash
# عرض قاعدة البيانات في المتصفح
npx prisma studio

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset

# تحديث schema بعد التعديل
npx prisma migrate dev --name <migration_name>

# فحص الكود
npm run lint

# تشغيل الاختبارات
npm run test
```

---

## 📁 هيكل المشروع (Project Structure)

```
backend/
├── prisma/
│   ├── schema.prisma          # تعريف قاعدة البيانات
│   └── seed.ts                # بيانات البذور
├── src/
│   ├── common/
│   │   ├── decorators/        # @Roles, @CurrentUser, @Public
│   │   ├── guards/            # JwtAuthGuard, RolesGuard
│   │   ├── filters/           # GlobalExceptionFilter
│   │   ├── interceptors/      # TransformInterceptor
│   │   └── prisma/            # PrismaService
│   ├── modules/
│   │   ├── auth/              # المصادقة
│   │   ├── users/             # المستخدمين
│   │   ├── courses/           # الدورات
│   │   ├── lessons/           # الدروس
│   │   ├── quizzes/           # الاختبارات
│   │   ├── enrollments/       # التسجيلات
│   │   └── progress/          # التقدم
│   ├── app.module.ts          # الوحدة الرئيسية
│   └── main.ts                # نقطة البداية
├── .env.example               # متغيرات البيئة النموذجية
├── package.json               # الحزم
└── tsconfig.json              # إعدادات TypeScript
```

---

## ⚠️ ملاحظات مهمة (Important Notes)

1. **لا تستخدم بيانات الاختبار في الإنتاج** - قم بتغيير كلمات المرور والمفاتيح السرية
2. **تأكد من تغيير JWT secrets** - استخدم مفاتيح قوية وفريدة
3. **فعّل HTTPS في الإنتاج** - لحماية البيانات المنقولة
4. **راقب Refresh Tokens** - يتم تخزينها في قاعدة البيانات ويمكن إبطالها

---

## 🐛 حل المشاكل الشائعة (Troubleshooting)

### خطأ في الاتصال بقاعدة البيانات
```
تأكد من:
1. PostgreSQL يعمل
2. DATABASE_URL صحيح
3. قاعدة البيانات موجودة
```

### خطأ في Prisma Client
```bash
# أعد توليد العميل
npx prisma generate
```

### خطأ 401 Unauthorized
```
تأكد من:
1. التوكن صالح وغير منتهي
2. إضافة Bearer قبل التوكن
3. استخدام Access Token وليس Refresh Token
```

---

## 📞 الدعم (Support)

للمساعدة أو الإبلاغ عن مشاكل، تواصل مع فريق التطوير.

---

**تم التطوير بـ ❤️ لمنصة لِمّ المنهج**
