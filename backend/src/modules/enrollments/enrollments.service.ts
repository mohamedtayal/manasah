import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CourseStatus, EnrollmentStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enrollInCourse(studentId: string, courseId: string) {
    // Check if course exists and is published
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('This course is not available for enrollment');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
        throw new ConflictException('You are already enrolled in this course');
      }

      // Reactivate dropped enrollment
      return this.prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: EnrollmentStatus.ACTIVE,
          enrolledAt: new Date(),
          completedAt: null,
          progress: 0,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              titleAr: true,
              slug: true,
            },
          },
        },
      });
    }

    // Create new enrollment
    return this.prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            slug: true,
          },
        },
      },
    });
  }

  async getStudentEnrollments(studentId: string, status?: EnrollmentStatus) {
    const where: any = { userId: studentId };

    if (status) {
      where.status = status;
    }

    return this.prisma.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            slug: true,
            thumbnail: true,
            level: true,
            duration: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                modules: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentDetails(studentId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            modules: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    titleAr: true,
                    type: true,
                    duration: true,
                    isFree: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            progress: {
              where: {
                lesson: {
                  module: {
                    courseId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async dropCourse(studentId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new ForbiddenException('This enrollment is not active');
    }

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: EnrollmentStatus.DROPPED,
      },
    });
  }

  async isEnrolled(studentId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
    });

    return enrollment?.status === EnrollmentStatus.ACTIVE;
  }

  async updateCourseProgress(studentId: string, courseId: string) {
    // Get total lessons in course
    const totalLessons = await this.prisma.lesson.count({
      where: {
        module: {
          courseId,
        },
      },
    });

    if (totalLessons === 0) return;

    // Get completed lessons
    const completedLessons = await this.prisma.progress.count({
      where: {
        userId: studentId,
        completed: true,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    const progressPercentage = (completedLessons / totalLessons) * 100;
    const isCompleted = progressPercentage >= 100;

    await this.prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
      data: {
        progress: progressPercentage,
        status: isCompleted ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }
}
