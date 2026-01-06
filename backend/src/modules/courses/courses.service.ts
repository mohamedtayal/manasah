import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus, Role } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== PUBLIC METHODS ====================

  async findAllPublished(page = 1, limit = 10, category?: string, level?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: CourseStatus.PUBLISHED,
    };

    if (level) {
      where.level = level;
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          titleAr: true,
          slug: true,
          description: true,
          descriptionAr: true,
          thumbnail: true,
          price: true,
          level: true,
          duration: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              modules: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
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
        categories: {
          include: {
            category: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  // ==================== DOCTOR METHODS ====================

  async create(doctorId: string, createCourseDto: CreateCourseDto) {
    // Generate slug from title
    const slug = this.generateSlug(createCourseDto.title);

    // Check if slug already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      throw new ConflictException('A course with this title already exists');
    }

    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        titleAr: createCourseDto.titleAr,
        slug,
        description: createCourseDto.description,
        descriptionAr: createCourseDto.descriptionAr,
        thumbnail: createCourseDto.thumbnail,
        price: createCourseDto.price || 0,
        level: createCourseDto.level,
        duration: createCourseDto.duration,
        status: CourseStatus.DRAFT,
        instructorId: doctorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async update(courseId: string, doctorId: string, updateCourseDto: UpdateCourseDto) {
    await this.verifyOwnership(courseId, doctorId);

    const updateData: any = { ...updateCourseDto };

    // Update slug if title changed
    if (updateCourseDto.title) {
      updateData.slug = this.generateSlug(updateCourseDto.title);
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: updateData,
    });
  }

  async publish(courseId: string, doctorId: string) {
    await this.verifyOwnership(courseId, doctorId);

    // Verify course has content
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const hasContent = course.modules.some((m) => m.lessons.length > 0);

    if (!hasContent) {
      throw new ForbiddenException('Course must have at least one lesson before publishing');
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: CourseStatus.PUBLISHED },
    });
  }

  async archive(courseId: string, doctorId: string) {
    await this.verifyOwnership(courseId, doctorId);

    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: CourseStatus.ARCHIVED },
    });
  }

  async delete(courseId: string, doctorId: string) {
    await this.verifyOwnership(courseId, doctorId);

    // Check if course has enrollments
    const enrollmentCount = await this.prisma.enrollment.count({
      where: { courseId },
    });

    if (enrollmentCount > 0) {
      throw new ForbiddenException(
        'Cannot delete course with existing enrollments. Archive it instead.',
      );
    }

    return this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  async findByDoctor(doctorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId: doctorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseStudents(courseId: string, doctorId: string) {
    await this.verifyOwnership(courseId, doctorId);

    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  // ==================== HELPER METHODS ====================

  private async verifyOwnership(courseId: string, doctorId: string) {
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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100) + '-' + Date.now().toString(36);
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }
}
