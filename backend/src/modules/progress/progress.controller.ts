import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Put('student/lesson/:lessonId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Update lesson progress (Student only)' })
  async updateLessonProgress(
    @CurrentUser('id') studentId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.updateLessonProgress(
      studentId,
      lessonId,
      updateProgressDto,
    );
  }

  @Post('student/lesson/:lessonId/complete')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Mark lesson as complete (Student only)' })
  async markLessonComplete(
    @CurrentUser('id') studentId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.progressService.markLessonComplete(studentId, lessonId);
  }

  @Get('student/lesson/:lessonId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get lesson progress (Student only)' })
  async getLessonProgress(
    @CurrentUser('id') studentId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.progressService.getLessonProgress(studentId, lessonId);
  }

  @Get('student/course/:courseId')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get course progress (Student only)' })
  async getCourseProgress(
    @CurrentUser('id') studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return this.progressService.getCourseProgress(studentId, courseId);
  }

  @Get('student/dashboard')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student dashboard data (Student only)' })
  async getStudentDashboard(@CurrentUser('id') studentId: string) {
    return this.progressService.getStudentDashboard(studentId);
  }
}
