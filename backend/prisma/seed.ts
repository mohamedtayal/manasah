// Prisma Seed Script for Test Data
// Run with: npm run prisma:seed

import { PrismaClient, Role, CourseStatus, LessonType, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in correct order to respect foreign keys)
  console.log('🗑️  Clearing existing data...');
  await prisma.answer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.courseCategory.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('Test@123456', saltRounds);

  // ==================== CREATE USERS ====================
  console.log('👤 Creating users...');

  // Test Student
  const student = await prisma.user.create({
    data: {
      email: 'student@limm.test',
      password: hashedPassword,
      firstName: 'أحمد',
      lastName: 'الطالب',
      role: Role.STUDENT,
      bio: 'طالب متحمس لتعلم البرمجة',
      isActive: true,
      emailVerified: true,
    },
  });

  // Test Doctor (Instructor)
  const doctor = await prisma.user.create({
    data: {
      email: 'doctor@limm.test',
      password: hashedPassword,
      firstName: 'محمد',
      lastName: 'المدرس',
      role: Role.DOCTOR,
      bio: 'مهندس برمجيات ومعلم بخبرة 10 سنوات',
      isActive: true,
      emailVerified: true,
    },
  });

  // Test Admin (optional)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@limm.test',
      password: hashedPassword,
      firstName: 'سارة',
      lastName: 'المديرة',
      role: Role.ADMIN,
      bio: 'مديرة منصة لِمّ المنهج',
      isActive: true,
      emailVerified: true,
    },
  });

  // ==================== CREATE CATEGORIES ====================
  console.log('📂 Creating categories...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Web Development',
        nameAr: 'تطوير الويب',
        slug: 'web-development',
        icon: '🌐',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mobile Development',
        nameAr: 'تطوير التطبيقات',
        slug: 'mobile-development',
        icon: '📱',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Programming Fundamentals',
        nameAr: 'أساسيات البرمجة',
        slug: 'programming-fundamentals',
        icon: '💻',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Data Science',
        nameAr: 'علم البيانات',
        slug: 'data-science',
        icon: '📊',
      },
    }),
  ]);

  // ==================== CREATE COURSES ====================
  console.log('📚 Creating courses...');

  // Python Course
  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Python Programming Fundamentals',
      titleAr: 'أساسيات البرمجة بـ Python',
      slug: 'python-fundamentals',
      description: 'Learn Python programming from scratch with hands-on projects',
      descriptionAr: 'تعلم لغة بايثون من الصفر مع مشاريع عملية',
      thumbnail: '/images/courses/python.jpg',
      price: 0,
      status: CourseStatus.PUBLISHED,
      level: 'beginner',
      duration: 1440, // 24 hours
      instructorId: doctor.id,
      categories: {
        create: [
          { categoryId: categories[2].id }, // Programming Fundamentals
        ],
      },
    },
  });

  // React Course
  const reactCourse = await prisma.course.create({
    data: {
      title: 'Modern React Development',
      titleAr: 'تطوير تطبيقات React الحديثة',
      slug: 'modern-react',
      description: 'Build modern web applications with React and TypeScript',
      descriptionAr: 'بناء تطبيقات ويب حديثة باستخدام React و TypeScript',
      thumbnail: '/images/courses/react.jpg',
      price: 99.99,
      status: CourseStatus.PUBLISHED,
      level: 'intermediate',
      duration: 2400, // 40 hours
      instructorId: doctor.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Web Development
        ],
      },
    },
  });

  // ==================== CREATE MODULES & LESSONS ====================
  console.log('📖 Creating modules and lessons...');

  // Python Course Modules
  const pythonModule1 = await prisma.module.create({
    data: {
      title: 'Getting Started',
      titleAr: 'البداية',
      description: 'Introduction to Python and setup',
      order: 1,
      courseId: pythonCourse.id,
    },
  });

  const pythonModule2 = await prisma.module.create({
    data: {
      title: 'Variables and Data Types',
      titleAr: 'المتغيرات وأنواع البيانات',
      description: 'Learn about variables and data types',
      order: 2,
      courseId: pythonCourse.id,
    },
  });

  // Lessons for Python Module 1
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'What is Python?',
      titleAr: 'ما هي بايثون؟',
      content: 'Python is a high-level, interpreted programming language...',
      contentAr: 'بايثون هي لغة برمجة عالية المستوى ومفسرة...',
      type: LessonType.VIDEO,
      videoUrl: 'https://example.com/videos/python-intro.mp4',
      duration: 15,
      order: 1,
      isFree: true,
      moduleId: pythonModule1.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Installing Python',
      titleAr: 'تثبيت بايثون',
      content: 'Learn how to install Python on your computer...',
      contentAr: 'تعلم كيفية تثبيت بايثون على جهازك...',
      type: LessonType.VIDEO,
      videoUrl: 'https://example.com/videos/python-install.mp4',
      duration: 20,
      order: 2,
      isFree: true,
      moduleId: pythonModule1.id,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'Your First Python Program',
      titleAr: 'برنامجك الأول بلغة بايثون',
      content: 'Write your first Hello World program...',
      contentAr: 'اكتب برنامجك الأول...',
      type: LessonType.TEXT,
      duration: 10,
      order: 3,
      isFree: false,
      moduleId: pythonModule1.id,
    },
  });

  // Lessons for Python Module 2
  const lesson4 = await prisma.lesson.create({
    data: {
      title: 'Understanding Variables',
      titleAr: 'فهم المتغيرات',
      content: 'Variables are containers for storing data values...',
      contentAr: 'المتغيرات هي حاويات لتخزين قيم البيانات...',
      type: LessonType.VIDEO,
      videoUrl: 'https://example.com/videos/python-variables.mp4',
      duration: 25,
      order: 1,
      isFree: false,
      moduleId: pythonModule2.id,
    },
  });

  // ==================== CREATE QUIZ ====================
  console.log('❓ Creating quizzes...');

  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Python Basics Quiz',
      titleAr: 'اختبار أساسيات بايثون',
      description: 'Test your understanding of Python basics',
      timeLimit: 15,
      passingScore: 70,
      lessonId: lesson3.id,
    },
  });

  // Create Questions
  const question1 = await prisma.question.create({
    data: {
      text: 'What is Python?',
      textAr: 'ما هي بايثون؟',
      type: QuestionType.SINGLE_CHOICE,
      points: 10,
      order: 1,
      explanation: 'Python is a high-level programming language',
      explanationAr: 'بايثون هي لغة برمجة عالية المستوى',
      quizId: quiz1.id,
      options: {
        create: [
          { text: 'A programming language', textAr: 'لغة برمجة', isCorrect: true, order: 1 },
          { text: 'A snake', textAr: 'ثعبان', isCorrect: false, order: 2 },
          { text: 'A database', textAr: 'قاعدة بيانات', isCorrect: false, order: 3 },
          { text: 'An operating system', textAr: 'نظام تشغيل', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  const question2 = await prisma.question.create({
    data: {
      text: 'Python is an interpreted language',
      textAr: 'بايثون لغة مفسرة',
      type: QuestionType.TRUE_FALSE,
      points: 5,
      order: 2,
      quizId: quiz1.id,
      options: {
        create: [
          { text: 'True', textAr: 'صحيح', isCorrect: true, order: 1 },
          { text: 'False', textAr: 'خطأ', isCorrect: false, order: 2 },
        ],
      },
    },
  });

  // ==================== CREATE ENROLLMENTS ====================
  console.log('📝 Creating enrollments...');

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: pythonCourse.id,
      status: 'ACTIVE',
      progress: 25.0,
    },
  });

  // ==================== CREATE PROGRESS ====================
  console.log('📈 Creating progress records...');

  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson1.id,
      completed: true,
      watchTime: 900, // 15 minutes
      completedAt: new Date(),
    },
  });

  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson2.id,
      completed: false,
      watchTime: 600, // 10 minutes
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('=====================================');
  console.log('👨‍🎓 STUDENT:');
  console.log('   Email: student@limm.test');
  console.log('   Password: Test@123456');
  console.log('');
  console.log('👨‍🏫 DOCTOR (Instructor):');
  console.log('   Email: doctor@limm.test');
  console.log('   Password: Test@123456');
  console.log('');
  console.log('👩‍💼 ADMIN:');
  console.log('   Email: admin@limm.test');
  console.log('   Password: Test@123456');
  console.log('=====================================');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
