import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ReorderDto } from './dto/reorder.dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // ==================== MODULE ROUTES (DOCTOR) ====================

  @Post('doctor/modules/:courseId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Create a module (Doctor only)' })
  async createModule(
    @CurrentUser('id') doctorId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.lessonsService.createModule(doctorId, courseId, createModuleDto);
  }

  @Put('doctor/modules/:moduleId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update a module (Doctor only)' })
  async updateModule(
    @CurrentUser('id') doctorId: string,
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.lessonsService.updateModule(doctorId, moduleId, updateModuleDto);
  }

  @Delete('doctor/modules/:moduleId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Delete a module (Doctor only)' })
  async deleteModule(
    @CurrentUser('id') doctorId: string,
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
  ) {
    return this.lessonsService.deleteModule(doctorId, moduleId);
  }

  @Put('doctor/modules/:courseId/reorder')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Reorder modules (Doctor only)' })
  async reorderModules(
    @CurrentUser('id') doctorId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.lessonsService.reorderModules(doctorId, courseId, reorderDto.ids);
  }

  // ==================== LESSON ROUTES (DOCTOR) ====================

  @Post('doctor/:moduleId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Create a lesson (Doctor only)' })
  async createLesson(
    @CurrentUser('id') doctorId: string,
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.createLesson(doctorId, moduleId, createLessonDto);
  }

  @Put('doctor/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Update a lesson (Doctor only)' })
  async updateLesson(
    @CurrentUser('id') doctorId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(doctorId, lessonId, updateLessonDto);
  }

  @Delete('doctor/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Delete a lesson (Doctor only)' })
  async deleteLesson(
    @CurrentUser('id') doctorId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.lessonsService.deleteLesson(doctorId, lessonId);
  }

  @Put('doctor/:moduleId/reorder')
  @UseGuards(RolesGuard)
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: 'Reorder lessons (Doctor only)' })
  async reorderLessons(
    @CurrentUser('id') doctorId: string,
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() reorderDto: ReorderDto,
  ) {
    return this.lessonsService.reorderLessons(doctorId, moduleId, reorderDto.ids);
  }

  // ==================== STUDENT ROUTES ====================

  @Get('student/:lessonId')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get lesson content (Student only, must be enrolled)' })
  async getLessonForStudent(
    @CurrentUser('id') studentId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.lessonsService.getLessonForStudent(lessonId, studentId);
  }

  // ==================== GENERAL ROUTES ====================

  @Get('course/:courseId/modules')
  @ApiOperation({ summary: 'Get all modules for a course' })
  async getCourseModules(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.lessonsService.getCourseModules(courseId);
  }

  @Get(':lessonId')
  @ApiOperation({ summary: 'Get lesson by ID' })
  async getLessonById(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    return this.lessonsService.getLessonById(lessonId);
  }
}
