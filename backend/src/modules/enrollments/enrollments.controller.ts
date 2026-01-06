import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { Role, EnrollmentStatus } from '@prisma/client';

@ApiTags('enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('student/enroll/:courseId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Enroll in a course (Student only)' })
  async enrollInCourse(
    @CurrentUser('id') studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return this.enrollmentsService.enrollInCourse(studentId, courseId);
  }

  @Get('student/my-courses')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student\'s enrolled courses (Student only)' })
  @ApiQuery({ name: 'status', required: false, enum: EnrollmentStatus })
  async getStudentEnrollments(
    @CurrentUser('id') studentId: string,
    @Query('status') status?: EnrollmentStatus,
  ) {
    return this.enrollmentsService.getStudentEnrollments(studentId, status);
  }

  @Get('student/course/:courseId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get enrollment details for a course (Student only)' })
  async getEnrollmentDetails(
    @CurrentUser('id') studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return this.enrollmentsService.getEnrollmentDetails(studentId, courseId);
  }

  @Delete('student/drop/:courseId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Drop a course (Student only)' })
  async dropCourse(
    @CurrentUser('id') studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return this.enrollmentsService.dropCourse(studentId, courseId);
  }

  @Get('student/check/:courseId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Check if enrolled in a course (Student only)' })
  async checkEnrollment(
    @CurrentUser('id') studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const isEnrolled = await this.enrollmentsService.isEnrolled(studentId, courseId);
    return { isEnrolled };
  }
}
