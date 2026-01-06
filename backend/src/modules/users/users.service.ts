import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(role?: Role) {
    const where = role ? { role } : {};
    
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllDoctors() {
    return this.prisma.user.findMany({
      where: { role: Role.DOCTOR, isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        _count: {
          select: { coursesCreated: true },
        },
      },
    });
  }

  async findAllStudents() {
    return this.prisma.user.findMany({
      where: { role: Role.STUDENT, isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        avatar: updateUserDto.avatar,
        bio: updateUserDto.bio,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
      },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async deactivateUser(userId: string, adminId: string) {
    // Check if admin has permission
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can deactivate users');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });
  }

  async getDoctorStats(doctorId: string) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: Role.DOCTOR },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        coursesCreated: {
          select: {
            id: true,
            title: true,
            titleAr: true,
            status: true,
            _count: {
              select: { enrollments: true },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const totalStudents = doctor.coursesCreated.reduce(
      (sum, course) => sum + course._count.enrollments,
      0,
    );

    return {
      ...doctor,
      totalCourses: doctor.coursesCreated.length,
      totalStudents,
    };
  }

  async getStudentStats(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId, role: Role.STUDENT },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        enrollments: {
          select: {
            id: true,
            progress: true,
            status: true,
            course: {
              select: {
                id: true,
                title: true,
                titleAr: true,
              },
            },
          },
        },
        quizAttempts: {
          select: {
            id: true,
            score: true,
            passed: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const completedCourses = student.enrollments.filter(
      (e) => e.status === 'COMPLETED',
    ).length;

    const passedQuizzes = student.quizAttempts.filter((q) => q.passed).length;

    return {
      ...student,
      totalEnrollments: student.enrollments.length,
      completedCourses,
      totalQuizzes: student.quizAttempts.length,
      passedQuizzes,
    };
  }
}
