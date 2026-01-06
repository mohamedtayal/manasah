import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async updateLessonProgress(
    studentId: string,
    lessonId: string,
    updateProgressDto: UpdateProgressDto,
  ) {
    // Get lesson and verify enrollment
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const isEnrolled = await this.enrollmentsService.isEnrolled(
      studentId,
      lesson.module.course.id,
    );

    if (!isEnrolled && !lesson.isFree) {
      throw new ForbiddenException('You must be enrolled to track progress');
    }

    // Update or create progress record
    const progress = await this.prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: studentId,
          lessonId,
        },
      },
      create: {
        userId: studentId,
        lessonId,
        watchTime: updateProgressDto.watchTime || 0,
        completed: updateProgressDto.completed || false,
        completedAt: updateProgressDto.completed ? new Date() : null,
        lastWatchedAt: new Date(),
      },
      update: {
        watchTime: updateProgressDto.watchTime,
        completed: updateProgressDto.completed,
        completedAt: updateProgressDto.completed ? new Date() : undefined,
        lastWatchedAt: new Date(),
      },
    });

    // Update overall course progress
    if (isEnrolled) {
      await this.enrollmentsService.updateCourseProgress(
        studentId,
        lesson.module.course.id,
      );
    }

    return progress;
  }

  async markLessonComplete(studentId: string, lessonId: string) {
    return this.updateLessonProgress(studentId, lessonId, { completed: true });
  }

  async getLessonProgress(studentId: string, lessonId: string) {
    const progress = await this.prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: studentId,
          lessonId,
        },
      },
    });

    return progress || { completed: false, watchTime: 0 };
  }

  async getCourseProgress(studentId: string, courseId: string) {
    // Get all lessons in course
    const lessons = await this.prisma.lesson.findMany({
      where: {
        module: {
          courseId,
        },
      },
      select: {
        id: true,
        title: true,
        titleAr: true,
        duration: true,
        order: true,
        module: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' },
      ],
    });

    // Get progress for all lessons
    const progressRecords = await this.prisma.progress.findMany({
      where: {
        userId: studentId,
        lessonId: { in: lessons.map((l) => l.id) },
      },
    });

    const progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]));

    // Build progress response
    const lessonsWithProgress = lessons.map((lesson) => ({
      ...lesson,
      progress: progressMap.get(lesson.id) || { completed: false, watchTime: 0 },
    }));

    const totalLessons = lessons.length;
    const completedLessons = progressRecords.filter((p) => p.completed).length;
    const overallProgress = totalLessons > 0 
      ? (completedLessons / totalLessons) * 100 
      : 0;

    return {
      courseId,
      totalLessons,
      completedLessons,
      overallProgress,
      lessons: lessonsWithProgress,
    };
  }

  async getStudentDashboard(studentId: string) {
    // Get all enrollments with progress
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        userId: studentId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            slug: true,
            thumbnail: true,
            _count: {
              select: {
                modules: true,
              },
            },
          },
        },
      },
    });

    // Get recent quiz attempts
    const recentQuizzes = await this.prisma.quizAttempt.findMany({
      where: { userId: studentId },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        quiz: {
          select: {
            title: true,
            titleAr: true,
          },
        },
      },
    });

    // Get recent progress
    const recentProgress = await this.prisma.progress.findMany({
      where: { userId: studentId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        lesson: {
          select: {
            title: true,
            titleAr: true,
            module: {
              select: {
                course: {
                  select: {
                    title: true,
                    titleAr: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate stats
    const totalCourses = enrollments.length;
    const completedCoursesCount = await this.prisma.enrollment.count({
      where: {
        userId: studentId,
        status: 'COMPLETED',
      },
    });

    const totalQuizAttempts = await this.prisma.quizAttempt.count({
      where: { userId: studentId },
    });

    const passedQuizzes = await this.prisma.quizAttempt.count({
      where: {
        userId: studentId,
        passed: true,
      },
    });

    return {
      enrollments,
      recentQuizzes,
      recentProgress,
      stats: {
        totalCourses,
        completedCourses: completedCoursesCount,
        totalQuizAttempts,
        passedQuizzes,
      },
    };
  }
}
