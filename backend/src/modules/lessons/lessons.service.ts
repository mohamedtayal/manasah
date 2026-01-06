import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== MODULE METHODS ====================

  async createModule(doctorId: string, courseId: string, createModuleDto: CreateModuleDto) {
    await this.verifyCourseOwnership(courseId, doctorId);

    // Get next order
    const lastModule = await this.prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });

    return this.prisma.module.create({
      data: {
        title: createModuleDto.title,
        titleAr: createModuleDto.titleAr,
        description: createModuleDto.description,
        order: lastModule ? lastModule.order + 1 : 1,
        courseId,
      },
    });
  }

  async updateModule(
    doctorId: string,
    moduleId: string,
    updateModuleDto: UpdateModuleDto,
  ) {
    const module = await this.getModuleWithOwnerCheck(moduleId, doctorId);

    return this.prisma.module.update({
      where: { id: moduleId },
      data: updateModuleDto,
    });
  }

  async deleteModule(doctorId: string, moduleId: string) {
    await this.getModuleWithOwnerCheck(moduleId, doctorId);

    return this.prisma.module.delete({
      where: { id: moduleId },
    });
  }

  async reorderModules(doctorId: string, courseId: string, moduleIds: string[]) {
    await this.verifyCourseOwnership(courseId, doctorId);

    const updates = moduleIds.map((id, index) =>
      this.prisma.module.update({
        where: { id },
        data: { order: index + 1 },
      }),
    );

    return this.prisma.$transaction(updates);
  }

  async getCourseModules(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  // ==================== LESSON METHODS ====================

  async createLesson(doctorId: string, moduleId: string, createLessonDto: CreateLessonDto) {
    await this.getModuleWithOwnerCheck(moduleId, doctorId);

    // Get next order
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: 'desc' },
    });

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        titleAr: createLessonDto.titleAr,
        content: createLessonDto.content,
        contentAr: createLessonDto.contentAr,
        type: createLessonDto.type,
        videoUrl: createLessonDto.videoUrl,
        duration: createLessonDto.duration,
        isFree: createLessonDto.isFree || false,
        order: lastLesson ? lastLesson.order + 1 : 1,
        moduleId,
      },
    });
  }

  async updateLesson(
    doctorId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    await this.getLessonWithOwnerCheck(lessonId, doctorId);

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: updateLessonDto,
    });
  }

  async deleteLesson(doctorId: string, lessonId: string) {
    await this.getLessonWithOwnerCheck(lessonId, doctorId);

    return this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  async reorderLessons(doctorId: string, moduleId: string, lessonIds: string[]) {
    await this.getModuleWithOwnerCheck(moduleId, doctorId);

    const updates = lessonIds.map((id, index) =>
      this.prisma.lesson.update({
        where: { id },
        data: { order: index + 1 },
      }),
    );

    return this.prisma.$transaction(updates);
  }

  async getLessonById(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                instructorId: true,
              },
            },
          },
        },
        quizzes: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async getLessonForStudent(lessonId: string, studentId: string) {
    const lesson = await this.getLessonById(lessonId);

    // Check if student is enrolled
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId: lesson.module.course.id,
        status: 'ACTIVE',
      },
    });

    // If not enrolled and lesson is not free
    if (!enrollment && !lesson.isFree) {
      throw new ForbiddenException('You must be enrolled in this course to access this lesson');
    }

    return lesson;
  }

  // ==================== HELPER METHODS ====================

  private async verifyCourseOwnership(courseId: string, doctorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this course');
    }

    return course;
  }

  private async getModuleWithOwnerCheck(moduleId: string, doctorId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    if (module.course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this module');
    }

    return module;
  }

  private async getLessonWithOwnerCheck(lessonId: string, doctorId: string) {
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

    if (lesson.module.course.instructorId !== doctorId) {
      throw new ForbiddenException('You do not have permission to modify this lesson');
    }

    return lesson;
  }
}
