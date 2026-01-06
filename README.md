# 🎓 لِمّ المنهج - Limm Al-Manhaj

<div align="center">

![Limm Logo](https://img.shields.io/badge/لِمّ_المنهج-منصة_تعليمية-00D4AA?style=for-the-badge&labelColor=0A0A0F)

**منصة تعليمية تقنية عربية متكاملة**

[English](#english) | [العربية](#العربية)

</div>

---

## العربية

### 📖 نظرة عامة

**لِمّ المنهج** هي منصة تعليمية تقنية عربية حديثة مصممة لتقديم تجربة تعلم استثنائية. تدعم المنصة ثلاثة أنواع من المستخدمين:

- **👨‍🎓 الطلاب**: التسجيل في الدورات، مشاهدة الدروس، حل الاختبارات، تتبع التقدم
- **👨‍🏫 المدرسين**: إنشاء وإدارة الدورات، إضافة الدروس والاختبارات، متابعة الطلاب
- **👨‍💼 المديرين**: إدارة النظام (للتوسع المستقبلي)

### ✨ المميزات

- 🌙 **واجهة داكنة أنيقة** مع تدرجات لونية (فيروزي/بنفسجي)
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة
- 🔐 **مصادقة حقيقية** باستخدام JWT (Access + Refresh Tokens)
- 👥 **نظام صلاحيات** متكامل حسب الدور
- 📊 **لوحات تحكم** مخصصة لكل نوع مستخدم
- 🎯 **تتبع التقدم** في الدورات والدروس
- ✅ **نظام اختبارات** مع تصحيح تلقائي

### 🏗️ البنية التقنية

```
manasah/
├── index.html          # صفحة الهبوط (Landing Page)
├── styles.css          # أنماط الواجهة الأمامية
├── script.js           # تفاعلات الصفحة
├── backend/            # الخادم الخلفي (NestJS)
│   ├── prisma/         # قاعدة البيانات
│   └── src/            # الكود المصدري
└── frontend/           # واجهة المستخدم (Next.js)
    └── src/            # الكود المصدري
```

### 🛠️ التقنيات المستخدمة

#### الخادم الخلفي (Backend)
- **NestJS 10.x** - إطار العمل
- **PostgreSQL** - قاعدة البيانات
- **Prisma ORM** - إدارة قاعدة البيانات
- **JWT** - المصادقة (Access: 15 دقيقة، Refresh: 7 أيام)
- **bcrypt** - تشفير كلمات المرور
- **Swagger** - توثيق API

#### الواجهة الأمامية (Frontend)
- **Next.js 14** - إطار العمل
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - التنسيقات
- **Zustand** - إدارة الحالة
- **React Hook Form + Zod** - التحقق من النماذج
- **Axios** - طلبات HTTP

### 🚀 بدء الاستخدام

#### البدء السريع (Quick Start)

```bash
# 1. تثبيت جميع المكتبات
npm run install:all

# 2. إعداد قاعدة البيانات
npm run prisma:migrate
npm run prisma:seed

# 3. تشغيل الخادم الخلفي والواجهة الأمامية معاً
npm run dev
```

#### الخطوات التفصيلية (Detailed Setup)

#### 1. إعداد قاعدة البيانات

```sql
CREATE DATABASE limm_db;
```

#### 2. إعداد الخادم الخلفي

```bash
cd backend
cp .env.example .env
# قم بتعديل .env

npm install
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run start:dev
```

#### 3. إعداد الواجهة الأمامية

```bash
cd frontend
npm install
npm run dev
```

#### أوامر مفيدة (Useful Commands)

```bash
# تشغيل وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل الإنتاج
npm run start

# إدارة قاعدة البيانات
npm run prisma:studio
```

### 🔑 حسابات الاختبار

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|------------------|-------------|
| طالب | student@limm.test | Test@123456 |
| مدرس | doctor@limm.test | Test@123456 |
| مدير | admin@limm.test | Test@123456 |

### 📚 توثيق API

بعد تشغيل الخادم: **http://localhost:3000/api/docs**

---

## English

### 📖 Overview

**Limm Al-Manhaj** (لِمّ المنهج) is a modern Arabic tech-education platform designed to deliver an exceptional learning experience. The platform supports three user types:

- **👨‍🎓 Students**: Enroll in courses, watch lessons, take quizzes, track progress
- **👨‍🏫 Doctors (Instructors)**: Create and manage courses, add lessons and quizzes, monitor students
- **👨‍💼 Admins**: System administration (for future expansion)

### ✨ Features

- 🌙 **Elegant dark theme** with gradient accents (turquoise/purple)
- 📱 **Responsive design** works on all devices
- 🔐 **Real authentication** using JWT (Access + Refresh Tokens)
- 👥 **Role-based access control** system
- 📊 **Custom dashboards** for each user type
- 🎯 **Progress tracking** for courses and lessons
- ✅ **Quiz system** with automatic grading

### 🏗️ Project Structure

```
manasah/
├── index.html          # Landing Page
├── styles.css          # Frontend styles
├── script.js           # Page interactions
├── backend/            # Backend server (NestJS)
│   ├── prisma/         # Database
│   └── src/            # Source code
└── frontend/           # User interface (Next.js)
    └── src/            # Source code
```

### 🛠️ Tech Stack

#### Backend
- **NestJS 10.x** - Framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database management
- **JWT** - Authentication (Access: 15min, Refresh: 7d)
- **bcrypt** - Password hashing
- **Swagger** - API documentation

#### Frontend
- **Next.js 14** - Framework
- **TypeScript** - Language
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form + Zod** - Form validation
- **Axios** - HTTP requests

### 🚀 Getting Started

#### Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup database
npm run prisma:migrate
npm run prisma:seed

# 3. Run both backend and frontend
npm run dev
```

#### Detailed Setup

#### 1. Setup Database

```sql
CREATE DATABASE limm_db;
```

#### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration

npm install
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run start:dev
```

#### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Useful Commands

```bash
# Run development mode
npm run dev

# Build for production
npm run build

# Run production
npm run start

# Database management
npm run prisma:studio
```

### 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@limm.test | Test@123456 |
| Doctor | doctor@limm.test | Test@123456 |
| Admin | admin@limm.test | Test@123456 |

### 📚 API Documentation

After starting the server: **http://localhost:3000/api/docs**

---

## 📁 Key API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Courses
- `GET /courses` - List all courses (public)
- `GET /courses/:id` - Get course details
- `POST /courses/doctor` - Create course (Doctor)
- `PUT /courses/doctor/:id` - Update course (Doctor)

### Lessons
- `GET /lessons/course/:courseId/modules` - Get course modules
- `GET /lessons/student/:lessonId` - Get lesson content (Student)
- `POST /lessons/doctor/module` - Create module (Doctor)
- `POST /lessons/doctor/lesson` - Create lesson (Doctor)

### Quizzes
- `GET /quizzes/course/:courseId` - Get course quizzes
- `POST /quizzes/student/:quizId/submit` - Submit quiz (Student)
- `GET /quizzes/student/results` - Get quiz results (Student)

### Enrollments
- `POST /enrollments/student/:courseId` - Enroll in course (Student)
- `GET /enrollments/student` - My enrollments (Student)

### Progress
- `PUT /progress/student/lesson/:lessonId` - Update progress (Student)
- `GET /progress/student/dashboard` - Dashboard data (Student)

---

## 🎨 Design System

### Colors
- **Primary**: #00D4AA (Turquoise)
- **Accent**: #8B5CF6 (Purple)
- **Background**: #0A0A0F (Dark)
- **Surface**: #141419 (Dark Surface)

### Typography
- **Font**: Cairo, IBM Plex Sans Arabic

### Landing Page Features
- **Modern Dark Theme**: Professional dark hero section with high contrast
- **Original Layout**: Unique design inspired by modern Arabic learning platforms
- **RTL Optimized**: Fully right-to-left layout for Arabic content

## 📁 Project Structure

```
manasah/
├── index.html       # Main HTML structure with semantic markup
├── styles.css       # Complete styling with CSS variables and responsive design
├── script.js        # Interactive features and animations
└── README.md        # This file
```

## 🚀 Features

### Interactive Elements
- ✅ Smooth scroll navigation with anchor links
- ✅ Scroll-triggered animations for cards
- ✅ Counter animation for statistics
- ✅ Hover effects with elevation and glow
- ✅ Button ripple effects
- ✅ Navbar background change on scroll
- ✅ Active navigation link highlighting

### Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoints: 768px and 480px
- ✅ Flexible grid layouts
- ✅ Optimized typography scaling
- ✅ Touch-friendly buttons

### Accessibility
- ✅ Proper semantic HTML (headings, sections, nav)
- ✅ High contrast ratios (WCAG AA compliant)
- ✅ Keyboard navigation support
- ✅ Reduced motion support
- ✅ RTL-aware focus management
- ✅ Proper language attributes

### Performance
- ✅ CSS custom variables for theming
- ✅ Hardware-accelerated animations
- ✅ Optimized SVG illustrations
- ✅ No external dependencies (fonts loaded from Google Fonts)

## 🎯 Sections

### 1. Navigation Bar
- Sticky top navigation with logo and menu links
- Semi-transparent backdrop blur effect
- Responsive layout

### 2. Hero Section
- Large headline with highlighted keywords
- Short description
- Dual CTA buttons (primary + secondary)
- Statistics with counter animations
- Custom vector illustration
- Decorative animated elements

### 3. Features Section
- 6 feature cards with hover effects
- Icons for each feature
- Grid layout that adapts to screen size
- Smooth fade-in animations

### 4. Courses Preview
- 3 course cards (Beginner, Intermediate, Advanced)
- Course metadata (duration, lessons)
- Hover elevation effects

### 5. CTA Section
- Large headline
- Call-to-action button
- Centered, impactful layout

### 6. Footer
- 3-column layout for links
- Copyright information
- Social media links placeholder

## 💻 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 CSS Custom Properties (Variables)

All colors, spacing, typography, and transitions are defined as CSS variables in `:root`:

```css
--bg-primary: #0F172A
--accent-primary: #06D6D6
--accent-secondary: #A855F7
--text-primary: #FFFFFF
--font-primary: 'Cairo'
--transition-base: 200ms ease-in-out
/* ... and more */
```

Easy to customize - just modify the root variables!

## 📱 Responsive Breakpoints

- **Desktop**: 1200px container, 2-column layouts
- **Tablet**: 768px - adjusts grid to single column
- **Mobile**: 480px - optimized spacing and typography

## ⚡ Performance Tips

1. **Fonts**: Using Google Fonts CDN for fast delivery
2. **SVG**: Inline SVG prevents extra HTTP requests
3. **CSS**: Organized with variables for efficient theming
4. **Animations**: Hardware-accelerated (transform, opacity)
5. **Images**: No external images to load

## 🔧 Customization

### Change Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #06D6D6;    /* Change turquoise */
    --accent-secondary: #A855F7;  /* Change purple */
    --bg-primary: #0F172A;        /* Change background */
}
```

### Change Fonts
Update the Google Fonts import and font-family variables:

```css
--font-primary: 'Cairo', 'IBM Plex Sans Arabic', serif;
--font-secondary: 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
```

### Modify Content
All text is in `index.html`. Update the Arabic text directly:

```html
<h1 class="hero-title">
    تعلم البرمجة 
    <span class="highlight">من الصفر</span>
    إلى الاحترافية
</h1>
```

## 🎓 Key Design Decisions

1. **Dark Theme**: Reduces eye strain and creates premium feel
2. **RTL Layout**: Full support for Arabic language requirements
3. **Original Assets**: Custom SVG illustrations avoid copyright issues
4. **Gradient Accents**: Adds sophistication without being excessive
5. **Generous Spacing**: Improves readability and visual hierarchy
6. **Smooth Animations**: Enhances engagement without slowing performance
7. **No Images**: SVG only, ensuring crisp display at any resolution

## 📊 SEO Optimization

- Semantic HTML structure
- Proper heading hierarchy
- Meta tags for sharing
- Accessible alt text for icons
- Mobile-friendly design

## 🚀 Getting Started

1. **Open in Browser**: Simply open `index.html` in any modern browser
2. **Local Server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # or Node.js
   npx http-server
   ```
3. **Visit**: `http://localhost:8000`

## 📝 Notes

- Platform name: "لِمّ المنهج" (Lemm Al-Manhaj)
- All illustrations are original, custom-designed
- No third-party libraries required (vanilla JavaScript)
- Fully self-contained in 3 files

## 🌟 Features Showcase

✨ **Original Design** - Not copied from any existing website  
🎨 **Custom SVG Art** - Hand-crafted vector illustration  
🌍 **Full RTL Support** - Perfect for Arabic content  
📱 **Mobile First** - Responsive on all devices  
⚡ **Fast & Light** - No heavy dependencies  
♿ **Accessible** - WCAG AA compliant  
🎯 **Modern UX** - Smooth animations and interactions  

---

**Created for لِمّ المنهج - Modern Arabic Tech-Education Platform**

Made with ❤️ for the Arabic developer community
